package main

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"net/url"
	"time"
)

type OAuthServer struct {
	BaseURL      string
	GitHubClient *GitHubClient
	Store        *TokenStore
}

type AuthorizationServerMetadata struct {
	Issuer                            string   `json:"issuer"`
	AuthorizationEndpoint             string   `json:"authorization_endpoint"`
	TokenEndpoint                     string   `json:"token_endpoint"`
	ResponseTypesSupported            []string `json:"response_types_supported"`
	GrantTypesSupported               []string `json:"grant_types_supported"`
	CodeChallengeMethodsSupported     []string `json:"code_challenge_methods_supported"`
	TokenEndpointAuthMethodsSupported []string `json:"token_endpoint_auth_methods_supported"`
}

type ProtectedResourceMetadata struct {
	Resource             string   `json:"resource"`
	AuthorizationServers []string `json:"authorization_servers"`
}

func NewOAuthServer(baseURL string, githubClient *GitHubClient, store *TokenStore) *OAuthServer {
	return &OAuthServer{
		BaseURL:      baseURL,
		GitHubClient: githubClient,
		Store:        store,
	}
}

func (s *OAuthServer) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /.well-known/oauth-authorization-server", s.handleAuthServerMetadata)
	mux.HandleFunc("GET /.well-known/oauth-protected-resource", s.handleProtectedResourceMetadata)
	mux.HandleFunc("GET /oauth/authorize", s.handleAuthorize)
	mux.HandleFunc("GET /oauth/callback", s.handleCallback)
	mux.HandleFunc("POST /oauth/token", s.handleToken)
	mux.HandleFunc("OPTIONS /oauth/token", s.handleTokenOptions)
}

func (s *OAuthServer) handleAuthServerMetadata(w http.ResponseWriter, _ *http.Request) {
	metadata := AuthorizationServerMetadata{
		Issuer:                            s.BaseURL,
		AuthorizationEndpoint:             s.BaseURL + "/oauth/authorize",
		TokenEndpoint:                     s.BaseURL + "/oauth/token",
		ResponseTypesSupported:            []string{"code"},
		GrantTypesSupported:               []string{"authorization_code", "refresh_token"},
		CodeChallengeMethodsSupported:     []string{"S256"},
		TokenEndpointAuthMethodsSupported: []string{"none"},
	}

	s.setCORSHeaders(w)
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(metadata)
}

func (s *OAuthServer) handleProtectedResourceMetadata(w http.ResponseWriter, _ *http.Request) {
	metadata := ProtectedResourceMetadata{
		Resource:             s.BaseURL,
		AuthorizationServers: []string{s.BaseURL},
	}

	s.setCORSHeaders(w)
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(metadata)
}

func (s *OAuthServer) handleAuthorize(w http.ResponseWriter, r *http.Request) {
	clientState := r.URL.Query().Get("state")
	redirectURI := r.URL.Query().Get("redirect_uri")
	codeChallenge := r.URL.Query().Get("code_challenge")
	codeChallengeMethod := r.URL.Query().Get("code_challenge_method")

	if codeChallengeMethod != "" && codeChallengeMethod != "S256" {
		http.Error(w, "Only S256 code challenge method supported", http.StatusBadRequest)
		return
	}

	internalState := generateSecureToken(32)

	session := &AuthSession{
		ClientState:         clientState,
		RedirectURI:         redirectURI,
		CodeChallenge:       codeChallenge,
		CodeChallengeMethod: codeChallengeMethod,
		CreatedAt:           time.Now(),
	}
	s.Store.SaveAuthSession(internalState, session)

	slog.Info("starting oauth flow",
		"redirect_uri", redirectURI,
		"has_pkce", codeChallenge != "",
	)

	githubURL := fmt.Sprintf(
		"https://github.com/login/oauth/authorize?client_id=%s&redirect_uri=%s&state=%s&scope=%s",
		s.GitHubClient.ClientID,
		url.QueryEscape(s.BaseURL+"/oauth/callback"),
		internalState,
		url.QueryEscape("read:user read:org user:email"),
	)

	http.Redirect(w, r, githubURL, http.StatusFound)
}

