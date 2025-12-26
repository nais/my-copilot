import React from "react";
import Image from "next/image";
import { Heading, BodyShort, Box, HGrid, HelpText, Label } from "@navikt/ds-react";
import {
  CheckmarkCircleIcon,
  XMarkOctagonIcon,
  ExclamationmarkTriangleIcon,
  LaptopIcon,
  GlobeIcon,
  TerminalIcon,
  CpuIcon,
  FileTextIcon,
  BranchingIcon,
  ShieldLockIcon,
  RocketIcon,
  BookIcon,
  TestFlaskIcon,
  MagnifyingGlassIcon,
  LinkIcon,
  LightBulbIcon,
  InformationIcon,
  TasklistIcon,
  CogIcon,
  BulletListIcon,
  PencilWritingIcon,
  StarIcon,
} from "@navikt/aksel-icons";

// VS Code style code block component with optional max height
function CodeBlock({ filename, children, maxHeight }: { filename: string; children: string; maxHeight?: string }) {
  const contentId = `code-${filename.replace(/[^a-z0-9]/gi, "-")}`;
  return (
    <div className="rounded-lg overflow-hidden border border-gray-700 shadow-lg">
      {/* Title bar */}
      <div className="bg-[#323233] px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-gray-400 text-xs ml-2 font-mono">{filename}</span>
      </div>
      {/* Code content with optional max height */}
      <div className="bg-[#1e1e1e] relative group">
        <input type="checkbox" id={contentId} className="peer hidden" />
        <div
          className="p-4 overflow-hidden transition-all duration-300"
          style={
            maxHeight
              ? ({
                maxHeight: maxHeight,
                "--expanded-height": "none",
              } as React.CSSProperties)
              : undefined
          }
        >
          <pre className="text-[#d4d4d4] text-xs font-mono whitespace-pre-wrap leading-relaxed">{children}</pre>
        </div>
        {maxHeight && (
          <>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-[#1e1e1e] to-transparent peer-checked:hidden pointer-events-none" />
            <label
              htmlFor={contentId}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-blue-400 hover:text-blue-300 cursor-pointer peer-checked:hidden bg-[#1e1e1e]/80 px-3 py-1 rounded-full"
            >
              Vis mer ↓
            </label>
            <label
              htmlFor={contentId}
              className="hidden peer-checked:block text-center text-xs text-blue-400 hover:text-blue-300 cursor-pointer py-2 border-t border-gray-700"
            >
              Vis mindre ↑
            </label>
          </>
        )}
        <style>{`
          #${contentId}:checked ~ div {
            max-height: none !important;
          }
        `}</style>
      </div>
    </div>
  );
}

export default async function BestPractices() {
  return (
    <main className="p-6 mx-4 max-w-7xl">
      <section className="space-y-6">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 overflow-hidden rounded-xl -z-10">
            <Image src="/images/HeaderImage.jpeg" alt="" fill className="object-cover opacity-15" priority />
            <div className="absolute inset-0 bg-linear-to-r from-white via-white/90 to-transparent" />
          </div>
          <div className="py-4">
            <Heading size="xlarge" level="1" className="mb-2">
              Beste Praksis og Læring
            </Heading>
            <BodyShort className="text-gray-600 max-w-2xl">
              En praktisk guide til GitHub Copilot – fra kodeforslag i editoren til autonome agenter som jobber i
              bakgrunnen. Lær å bruke verktøyet effektivt og trygt.
            </BodyShort>
          </div>
        </div>

        {/* 1. Styrker, Begrensninger og Farer */}
        <Box background="surface-subtle" padding="6" borderRadius="large">
          <Heading size="large" level="2" className="mb-4">
            Styrker, Begrensninger og Farer
          </Heading>
          <BodyShort className="text-gray-600 mb-6">
            Copilot er kraftig, men ikke magisk. Forstå hva det gjør best, hvor det svikter, og hvilke farer du må være
            oppmerksom på.
          </BodyShort>

          <HGrid columns={2} gap="6" className="mb-6">
            <div>
              <Heading size="medium" level="3" className="mb-4 text-green-700">
                ✓ Hva Copilot gjør best
              </Heading>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-green-600 font-bold">•</span>
                  <div>
                    <BodyShort weight="semibold">Repetitivt arbeid i stor skala</BodyShort>
                    <BodyShort className="text-gray-600 text-sm">
                      Fikse 161 skrivefeil på tvers av 100 filer, fjerne utdaterte feature flags, stor-skala
                      refaktorering
                    </BodyShort>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-600 font-bold">•</span>
                  <div>
                    <BodyShort weight="semibold">Tester og dokumentasjon</BodyShort>
                    <BodyShort className="text-gray-600 text-sm">
                      Genererer enhetstester, integrasjonstester, API-dokumentasjon og README-filer
                    </BodyShort>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-600 font-bold">•</span>
                  <div>
                    <BodyShort weight="semibold">Feilsøking og analyse</BodyShort>
                    <BodyShort className="text-gray-600 text-sm">
                      Fikse flaky tester, debugge produksjonsfeil, finne ytelsesflaskehalser
                    </BodyShort>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-600 font-bold">•</span>
                  <div>
                    <BodyShort weight="semibold">Kodebase-analyser</BodyShort>
                    <BodyShort className="text-gray-600 text-sm">
                      Audit av feature flags, autorisasjonsanalyse, finne forbedringsmuligheter
                    </BodyShort>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <Heading size="medium" level="3" className="mb-4 text-orange-700">
                ✗ Begrensninger
              </Heading>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-orange-600 font-bold">•</span>
                  <div>
                    <BodyShort weight="semibold">Arkitektur og systemdesign</BodyShort>
                    <BodyShort className="text-gray-600 text-sm">
                      Du må eie arkitekturen – Copilot implementerer, du designer
                    </BodyShort>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-orange-600 font-bold">•</span>
                  <div>
                    <BodyShort weight="semibold">Oppgaver med avhengigheter</BodyShort>
                    <BodyShort className="text-gray-600 text-sm">
                      Komplekse oppgaver der steg 2 avhenger av resultatet fra steg 1
                    </BodyShort>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-orange-600 font-bold">•</span>
                  <div>
                    <BodyShort weight="semibold">Ukjent terreng</BodyShort>
                    <BodyShort className="text-gray-600 text-sm">
                      Når du utforsker nye teknologier eller validerer antakelser
                    </BodyShort>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-orange-600 font-bold">•</span>
                  <div>
                    <BodyShort weight="semibold">Garantert sikker eller korrekt kode</BodyShort>
                    <BodyShort className="text-gray-600 text-sm">
                      Du må alltid gjennomgå og teste – AI kan og vil gjøre feil
                    </BodyShort>
                  </div>
                </li>
              </ul>
            </div>
          </HGrid>

          {/* Dangers section */}
          <Box background="surface-danger-subtle" padding="4" borderRadius="medium" className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <ExclamationmarkTriangleIcon className="text-red-700" aria-hidden />
              <Heading size="medium" level="3" className="text-red-700">
                Farer du må kjenne til
              </Heading>
            </div>
            <HGrid columns={2} gap="4">
              <div className="space-y-3">
                <div>
                  <BodyShort weight="semibold">Scope creep</BodyShort>
                  <BodyShort className="text-gray-600 text-sm">
                    Agenten refaktorerer kode du ikke ba om, eller &quot;forbedrer&quot; ting utenfor oppgaven
                  </BodyShort>
                </div>
                <div>
                  <BodyShort weight="semibold">Sirkulær atferd</BodyShort>
                  <BodyShort className="text-gray-600 text-sm">
                    Agenten prøver samme feilende tilnærming flere ganger uten å justere
                  </BodyShort>
                </div>
                <div>
                  <BodyShort weight="semibold">Hallusinasjoner</BodyShort>
                  <BodyShort className="text-gray-600 text-sm">
                    Copilot kan finne på API-er, funksjoner eller biblioteker som ikke eksisterer
                  </BodyShort>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <BodyShort weight="semibold">Prompt injection</BodyShort>
                  <BodyShort className="text-gray-600 text-sm">
                    Ondsinnet innhold i issues eller filer kan manipulere agentens oppførsel
                  </BodyShort>
                </div>
                <div>
                  <BodyShort weight="semibold">Konteksttap</BodyShort>
                  <BodyShort className="text-gray-600 text-sm">
                    Lange chat-sesjoner kan føre til at Copilot &quot;glemmer&quot; tidligere kontekst
                  </BodyShort>
                </div>
                <div>
                  <BodyShort weight="semibold">Over-engineering</BodyShort>
                  <BodyShort className="text-gray-600 text-sm">
                    Copilot kan generere unødvendig kompleks kode for enkle problemer
                  </BodyShort>
                </div>
              </div>
            </HGrid>
          </Box>

          {/* Security principles */}
          <Box background="surface-info-subtle" padding="4" borderRadius="medium">
            <div className="flex items-center gap-2 mb-3">
              <ShieldLockIcon className="text-blue-700" aria-hidden />
              <Heading size="small" level="3" className="text-blue-700">
                GitHubs sikkerhetsprinsipper for agenter
              </Heading>
            </div>
            <BodyShort className="text-gray-600 text-sm mb-3">
              GitHub har bygget inn disse sikkerhetsprinsippene i Copilot coding agent:
            </BodyShort>
            <HGrid columns={3} gap="3">
              <div>
                <BodyShort weight="semibold" className="text-sm">
                  Synlig kontekst
                </BodyShort>
                <BodyShort className="text-gray-600 text-xs">
                  Kun synlig innhold sendes til agenten, usynlig Unicode/HTML fjernes
                </BodyShort>
              </div>
              <div>
                <BodyShort weight="semibold" className="text-sm">
                  Begrenset tilgang
                </BodyShort>
                <BodyShort className="text-gray-600 text-xs">
                  Agenten får ikke CI-hemmeligheter eller filer utenfor repo
                </BodyShort>
              </div>
              <div>
                <BodyShort weight="semibold" className="text-sm">
                  Ingen irreversible endringer
                </BodyShort>
                <BodyShort className="text-gray-600 text-xs">Kun PR-er, aldri direkte commits til main</BodyShort>
              </div>
              <div>
                <BodyShort weight="semibold" className="text-sm">
                  Sporbarhet
                </BodyShort>
                <BodyShort className="text-gray-600 text-xs">
                  Alle handlinger attribueres til både bruker og agent
                </BodyShort>
              </div>
              <div>
                <BodyShort weight="semibold" className="text-sm">
                  Firewall
                </BodyShort>
                <BodyShort className="text-gray-600 text-xs">
                  Nettverkstilgang er begrenset, konfigurerbar per org
                </BodyShort>
              </div>
              <div>
                <BodyShort weight="semibold" className="text-sm">
                  Autoriserte brukere
                </BodyShort>
                <BodyShort className="text-gray-600 text-xs">
                  Kun brukere med write-tilgang kan tildele agenten issues
                </BodyShort>
              </div>
            </HGrid>
          </Box>
        </Box>

        {/* 2. Verktøy og Moduser */}
        <Box background="surface-subtle" padding="6" borderRadius="large">
          <Heading size="large" level="2" className="mb-4">
            Verktøy og Moduser
          </Heading>
          <BodyShort className="text-gray-600 mb-6">
            GitHub Copilot er ikke bare kodeforslag i editoren. Det er et økosystem av verktøy som spenner fra
            sanntidsforslag til autonome agenter som jobber i bakgrunnen.
          </BodyShort>

          {/* Video showcase */}
          <Box background="surface-default" padding="4" borderRadius="medium" className="mb-6">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full rounded-lg"
              aria-label="GitHub Copilot demonstrasjon"
              poster="/vldeos/hero-poster-lg.jpeg"
            >
              <source src="/vldeos/hero-animation-lg.mp4" type="video/mp4" media="(min-width: 768px)" />
              <source src="/vldeos/hero-animation-sm.mp4" type="video/mp4" />
            </video>
          </Box>

          <HGrid columns={3} gap="4" className="mb-6">
            {/* IDE */}
            <Box background="surface-info-subtle" padding="4" borderRadius="medium">
              <div className="flex items-center gap-2 mb-3">
                <LaptopIcon className="text-blue-700" aria-hidden />
                <Heading size="medium" level="3" className="text-blue-700">
                  I editoren (IDE)
                </Heading>
              </div>
              <Image
                src="/images/github-copilot-agent-mode.jpeg"
                alt="Copilot Agent Mode i VS Code"
                width={400}
                height={225}
                className="w-full rounded-md mb-3 border border-blue-200"
              />
              <div className="space-y-3">
                <div>
                  <BodyShort weight="semibold" className="text-sm">
                    Kodeforslag (Completions)
                  </BodyShort>
                  <BodyShort className="text-gray-600 text-xs">
                    Sanntidsforslag mens du skriver. Tab for å godta, Esc for å avvise.
                  </BodyShort>
                </div>
                <div>
                  <BodyShort weight="semibold" className="text-sm">
                    Chat (⌘+I / Ctrl+I)
                  </BodyShort>
                  <BodyShort className="text-gray-600 text-xs">
                    Still spørsmål, generér kode, få forklaringer. Bruk @workspace for prosjektkontekst.
                  </BodyShort>
                </div>
                <div>
                  <BodyShort weight="semibold" className="text-sm">
                    Agent Mode
                  </BodyShort>
                  <BodyShort className="text-gray-600 text-xs">
                    Multifil-endringer, kjør kommandoer, iterér på feil. Mer autonomt enn chat.
                  </BodyShort>
                </div>
                <div>
                  <BodyShort weight="semibold" className="text-sm">
                    Godkjenninger
                  </BodyShort>
                  <BodyShort className="text-gray-600 text-xs">
                    Agent spør om godkjenning før terminalkommandoer og nettsidefetching.
                  </BodyShort>
                </div>
              </div>
            </Box>

            {/* GitHub.com */}
            <Box background="surface-success-subtle" padding="4" borderRadius="medium">
              <div className="flex items-center gap-2 mb-3">
                <GlobeIcon className="text-green-700" aria-hidden />
                <Heading size="medium" level="3" className="text-green-700">
                  På GitHub.com
                </Heading>
              </div>
              <Image
                src="/images/github-copilot-coding-agent.jpeg"
                alt="Copilot Coding Agent på GitHub"
                width={400}
                height={225}
                className="w-full rounded-md mb-3 border border-green-200"
              />
              <div className="space-y-3">
                <div>
                  <BodyShort weight="semibold" className="text-sm">
                    Coding Agent
                  </BodyShort>
                  <BodyShort className="text-gray-600 text-xs">
                    Tildel en issue til @copilot, agenten lager PR i bakgrunnen. Perfekt for backlog.
                  </BodyShort>
                </div>
                <div>
                  <BodyShort weight="semibold" className="text-sm">
                    Mission Control
                  </BodyShort>
                  <BodyShort className="text-gray-600 text-xs">
                    Dashboard for å spore Copilot-oppgaver på tvers av repoer. Se fremdrift, session logs, og styr
                    agenten underveis. Tilgjengelig via{" "}
                    <a
                      href="https://github.com/copilot/tasks"
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      github.com/copilot/tasks
                    </a>
                    .
                  </BodyShort>
                </div>
                <div>
                  <BodyShort weight="semibold" className="text-sm">
                    Code Review
                  </BodyShort>
                  <BodyShort className="text-gray-600 text-xs">
                    Legg til @copilot som reviewer på PR-er. Tilpass med instructions-filer.
                  </BodyShort>
                </div>
                <div>
                  <BodyShort weight="semibold" className="text-sm">
                    Copilot Spaces
                  </BodyShort>
                  <BodyShort className="text-gray-600 text-xs">
                    Del kontekst med teamet for raskere debugging og samarbeid.
                  </BodyShort>
                </div>
              </div>
            </Box>

            {/* CLI */}
            <Box background="surface-warning-subtle" padding="4" borderRadius="medium">
              <div className="flex items-center gap-2 mb-3">
                <TerminalIcon className="text-orange-700" aria-hidden />
                <Heading size="medium" level="3" className="text-orange-700">
                  I terminalen (CLI)
                </Heading>
              </div>
              <Image
                src="/images/github-copilot-cli.jpeg"
                alt="Copilot i terminalen"
                width={400}
                height={225}
                className="w-full rounded-md mb-3 border border-orange-200"
              />
              <div className="space-y-3">
                <div>
                  <BodyShort weight="semibold" className="text-sm">
                    copilot
                  </BodyShort>
                  <BodyShort className="text-gray-600 text-xs">
                    Agentic CLI – build, debug, refactor kode med naturlig språk direkte i terminalen.
                  </BodyShort>
                </div>
                <Box background="surface-default" padding="2" borderRadius="small">
                  <code className="text-xs block">copilot</code>
                  <code className="text-xs block mt-1 text-gray-500"># Åpner interaktiv agent-modus</code>
                </Box>
                <BodyShort className="text-gray-500 text-xs">
                  Installer: <code className="bg-gray-100 px-1 rounded">brew install copilot-cli</code>{" "}
                  <code className="bg-gray-100 px-1 rounded">winget install GitHub.Copilot</code>{" "}
                  <code className="bg-gray-100 px-1 rounded">npm install -g @github/copilot</code>
                </BodyShort>
              </div>
            </Box>
          </HGrid>

          {/* MCP section - separate from CLI */}
          <Box background="surface-warning-subtle" padding="4" borderRadius="medium" className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <CogIcon className="text-orange-700" aria-hidden />
              <Heading size="small" level="3" className="text-orange-700">
                MCP (Model Context Protocol)
              </Heading>
            </div>
            <BodyShort className="text-gray-600 text-sm mb-2">
              Utvid Copilot med eksterne verktøy via MCP-servere. Tilgjengelig i Agent Mode (VS Code), Copilot CLI og
              Coding Agent på GitHub.com.
            </BodyShort>
            <BodyShort className="text-orange-600 text-xs font-medium">⚠️ Ikke godkjent for Nav ennå.</BodyShort>
          </Box>

          {/* Model selection */}
          <Box background="surface-action-subtle" padding="4" borderRadius="medium">
            <div className="flex items-center gap-2 mb-2">
              <CpuIcon className="text-blue-600" aria-hidden />
              <Heading size="small" level="3">
                Modellvalg og kostnader
              </Heading>
            </div>
            <BodyShort className="text-gray-600 text-sm mb-3">
              Du har <strong>300 premium requests</strong> per måned. <strong>Auto</strong> gir 10 % rabatt og velger
              beste modell automatisk. Multiplikatoren (1x, 3x, 0.33x) viser hvor mange requests som trekkes per
              forespørsel.
            </BodyShort>
            <HGrid columns={3} gap="3">
              <div>
                <Label size="small" className="text-green-700">
                  Auto (10 % rabatt)
                </Label>
                <BodyShort className="text-gray-600 text-xs">Anbefalt – velger optimal modell automatisk</BodyShort>
              </div>
              <div>
                <Label size="small">Claude Sonnet 4 / 4.5</Label>
                <BodyShort className="text-gray-600 text-xs">Balansert – god til de fleste oppgaver (1x)</BodyShort>
              </div>
              <div>
                <Label size="small">Claude Opus 4.5</Label>
                <BodyShort className="text-gray-600 text-xs">Kraftigst – komplekse oppgaver (3x)</BodyShort>
              </div>
              <div>
                <Label size="small">GPT-5.1 / 5.2</Label>
                <BodyShort className="text-gray-600 text-xs">OpenAI – bred kunnskap (1x)</BodyShort>
              </div>
              <div>
                <Label size="small">Gemini 2.5 Pro / 3 Pro</Label>
                <BodyShort className="text-gray-600 text-xs">Google – stor kontekst (1x)</BodyShort>
              </div>
              <div>
                <Label size="small">Haiku 4.5 / Gemini Flash</Label>
                <BodyShort className="text-gray-600 text-xs">Raske – enklere oppgaver (0.33x)</BodyShort>
              </div>
            </HGrid>
            <BodyShort className="text-gray-500 text-xs mt-3">
              Se{" "}
              <a
                href="https://docs.github.com/en/copilot/managing-copilot/monitoring-usage-and-entitlements/about-premium-requests"
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Premium requests dokumentasjon
              </a>{" "}
              for detaljer.
            </BodyShort>
          </Box>
        </Box>

        {/* 3. Forbered for Suksess */}
        <Box background="surface-subtle" padding="6" borderRadius="large">
          <Heading size="large" level="2" className="mb-4">
            Forbered for Suksess
          </Heading>
          <BodyShort className="text-gray-600 mb-6">
            Tilpass Copilot til ditt prosjekt med instruksjonsfiler. Jo bedre kontekst du gir, jo bedre resultater får
            du.
          </BodyShort>

          {/* Language guidance */}
          <Box background="surface-info-subtle" padding="4" borderRadius="medium" className="mb-6">
            <div className="flex items-start gap-2">
              <GlobeIcon className="text-blue-700 mt-0.5" aria-hidden />
              <Heading size="small" level="3" className="text-blue-700">
                Norsk vs. Engelsk
              </Heading>
              <HelpText title="Når bruke hvilket språk?">
                Copilot forstår begge språk godt, men konsistens er viktig for at agenten skal følge mønstrene i koden
                din.
              </HelpText>
            </div>
            <BodyShort className="text-gray-600 text-sm mt-2">
              <strong>Anbefaling:</strong> Skriv beskrivelser og kommentarer på norsk hvis det passer teamet. Hold kode,
              kommandoer, variabelnavn og tekniske termer på engelsk. Dette matcher vanlig praksis i norske
              utviklingsmiljøer og sikrer at Copilot forstår koden din korrekt.
            </BodyShort>
          </Box>

          {/* Comparison box */}
          <Box background="surface-warning-subtle" padding="4" borderRadius="medium" className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <InformationIcon className="text-orange-600" aria-hidden />
              <Heading size="small" level="3" className="text-orange-700">
                copilot-instructions.md vs agents/*.md
              </Heading>
            </div>
            <HGrid columns={2} gap="4">
              <div>
                <Label size="small" className="text-blue-700">
                  copilot-instructions.md
                </Label>
                <BodyShort className="text-gray-600 text-xs mt-1">
                  Generelle regler for hele repoet. Leses automatisk av alle Copilot-funksjoner (chat, completions,
                  agent). Bruk til: kodestil, teknisk stack, kommandoer, prosjektstruktur.
                </BodyShort>
              </div>
              <div>
                <Label size="small" className="text-green-700">
                  agents/*.md
                </Label>
                <BodyShort className="text-gray-600 text-xs mt-1">
                  Spesialiserte agenter for spesifikke oppgaver. Krever YAML frontmatter med <code>name</code> og{" "}
                  <code>description</code>. Bruk til: test-agent, migreringsagent, review-agent.
                </BodyShort>
              </div>
            </HGrid>
          </Box>

          <div className="space-y-6">
            {/* Horizontal scrollable instruction files */}
            <div className="relative">
              {/* Swipe hint */}
              <div className="flex items-center justify-between mb-3">
                <BodyShort className="text-gray-500 text-xs flex items-center gap-1">
                  <span>←</span> Swipe for flere eksempler <span>→</span>
                </BodyShort>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                </div>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {/* copilot-instructions.md */}
                <div className="shrink-0 w-100 snap-start">
                  <div className="flex items-center gap-2 mb-2">
                    <FileTextIcon className="text-blue-600" aria-hidden />
                    <Heading size="small" level="3">
                      Repository Instructions
                    </Heading>
                  </div>
                  <BodyShort className="text-gray-600 text-xs mb-2">Gjelder hele repoet, leses automatisk.</BodyShort>
                  <CodeBlock
                    filename=".github/copilot-instructions.md"
                    maxHeight="350px"
                  >{`# Prosjektinstruksjoner for Copilot

## Teknisk stack
- Next.js 15 med App Router
- TypeScript strict mode
- NAV Design System (@navikt/ds-react)
- Tailwind CSS for utilities

## Kodestil
- Bruk funksjonelle komponenter med hooks
- Unngå \`any\`-typer, definer eksplisitte interfaces
- Norske kommentarer, engelsk kode

## Kommandoer
- Test: \`pnpm test\`
- Lint: \`pnpm lint\`
- Build: \`pnpm build\`
- Typecheck: \`pnpm check\``}</CodeBlock>
                </div>

                {/* Custom agents */}
                <div className="shrink-0 w-100 snap-start">
                  <div className="flex items-center gap-2 mb-2">
                    <CogIcon className="text-green-600" aria-hidden />
                    <Heading size="small" level="3">
                      Custom Agents
                    </Heading>
                  </div>
                  <BodyShort className="text-gray-600 text-xs mb-2">
                    Spesialiserte agenter med YAML frontmatter.
                  </BodyShort>
                  <CodeBlock filename=".github/agents/test-agent.md" maxHeight="350px">{`---
name: test-agent
description: Skriver tester for dette prosjektet
---

Du er en erfaren QA-ingeniør som skriver tester.

## Din rolle
- Skriv enhetstester og integrasjonstester
- Følg eksisterende testmønstre i prosjektet
- Sikre god testdekning for edge cases

## Kommandoer
- Kjør tester: \`pnpm test\`
- Dekning: \`pnpm test --coverage\`

## Prosjektstruktur
- Tester ligger i \`__tests__/\` eller \`*.test.ts\`
- Bruk Jest og React Testing Library

## Grenser
✅ **Alltid:** Skriv til test-filer, kjør tester før commit
⚠️ **Spør først:** Endre eksisterende tester
🚫 **Aldri:** Slett tester, endre kildekode, commit secrets`}</CodeBlock>
                </div>

                {/* Path-specific instructions */}
                <div className="shrink-0 w-100 snap-start">
                  <div className="flex items-center gap-2 mb-2">
                    <PencilWritingIcon className="text-orange-600" aria-hidden />
                    <Heading size="small" level="3">
                      Path-Specific Instructions
                    </Heading>
                  </div>
                  <BodyShort className="text-gray-600 text-xs mb-2">Brukes av Copilot Code Review.</BodyShort>
                  <CodeBlock filename=".github/instructions/ts.instructions.md" maxHeight="350px">{`---
applyTo: "**/*.ts"
---
# TypeScript Coding Standards

## Naming Conventions
- Variables/functions: \`camelCase\` (getUserData, calculateTotal)
- Classes/interfaces: \`PascalCase\` (UserService, DataController)
- Constants: \`UPPER_SNAKE_CASE\` (API_KEY, MAX_RETRIES)

## Code Style
- Prefer \`const\` over \`let\` when not reassigning
- Use arrow functions for callbacks
- Avoid \`any\` – specify precise types
- Handle all promise rejections with try/catch

## Example
\`\`\`typescript
// ✅ Good
const fetchUser = async (id: string): Promise<User> => {
  if (!id) throw new Error('User ID required');
  return await api.get(\`/users/\${id}\`);
};

// ❌ Bad
async function get(x) {
  return await api.get('/users/' + x).data;
}
\`\`\``}</CodeBlock>
                </div>
              </div>
              {/* Right fade */}
              <div className="absolute right-0 top-10 bottom-4 w-16 bg-linear-to-l from-surface-subtle via-surface-subtle/80 to-transparent pointer-events-none" />
            </div>

            {/* Six core areas */}
            <Box background="surface-info-subtle" padding="4" borderRadius="medium">
              <div className="flex items-center gap-2 mb-3">
                <BulletListIcon className="text-blue-700" aria-hidden />
                <Heading size="small" level="3" className="text-blue-700">
                  Seks kjerneområder (fra 2500+ repos)
                </Heading>
              </div>
              <BodyShort className="text-gray-600 text-sm mb-3">
                Analyse av over 2500 agents.md-filer viser at de beste dekker disse områdene:
              </BodyShort>
              <HGrid columns={3} gap="3">
                <div>
                  <BodyShort weight="semibold" className="text-sm">
                    1. Kommandoer
                  </BodyShort>
                  <BodyShort className="text-gray-600 text-xs">
                    Kjørbare kommandoer tidlig: npm test, pnpm build
                  </BodyShort>
                </div>
                <div>
                  <BodyShort weight="semibold" className="text-sm">
                    2. Testing
                  </BodyShort>
                  <BodyShort className="text-gray-600 text-xs">Testrammeverk, hvor tester ligger, coverage</BodyShort>
                </div>
                <div>
                  <BodyShort weight="semibold" className="text-sm">
                    3. Prosjektstruktur
                  </BodyShort>
                  <BodyShort className="text-gray-600 text-xs">Mappestruktur, hvor kode hører hjemme</BodyShort>
                </div>
                <div>
                  <BodyShort weight="semibold" className="text-sm">
                    4. Kodestil
                  </BodyShort>
                  <BodyShort className="text-gray-600 text-xs">Kodeeksempler over forklaringer</BodyShort>
                </div>
                <div>
                  <BodyShort weight="semibold" className="text-sm">
                    5. Git-workflow
                  </BodyShort>
                  <BodyShort className="text-gray-600 text-xs">Branch-strategi, commit-meldinger</BodyShort>
                </div>
                <div>
                  <BodyShort weight="semibold" className="text-sm">
                    6. Grenser
                  </BodyShort>
                  <BodyShort className="text-gray-600 text-xs">Hva agenten aldri skal gjøre</BodyShort>
                </div>
              </HGrid>
            </Box>
          </div>
        </Box>

        {/* 4. Prompt Engineering */}
        <Box background="surface-subtle" padding="6" borderRadius="large">
          <Heading size="large" level="2" className="mb-4">
            Prompt Engineering
          </Heading>
          <BodyShort className="text-gray-600 mb-6">
            Hvordan du formulerer forespørselen påvirker kvaliteten på Copilots svar. Spesifisitet er nøkkelen.
          </BodyShort>

          <div className="space-y-6">
            {/* Strategy 1: Specific prompts */}
            <div>
              <Heading size="medium" level="3" className="mb-4 flex items-center gap-2">
                <span className="text-blue-600">1.</span>
                Vær spesifikk, ikke vag
              </Heading>

              <HGrid columns={2} gap="4" className="mb-4">
                <Box
                  background="surface-danger-subtle"
                  padding="4"
                  borderRadius="medium"
                  className="border-l-4 border-red-600"
                >
                  <BodyShort weight="semibold" className="text-red-700 mb-2">
                    ❌ Vag
                  </BodyShort>
                  <code className="text-sm bg-white p-2 block rounded whitespace-pre-wrap">
                    {`Fix the authentication bug.`}
                  </code>
                </Box>

                <Box
                  background="surface-success-subtle"
                  padding="4"
                  borderRadius="medium"
                  className="border-l-4 border-green-600"
                >
                  <BodyShort weight="semibold" className="text-green-700 mb-2">
                    ✓ Spesifikk
                  </BodyShort>
                  <code className="text-sm bg-white p-2 block rounded whitespace-pre-wrap">
                    {`Users report 'Invalid token' errors
after 30 minutes. JWT tokens are
configured with 1-hour expiration
in auth.config.ts. Investigate why
tokens expire early and fix the
validation logic in middleware/auth.ts`}
                  </code>
                </Box>
              </HGrid>
            </div>

            {/* Strategy 2: Examples */}
            <div>
              <Heading size="medium" level="3" className="mb-4 flex items-center gap-2">
                <span className="text-blue-600">2.</span>
                Gi eksempler på forventet output
              </Heading>

              <HGrid columns={2} gap="4" className="mb-4">
                <Box
                  background="surface-danger-subtle"
                  padding="4"
                  borderRadius="medium"
                  className="border-l-4 border-red-600"
                >
                  <BodyShort weight="semibold" className="text-red-700 mb-2">
                    ❌ Uten eksempel
                  </BodyShort>
                  <code className="text-sm bg-white p-2 block rounded whitespace-pre-wrap">
                    {`Write a function that formats
currency in Norwegian style`}
                  </code>
                </Box>

                <Box
                  background="surface-success-subtle"
                  padding="4"
                  borderRadius="medium"
                  className="border-l-4 border-green-600"
                >
                  <BodyShort weight="semibold" className="text-green-700 mb-2">
                    ✓ Med eksempel
                  </BodyShort>
                  <code className="text-sm bg-white p-2 block rounded whitespace-pre-wrap">
                    {`Write a TypeScript function that
formats numbers as Norwegian currency.

Example:
formatNOK(1234.5) → "1 234,50 kr"
formatNOK(1000000) → "1 000 000,00 kr"`}
                  </code>
                </Box>
              </HGrid>
            </div>

            {/* Strategy 3: Break down */}
            <div>
              <Heading size="medium" level="3" className="mb-4 flex items-center gap-2">
                <span className="text-blue-600">3.</span>
                Bryt ned komplekse oppgaver
              </Heading>
              <BodyShort className="text-gray-600 mb-4">
                Store oppgaver bør deles i mindre steg. Bruk <strong>Plan Mode</strong> for å la Copilot analysere
                oppgaven og foreslå en plan før implementering.
              </BodyShort>

              {/* Plan Mode Image */}
              <div className="mb-4 rounded-lg overflow-hidden border border-gray-200 shadow-sm relative aspect-video">
                <Image
                  src="/images/copilot-in-vs-code-hero-plan-mode.jpeg"
                  alt="Plan Mode i VS Code - Copilot analyserer og planlegger oppgaven"
                  fill
                  className="object-cover"
                />
              </div>

              <HGrid columns={2} gap="4">
                <Box background="surface-info-subtle" padding="4" borderRadius="medium">
                  <div className="flex items-center gap-2 mb-2">
                    <TasklistIcon className="text-blue-600" aria-hidden />
                    <BodyShort weight="semibold">Plan Mode</BodyShort>
                  </div>
                  <BodyShort className="text-gray-600 text-sm mb-2">
                    Aktiver med &quot;/plan&quot; eller velg Plan i modusvelgeren. Copilot vil:
                  </BodyShort>
                  <ol className="space-y-1 list-decimal list-inside text-xs text-gray-600">
                    <li>Analysere oppgaven og konteksten</li>
                    <li>Foreslå en detaljert plan med steg</li>
                    <li>La deg godkjenne eller justere planen</li>
                    <li>Implementere steg for steg</li>
                  </ol>
                </Box>

                <Box background="surface-success-subtle" padding="4" borderRadius="medium">
                  <BodyShort weight="semibold" className="mb-2">
                    Eksempel: Legg til autentisering
                  </BodyShort>
                  <ol className="space-y-1 list-decimal list-inside text-sm">
                    <li>Lag en AuthContext med login/logout</li>
                    <li>Lag en useAuth-hook</li>
                    <li>Lag ProtectedRoute-komponent</li>
                    <li>Integrer i app layout</li>
                  </ol>
                </Box>
              </HGrid>

              <Box background="surface-warning-subtle" padding="3" borderRadius="medium" className="mt-3">
                <BodyShort className="text-gray-600 text-xs">
                  <strong>Tips:</strong> For coding agent på GitHub.com, skriv issues med klare akseptkriterier og bruk
                  sub-issues for store oppgaver. Se{" "}
                  <a
                    href="https://docs.github.com/en/copilot/tutorials/coding-agent/get-the-best-results"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get the best results from the coding agent
                  </a>
                  .
                </BodyShort>
              </Box>
            </div>

            {/* Strategy 4: Context */}
            <div>
              <Heading size="medium" level="3" className="mb-4 flex items-center gap-2">
                <span className="text-blue-600">4.</span>
                Gi relevant kontekst
              </Heading>
              <Box background="surface-info-subtle" padding="4" borderRadius="medium">
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <span className="text-blue-600">▪</span>
                    <BodyShort className="text-sm">Åpne relevante filer, lukk irrelevante</BodyShort>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600">▪</span>
                    <BodyShort className="text-sm">Bruk @workspace for prosjektkontekst i chat</BodyShort>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600">▪</span>
                    <BodyShort className="text-sm">Merk opp koden du vil referere til</BodyShort>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600">▪</span>
                    <BodyShort className="text-sm">Start ny chat når du bytter tema</BodyShort>
                  </li>
                </ul>
              </Box>
            </div>

            {/* Anti-patterns */}
            <Box background="surface-danger-subtle" padding="4" borderRadius="medium">
              <div className="flex items-center gap-2 mb-3">
                <XMarkOctagonIcon className="text-red-700" aria-hidden />
                <Heading size="small" level="3" className="text-red-700">
                  Anti-mønstre å unngå
                </Heading>
              </div>
              <HGrid columns={2} gap="4">
                <div>
                  <BodyShort weight="semibold" className="text-sm">
                    Vage direktiver
                  </BodyShort>
                  <BodyShort className="text-gray-600 text-xs">
                    &quot;Be more accurate&quot; eller &quot;Identify all issues&quot; – Copilot gjør allerede sitt
                    beste
                  </BodyShort>
                </div>
                <div>
                  <BodyShort weight="semibold" className="text-sm">
                    Eksterne lenker
                  </BodyShort>
                  <BodyShort className="text-gray-600 text-xs">
                    Copilot følger ikke lenker – kopier relevant innhold inn i prompten
                  </BodyShort>
                </div>
                <div>
                  <BodyShort weight="semibold" className="text-sm">
                    Tvetydige referanser
                  </BodyShort>
                  <BodyShort className="text-gray-600 text-xs">
                    &quot;Fix this&quot; eller &quot;What does it do?&quot; – vær eksplisitt om hva du refererer til
                  </BodyShort>
                </div>
                <div>
                  <BodyShort weight="semibold" className="text-sm">
                    UX-endringer
                  </BodyShort>
                  <BodyShort className="text-gray-600 text-xs">
                    Du kan ikke endre fonter eller formatering på Copilot-kommentarer
                  </BodyShort>
                </div>
              </HGrid>
            </Box>
          </div>
        </Box>

        {/* 5. WRAP-metoden */}
        <Box background="surface-subtle" padding="6" borderRadius="large">
          <Heading size="large" level="2" className="mb-4">
            WRAP-metoden for Coding Agent
          </Heading>
          <BodyShort className="text-gray-600 mb-6">
            WRAP er en enkel huskeregel for å få mest mulig ut av Copilot coding agent. Tenk på det som å onboarde en ny
            kollega.
          </BodyShort>

          <HGrid columns={2} gap="6">
            <Box
              background="surface-success-subtle"
              padding="4"
              borderRadius="medium"
              className="border-l-4 border-green-600"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-600 font-bold text-xl">W</span>
                <Heading size="medium" level="3">
                  Write
                </Heading>
              </div>
              <BodyShort className="text-gray-600 mb-3">
                Skriv issues som om du forklarer til en ny utvikler på teamet.
              </BodyShort>
              <Box background="surface-default" padding="2" borderRadius="small">
                <code className="text-xs block">
                  {`Legg til en "Slett bruker"-knapp på
/admin/users siden.

- Knappen skal vises ved hover på rad
- Vis bekreftelsesdialog før sletting
- Kall DELETE /api/users/{id}
- Vis toast ved suksess/feil`}
                </code>
              </Box>
            </Box>

            <Box
              background="surface-info-subtle"
              padding="4"
              borderRadius="medium"
              className="border-l-4 border-blue-600"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-600 font-bold text-xl">R</span>
                <Heading size="medium" level="3">
                  Refine
                </Heading>
              </div>
              <BodyShort className="text-gray-600 mb-3">
                Forbedre med copilot-instructions.md og agents.md for konsistente resultater.
              </BodyShort>
              <ul className="space-y-1 text-sm">
                <li className="flex gap-2">
                  <span className="text-blue-600">▪</span>
                  <BodyShort className="text-sm">Definer tech stack og kodestil</BodyShort>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600">▪</span>
                  <BodyShort className="text-sm">Spesifiser testmønstre og kommandoer</BodyShort>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600">▪</span>
                  <BodyShort className="text-sm">Sett klare grenser (hva den aldri skal gjøre)</BodyShort>
                </li>
              </ul>
            </Box>

            <Box
              background="surface-warning-subtle"
              padding="4"
              borderRadius="medium"
              className="border-l-4 border-orange-600"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-orange-600 font-bold text-xl">A</span>
                <Heading size="medium" level="3">
                  Atomic
                </Heading>
              </div>
              <BodyShort className="text-gray-600 mb-3">
                Bryt ned i små, uavhengige oppgaver som kan kjøres parallelt.
              </BodyShort>
              <ul className="space-y-1 text-sm">
                <li className="flex gap-2">
                  <span className="text-orange-600">✗</span>
                  <BodyShort className="text-sm">&quot;Bygg komplett autentiseringssystem&quot;</BodyShort>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-600">✓</span>
                  <BodyShort className="text-sm">&quot;Lag login-skjema med validering&quot;</BodyShort>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-600">✓</span>
                  <BodyShort className="text-sm">&quot;Lag JWT token-håndtering&quot;</BodyShort>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-600">✓</span>
                  <BodyShort className="text-sm">&quot;Lag protected route middleware&quot;</BodyShort>
                </li>
              </ul>
            </Box>

            <Box
              background="surface-action-subtle"
              padding="4"
              borderRadius="medium"
              className="border-l-4 border-purple-600"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-purple-600 font-bold text-xl">P</span>
                <Heading size="medium" level="3">
                  Pair
                </Heading>
              </div>
              <BodyShort className="text-gray-600 mb-3">
                Jobb sammen med agenten – du eier arkitekturen, den implementerer.
              </BodyShort>
              <ul className="space-y-1 text-sm">
                <li className="flex gap-2">
                  <span className="text-purple-600">▪</span>
                  <BodyShort className="text-sm">Les session logs for å forstå agentens tankegang</BodyShort>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-600">▪</span>
                  <BodyShort className="text-sm">Gi spesifikk tilbakemelding når den sporer av</BodyShort>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-600">▪</span>
                  <BodyShort className="text-sm">Bygg videre på PR-en manuelt ved behov</BodyShort>
                </li>
              </ul>
            </Box>
          </HGrid>

          {/* Real-world examples from GitHub */}
          <Box background="surface-info-subtle" padding="4" borderRadius="medium" className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <BranchingIcon className="text-blue-700" aria-hidden />
              <Heading size="small" level="3" className="text-blue-700">
                Hva GitHub bruker Copilot til internt
              </Heading>
            </div>
            <BodyShort className="text-gray-600 text-sm mb-3">
              GitHub bruker Copilot coding agent aktivt på github.com-kodebasen:
            </BodyShort>
            <HGrid columns={3} gap="3">
              <div>
                <BodyShort weight="semibold" className="text-sm">
                  Opprydding
                </BodyShort>
                <BodyShort className="text-gray-600 text-xs">
                  Fjerne utdaterte feature flags, fikse 161 skrivefeil på tvers av 100 filer
                </BodyShort>
              </div>
              <div>
                <BodyShort weight="semibold" className="text-sm">
                  Refaktorering
                </BodyShort>
                <BodyShort className="text-gray-600 text-xs">
                  Gi nytt navn til klasser brukt overalt i kodebasen
                </BodyShort>
              </div>
              <div>
                <BodyShort weight="semibold" className="text-sm">
                  Feilretting
                </BodyShort>
                <BodyShort className="text-gray-600 text-xs">
                  Fikse flaky tester, produksjonsfeil, ytelsesproblemer
                </BodyShort>
              </div>
              <div>
                <BodyShort weight="semibold" className="text-sm">
                  Nye features
                </BodyShort>
                <BodyShort className="text-gray-600 text-xs">Nye API-endepunkter, interne verktøy</BodyShort>
              </div>
              <div>
                <BodyShort weight="semibold" className="text-sm">
                  Migrasjoner
                </BodyShort>
                <BodyShort className="text-gray-600 text-xs">Database-skjemaendringer, sikkerhetsgates</BodyShort>
              </div>
              <div>
                <BodyShort weight="semibold" className="text-sm">
                  Analyser
                </BodyShort>
                <BodyShort className="text-gray-600 text-xs">Audit av feature flags, autorisasjonsanalyse</BodyShort>
              </div>
            </HGrid>
          </Box>
        </Box>

        {/* 6. Orkestrer og Styr Agenter */}
        <Box background="surface-subtle" padding="6" borderRadius="large">
          <Heading size="large" level="2" className="mb-4">
            Orkestrer og Styr Agenter
          </Heading>
          <BodyShort className="text-gray-600 mb-6">
            Med Copilot coding agent jobber du som en &quot;mission control&quot; – du styrer oppgaver, overvåker
            fremdrift og griper inn ved behov.
          </BodyShort>

          {/* Mission Control Hero Image */}
          <div className="mb-6 rounded-lg overflow-hidden border border-gray-200 shadow-sm relative aspect-video">
            <Image
              src="/images/agents-on-github-hero-mission-control.jpeg"
              alt="Mission Control dashboard for Copilot agenter"
              fill
              className="object-cover"
            />
          </div>

            <div className="space-y-6">
            {/* Parallel vs Sequential */}
            <HGrid columns={2} gap="4">
              <Box background="surface-success-subtle" padding="4" borderRadius="medium">
              <div className="flex items-center gap-2 mb-2">
                <CheckmarkCircleIcon className="text-green-700" aria-hidden />
                <Heading size="small" level="3" className="text-green-700">
                Parallelt (uavhengige oppgaver)
                </Heading>
              </div>
              <BodyShort className="text-gray-600 text-sm mb-2">
                Start flere agenter samtidig når oppgavene ikke påvirker hverandre:
              </BodyShort>
              <ul className="space-y-1 text-xs">
                <li className="flex gap-2">
                <span className="text-green-600">✓</span>
                <span>Dokumentasjon for ulike moduler</span>
                </li>
                <li className="flex gap-2">
                <span className="text-green-600">✓</span>
                <span>Tester for forskjellige features</span>
                </li>
                <li className="flex gap-2">
                <span className="text-green-600">✓</span>
                <span>Code review av separate PR-er</span>
                </li>
                <li className="flex gap-2">
                <span className="text-green-600">✓</span>
                <span>Research på ulike teknologier</span>
                </li>
              </ul>
              </Box>

              <Box background="surface-warning-subtle" padding="4" borderRadius="medium">
              <div className="flex items-center gap-2 mb-2">
                <LinkIcon className="text-orange-700" aria-hidden />
                <Heading size="small" level="3" className="text-orange-700">
                Sekvensielt (avhengige oppgaver)
                </Heading>
              </div>
              <BodyShort className="text-gray-600 text-sm mb-2">Vent på én agent før du starter neste:</BodyShort>
              <ul className="space-y-1 text-xs">
                <li className="flex gap-2">
                <span className="text-orange-600">→</span>
                <span>1. Lag database-schema</span>
                </li>
                <li className="flex gap-2">
                <span className="text-orange-600">→</span>
                <span>2. Lag API som bruker schema</span>
                </li>
                <li className="flex gap-2">
                <span className="text-orange-600">→</span>
                <span>3. Lag frontend som kaller API</span>
                </li>
                <li className="flex gap-2">
                <span className="text-orange-600">→</span>
                <span>4. Lag tester for hele stacken</span>
                </li>
              </ul>
              </Box>
            </HGrid>

            {/* Reading Signals */}
            <Box background="surface-info-subtle" padding="4" borderRadius="medium">
              <div className="flex items-center gap-2 mb-3">
              <InformationIcon className="text-blue-700" aria-hidden />
              <Heading size="small" level="3" className="text-blue-700">
                Les agentens signaler
              </Heading>
              </div>
              <BodyShort className="text-gray-600 text-sm mb-3">
              Session logs viser agentens tankegang. Se etter disse tegnene:
              </BodyShort>
              <HGrid columns={3} gap="3">
              <div>
                <div className="flex items-center gap-1">
                <CheckmarkCircleIcon className="text-green-700" fontSize="1rem" aria-hidden />
                <BodyShort weight="semibold" className="text-sm text-green-700">
                  På rett spor
                </BodyShort>
                </div>
                <BodyShort className="text-gray-600 text-xs">
                Bruker riktige filer, følger kodestil, kjører tester
                </BodyShort>
              </div>
              <div>
                <div className="flex items-center gap-1">
                <ExclamationmarkTriangleIcon className="text-orange-700" fontSize="1rem" aria-hidden />
                <BodyShort weight="semibold" className="text-sm text-orange-700">
                  Sporet av
                </BodyShort>
                </div>
                <BodyShort className="text-gray-600 text-xs">
                Gjør mer enn oppgaven, redigerer irrelevante filer, går i loops
                </BodyShort>
              </div>
              <div>
                <div className="flex items-center gap-1">
                <XMarkOctagonIcon className="text-red-700" fontSize="1rem" aria-hidden />
                <BodyShort weight="semibold" className="text-sm text-red-700">
                  Stopp og ta over
                </BodyShort>
                </div>
                <BodyShort className="text-gray-600 text-xs">
                Feil etter feil, hallusinerer APIs, trenger domenekunnskap
                </BodyShort>
              </div>
              </HGrid>
            </Box>

            {/* Steering Techniques */}
            <Box background="surface-action-subtle" padding="4" borderRadius="medium">
              <div className="flex items-center gap-2 mb-3">
              <CogIcon className="text-blue-600" aria-hidden />
              <Heading size="small" level="3">
                Korrigeringsteknikker
              </Heading>
              </div>
              <div className="space-y-2">
              <div className="flex gap-3 items-start">
                <span className="text-blue-600 font-bold">1</span>
                <div>
                <BodyShort weight="semibold" className="text-sm">
                  Kommenter på PR-en
                </BodyShort>
                <BodyShort className="text-gray-600 text-xs">
                  &quot;Ikke endre config.ts – fokuser kun på UserService&quot;
                </BodyShort>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-blue-600 font-bold">2</span>
                <div>
                <BodyShort weight="semibold" className="text-sm">
                  Gjør manuell endring + be om å fortsette
                </BodyShort>
                <BodyShort className="text-gray-600 text-xs">
                  Fiks feil selv, push, og skriv &quot;Fikset typen, vennligst fortsett med resten&quot;
                </BodyShort>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-blue-600 font-bold">3</span>
                <div>
                <BodyShort weight="semibold" className="text-sm">
                  Bryt opp oppgaven
                </BodyShort>
                <BodyShort className="text-gray-600 text-xs">
                  Lukk issue, lag flere mindre issues, tildel på nytt
                </BodyShort>
                </div>
              </div>
              </div>
            </Box>

            {/* Session log screenshot */}
            <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm relative aspect-video">
              <Image
              src="/images/chat-reasoning.png"
              alt="Session log med agentens resonnering og verktøykall"
              fill
              className="object-cover"
              />
            </div>
            </div>
        </Box>

        {/* 7. Gjennomgå Copilots Arbeid */}
        <Box background="surface-subtle" padding="6" borderRadius="large">
          <Heading size="large" level="2" className="mb-4">
            Gjennomgå Copilots Arbeid
          </Heading>
          <BodyShort className="text-gray-600 mb-6">
            Copilot coding agent lager PR-er som trenger grundig gjennomgang. Bruk en tre-trinns sjekkliste.
          </BodyShort>

          {/* Code Review Image */}
          <div className="mb-6 rounded-lg overflow-hidden border border-gray-200 shadow-sm relative aspect-video">
            <Image
              src="/images/github-copilot-code-review-updated.jpeg"
              alt="Copilot Code Review på GitHub"
              fill
              className="object-cover"
            />
          </div>

          <HGrid columns={3} gap="4">
            <Box
              background="surface-info-subtle"
              padding="4"
              borderRadius="medium"
              className="border-l-4 border-blue-600"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-blue-600 font-bold text-lg">1</span>
                <Heading size="small" level="3">
                  Session logs
                </Heading>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="text-blue-600">▪</span>
                  <span>Forstod agenten oppgaven?</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600">▪</span>
                  <span>Var det feil den ga opp på?</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600">▪</span>
                  <span>Gikk den i loop eller hallusinerte?</span>
                </li>
              </ul>
            </Box>

            <Box
              background="surface-success-subtle"
              padding="4"
              borderRadius="medium"
              className="border-l-4 border-green-600"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-green-600 font-bold text-lg">2</span>
                <Heading size="small" level="3">
                  Files changed
                </Heading>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="text-green-600">▪</span>
                  <span>Kun relevante filer endret?</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">▪</span>
                  <span>Følger koden prosjektets stil?</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">▪</span>
                  <span>Er det hardkodet/generert kode?</span>
                </li>
              </ul>
            </Box>

            <Box
              background="surface-warning-subtle"
              padding="4"
              borderRadius="medium"
              className="border-l-4 border-orange-600"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-orange-600 font-bold text-lg">3</span>
                <Heading size="small" level="3">
                  Checks
                </Heading>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="text-orange-600">▪</span>
                  <span>Kjør CI manuelt (ikke auto på Copilot PR)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-600">▪</span>
                  <span>Sjekk at alle tester passerer</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-600">▪</span>
                  <span>Verifiser i preview/staging</span>
                </li>
              </ul>
            </Box>
          </HGrid>

          <Box background="surface-danger-subtle" padding="4" borderRadius="medium" className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <ExclamationmarkTriangleIcon className="text-red-700" aria-hidden />
              <Heading size="small" level="3" className="text-red-700">
                Viktig: CI kjører ikke automatisk
              </Heading>
            </div>
            <BodyShort className="text-gray-600 text-sm">
              PR-er fra Copilot coding agent utløser ikke CI-workflows automatisk. Du må starte dem manuelt eller
              approve workflow run. Dette er en sikkerhetsfunksjon.
            </BodyShort>
          </Box>

          {/* Pro tips */}
          <Box background="surface-action-subtle" padding="4" borderRadius="medium" className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <LightBulbIcon className="text-blue-600" aria-hidden />
              <Heading size="small" level="3">
                Pro-tips for effektiv gjennomgang
              </Heading>
            </div>
            <HGrid columns={2} gap="4">
              <div>
                <BodyShort weight="semibold" className="text-sm">
                  Be Copilot gjennomgå seg selv
                </BodyShort>
                <BodyShort className="text-gray-600 text-xs">
                  &quot;Review this PR for bugs, security issues, and code style violations&quot;
                </BodyShort>
              </div>
              <div>
                <BodyShort weight="semibold" className="text-sm">
                  Grupper lignende PR-er
                </BodyShort>
                <BodyShort className="text-gray-600 text-xs">
                  Gjennomgå flere dokumentasjons-PR-er sammen for konsistens
                </BodyShort>
              </div>
            </HGrid>
          </Box>
        </Box>

        {/* 8. Vanlige mønstre */}
        <Box background="surface-subtle" padding="6" borderRadius="large">
          <Heading size="large" level="2" className="mb-4">
            Vanlige mønstre for Agent Mode
          </Heading>
          <BodyShort className="text-gray-600 mb-6">
            Bygg spesialiserte agenter for repeterende oppgaver. Her er seks anbefalte agenter å starte med.
          </BodyShort>

          <HGrid columns={3} gap="4">
            <Box background="surface-info-subtle" padding="4" borderRadius="medium">
              <div className="flex items-center gap-2 mb-2">
                <BookIcon className="text-blue-700" aria-hidden />
                <Heading size="small" level="3">
                  @docs-agent
                </Heading>
              </div>
              <BodyShort className="text-gray-600 text-sm mb-2">Dokumentasjonsassistent</BodyShort>
              <ul className="space-y-1 text-xs">
                <li>• Oppdater README ved API-endringer</li>
                <li>• Generer JSDoc/docstrings</li>
                <li>• Lag CHANGELOG-oppføringer</li>
              </ul>
            </Box>

            <Box background="surface-success-subtle" padding="4" borderRadius="medium">
              <div className="flex items-center gap-2 mb-2">
                <TestFlaskIcon className="text-green-700" aria-hidden />
                <Heading size="small" level="3">
                  @test-agent
                </Heading>
              </div>
              <BodyShort className="text-gray-600 text-sm mb-2">Testskriving</BodyShort>
              <ul className="space-y-1 text-xs">
                <li>• Skriv enhetstester for ny kode</li>
                <li>• Øk testdekning på moduler</li>
                <li>• Fiks flaky tester</li>
              </ul>
            </Box>

            <Box background="surface-warning-subtle" padding="4" borderRadius="medium">
              <div className="flex items-center gap-2 mb-2">
                <MagnifyingGlassIcon className="text-orange-700" aria-hidden />
                <Heading size="small" level="3">
                  @lint-agent
                </Heading>
              </div>
              <BodyShort className="text-gray-600 text-sm mb-2">Kodeformatering</BodyShort>
              <ul className="space-y-1 text-xs">
                <li>• Fiks linting-feil</li>
                <li>• Migrer til ny ESLint-config</li>
                <li>• Fjern ubrukt kode</li>
              </ul>
            </Box>

            <Box background="surface-action-subtle" padding="4" borderRadius="medium">
              <div className="flex items-center gap-2 mb-2">
                <LinkIcon className="text-blue-600" aria-hidden />
                <Heading size="small" level="3">
                  @api-agent
                </Heading>
              </div>
              <BodyShort className="text-gray-600 text-sm mb-2">API-utvikling</BodyShort>
              <ul className="space-y-1 text-xs">
                <li>• Lag nye endepunkter</li>
                <li>• Generer OpenAPI-spec</li>
                <li>• Valider request/response</li>
              </ul>
            </Box>

            <Box background="surface-danger-subtle" padding="4" borderRadius="medium">
              <div className="flex items-center gap-2 mb-2">
                <ShieldLockIcon className="text-red-700" aria-hidden />
                <Heading size="small" level="3">
                  @security-agent
                </Heading>
              </div>
              <BodyShort className="text-gray-600 text-sm mb-2">Sikkerhetssjekk</BodyShort>
              <ul className="space-y-1 text-xs">
                <li>• Audit avhengigheter</li>
                <li>• Finn sikkerhetshull</li>
                <li>• Foreslå fixes</li>
              </ul>
            </Box>

            <Box background="surface-neutral-subtle" padding="4" borderRadius="medium">
              <div className="flex items-center gap-2 mb-2">
                <RocketIcon className="text-gray-700" aria-hidden />
                <Heading size="small" level="3">
                  @deploy-agent
                </Heading>
              </div>
              <BodyShort className="text-gray-600 text-sm mb-2">Dev/Deploy-hjelp</BodyShort>
              <ul className="space-y-1 text-xs">
                <li>• Oppdater Dockerfile</li>
                <li>• Fiks CI-config</li>
                <li>• Miljøvariabler</li>
              </ul>
            </Box>
          </HGrid>

          {/* Example agent file */}
          <Box background="surface-info-subtle" padding="4" borderRadius="medium" className="mt-4">
            <div className="flex items-center gap-2 mb-3">
              <FileTextIcon className="text-blue-700" aria-hidden />
              <Heading size="small" level="3" className="text-blue-700">
                Eksempel: .github/agents/test-agent.md
              </Heading>
            </div>
            <BodyShort className="text-gray-600 text-xs mb-2">
              Følger GitHub sin anbefalte rekkefølge: Kommandoer → Testing → Prosjektstruktur → Kodestil → Git-workflow
              → Grenser
            </BodyShort>
            <CodeBlock filename=".github/agents/test-agent.md">{`---
name: test-agent
description: Skriver tester for dette prosjektet
---

## Kommandoer
- Kjør tester: pnpm test
- Dekning: pnpm test --coverage
- Watch mode: pnpm test --watch

## Testing
- Testrammeverk: Jest + React Testing Library
- Mål: 80% coverage på nye filer

## Prosjektstruktur
- Tester: src/__tests__/ eller ved siden av fil som *.test.ts
- Mocks: src/__mocks__/

## Kodestil
- Bruk describe/it-blokker
- Test én ting per test
- Unngå implementasjonsdetaljer

## Git-workflow
- Commit-melding: "test: <beskrivelse>"
- Kjør tester før push

## Grenser
- ✅ Alltid: Kjør tester før commit
- ⚠️ Spør først: Endre eksisterende tester
- 🚫 Aldri: Slett tester uten godkjenning`}</CodeBlock>
          </Box>
        </Box>

        {/* 9. Ressurser */}
        <Box background="surface-subtle" padding="6" borderRadius="large">
          <Heading size="large" level="2" className="mb-4">
            Ressurser
          </Heading>
          <BodyShort className="text-gray-600 mb-6">
            Offisielle kilder, fellesskapsressurser og Nav-spesifikk dokumentasjon.
          </BodyShort>

          <HGrid columns={2} gap="4">
            <Box background="surface-info-subtle" padding="4" borderRadius="medium">
              <div className="flex items-center gap-2 mb-2">
                <BookIcon className="text-blue-600" aria-hidden />
                <Heading size="small" level="3">
                  Offisiell dokumentasjon
                </Heading>
              </div>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <span className="text-blue-600">▪</span>
                  <a
                    href="https://docs.github.com/en/copilot"
                    className="text-blue-600 hover:underline text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub Copilot Docs
                  </a>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600">▪</span>
                  <a
                    href="https://docs.github.com/en/copilot/get-started/best-practices"
                    className="text-blue-600 hover:underline text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Best Practices (Official)
                  </a>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600">▪</span>
                  <a
                    href="https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering"
                    className="text-blue-600 hover:underline text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Prompt Engineering Guide
                  </a>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600">▪</span>
                  <a
                    href="https://docs.github.com/en/copilot/managing-copilot/monitoring-usage-and-entitlements/about-premium-requests"
                    className="text-blue-600 hover:underline text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Premium Requests & Limits
                  </a>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600">▪</span>
                  <a
                    href="https://github.blog/changelog/2025-10-28-a-mission-control-to-assign-steer-and-track-copilot-coding-agent-tasks/"
                    className="text-blue-600 hover:underline text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Mission Control Changelog
                  </a>
                </li>
              </ul>
            </Box>

            <Box background="surface-success-subtle" padding="4" borderRadius="medium">
              <div className="flex items-center gap-2 mb-2">
                <StarIcon className="text-green-600" aria-hidden />
                <Heading size="small" level="3">
                  Fellesskapsressurser
                </Heading>
              </div>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <span className="text-green-600">▪</span>
                  <a
                    href="https://github.com/github/awesome-copilot"
                    className="text-green-600 hover:underline text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Awesome Copilot – kuratert liste
                  </a>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">▪</span>
                  <a
                    href="https://github.blog/tag/github-copilot/"
                    className="text-green-600 hover:underline text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub Blog – Copilot-artikler
                  </a>
                </li>
              </ul>
            </Box>

            <Box background="surface-warning-subtle" padding="4" borderRadius="medium">
              <div className="flex items-center gap-2 mb-2">
                <ShieldLockIcon className="text-orange-600" aria-hidden />
                <Heading size="small" level="3">
                  Sikkerhet og tillit
                </Heading>
              </div>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <span className="text-orange-600">▪</span>
                  <a
                    href="https://copilot.github.trust.page/"
                    className="text-orange-600 hover:underline text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub Copilot Trust Center
                  </a>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-600">▪</span>
                  <a
                    href="https://docs.github.com/en/copilot/managing-copilot"
                    className="text-orange-600 hover:underline text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Copilot Policy & Security
                  </a>
                </li>
              </ul>
            </Box>

            <Box background="surface-action-subtle" padding="4" borderRadius="medium">
              <div className="flex items-center gap-2 mb-2">
                <BranchingIcon className="text-blue-600" aria-hidden />
                <Heading size="small" level="3">
                  Nav-spesifikk
                </Heading>
              </div>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <span className="text-blue-600">▪</span>
                  <a
                    href="https://utvikling.intern.nav.no/teknisk/github-copilot.html"
                    className="text-blue-600 hover:underline text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Om GitHub Copilot i Nav
                  </a>
                </li>
              </ul>
            </Box>
          </HGrid>
        </Box>

        {/* Footer tip */}
        <Box background="surface-info-subtle" padding="4" borderRadius="medium">
          <div className="flex items-center gap-2 mb-2">
            <LightBulbIcon className="text-blue-700" aria-hidden />
            <Heading size="small" level="3" className="text-blue-700">
              Tips
            </Heading>
          </div>
          <BodyShort className="text-gray-700 text-sm">
            Copilot utvikles raskt – hold deg oppdatert via GitHub Blog og awesome-copilot. Husk at agenten er et
            verktøy: du eier arkitekturen, den implementerer.
          </BodyShort>
        </Box>
      </section>
    </main>
  );
}
