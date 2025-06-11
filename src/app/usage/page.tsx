import React from "react";
import { getCopilotUsage } from "@/lib/github";
import Tabs from "@/components/tabs";
import TrendChart from "@/components/charts/TrendChart";
import LanguagesChart from "@/components/charts/LanguagesChart";
import EditorsChart from "@/components/charts/EditorsChart";
import ChatChart from "@/components/charts/ChatChart";
import {
  Table,
  BodyShort,
  Heading,
  HGrid,
  Box,
  HelpText
} from "@navikt/ds-react";
import { TableBody, TableDataCell, TableHeader, TableHeaderCell, TableRow } from "@navikt/ds-react/Table";
import {
  calculateAcceptanceRate,
  getTopLanguages,
  getEditorStats,
  getChatStats,
  getOverallMetrics,
  getLanguageAcceptanceData,
  getLatestUsage,
  getLinesOfCodeMetrics,
  getPRSummaryMetrics,
  getFeatureAdoptionMetrics,
  getModelUsageMetrics
} from "@/lib/data-utils";
import { LanguageData, EditorData, RepositoryData, ModelData } from "@/lib/types";

export default async function Usage() {
  const { usage, error } = await getCopilotUsage("navikt");

  if (error) {
    return (
      <main className="p-6 mx-4 max-w-7xl">
        <section className="mb-8">
          <Heading size="xlarge" level="1" className="mb-6">Copilot Bruksstatistikk</Heading>
          <BodyShort className="text-red-500">Feil ved henting av bruksdata: {error}</BodyShort>
        </section>
      </main>
    );
  }

  if (!usage || usage.length === 0) {
    return (
      <main className="p-6 mx-4 max-w-7xl">
        <section className="mb-8">
          <Heading size="xlarge" level="1" className="mb-6">Copilot Bruksstatistikk</Heading>
          <BodyShort>Ingen bruksdata tilgjengelig</BodyShort>
        </section>
      </main>
    );
  }

  const latestUsage = getLatestUsage(usage);
  if (!latestUsage) {
    return (
      <main className="p-6 mx-4 max-w-7xl">
        <section className="mb-8">
          <Heading size="xlarge" level="1" className="mb-6">Copilot Bruksstatistikk</Heading>
          <BodyShort>Ingen bruksdata tilgjengelig</BodyShort>
        </section>
      </main>
    );
  }

  const topLanguages = getTopLanguages(usage);
  const editorStats = getEditorStats(usage);
  const chatStats = getChatStats(usage);
  const overallMetrics = getOverallMetrics(usage);
  const linesMetrics = getLinesOfCodeMetrics(usage);
  const prSummaryMetrics = getPRSummaryMetrics(usage);
  const featureAdoptionMetrics = getFeatureAdoptionMetrics(usage);
  const modelUsageMetrics = getModelUsageMetrics(usage);

  if (!overallMetrics) {
    return (
      <main className="p-6 mx-4 max-w-7xl">
        <section className="mb-8">
          <Heading size="xlarge" level="1" className="mb-6">Copilot Bruksstatistikk</Heading>
          <BodyShort>Kunne ikke beregne nøkkeltall</BodyShort>
        </section>
      </main>
    );
  }

  // Tab content components
  const overviewContent = (
    <div className="space-y-6">
      {/* Header */}
      <Heading size="medium">Oversikt over nøkkeltall</Heading>

      {/* Key Metrics Cards */}
      <HGrid columns={4} gap="4">
        <Box background="surface-action-selected" padding="6" borderRadius="large">
          <div className="text-white">
            <Heading size="xlarge" level="2" className="mb-2 text-white">{latestUsage.total_active_users}</Heading>
            <div className="flex items-center gap-2">            <BodyShort className="text-blue-100">
              Totalt aktive brukere
            </BodyShort>
              <HelpText title="Aktive brukere" placement="top">
                Unike brukere som har brukt GitHub Copilot i organisasjonen i løpet av den siste perioden.
              </HelpText>
            </div>
          </div>
        </Box>
        <Box background="surface-success" padding="6" borderRadius="large">
          <div className="text-white">
            <Heading size="xlarge" level="2" className="mb-2 text-white">{latestUsage.total_engaged_users}</Heading>
            <div className="flex items-center gap-2">            <BodyShort className="text-green-100">
              Engasjerte brukere
            </BodyShort>
              <HelpText title="Engasjerte brukere" placement="top">
                Brukere som aktivt har interagert med Copilot ved å akseptere kodeforslag eller bruke chat-funksjonen.
              </HelpText>
            </div>
          </div>
        </Box>
        <Box background="surface-info" padding="6" borderRadius="large">
          <div className="text-white">
            <Heading size="xlarge" level="2" className="mb-2 text-white">{overallMetrics.overallAcceptanceRate}%</Heading>
            <div className="flex items-center gap-2">
              <BodyShort className="text-purple-100">
                Aksepteringsrate
              </BodyShort>
              <HelpText title="Aksepteringsrate" placement="top">
                Prosentandel av Copilots kodeforslag som blir akseptert av utviklerne. Typisk ligger gode rater mellom 20-40%.
              </HelpText>
            </div>
          </div>
        </Box>
        <Box background="surface-warning" padding="6" borderRadius="large">
          <div className="text-white">
            <Heading size="xlarge" level="2" className="mb-2 text-white">{overallMetrics.totalSuggestions.toLocaleString()}</Heading>
            <div className="flex items-center gap-2">            <BodyShort className="text-orange-100">
              Totale kodeforslag
            </BodyShort>
              <HelpText title="Totale kodeforslag" placement="top">
                Det totale antallet kodeforslag som Copilot har generert, inkludert både aksepterte og avviste forslag.
              </HelpText>
            </div>
          </div>
        </Box>
      </HGrid>

      {/* Chat Usage Section */}
      {chatStats && (
        <Box background="surface-subtle" padding="6" borderRadius="large">
          <Heading size="medium" level="3" className="mb-4">Chat-funksjoner</Heading>
          <BodyShort className="text-gray-600 mb-4">
            Oversikt over hvordan GitHub Copilot Chat blir brukt i organisasjonen. Dette inkluderer samtaler i IDE-er og på GitHub.com, samt hvordan brukerne interagerer med chat-svarene.
          </BodyShort>
          <HGrid columns={4} gap="4">
            <div className="text-center">
              <Heading size="large" level="4" className="mb-2 text-blue-600">{chatStats.totalChats}</Heading>
              <div className="flex items-center justify-center gap-1">              <BodyShort className="text-gray-600">
                Totale samtaler
              </BodyShort>
                <HelpText title="Totale samtaler" placement="top">
                  Antall chat-samtaler som er startet med Copilot, både i IDE-er og på GitHub.com.
                </HelpText>
              </div>
            </div>
            <div className="text-center">
              <Heading size="large" level="4" className="mb-2 text-green-600">{chatStats.totalCopyEvents}</Heading>
              <div className="flex items-center justify-center gap-1">
                <BodyShort className="text-gray-600">
                  Kopieringshendelser
                </BodyShort>
                <HelpText title="Kopieringshendelser" placement="top">
                  Hvor mange ganger brukere har kopiert kode eller tekst fra Copilot chat-svar.
                </HelpText>
              </div>
            </div>
            <div className="text-center">
              <Heading size="large" level="4" className="mb-2 text-purple-600">{chatStats.totalInsertionEvents}</Heading>
              <div className="flex items-center justify-center gap-1">
                <BodyShort className="text-gray-600">
                  Innsettingshendelser
                </BodyShort>
                <HelpText title="Innsettingshendelser" placement="top">
                  Antall ganger kode fra chat-svar har blitt satt direkte inn i filer.
                </HelpText>
              </div>
            </div>
            <div className="text-center">
              <Heading size="large" level="4" className="mb-2 text-orange-600">{chatStats.ideUsers + chatStats.dotcomUsers}</Heading>
              <div className="flex items-center justify-center gap-1">              <BodyShort className="text-gray-600">
                Chat-brukere
              </BodyShort>
                <HelpText title="Chat-brukere" placement="top">
                  Unike brukere som har brukt Copilot chat-funksjonen, enten i IDE-er eller på GitHub.com.
                </HelpText>
              </div>
            </div>
          </HGrid>
        </Box>
      )}

      {/* Chat Chart */}
      {chatStats && (
        <div className="mt-6">
          <ChatChart usage={usage} />
        </div>
      )}

      {/* Code Completion Details */}
      <Box background="surface-subtle" padding="6" borderRadius="large">
        <Heading size="medium" level="3" className="mb-4">Kodeforslag detaljer</Heading>
        <BodyShort className="text-gray-600 mb-4">
          Detaljert statistikk over GitHub Copilots kodeforslag-funksjon, som viser hvor effektivt AI-assistenten bidrar til kodeutviklingen i organisasjonen.
        </BodyShort>
        <HGrid columns={3} gap="4">
          <Box background="surface-info-subtle" padding="4" borderRadius="medium">
            <div className="text-center">
              <Heading size="large" level="4" className="mb-2 text-blue-600">{overallMetrics.totalAcceptances.toLocaleString()}</Heading>
              <div className="flex items-center justify-center gap-1">                <BodyShort className="text-gray-600">
                Aksepterte forslag
              </BodyShort>
                <HelpText title="Aksepterte forslag" placement="top">
                  Antall kodeforslag fra Copilot som utviklerne har akseptert og tatt i bruk.
                </HelpText>
              </div>
            </div>
          </Box>
          <Box background="surface-neutral-subtle" padding="4" borderRadius="medium">
            <div className="text-center">
              <Heading size="large" level="4" className="mb-2 text-gray-600">{overallMetrics.totalSuggestions.toLocaleString()}</Heading>
              <div className="flex items-center justify-center gap-1">                <BodyShort className="text-gray-600">
                Totale forslag
              </BodyShort>
                <HelpText title="Totale forslag" placement="top">
                  Det totale antallet kodeforslag som Copilot har generert, inkludert både aksepterte og avviste.
                </HelpText>
              </div>
            </div>
          </Box>
          <Box background="surface-success-subtle" padding="4" borderRadius="medium">
            <div className="text-center">
              <Heading size="large" level="4" className="mb-2 text-green-600">{latestUsage.copilot_ide_code_completions?.total_engaged_users || 0}</Heading>
              <div className="flex items-center justify-center gap-1">                <BodyShort className="text-gray-600">
                Aktive utviklere
              </BodyShort>
                <HelpText title="Aktive utviklere" placement="top">
                  Antall unike utviklere som har mottatt og interagert med kodeforslag fra Copilot.
                </HelpText>
              </div>
            </div>
          </Box>
        </HGrid>
      </Box>

      {/* Charts Section */}
      <div className="space-y-6">
        <Heading size="medium" level="3">Trendanalyse</Heading>
        <TrendChart usage={usage} />
      </div>
    </div>
  );

  const languagesContent = (
    <div className="space-y-6">
      {/* Programming Languages Table */}
      <div className="overflow-hidden">
        <Heading size="medium" level="3" className="mb-4">Programmeringsspråk statistikk</Heading>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell scope="col">
                <div className="flex items-center gap-1">
                  Rangering
                  <HelpText title="Rangering" placement="top">
                    Språkenes rangering basert på antall aktive brukere som bruker Copilot med det språket.
                  </HelpText>
                </div>
              </TableHeaderCell>
              <TableHeaderCell scope="col">Språk</TableHeaderCell>
              <TableHeaderCell scope="col">
                <div className="flex items-center gap-1">
                  Brukere
                  <HelpText title="Brukere" placement="top">
                    Antall unike utviklere som har brukt Copilot med dette programmeringsspråket.
                  </HelpText>
                </div>
              </TableHeaderCell>
              <TableHeaderCell scope="col">
                <div className="flex items-center gap-1">
                  Aksepteringsrate
                  <HelpText title="Aksepteringsrate" placement="top">
                    Hvor stor andel av Copilots forslag som blir akseptert for dette språket.
                  </HelpText>
                </div>
              </TableHeaderCell>
              <TableHeaderCell scope="col">
                <div className="flex items-center gap-1">
                  Aksepterte / totale
                  <HelpText title="Aksepterte / totale" placement="top">
                    Antall aksepterte forslag sammenlignet med totalt antall forslag for språket.
                  </HelpText>
                </div>
              </TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topLanguages.map((language: LanguageData, index: number) => {
              const { acceptances, suggestions } = getLanguageAcceptanceData(usage, language.name);
              const acceptanceRate = calculateAcceptanceRate(acceptances, suggestions);

              return (
                <TableRow key={language.name}>
                  <TableDataCell>
                    <Box background="surface-action-subtle" borderRadius="full" className="flex items-center justify-center w-8 h-8">
                      <BodyShort weight="semibold" className="text-blue-600">
                        {index + 1}
                      </BodyShort>
                    </Box>
                  </TableDataCell>
                  <TableDataCell>
                    <BodyShort weight="semibold" className="capitalize">{language.name}</BodyShort>
                  </TableDataCell>
                  <TableDataCell>
                    <BodyShort>{language.total_engaged_users}</BodyShort>
                  </TableDataCell>
                  <TableDataCell>
                    <BodyShort weight="semibold">{acceptanceRate}%</BodyShort>
                  </TableDataCell>
                  <TableDataCell>
                    <BodyShort>{acceptances.toLocaleString()} / {suggestions.toLocaleString()}</BodyShort>
                  </TableDataCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Languages Chart */}
      <div className="mt-8">
        <Heading size="medium" level="3" className="mb-4">Språktrend over tid</Heading>
        <LanguagesChart usage={usage} />
      </div>
    </div>
  );

  const editorsContent = (
    <div className="space-y-6">
      {/* Editor Statistics Table */}
      <div className="overflow-hidden">
        <Heading size="medium" level="3" className="mb-4">Editor statistikk</Heading>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell scope="col">
                <div className="flex items-center gap-1">
                  Rangering
                  <HelpText title="Rangering" placement="top">
                    Editorenes rangering basert på antall aktive brukere som bruker Copilot med editoren.
                  </HelpText>
                </div>
              </TableHeaderCell>
              <TableHeaderCell scope="col">Editor</TableHeaderCell>
              <TableHeaderCell scope="col">
                <div className="flex items-center gap-1">
                  Brukere
                  <HelpText title="Brukere" placement="top">
                    Antall unike utviklere som bruker Copilot i denne editoren.
                  </HelpText>
                </div>
              </TableHeaderCell>
              <TableHeaderCell scope="col">
                <div className="flex items-center gap-1">
                  Aksepteringsrate
                  <HelpText title="Aksepteringsrate" placement="top">
                    Prosentandel av forslag som blir akseptert i denne editoren.
                  </HelpText>
                </div>
              </TableHeaderCell>
              <TableHeaderCell scope="col">
                <div className="flex items-center gap-1">
                  Aksepterte / totale
                  <HelpText title="Aksepterte / totale" placement="top">
                    Antall aksepterte forslag sammenlignet med totalt antall forslag for editoren.
                  </HelpText>
                </div>
              </TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {editorStats.map((editor: EditorData, index: number) => (
              <TableRow key={editor.name}>
                <TableDataCell>
                  <Box background="surface-action-subtle" borderRadius="full" className="flex items-center justify-center w-8 h-8">
                    <BodyShort weight="semibold" className="text-blue-600">
                      {index + 1}
                    </BodyShort>
                  </Box>
                </TableDataCell>
                <TableDataCell>
                  <BodyShort weight="semibold">{editor.name}</BodyShort>
                </TableDataCell>
                <TableDataCell>
                  <BodyShort>{editor.users}</BodyShort>
                </TableDataCell>
                <TableDataCell>
                  <BodyShort weight="semibold">{editor.acceptanceRate}%</BodyShort>
                </TableDataCell>
                <TableDataCell>
                  <BodyShort>{editor.acceptances.toLocaleString()} / {editor.suggestions.toLocaleString()}</BodyShort>
                </TableDataCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Editors Chart */}
      <div className="mt-8">
        <Heading size="medium" level="3" className="mb-4">Editor bruk over tid</Heading>
        <EditorsChart usage={usage} />
      </div>
    </div>
  );

  const advancedMetricsContent = (
    <div className="space-y-6">
      {/* Lines of Code Metrics */}
      {linesMetrics && (
        <Box background="surface-subtle" padding="6" borderRadius="large">
          <Heading size="medium" level="3" className="mb-4">Linjer med kode</Heading>
          <BodyShort className="text-gray-600 mb-4">
            Detaljert oversikt over linjer med kode som er foreslått og akseptert av Copilot. Dette gir et mer granulært bilde av kodeproduksjonen enn bare antall forslag.
          </BodyShort>
          <HGrid columns={3} gap="4">
            <Box background="surface-info-subtle" padding="4" borderRadius="medium">
              <div className="text-center">
                <Heading size="large" level="4" className="mb-2 text-blue-600">{linesMetrics.totalLinesSuggested.toLocaleString()}</Heading>
                <div className="flex items-center justify-center gap-1">
                  <BodyShort className="text-gray-600">
                    Foreslåtte linjer
                  </BodyShort>
                  <HelpText title="Foreslåtte linjer" placement="top">
                    Totalt antall kodelinjer som Copilot har foreslått i løpet av perioden.
                  </HelpText>
                </div>
              </div>
            </Box>
            <Box background="surface-success-subtle" padding="4" borderRadius="medium">
              <div className="text-center">
                <Heading size="large" level="4" className="mb-2 text-green-600">{linesMetrics.totalLinesAccepted.toLocaleString()}</Heading>
                <div className="flex items-center justify-center gap-1">
                  <BodyShort className="text-gray-600">
                    Aksepterte linjer
                  </BodyShort>
                  <HelpText title="Aksepterte linjer" placement="top">
                    Antall kodelinjer fra Copilot som utviklerne har akseptert og tatt i bruk.
                  </HelpText>
                </div>
              </div>
            </Box>
            <Box background="surface-warning-subtle" padding="4" borderRadius="medium">
              <div className="text-center">
                <Heading size="large" level="4" className="mb-2 text-orange-600">{linesMetrics.linesAcceptanceRate}%</Heading>
                <div className="flex items-center justify-center gap-1">
                  <BodyShort className="text-gray-600">
                    Linjeaksepteringsrate
                  </BodyShort>
                  <HelpText title="Linjeaksepteringsrate" placement="top">
                    Prosentandel av foreslåtte kodelinjer som ble akseptert. Dette kan avvike fra forslags-aksepteringsraten.
                  </HelpText>
                </div>
              </div>
            </Box>
          </HGrid>
        </Box>
      )}

      {/* Feature Adoption Breakdown */}
      {featureAdoptionMetrics && (
        <Box background="surface-subtle" padding="6" borderRadius="large">
          <Heading size="medium" level="3" className="mb-4">Funksjonsadopsjon</Heading>
          <BodyShort className="text-gray-600 mb-4">
            Oversikt over hvor mange brukere som benytter de ulike Copilot-funksjonene. Dette hjelper med å forstå hvilke funksjoner som gir mest verdi.
          </BodyShort>
          <HGrid columns={4} gap="4">
            <div className="text-center">
              <Heading size="large" level="4" className="mb-2 text-blue-600">{featureAdoptionMetrics.codeCompletionUsers}</Heading>
              <BodyShort className="text-gray-600 mb-1">Kodeforslag</BodyShort>
              <BodyShort className="text-sm text-gray-500">({featureAdoptionMetrics.adoptionRates.codeCompletion}% av aktive)</BodyShort>
            </div>
            <div className="text-center">
              <Heading size="large" level="4" className="mb-2 text-green-600">{featureAdoptionMetrics.ideChatUsers}</Heading>
              <BodyShort className="text-gray-600 mb-1">IDE Chat</BodyShort>
              <BodyShort className="text-sm text-gray-500">({featureAdoptionMetrics.adoptionRates.ideChat}% av aktive)</BodyShort>
            </div>
            <div className="text-center">
              <Heading size="large" level="4" className="mb-2 text-purple-600">{featureAdoptionMetrics.dotcomChatUsers}</Heading>
              <BodyShort className="text-gray-600 mb-1">GitHub Chat</BodyShort>
              <BodyShort className="text-sm text-gray-500">({featureAdoptionMetrics.adoptionRates.dotcomChat}% av aktive)</BodyShort>
            </div>
            <div className="text-center">
              <Heading size="large" level="4" className="mb-2 text-orange-600">{featureAdoptionMetrics.prSummaryUsers}</Heading>
              <BodyShort className="text-gray-600 mb-1">PR Sammendrag</BodyShort>
              <BodyShort className="text-sm text-gray-500">({featureAdoptionMetrics.adoptionRates.prSummary}% av aktive)</BodyShort>
            </div>
          </HGrid>
        </Box>
      )}

      {/* PR Summary Metrics */}
      {prSummaryMetrics && prSummaryMetrics.totalPRSummaries > 0 && (
        <div className="space-y-4">
          <Heading size="medium" level="3">Pull Request sammendrag</Heading>
          <BodyShort className="text-gray-600">
            GitHub Copilot kan automatisk generere sammendrag for pull requests. Her ser du hvordan denne funksjonen brukes på tvers av repositorier.
          </BodyShort>

          <HGrid columns={3} gap="4" className="mb-6">
            <Box background="surface-action-subtle" padding="4" borderRadius="medium">
              <div className="text-center">
                <Heading size="large" level="4" className="mb-2 text-blue-600">{prSummaryMetrics.totalEngagedUsers}</Heading>
                <BodyShort className="text-gray-600">Aktive brukere</BodyShort>
              </div>
            </Box>
            <Box background="surface-success-subtle" padding="4" borderRadius="medium">
              <div className="text-center">
                <Heading size="large" level="4" className="mb-2 text-green-600">{prSummaryMetrics.totalPRSummaries}</Heading>
                <BodyShort className="text-gray-600">Genererte sammendrag</BodyShort>
              </div>
            </Box>
            <Box background="surface-info-subtle" padding="4" borderRadius="medium">
              <div className="text-center">
                <Heading size="large" level="4" className="mb-2 text-purple-600">{prSummaryMetrics.repositoryStats.length}</Heading>
                <BodyShort className="text-gray-600">Repositorier</BodyShort>
              </div>
            </Box>
          </HGrid>

          {prSummaryMetrics.repositoryStats.length > 0 && (
            <div className="overflow-hidden">
              <Heading size="small" level="4" className="mb-4">Topp repositorier</Heading>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell scope="col">Repository</TableHeaderCell>
                    <TableHeaderCell scope="col">Brukere</TableHeaderCell>
                    <TableHeaderCell scope="col">Sammendrag</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prSummaryMetrics.repositoryStats.slice(0, 10).map((repo: RepositoryData) => (
                    <TableRow key={repo.name}>
                      <TableDataCell>
                        <BodyShort weight="semibold">{repo.name}</BodyShort>
                      </TableDataCell>
                      <TableDataCell>
                        <BodyShort>{repo.users}</BodyShort>
                      </TableDataCell>
                      <TableDataCell>
                        <BodyShort>{repo.summaries}</BodyShort>
                      </TableDataCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}

      {/* Model Usage Information */}
      {modelUsageMetrics && modelUsageMetrics.length > 0 && (
        <div className="space-y-4">
          <Heading size="medium" level="3">AI-modeller i bruk</Heading>
          <BodyShort className="text-gray-600">
            Oversikt over hvilke AI-modeller som brukes og hvilke funksjoner de støtter. Dette kan inkludere både standard GitHub-modeller og tilpassede modeller.
          </BodyShort>

          <div className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell scope="col">Modell</TableHeaderCell>
                  <TableHeaderCell scope="col">Type</TableHeaderCell>
                  <TableHeaderCell scope="col">Brukere</TableHeaderCell>
                  <TableHeaderCell scope="col">Funksjoner</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modelUsageMetrics.map((model: ModelData) => (
                  <TableRow key={model.name}>
                    <TableDataCell>
                      <BodyShort weight="semibold">{model.name}</BodyShort>
                    </TableDataCell>
                    <TableDataCell>
                      <BodyShort className={model.isCustom ? "text-purple-600" : "text-gray-600"}>
                        {model.isCustom ? "Tilpasset" : "Standard"}
                      </BodyShort>
                    </TableDataCell>
                    <TableDataCell>
                      <BodyShort>{model.users}</BodyShort>
                    </TableDataCell>
                    <TableDataCell>
                      <BodyShort className="text-sm">{model.features.join(", ")}</BodyShort>
                    </TableDataCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Oversikt', content: overviewContent },
    { id: 'languages', label: 'Språk & Teknologier', content: languagesContent },
    { id: 'editors', label: 'Utviklingsverktøy', content: editorsContent },
    { id: 'advanced', label: 'Avanserte Målinger', content: advancedMetricsContent },
  ];

  return (
    <main className="p-6 mx-4 max-w-7xl">
      <section className="mb-8">
        <Heading size="xlarge" level="1" className="mb-6">Copilot Bruksstatistikk</Heading>
        <div className="space-y-3 mb-8">
          <BodyShort className="text-gray-600">Siste oppdatering: {latestUsage.date}</BodyShort>
          <BodyShort className="text-gray-700">
            Dette dashbordet gir deg en omfattende oversikt over hvordan GitHub Copilot brukes i organisasjonen.
            Tallene inkluderer både kodeforslag (code completion) og chat-funksjoner på tvers av ulike editorer og programmeringsspråk.
          </BodyShort>
          <BodyShort className="text-gray-700">
            Bruk fanene under for å utforske detaljert statistikk, språk- og verktøyfordeling, samt trendanalyser over tid.
          </BodyShort>
        </div>

        <Tabs tabs={tabs} defaultTab="overview" />
      </section>
    </main>
  );
};
