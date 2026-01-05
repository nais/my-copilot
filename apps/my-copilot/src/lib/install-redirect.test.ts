import { isAllowedInstallUrl, INSTALL_TYPES, InstallType } from "./install-redirect";

describe("isAllowedInstallUrl", () => {
  const types: InstallType[] = ["agent", "instructions", "prompt"];

  describe.each(types)("for type '%s'", (type) => {
    const chatPath = INSTALL_TYPES[type];

    it("should allow valid vscode: URL with navikt repo", () => {
      const url = `vscode:${chatPath}/install?url=https://raw.githubusercontent.com/navikt/copilot/main/.github/agents/nais.agent.md`;
      expect(isAllowedInstallUrl(url, type)).toBe(true);
    });

    it("should allow valid vscode-insiders: URL with navikt repo", () => {
      const url = `vscode-insiders:${chatPath}/install?url=https://raw.githubusercontent.com/navikt/copilot/main/.github/agents/nais.agent.md`;
      expect(isAllowedInstallUrl(url, type)).toBe(true);
    });

    it("should allow URLs with different branches", () => {
      const url = `vscode:${chatPath}/install?url=https://raw.githubusercontent.com/navikt/my-repo/feature-branch/.github/agents/custom.agent.md`;
      expect(isAllowedInstallUrl(url, type)).toBe(true);
    });

    it("should reject URLs from non-navikt orgs", () => {
      const url = `vscode:${chatPath}/install?url=https://raw.githubusercontent.com/evil-org/copilot/main/.github/agents/malicious.agent.md`;
      expect(isAllowedInstallUrl(url, type)).toBe(false);
    });

    it("should reject URLs with wrong scheme", () => {
      const url = `http:${chatPath}/install?url=https://raw.githubusercontent.com/navikt/copilot/main/.github/agents/nais.agent.md`;
      expect(isAllowedInstallUrl(url, type)).toBe(false);
    });

    it("should reject URLs with http:// instead of vscode:", () => {
      const url = `https://example.com/malicious?redirect=https://raw.githubusercontent.com/navikt/copilot/main/.github/agents/nais.agent.md`;
      expect(isAllowedInstallUrl(url, type)).toBe(false);
    });

    it("should reject URLs with wrong chat path", () => {
      // Using agent path for instructions type, etc.
      const wrongPath = type === "agent" ? "chat-prompt" : "chat-agent";
      const url = `vscode:${wrongPath}/install?url=https://raw.githubusercontent.com/navikt/copilot/main/.github/agents/nais.agent.md`;
      expect(isAllowedInstallUrl(url, type)).toBe(false);
    });

    it("should reject empty URLs", () => {
      expect(isAllowedInstallUrl("", type)).toBe(false);
    });

    it("should reject URLs trying to escape with encoded characters", () => {
      // Attempt to use URL encoding to bypass validation
      const url = `vscode:${chatPath}/install?url=https://raw.githubusercontent.com/navikt/../evil-org/copilot/main/malicious.md`;
      expect(isAllowedInstallUrl(url, type)).toBe(false);
    });

    it("should reject URLs with navikt in subdirectory but not org", () => {
      const url = `vscode:${chatPath}/install?url=https://raw.githubusercontent.com/evil/navikt/main/file.md`;
      expect(isAllowedInstallUrl(url, type)).toBe(false);
    });
  });

  describe("cross-type validation", () => {
    it("should not allow agent URL for instructions type", () => {
      const url =
        "vscode:chat-agent/install?url=https://raw.githubusercontent.com/navikt/copilot/main/.github/agents/nais.agent.md";
      expect(isAllowedInstallUrl(url, "instructions")).toBe(false);
    });

    it("should not allow instructions URL for prompt type", () => {
      const url =
        "vscode:chat-instructions/install?url=https://raw.githubusercontent.com/navikt/copilot/main/.github/instructions/test.instructions.md";
      expect(isAllowedInstallUrl(url, "prompt")).toBe(false);
    });

    it("should not allow prompt URL for agent type", () => {
      const url =
        "vscode:chat-prompt/install?url=https://raw.githubusercontent.com/navikt/copilot/main/.github/prompts/test.prompt.md";
      expect(isAllowedInstallUrl(url, "agent")).toBe(false);
    });
  });
});
