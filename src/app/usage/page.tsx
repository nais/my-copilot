import React from "react";
import { getCopilotUsage } from "@/lib/github";
import UsageChart from "@/components/usage";

export default async function Usage() {
  const { usage, error } = await getCopilotUsage("navikt");


  return (
    <main className="p-4 mx-4">
      <h1 className="text-3xl font-bold mb-4">Copilot Bruksstatistikk</h1>
      {error ? (
        <p className="text-red-500">Error fetching usage data: {error}</p>
      ) : (
        <><div className="m-4">
          {usage && usage.length > 0 && (
            <div className="flex space-x-4 overflow-x-auto">
              <div className="bg-white shadow-md rounded-lg p-4 w-64 border border-gray-300 text-center">
                <p className="text-2xl font-bold">{usage[usage.length - 1].total_active_users || 0}</p>
                <p><strong>Active Users</strong></p>
              </div>
              <div className="bg-white shadow-md rounded-lg p-4 w-64 border border-gray-300 text-center">
                <p className="text-2xl font-bold">{usage[usage.length - 1].total_active_chat_users || 0}</p>
                <p><strong>Active Chat Users</strong></p>
              </div>
              <div className="bg-white shadow-md rounded-lg p-4 w-64 border border-gray-300 text-center">
                <p className="text-2xl font-bold">
                  {(() => {
                    const languageCount: Record<string, number> = {};

                    usage[usage.length - 1].breakdown?.forEach((breakdownItem) => {
                      if (breakdownItem.language) {
                        if (!languageCount[breakdownItem.language]) {
                          languageCount[breakdownItem.language] = 0;
                        }
                        languageCount[breakdownItem.language] += breakdownItem.active_users || 0;
                      }
                    });

                    const topLanguage = Object.entries(languageCount).reduce(
                      (topLang, [language, users]) => users > topLang[1] ? [language, users] : topLang,
                      ['', 0]
                    )[0];

                    return topLanguage || 'N/A';
                  })()}
                </p>
                <p><strong>Top Language</strong></p>
              </div>
              <div className="bg-white shadow-md rounded-lg p-4 w-64 border border-gray-300 text-center">
                <p className="text-2xl font-bold">
                  {(() => {
                    const editorCount: Record<string, number> = {};

                    usage[usage.length - 1].breakdown?.forEach((breakdownItem) => {
                      if (breakdownItem.editor) {
                        if (!editorCount[breakdownItem.editor]) {
                          editorCount[breakdownItem.editor] = 0;
                        }
                        editorCount[breakdownItem.editor] += breakdownItem.active_users || 0;
                      }
                    });

                    const topEditor = Object.entries(editorCount).reduce(
                      (topEd, [editor, users]) => users > topEd[1] ? [editor, users] : topEd,
                      ['', 0]
                    )[0];

                    return topEditor || 'N/A';
                  })()}
                </p>
                <p><strong>Top Editor</strong></p>
              </div>
            </div>
          )}
        </div><UsageChart usage={usage!} /></>
      )
      }
    </main >
  );
};
