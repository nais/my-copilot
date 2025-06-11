import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@navikt/ds-css";
import "./globals.css";
import { InternalHeader, InternalHeaderButton, InternalHeaderTitle, InternalHeaderUser } from "@navikt/ds-react/InternalHeader";
import { Spacer } from "@navikt/ds-react";
import { getUser } from "@/lib/auth";
import Faro from "@/components/faro";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Min Copilot",
  description: "Min Copilot er et selvbetjeningsverktøy for administrasjon av ditt GitHub Copilot abonnement.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser(false);

  if (!user) {
    return null;
  }

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-800`}>
        <InternalHeader>
          <InternalHeaderTitle as="a" href="/">Min Copilot</InternalHeaderTitle>
          <InternalHeaderButton as="a" href="/usage">Bruksstatistikk</InternalHeaderButton>
          <InternalHeaderButton as="a" href="/overview">Lisensoversikt</InternalHeaderButton>
          <Spacer />
          <InternalHeaderUser name={`${user.firstName} ${user.lastName}`} />
        </InternalHeader>
        <div className="bg-gray-100">
          {children}
        </div>
        <footer className="text-white py-4 px-4 text-left text-md pb-10 pt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p>Bygget med GitHub Copilot</p>
            </div>
            <div>
              <h2 className="text-lg font-bold mb-2">Relevante Lenker</h2>
              <ul className="list-disc list-inside">
                <li>
                  <a href="https://docs.github.com/en/copilot" className="text-blue-400 hover:underline">
                    GitHub Copilot Dokumentasjon
                  </a>
                </li>
                <li>
                  <a href="https://github.com/features/copilot" className="text-blue-400 hover:underline">
                    GitHub Copilot Funksjoner
                  </a>
                </li>
                <li>
                  <a href="https://utvikling.intern.nav.no/teknisk/github-copilot.html" className="text-blue-400 hover:underline">
                    Om GitHub Copilot i Nav
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-bold mb-2">Tekniske Lenker</h2>
              <ul className="list-disc list-inside">
                <li>
                  <a href="https://github.com/nais/my-copilot" className="text-blue-400 hover:underline">
                    github.com/nais/my-copilot
                  </a>
                </li>
                <li>
                  <a href="https://grafana.nav.cloud.nais.io/d/min-copilot" className="text-blue-400 hover:underline">
                    Grafana Dashboard
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </body>
      <Faro />
    </html>
  );
}