import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@navikt/ds-css";
import "./globals.css";
import { InternalHeader, InternalHeaderTitle, InternalHeaderUser } from "@navikt/ds-react/InternalHeader";
import { Spacer } from "@navikt/ds-react";
import { getUser } from "@/lib/auth";

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
      <body className={`${inter.className}`}>
        <InternalHeader>
          <InternalHeaderTitle as="h1">Min Copilot</InternalHeaderTitle>
          <Spacer />
          <InternalHeaderUser name={`${user.firstName} ${user.lastName}`} />
        </InternalHeader>
        <div className="bg-white">
          {children}
        </div>
        <footer className="bg-gray-800 text-white py-4 px-4 text-left text-md pb-10">
          <p>Built with GitHub Copilot</p>
        </footer>
      </body>
    </html>
  );
}