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
  getModelUsageMetrics,
  getDateRange,
  getAggregatedMetrics,
  getAggregatedChatStats,
  getAggregatedFeatureAdoption,
  getAggregatedPRSummary
} from "@/lib/data-utils";
import { LanguageData, EditorData, RepositoryData, ModelData } from "@/lib/types";
import { formatNumber } from "@/lib/format";

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

  const dateRange = getDateRange(usage);
  const latestUsage = getLatestUsage(usage);
  if (!latestUsage || !dateRange) {
    return (
      <main className="p-6 mx-4 max-w-7xl">
        <section className="mb-8">
          <Heading size="xlarge" level="1" className="mb-6">Copilot Bruksstatistikk</Heading>
          <BodyShort>Ingen bruksdata tilgjengelig</BodyShort>
        </section>
      </main>
    );
  }

  // Use aggregated metrics across entire period
  const aggregatedMetrics = getAggregatedMetrics(usage);
  const topLanguages = getTopLanguages(usage);
  const editorStats = getEditorStats(usage);
  const chatStats = getAggregatedChatStats(usage);
  const overallMetrics = getOverallMetrics(usage);
  const linesMetrics = getLinesOfCodeMetrics(usage);
  const prSummaryMetrics = getAggregatedPRSummary(usage);
  const featureAdoptionMetrics = getAggregatedFeatureAdoption(usage);
  const modelUsageMetrics = getModelUsageMetrics(usage);

  if (!aggregatedMetrics) {
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
            <Heading size="xlarge" level="2" className="mb-2 text-white">{formatNumber(aggregatedMetrics.totalActiveUsers)}</Heading>
            <div className="flex items-center gap-2">            <BodyShort className="text-blue-100">
              Aktive brukere
            </BodyShort>
              <HelpText title="Aktive brukere" placement="top">
                Unike brukere som har brukt GitHub Copilot i organisasjonen i løpet av hele perioden.
              </HelpText>
            </div>
          </div>
        </Box>
        <Box background="surface-success" padding="6" borderRadius="large">
          <div className="text-white">
            <Heading size="xlarge" level="2" className="mb-2 text-white">{formatNumber(aggregatedMetrics.totalEngagedUsers)}</Heading>
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
            <Heading size="xlarge" level="2" className="mb-2 text-white">{aggregatedMetrics.overallAcceptanceRate}%</Heading>
            <div className="flex items-center gap-2">
              <BodyShort className="text-purple-100">
                Aksepteringsrate
              </BodyShort>
              <HelpText title="Aksepteringsrate" placement="top">
                Prosentandel av Copilots kodeforslag som blir akseptert av utviklerne over hele perioden. Typisk ligger gode rater mellom 20-40%.
              </HelpText>
            </div>
          </div>
        </Box>
        <Box background="surface-warning" padding="6" borderRadius="large">
          <div className="text-white">
            <Heading size="xlarge" level="2" className="mb-2 text-white">{formatNumber(aggregatedMetrics.totalSuggestions)}</Heading>
            <div className="flex items-center gap-2">            <BodyShort className="text-orange-100">
              Totale kodeforslag
            </BodyShort>
              <HelpText title="Totale kodeforslag" placement="top">
                Totalt antall kodeforslag som Copilot har generert over hele perioden, inkludert både aksepterte og avviste forslag.
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
            Oversikt over hvordan GitHub Copilot Chat brukes i organisasjonen. Dette inkluderer samtaler i IDE-er og på GitHub.com, samt hvordan brukerne interagerer med chat-svarene.
          </BodyShort>
          <HGrid columns={4} gap="4">
            <div className="text-center">
              <Heading size="large" level="4" className="mb-2 text-blue-600">{formatNumber(chatStats.totalChats)}</Heading>
              <div className="flex items-center justify-center gap-1">              <BodyShort className="text-gray-600">
                Totale samtaler
              </BodyShort>
                <HelpText title="Totale samtaler" placement="top">
                  Antall chat-samtaler som har blitt startet med Copilot, både i IDE-er og på GitHub.com.
                </HelpText>
              </div>
            </div>
            <div className="text-center">
              <Heading size="large" level="4" className="mb-2 text-green-600">{formatNumber(chatStats.totalCopyEvents)}</Heading>
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
              <Heading size="large" level="4" className="mb-2 text-purple-600">{formatNumber(chatStats.totalInsertionEvents)}</Heading>
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
              <Heading size="large" level="4" className="mb-2 text-orange-600">{formatNumber(chatStats.ideUsers + chatStats.dotcomUsers)}</Heading>
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
        <Heading size="medium" level="3" className="mb-4">Detaljer om kodeforslag</Heading>
        <BodyShort className="text-gray-600 mb-4">
          Detaljert statistikk over GitHub Copilots funksjon for kodeforslag, som viser hvor effektivt AI-assistenten bidrar til kodeutviklingen i organisasjonen over hele perioden.
        </BodyShort>
        <HGrid columns={3} gap="4">
          <Box background="surface-info-subtle" padding="4" borderRadius="medium">
            <div className="text-center">
              <Heading size="large" level="4" className="mb-2 text-blue-600">{formatNumber(aggregatedMetrics.totalAcceptances)}</Heading>
              <div className="flex items-center justify-center gap-1">                <BodyShort className="text-gray-600">
                Aksepterte forslag
              </BodyShort>
                <HelpText title="Aksepterte forslag" placement="top">
                  Antall kodeforslag fra Copilot som utviklerne har akseptert og tatt i bruk over hele perioden.
                </HelpText>
              </div>
            </div>
          </Box>
          <Box background="surface-neutral-subtle" padding="4" borderRadius="medium">
            <div className="text-center">
              <Heading size="large" level="4" className="mb-2 text-gray-600">{formatNumber(aggregatedMetrics.totalSuggestions)}</Heading>
              <div className="flex items-center justify-center gap-1">                <BodyShort className="text-gray-600">
                Totale forslag
              </BodyShort>
                <HelpText title="Totale forslag" placement="top">
                  Totalt antall kodeforslag som Copilot har generert over hele perioden, inkludert både aksepterte og avviste forslag.
                </HelpText>
              </div>
            </div>
          </Box>
          <Box background="surface-success-subtle" padding="4" borderRadius="medium">
            <div className="text-center">
              <Heading size="large" level="4" className="mb-2 text-green-600">{formatNumber(aggregatedMetrics.codeCompletionUsers)}</Heading>
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
        <Heading size="medium" level="3" className="mb-4">Statistikk for programmeringsspråk</Heading>
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
                    Hvor stor andel av Copilots forslag som aksepteres for dette språket.
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
                    <BodyShort>{formatNumber(language.total_engaged_users)}</BodyShort>
                  </TableDataCell>
                  <TableDataCell>
                    <BodyShort weight="semibold">{acceptanceRate}%</BodyShort>
                  </TableDataCell>
                  <TableDataCell>
                    <BodyShort>{formatNumber(acceptances)} / {formatNumber(suggestions)}</BodyShort>
                  </TableDataCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Languages Chart */}
      <div className="mt-8">
        <Heading size="medium" level="3" className="mb-4">Språkutvikling over tid</Heading>
        <LanguagesChart usage={usage} />
      </div>
    </div>
  );

  const editorsContent = (
    <div className="space-y-6">
      {/* Editor Statistics Table */}
      <div className="overflow-hidden">
        <Heading size="medium" level="3" className="mb-4">Statistikk for editorer</Heading>
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
                  <BodyShort>{formatNumber(editor.users)}</BodyShort>
                </TableDataCell>
                <TableDataCell>
                  <BodyShort weight="semibold">{editor.acceptanceRate}%</BodyShort>
                </TableDataCell>
                <TableDataCell>
                  <BodyShort>{formatNumber(editor.acceptances)} / {formatNumber(editor.suggestions)}</BodyShort>
                </TableDataCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Editors Chart */}
      <div className="mt-8">
        <Heading size="medium" level="3" className="mb-4">Editorbruk over tid</Heading>
        <EditorsChart usage={usage} />
      </div>
    </div>
  );

  const advancedMetricsContent = (
    <div className="space-y-6">
      {/* Lines of Code Metrics */}
      {aggregatedMetrics && (
        <Box background="surface-subtle" padding="6" borderRadius="large">
          <Heading size="medium" level="3" className="mb-4">Kodelinjer</Heading>
          <BodyShort className="text-gray-600 mb-4">
            Detaljert oversikt over kodelinjer som er foreslått og akseptert av Copilot over hele perioden. Dette gir et mer detaljert bilde av kodeproduksjonen enn bare antall forslag.
          </BodyShort>
          <HGrid columns={3} gap="4">
            <Box background="surface-info-subtle" padding="4" borderRadius="medium">
              <div className="text-center">
                <Heading size="large" level="4" className="mb-2 text-blue-600">{formatNumber(aggregatedMetrics.totalLinesSuggested)}</Heading>
                <div className="flex items-center justify-center gap-1">
                  <BodyShort className="text-gray-600">
                    Foreslåtte linjer
                  </BodyShort>
                  <HelpText title="Foreslåtte linjer" placement="top">
                    Totalt antall kodelinjer som Copilot har foreslått gjennom hele perioden.
                  </HelpText>
                </div>
              </div>
            </Box>
            <Box background="surface-success-subtle" padding="4" borderRadius="medium">
              <div className="text-center">
                <Heading size="large" level="4" className="mb-2 text-green-600">{formatNumber(aggregatedMetrics.totalLinesAccepted)}</Heading>
                <div className="flex items-center justify-center gap-1">
                  <BodyShort className="text-gray-600">
                    Aksepterte linjer
                  </BodyShort>
                  <HelpText title="Aksepterte linjer" placement="top">
                    Antall kodelinjer fra Copilot som utviklerne har akseptert og tatt i bruk over hele perioden.
                  </HelpText>
                </div>
              </div>
            </Box>
            <Box background="surface-warning-subtle" padding="4" borderRadius="medium">
              <div className="text-center">
                <Heading size="large" level="4" className="mb-2 text-orange-600">{aggregatedMetrics.linesAcceptanceRate}%</Heading>
                <div className="flex items-center justify-center gap-1">
                  <BodyShort className="text-gray-600">
                    Linjeaksepteringsrate
                  </BodyShort>
                  <HelpText title="Linjeaksepteringsrate" placement="top">
                    Prosentandel av foreslåtte kodelinjer som ble akseptert over hele perioden. Dette kan avvike fra forslags-aksepteringsraten.
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
          <Heading size="medium" level="3" className="mb-4">Funksjonsbruk</Heading>
          <BodyShort className="text-gray-600 mb-4">
            Oversikt over hvor mange brukere som benytter de ulike Copilot-funksjonene. Dette hjelper deg å forstå hvilke funksjoner som gir mest verdi.
          </BodyShort>
          <HGrid columns={4} gap="4">
            <div className="text-center">
              <Heading size="large" level="4" className="mb-2 text-blue-600">{formatNumber(featureAdoptionMetrics.codeCompletionUsers)}</Heading>
              <BodyShort className="text-gray-600 mb-1">Kodeforslag</BodyShort>
              <BodyShort className="text-sm text-gray-500">({featureAdoptionMetrics.adoptionRates.codeCompletion}% av aktive)</BodyShort>
            </div>
            <div className="text-center">
              <Heading size="large" level="4" className="mb-2 text-green-600">{formatNumber(featureAdoptionMetrics.ideChatUsers)}</Heading>
              <BodyShort className="text-gray-600 mb-1">IDE Chat</BodyShort>
              <BodyShort className="text-sm text-gray-500">({featureAdoptionMetrics.adoptionRates.ideChat}% av aktive)</BodyShort>
            </div>
            <div className="text-center">
              <Heading size="large" level="4" className="mb-2 text-purple-600">{formatNumber(featureAdoptionMetrics.dotcomChatUsers)}</Heading>
              <BodyShort className="text-gray-600 mb-1">GitHub Chat</BodyShort>
              <BodyShort className="text-sm text-gray-500">({featureAdoptionMetrics.adoptionRates.dotcomChat}% av aktive)</BodyShort>
            </div>
            <div className="text-center">
              <Heading size="large" level="4" className="mb-2 text-orange-600">{formatNumber(featureAdoptionMetrics.prSummaryUsers)}</Heading>
              <BodyShort className="text-gray-600 mb-1">PR Sammendrag</BodyShort>
              <BodyShort className="text-sm text-gray-500">({featureAdoptionMetrics.adoptionRates.prSummary}% av aktive)</BodyShort>
            </div>
          </HGrid>
        </Box>
      )}

      {/* PR Summary Metrics */}
      {prSummaryMetrics && prSummaryMetrics.totalPRSummaries > 0 && (
        <div className="space-y-4">
          <Heading size="medium" level="3">Pull request-sammendrag</Heading>
          <BodyShort className="text-gray-600">
            GitHub Copilot kan automatisk generere sammendrag for pull requests. Her ser du hvordan denne funksjonen brukes på tvers av repoer.
          </BodyShort>

          <HGrid columns={3} gap="4" className="mb-6">
            <Box background="surface-action-subtle" padding="4" borderRadius="medium">
              <div className="text-center">
                <Heading size="large" level="4" className="mb-2 text-blue-600">{formatNumber(prSummaryMetrics.totalEngagedUsers)}</Heading>
                <BodyShort className="text-gray-600">Aktive brukere</BodyShort>
              </div>
            </Box>
            <Box background="surface-success-subtle" padding="4" borderRadius="medium">
              <div className="text-center">
                <Heading size="large" level="4" className="mb-2 text-green-600">{formatNumber(prSummaryMetrics.totalPRSummaries)}</Heading>
                <BodyShort className="text-gray-600">Genererte sammendrag</BodyShort>
              </div>
            </Box>
            <Box background="surface-info-subtle" padding="4" borderRadius="medium">
              <div className="text-center">
                <Heading size="large" level="4" className="mb-2 text-purple-600">{formatNumber(prSummaryMetrics.repositoryStats.length)}</Heading>
                <BodyShort className="text-gray-600">Repositorier</BodyShort>
              </div>
            </Box>
          </HGrid>

          {prSummaryMetrics.repositoryStats.length > 0 && (
            <div className="overflow-hidden">
              <Heading size="small" level="4" className="mb-4">Topp-repoer</Heading>
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
                        <BodyShort>{formatNumber(repo.users)}</BodyShort>
                      </TableDataCell>
                      <TableDataCell>
                        <BodyShort>{formatNumber(repo.summaries)}</BodyShort>
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
            Oversikt over hvilke AI-modeller som brukes og hvilke funksjoner de støtter. Dette inkluderer både standard GitHub-modeller og tilpassede modeller.
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
                      <BodyShort>{formatNumber(model.users)}</BodyShort>
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
    { id: 'languages', label: 'Språk og teknologier', content: languagesContent },
    { id: 'editors', label: 'Utviklingsverktøy', content: editorsContent },
    { id: 'advanced', label: 'Avanserte målinger', content: advancedMetricsContent },
  ];

  return (
    <main className="p-6 mx-4 max-w-7xl">
      <section className="mb-8">
        <Heading size="xlarge" level="1" className="mb-6">Copilot Bruksstatistikk</Heading>
        <div className="space-y-3 mb-8">
          <BodyShort className="text-gray-600">
            Periode: {dateRange.start} - {dateRange.end} ({formatNumber(usage.length)} dager)
          </BodyShort>
          <BodyShort className="text-gray-700">
            Dette dashbordet gir deg en omfattende oversikt over hvordan GitHub Copilot brukes i organisasjonen gjennom hele perioden.
            Tallene inkluderer både kodeforslag (code completion) og chat-funksjoner på tvers av ulike editorer og programmeringsspråk.
          </BodyShort>
          <BodyShort className="text-gray-700">
            Bruk fanene nedenfor for å utforske detaljert statistikk, språk- og verktøyfordeling, samt trendanalyser over tid.
          </BodyShort>
        </div>

        <Tabs tabs={tabs} defaultTab="overview" />
      </section>
    </main>
  );
};
