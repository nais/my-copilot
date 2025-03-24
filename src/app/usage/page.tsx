import React from "react";
import { getCopilotUsage } from "@/lib/github";
import UsageChart from "@/components/usage";

export default async function Usage() {
  const { usage, error } = await getCopilotUsage("navikt");

  return (
    <main className="p-4 mx-4">
      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Copilot Bruksstatistikk</h1>
        {error ? (
          <p className="text-red-500">Feil ved henting av bruksdata: {error}</p>
        ) : (
          <><div className="m-4">
            {usage && usage.length > 0 && (
              <div className="flex space-x-4 overflow-x-auto">
                <div className="bg-white shadow-md rounded-lg p-4 w-64 border border-gray-300 text-center">
                  <p className="text-2xl font-bold">{usage[usage.length - 2].total_active_users || 0}</p>
                  <p><strong>Aktive Brukere</strong></p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-4 w-64 border border-gray-300 text-center">
                  <p className="text-2xl font-bold">{usage[usage.length - 2].total_engaged_users || 0}</p>
                  <p><strong>Engasjerte Brukere</strong></p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-4 w-64 border border-gray-300 text-center">
                  <p className="text-2xl font-bold">
                    {(() => {
                      const languageCount: Record<string, number> = {};

                      usage[usage.length - 2].copilot_ide_code_completions?.languages?.forEach((language) => {
                        if (language.name) {
                          if (!languageCount[language.name]) {
                            languageCount[language.name] = 0;
                          }
                          languageCount[language.name] += language.total_engaged_users || 0;
                        }
                      });

                      const topLanguage = Object.entries(languageCount).reduce(
                        (topLang, [language, users]) => users > topLang[1] ? [language, users] : topLang,
                        ['', 0]
                      )[0];

                      return topLanguage || 'N/A';
                    })()}
                  </p>
                  <p><strong>Mest Brukte Språk</strong></p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-4 w-64 border border-gray-300 text-center">
                  <p className="text-2xl font-bold">
                    {(() => {
                      const editorCount: Record<string, number> = {};

                      usage[usage.length - 2].copilot_ide_code_completions?.editors?.forEach((editor) => {
                        if (editor.name) {
                          if (!editorCount[editor.name]) {
                            editorCount[editor.name] = 0;
                          }
                          editorCount[editor.name] += editor.total_engaged_users || 0;
                        }
                      });

                      const topEditor = Object.entries(editorCount).reduce(
                        (topEd, [editor, users]) => users > topEd[1] ? [editor, users] : topEd,
                        ['', 0]
                      )[0];

                      return topEditor || 'N/A';
                    })()}
                  </p>
                  <p><strong>Mest Brukte Editor</strong></p>
                </div>
              </div>
            )}
          </div><UsageChart usage={usage!} /></>
        )
        }
      </section>
    </main >
  );
};
