package main

import (
	"bufio"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"sync"
	"time"
)

type MCPHandler struct {
	githubClient *GitHubClient
}

func NewMCPHandler(githubClient *GitHubClient) *MCPHandler {
	return &MCPHandler{
		githubClient: githubClient,
	}
}

type JSONRPCRequest struct {
	JSONRPC string          `json:"jsonrpc"`
	ID      interface{}     `json:"id,omitempty"`
	Method  string          `json:"method"`
	Params  json.RawMessage `json:"params,omitempty"`
}

type JSONRPCResponse struct {
	JSONRPC string        `json:"jsonrpc"`
	ID      interface{}   `json:"id,omitempty"`
	Result  interface{}   `json:"result,omitempty"`
	Error   *JSONRPCError `json:"error,omitempty"`
}

type JSONRPCError struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

type ServerInfo struct {
	Name    string `json:"name"`
	Version string `json:"version"`
}

type ServerCapabilities struct {
	Tools *ToolsCapability `json:"tools,omitempty"`
}

type ToolsCapability struct {
	ListChanged bool `json:"listChanged,omitempty"`
}

type InitializeResult struct {
	ProtocolVersion string             `json:"protocolVersion"`
	Capabilities    ServerCapabilities `json:"capabilities"`
	ServerInfo      ServerInfo         `json:"serverInfo"`
}

type Tool struct {
	Name        string          `json:"name"`
	Description string          `json:"description"`
	InputSchema json.RawMessage `json:"inputSchema"`
}

type ListToolsResult struct {
	Tools []Tool `json:"tools"`
}

type CallToolParams struct {
	Name      string                 `json:"name"`
	Arguments map[string]interface{} `json:"arguments,omitempty"`
}

type TextContent struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

type CallToolResult struct {
	Content []TextContent `json:"content"`
	IsError bool          `json:"isError,omitempty"`
}

func (h *MCPHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	accept := r.Header.Get("Accept")

	if r.Method == "GET" {
		h.handleSSE(w, r)
		return
	}

	if r.Method == "POST" {
		if accept == "text/event-stream" || accept == "application/json, text/event-stream" {
			h.handleStreamableHTTP(w, r)
		} else {
			h.handleJSONRPC(w, r)
		}
		return
	}

	http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
}

func (h *MCPHandler) handleJSONRPC(w http.ResponseWriter, r *http.Request) {
	var req JSONRPCRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.writeError(w, nil, -32700, "Parse error", nil)
		return
	}

	user := GetUserFromContext(r.Context())
	response := h.processRequest(&req, user)

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(response)
}

func (h *MCPHandler) handleStreamableHTTP(w http.ResponseWriter, r *http.Request) {
	var req JSONRPCRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.writeError(w, nil, -32700, "Parse error", nil)
		return
	}

	user := GetUserFromContext(r.Context())
	response := h.processRequest(&req, user)

	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	data, _ := json.Marshal(response)
	_, _ = fmt.Fprintf(w, "data: %s\n\n", data)

	if f, ok := w.(http.Flusher); ok {
		f.Flush()
	}
}

func (h *MCPHandler) handleSSE(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "SSE not supported", http.StatusInternalServerError)
		return
	}

	ctx := r.Context()
	user := GetUserFromContext(ctx)

	slog.Info("SSE connection opened", "user", user.Login)

	var mu sync.Mutex
	sendEvent := func(event, data string) {
		mu.Lock()
		defer mu.Unlock()
		if event != "" {
			_, _ = fmt.Fprintf(w, "event: %s\n", event)
		}
		_, _ = fmt.Fprintf(w, "data: %s\n\n", data)
		flusher.Flush()
	}

	reader := bufio.NewReader(r.Body)
	messages := make(chan []byte)

	go func() {
		defer close(messages)
		for {
			line, err := reader.ReadBytes('\n')
			if err != nil {
				if err != io.EOF {
					slog.Error("error reading SSE message", "error", err)
				}
				return
			}
			if len(line) > 0 {
				messages <- line
			}
		}
	}()

	keepalive := time.NewTicker(30 * time.Second)
	defer keepalive.Stop()

	for {
		select {
		case <-ctx.Done():
			slog.Info("SSE connection closed", "user", user.Login)
			return
		case <-keepalive.C:
			sendEvent("", `{"type":"keepalive"}`)
		case msg, ok := <-messages:
			if !ok {
				return
			}
			var req JSONRPCRequest
			if err := json.Unmarshal(msg, &req); err != nil {
				continue
			}
			response := h.processRequest(&req, user)
			data, _ := json.Marshal(response)
			sendEvent("message", string(data))
		}
	}
}

func (h *MCPHandler) processRequest(req *JSONRPCRequest, user *UserContext) *JSONRPCResponse {
	switch req.Method {
	case "initialize":
		return h.handleInitialize(req)
	case "initialized":
		return nil
	case "tools/list":
		return h.handleListTools(req)
	case "tools/call":
		return h.handleCallTool(req, user)
	case "ping":
		return h.handlePing(req)
	default:
		return &JSONRPCResponse{
			JSONRPC: "2.0",
			ID:      req.ID,
			Error: &JSONRPCError{
				Code:    -32601,
				Message: "Method not found",
			},
		}
	}
}