func (s *OAuthServer) handleCallback(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	state := r.URL.Query().Get("state")
	errorParam := r.URL.Query().Get("error")

	if errorParam != "" {
		errorDesc := r.URL.Query().Get("error_description")
		slog.Error("github oauth error", "error", errorParam, "description", errorDesc)
		http.Error(w, fmt.Sprintf("GitHub OAuth error: %s - %s", errorParam, errorDesc), http.StatusBadRequest)
		return
	}

	session, err := s.Store.GetAuthSession(state)
	if err != nil {
		slog.Error("invalid state", "error", err)
		http.Error(w, "Invalid or expired state", http.StatusBadRequest)
		return
	}
	s.Store.DeleteAuthSession(state)

	githubToken, err := s.GitHubClient.ExchangeCode(code)
	if err != nil {
		slog.Error("failed to exchange code", "error", err)
		http.Error(w, "Failed to exchange code with GitHub", http.StatusInternalServerError)
		return
	}

	user, err := s.GitHubClient.GetUser(githubToken.AccessToken)
	if err != nil {
		slog.Error("failed to get user", "error", err)
		http.Error(w, "Failed to get GitHub user", http.StatusInternalServerError)
		return
	}

	slog.Info("user authenticated", "login", user.Login, "id", user.ID)

	mcpCode := generateSecureToken(32)
	s.Store.SaveAuthCode(mcpCode, &AuthCode{
		GitHubAccessToken:  githubToken.AccessToken,
		GitHubRefreshToken: githubToken.RefreshToken,
		GitHubExpiresAt:    githubToken.ExpiresAt,
		CodeChallenge:      session.CodeChallenge,
		RedirectURI:        session.RedirectURI,
		UserLogin:          user.Login,
		UserID:             user.ID,
		CreatedAt:          time.Now(),
	})

	callbackURL := fmt.Sprintf("%s?code=%s&state=%s",
		session.RedirectURI,
		mcpCode,
		session.ClientState,
	)

	http.Redirect(w, r, callbackURL, http.StatusFound)
}

func (s *OAuthServer) handleTokenOptions(w http.ResponseWriter, _ *http.Request) {
	s.setCORSHeaders(w)
	w.WriteHeader(http.StatusNoContent)
}

func (s *OAuthServer) handleToken(w http.ResponseWriter, r *http.Request) {
	s.setCORSHeaders(w)
	w.Header().Set("Content-Type", "application/json")

	if err := r.ParseForm(); err != nil {
		s.writeTokenError(w, "invalid_request", "Failed to parse form")
		return
	}

	grantType := r.FormValue("grant_type")

	switch grantType {
	case "authorization_code":
		s.handleAuthorizationCodeGrant(w, r)
	case "refresh_token":
		s.handleRefreshTokenGrant(w, r)
	default:
		s.writeTokenError(w, "unsupported_grant_type", "Grant type not supported")
	}
}

