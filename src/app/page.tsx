import SubscriptionDetails from "@/components/subscription";
import { getUser } from "@/lib/auth";
import React from "react";
import { Box, VStack, Heading, BodyShort } from "@navikt/ds-react";

export default async function Home() {
  const user = await getUser(false);

  return (
    <main className="max-w-7xl mx-auto">
      <Box paddingBlock={{ xs: "space-16", md: "space-24" }} paddingInline={{ xs: "space-16", md: "space-40" }}>
        <VStack gap="space-24">
          <VStack gap="space-8">
            <Heading size="xlarge" level="1">
              GitHub Copilot
            </Heading>
            <BodyShort>
              GitHub Copilot er et AI-drevet kodefullføringsverktøy som hjelper deg med å skrive og forstå kode. Min
              Copilot er et selvbetjeningsverktøy for administrasjon av ditt Copilot abonnement. Du må ha en aktiv
              bruker i GitHub organisasjonen <code>navikt</code> for å kunne bruke Copilot.
            </BodyShort>
          </VStack>

          <VStack gap="space-8">
            <Heading size="large" level="2">
              Relevante Lenker
            </Heading>
            <ul className="list-disc list-inside">
              <li>
                <a href="/best-practices" className="text-blue-600 hover:underline">
                  Beste Praksis og Læring
                </a>
              </li>
              <li>
                <a href="https://docs.github.com/en/copilot" className="text-blue-600 hover:underline">
                  GitHub Copilot Dokumentasjon
                </a>
              </li>
              <li>
                <a href="https://github.com/features/copilot" className="text-blue-600 hover:underline">
                  GitHub Copilot Funksjoner
                </a>
              </li>
              <li>
                <a
                  href="https://utvikling.intern.nav.no/teknisk/github-copilot.html"
                  className="text-blue-600 hover:underline"
                >
                  Om GitHub Copilot i Nav
                </a>
              </li>
            </ul>
          </VStack>

          <VStack gap="space-8">
            <Heading size="large" level="2">
              Mitt Abonnement
            </Heading>
            <SubscriptionDetails user={user!} />
          </VStack>
        </VStack>
      </Box>
    </main>
  );
}
