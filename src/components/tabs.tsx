'use client';

import React, { useState, useTransition } from 'react';
import { Skeleton, Box, HGrid } from '@navikt/ds-react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

const TabContentSkeleton = () => (
  <div className="space-y-6">
    <Skeleton variant="text" width="40%" />

    <HGrid columns={4} gap="4">
      <Box background="surface-subtle" padding="6" borderRadius="large">
        <Skeleton variant="rectangle" height={80} />
      </Box>
      <Box background="surface-subtle" padding="6" borderRadius="large">
        <Skeleton variant="rectangle" height={80} />
      </Box>
      <Box background="surface-subtle" padding="6" borderRadius="large">
        <Skeleton variant="rectangle" height={80} />
      </Box>
      <Box background="surface-subtle" padding="6" borderRadius="large">
        <Skeleton variant="rectangle" height={80} />
      </Box>
    </HGrid>

    <div className="space-y-3">
      <Skeleton variant="text" width="90%" />
      <Skeleton variant="text" width="85%" />
      <Skeleton variant="text" width="80%" />
    </div>
  </div>
);

const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (tabId: string) => {
    startTransition(() => {
      setActiveTab(tabId);
    });
  };

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-2 bg-gray-50 rounded-t-lg p-1" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              disabled={isPending}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 ${activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm border border-gray-200 border-b-white -mb-px relative z-10'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 cursor-pointer'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div
        className="bg-white rounded-b-lg rounded-tr-lg border border-gray-200 border-t-0 p-6 shadow-sm min-h-[400px] relative"
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {isPending ? (
          <TabContentSkeleton />
        ) : (
          tabs.find((tab) => tab.id === activeTab)?.content
        )}
      </div>
    </div>
  );
};

export default Tabs;
