package discovery

import (
	"testing"
)

func TestLoadManifest(t *testing.T) {
	service := NewService("navikt", "copilot", "main", "")

	if err := service.LoadManifest(); err != nil {
		t.Fatalf("LoadManifest() error = %v", err)
	}

	manifest := service.GetManifest()
	if manifest == nil {
		t.Fatal("GetManifest() returned nil")
	}

	if len(manifest.Agents) == 0 {
		t.Error("Expected at least one agent in embedded manifest")
	}
}

func TestSearch(t *testing.T) {
	service := NewService("navikt", "copilot", "main", "")
	if err := service.LoadManifest(); err != nil {
		t.Fatalf("LoadManifest() error = %v", err)
	}

	results := service.Search("kafka", "", nil)
	if len(results) == 0 {
		t.Error("Search() returned 0 results for 'kafka'")
	}
}

func TestListByType(t *testing.T) {
	service := NewService("navikt", "copilot", "main", "")
	if err := service.LoadManifest(); err != nil {
		t.Fatalf("LoadManifest() error = %v", err)
	}

	results := service.ListByType(TypeAgent, "")
	if len(results) == 0 {
		t.Error("ListByType() returned 0 agents")
	}
}
