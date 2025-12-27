import { Heading, BodyShort, Link } from "@navikt/ds-react";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8 text-center">
      <Heading size="xlarge" level="1">
        404
      </Heading>
      <BodyShort className="text-gray-600">Siden du leter etter finnes ikke.</BodyShort>
      <Link href="/">Gå til forsiden</Link>
    </main>
  );
}
