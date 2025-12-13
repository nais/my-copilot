import { Heading, BodyShort, Box, HGrid, Skeleton } from "@navikt/ds-react";

export default function Loading() {
  return (
    <main className="p-6 mx-4 max-w-7xl">
      <section>
        <Heading size="xlarge" level="1" className="mb-2">
          Copilot Bruksstatistikk
        </Heading>
        <BodyShort className="text-gray-600 mb-12">
          <Skeleton variant="text" width="60%" />
        </BodyShort>

        {/* Tab skeleton */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-2 bg-gray-50 rounded-t-lg p-1">
            <Skeleton variant="rectangle" height={36} width={100} />
            <Skeleton variant="rectangle" height={36} width={150} />
            <Skeleton variant="rectangle" height={36} width={130} />
            <Skeleton variant="rectangle" height={36} width={140} />
          </nav>
        </div>

        {/* Content skeleton */}
        <div className="bg-white rounded-b-lg rounded-tr-lg border border-gray-200 border-t-0 p-6 shadow-sm">
          <Skeleton variant="text" width="40%" className="mb-6" />

          <HGrid columns={4} gap="4" className="mb-6">
            <Box background="surface-action-selected" padding="6" borderRadius="large">
              <Skeleton variant="rectangle" height={80} />
            </Box>
            <Box background="surface-success" padding="6" borderRadius="large">
              <Skeleton variant="rectangle" height={80} />
            </Box>
            <Box background="surface-info" padding="6" borderRadius="large">
              <Skeleton variant="rectangle" height={80} />
            </Box>
            <Box background="surface-warning" padding="6" borderRadius="large">
              <Skeleton variant="rectangle" height={80} />
            </Box>
          </HGrid>

          <Box background="surface-subtle" padding="6" borderRadius="large">
            <Skeleton variant="text" width="30%" className="mb-4" />
            <HGrid columns={4} gap="4">
              <Skeleton variant="rectangle" height={60} />
              <Skeleton variant="rectangle" height={60} />
              <Skeleton variant="rectangle" height={60} />
              <Skeleton variant="rectangle" height={60} />
            </HGrid>
          </Box>
        </div>
      </section>
    </main>
  );
}
