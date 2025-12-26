import SubscriptionDetails from "@/components/subscription";
import { getUser } from "@/lib/auth";
import React from "react";

export default async function Home() {
  const user = await getUser(false);

  return (
    <main className="p-4 mx-4">
      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-4">GitHub Copilot</h1>
        <p className="mb-4">
          GitHub Copilot er et AI-drevet kodefullføringsverktøy som hjelper deg med å skrive og forstå kode. Min Copilot
          er et selvbetjeningsverktøy for administrasjon av ditt Copilot abonnement. Du må ha en aktiv bruker i GitHub
          organisasjonen <code>navikt</code> for å kunne bruke Copilot.
        </p>

        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">Relevante Lenker</h2>
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
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Mitt Abonnement</h2>
        <SubscriptionDetails user={user!} />
      </section>
    </main>
  );
}