func (h *MCPHandler) handleInitialize(req *JSONRPCRequest) *JSONRPCResponse {
	result := InitializeResult{
		ProtocolVersion: "2024-11-05",
		Capabilities: ServerCapabilities{
			Tools: &ToolsCapability{
				ListChanged: false,
			},
		},
		ServerInfo: ServerInfo{
			Name:    "mcp-hello-world",
			Version: "1.0.0",
		},
	}

	return &JSONRPCResponse{
		JSONRPC: "2.0",
		ID:      req.ID,
		Result:  result,
	}
}

func (h *MCPHandler) handleListTools(req *JSONRPCRequest) *JSONRPCResponse {
	tools := []Tool{
		{
			Name:        "hello_world",
			Description: "Returns a friendly hello world greeting with the authenticated user's GitHub username",
			InputSchema: json.RawMessage(`{
				"type": "object",
				"properties": {},
				"required": []
			}`),
		},
		{
			Name:        "greet",
			Description: "Returns a personalized greeting message",
			InputSchema: json.RawMessage(`{
				"type": "object",
				"properties": {
					"name": {
						"type": "string",
						"description": "The name to greet"
					}
				},
				"required": ["name"]
			}`),
		},
		{
			Name:        "whoami",
			Description: "Returns information about the authenticated GitHub user",
			InputSchema: json.RawMessage(`{
				"type": "object",
				"properties": {},
				"required": []
			}`),
		},
		{
			Name:        "echo",
			Description: "Echoes back the provided message",
			InputSchema: json.RawMessage(`{
				"type": "object",
				"properties": {
					"message": {
						"type": "string",
						"description": "The message to echo back"
					}
				},
				"required": ["message"]
			}`),
		},
		{
			Name:        "get_time",
			Description: "Returns the current server time in various formats",
			InputSchema: json.RawMessage(`{
				"type": "object",
				"properties": {
					"format": {
						"type": "string",
						"description": "Time format: 'iso', 'unix', or 'human'",
						"enum": ["iso", "unix", "human"]
					}
				},
				"required": []
			}`),
		},
	}

	return &JSONRPCResponse{
		JSONRPC: "2.0",
		ID:      req.ID,
		Result:  ListToolsResult{Tools: tools},
	}
}

func (h *MCPHandler) handleCallTool(req *JSONRPCRequest, user *UserContext) *JSONRPCResponse {
	var params CallToolParams
	if err := json.Unmarshal(req.Params, &params); err != nil {
		return &JSONRPCResponse{
			JSONRPC: "2.0",
			ID:      req.ID,
			Error: &JSONRPCError{
				Code:    -32602,
				Message: "Invalid params",
			},
		}
	}

	slog.Info("tool called", "tool", params.Name, "user", user.Login)

	var result CallToolResult

	switch params.Name {
	case "hello_world":
		result = CallToolResult{
			Content: []TextContent{
				{Type: "text", Text: fmt.Sprintf("Hello, World! 👋 Greetings from NAV MCP Hello World server. You are authenticated as @%s.", user.Login)},
			},
		}

	case "greet":
		name, _ := params.Arguments["name"].(string)
		if name == "" {
			name = user.Login
		}
		result = CallToolResult{
			Content: []TextContent{
				{Type: "text", Text: fmt.Sprintf("Hello, %s! 🎉 Welcome to the NAV MCP Hello World server.", name)},
			},
		}

	case "whoami":
		info := fmt.Sprintf(`GitHub User Information:
- Username: @%s
- User ID: %d
- Authenticated: ✅

This information is from your GitHub OAuth session.`, user.Login, user.ID)
		result = CallToolResult{
			Content: []TextContent{
				{Type: "text", Text: info},
			},
		}

	case "echo":
		message, _ := params.Arguments["message"].(string)
		result = CallToolResult{
			Content: []TextContent{
				{Type: "text", Text: fmt.Sprintf("Echo: %s", message)},
			},
		}

	case "get_time":
		format, _ := params.Arguments["format"].(string)
		now := time.Now()
		var timeStr string
		switch format {
		case "unix":
			timeStr = fmt.Sprintf("%d", now.Unix())
		case "human":
			timeStr = now.Format("Monday, January 2, 2006 at 3:04 PM MST")
		default:
			timeStr = now.Format(time.RFC3339)
		}
		result = CallToolResult{
			Content: []TextContent{
				{Type: "text", Text: fmt.Sprintf("Current server time: %s", timeStr)},
			},
		}

	default:
		return &JSONRPCResponse{
			JSONRPC: "2.0",
			ID:      req.ID,
			Error: &JSONRPCError{
				Code:    -32602,
				Message: fmt.Sprintf("Unknown tool: %s", params.Name),
			},
		}
	}

	return &JSONRPCResponse{
		JSONRPC: "2.0",
		ID:      req.ID,
		Result:  result,
	}
}

func (h *MCPHandler) handlePing(req *JSONRPCRequest) *JSONRPCResponse {
	return &JSONRPCResponse{
		JSONRPC: "2.0",
		ID:      req.ID,
		Result:  map[string]string{},
	}
}

func (h *MCPHandler) writeError(w http.ResponseWriter, id interface{}, code int, message string, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(JSONRPCResponse{
		JSONRPC: "2.0",
		ID:      id,
		Error: &JSONRPCError{
			Code:    code,
			Message: message,
			Data:    data,
		},
	})
}

type contextKey string

const userContextKey contextKey = "user"

type UserContext struct {
	Login             string
	ID                int64
	GitHubAccessToken string
}

func GetUserFromContext(ctx context.Context) *UserContext {
	user, _ := ctx.Value(userContextKey).(*UserContext)
	if user == nil {
		return &UserContext{Login: "anonymous", ID: 0}
	}
	return user
}
