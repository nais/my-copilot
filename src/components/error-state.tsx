import { Heading, BodyShort } from '@navikt/ds-react';

interface ErrorStateProps {
  title?: string;
  message: string;
}

export default function ErrorState({
  title = 'Copilot Bruksstatistikk',
  message
}: ErrorStateProps) {
  return (
    <main className="p-6 mx-4 max-w-7xl">
      <section className="mb-8">
        <Heading size="xlarge" level="1" className="mb-6">
          {title}
        </Heading>
        <BodyShort className={message.startsWith('Feil') ? 'text-red-500' : ''}>
          {message}
        </BodyShort>
      </section>
    </main>
  );
}