func (s *OAuthServer) handleAuthorizationCodeGrant(w http.ResponseWriter, r *http.Request) {
	code := r.FormValue("code")
	codeVerifier := r.FormValue("code_verifier")
	redirectURI := r.FormValue("redirect_uri")

	authCode, err := s.Store.GetAuthCode(code)
	if err != nil {
		slog.Error("invalid auth code", "error", err)
		s.writeTokenError(w, "invalid_grant", "Invalid or expired authorization code")
		return
	}
	s.Store.DeleteAuthCode(code)

	if time.Since(authCode.CreatedAt) > 10*time.Minute {
		s.writeTokenError(w, "invalid_grant", "Authorization code expired")
		return
	}

	if authCode.RedirectURI != redirectURI {
		s.writeTokenError(w, "invalid_grant", "Redirect URI mismatch")
		return
	}

	if authCode.CodeChallenge != "" {
		if !VerifyPKCE(codeVerifier, authCode.CodeChallenge) {
			slog.Warn("PKCE verification failed", "user", authCode.UserLogin)
			s.writeTokenError(w, "invalid_grant", "PKCE verification failed")
			return
		}
	}

	accessToken := generateSecureToken(64)
	refreshToken := generateSecureToken(64)
	expiresIn := 3600

	s.Store.SaveToken(accessToken, &TokenData{
		GitHubAccessToken:  authCode.GitHubAccessToken,
		GitHubRefreshToken: authCode.GitHubRefreshToken,
		GitHubExpiresAt:    authCode.GitHubExpiresAt,
		UserLogin:          authCode.UserLogin,
		UserID:             authCode.UserID,
		ExpiresAt:          time.Now().Add(time.Duration(expiresIn) * time.Second),
	})

	s.Store.SaveRefreshToken(refreshToken, &RefreshTokenData{
		GitHubRefreshToken: authCode.GitHubRefreshToken,
		UserLogin:          authCode.UserLogin,
		UserID:             authCode.UserID,
		CreatedAt:          time.Now(),
	})

	slog.Info("token issued", "user", authCode.UserLogin, "expires_in", expiresIn)

	response := map[string]interface{}{
		"access_token":  accessToken,
		"token_type":    "Bearer",
		"expires_in":    expiresIn,
		"refresh_token": refreshToken,
	}
	_ = json.NewEncoder(w).Encode(response)
}

func (s *OAuthServer) handleRefreshTokenGrant(w http.ResponseWriter, r *http.Request) {
	refreshToken := r.FormValue("refresh_token")

	rtData, err := s.Store.GetRefreshToken(refreshToken)
	if err != nil {
		s.writeTokenError(w, "invalid_grant", "Invalid refresh token")
		return
	}

	newGitHubToken, err := s.GitHubClient.RefreshToken(rtData.GitHubRefreshToken)
	if err != nil {
		slog.Error("failed to refresh github token", "error", err, "user", rtData.UserLogin)
		s.writeTokenError(w, "invalid_grant", "Failed to refresh GitHub token")
		return
	}

	accessToken := generateSecureToken(64)
	newRefreshToken := generateSecureToken(64)
	expiresIn := 3600

	s.Store.SaveToken(accessToken, &TokenData{
		GitHubAccessToken:  newGitHubToken.AccessToken,
		GitHubRefreshToken: newGitHubToken.RefreshToken,
		GitHubExpiresAt:    newGitHubToken.ExpiresAt,
		UserLogin:          rtData.UserLogin,
		UserID:             rtData.UserID,
		ExpiresAt:          time.Now().Add(time.Duration(expiresIn) * time.Second),
	})

	s.Store.DeleteRefreshToken(refreshToken)
	s.Store.SaveRefreshToken(newRefreshToken, &RefreshTokenData{
		GitHubRefreshToken: newGitHubToken.RefreshToken,
		UserLogin:          rtData.UserLogin,
		UserID:             rtData.UserID,
		CreatedAt:          time.Now(),
	})

	slog.Info("token refreshed", "user", rtData.UserLogin)

	response := map[string]interface{}{
		"access_token":  accessToken,
		"token_type":    "Bearer",
		"expires_in":    expiresIn,
		"refresh_token": newRefreshToken,
	}
	_ = json.NewEncoder(w).Encode(response)
}

func (s *OAuthServer) writeTokenError(w http.ResponseWriter, code, description string) {
	w.WriteHeader(http.StatusBadRequest)
	_ = json.NewEncoder(w).Encode(map[string]string{
		"error":             code,
		"error_description": description,
	})
}

func (s *OAuthServer) setCORSHeaders(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept")
}

func generateSecureToken(length int) string {
	b := make([]byte, length)
	_, _ = rand.Read(b)
	return base64.RawURLEncoding.EncodeToString(b)
}
