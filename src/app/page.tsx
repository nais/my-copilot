import { getUser } from "@/lib/auth";
import { Button } from "@navikt/ds-react/Button";

export async function getInitialProps() {
  return { props: {} };
}
export default async function Home() {
  const user = await getUser(false);

  return (
    <main className="p-4 mx-4">
      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Copilot Abonnement</h1>
        <p className="mb-4">
          GitHub Copilot er et AI-drevet kodefullføringsverktøy som hjelper deg med å skrive og forstå kode. Min Copoilot er et selvbetjeningsverktøy for administrasjon av ditt Copilot abonnement.
        </p>

        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">Relevante Lenker</h2>
          <ul className="list-disc list-inside">
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
              <a href="https://utvikling.intern.nav.no/teknisk/github-copilot.html" className="text-blue-600 hover:underline">
                Om GitHub Copilot i Nav
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Mitt Abonnement</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Abonnement Detaljer</h3>
            <p className="mb-2"><strong>Plan:</strong> Individuell Plan</p>
            <p className="mb-2"><strong>Pris:</strong> $10 per måned</p>
            <p className="mb-2"><strong>Startdato:</strong> 01.01.2023</p>
            <p className="mb-2"><strong>Status:</strong> Aktiv</p>
            <Button variant="secondary">Administrer Abonnement</Button>
          </div>
          <div className="border p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Bruker Detaljer</h3>
            <p className="mb-2"><strong>Navn:</strong> {user?.firstName} {user?.lastName}</p>
            <p className="mb-2"><strong>E-post:</strong> {user?.email}</p>
            <p className="mb-2"><strong>Grupper:</strong> {user?.groups.join(", ")}</p>
          </div>
        </div>
      </section>

    </main>
  );
}