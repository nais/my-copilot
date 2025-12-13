import { Heading, Skeleton } from "@navikt/ds-react";

export default function Loading() {
  return (
    <main className="p-4 mx-4">
      <section className="mb-8">
        <Heading size="xlarge" level="1" className="mb-4">
          GitHub Copilot
        </Heading>
        <div className="space-y-3 mb-8">
          <Skeleton variant="text" width="90%" />
          <Skeleton variant="text" width="85%" />
        </div>

        <div className="mb-4">
          <Skeleton variant="text" width="40%" className="mb-2" />
          <div className="space-y-2">
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="55%" />
            <Skeleton variant="text" width="65%" />
          </div>
        </div>
      </section>

      <section className="mb-8">
        <Skeleton variant="text" width="30%" className="mb-4" />
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <Skeleton variant="rectangle" height={200} />
        </div>
      </section>
    </main>
  );
}
