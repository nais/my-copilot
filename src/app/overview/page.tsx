import { getCopilotBilling } from "@/lib/github";

function currencyFormat(num: number) {
  return `$${num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} USD`;
}

export default async function Users() {
  const { billing, error } = await getCopilotBilling("navikt");

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!billing) {
    return <div>Loading...</div>;
  }

  return (
    <main className="p-4 mx-4">
      <h1 className="text-3xl font-bold mb-4">Copilot Oversikt</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4">
          <h2 className="text-lg font-bold mb-2">Lisensfordeling</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Beskrivelse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verdi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Totalt antall lisenser</td>
                <td className="px-6 py-4 whitespace-nowrap">{billing.seat_breakdown.total}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Lagt til denne syklusen</td>
                <td className="px-6 py-4 whitespace-nowrap">{billing.seat_breakdown.added_this_cycle}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Ventende invitasjon</td>
                <td className="px-6 py-4 whitespace-nowrap">{billing.seat_breakdown.pending_invitation}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Ventende kansellering</td>
                <td className="px-6 py-4 whitespace-nowrap">{billing.seat_breakdown.pending_cancellation}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Aktiv denne syklusen</td>
                <td className="px-6 py-4 whitespace-nowrap">{billing.seat_breakdown.active_this_cycle}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Inaktiv denne syklusen</td>
                <td className="px-6 py-4 whitespace-nowrap">{billing.seat_breakdown.inactive_this_cycle}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Total kostnad</td>
                <td className="px-6 py-4 whitespace-nowrap">{currencyFormat((billing.seat_breakdown.total ?? 0) * 19)} per måned</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-bold mb-2">Innstillinger</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Innstilling</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verdi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Adminisrasjon av lisenser</td>
                <td className="px-6 py-4 whitespace-nowrap">{billing.seat_management_setting}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">IDE Chat</td>
                <td className="px-6 py-4 whitespace-nowrap">{billing.ide_chat}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Plattform Chat</td>
                <td className="px-6 py-4 whitespace-nowrap">{billing.platform_chat}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">CLI</td>
                <td className="px-6 py-4 whitespace-nowrap">{billing.cli}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Offentlige kodeforslag</td>
                <td className="px-6 py-4 whitespace-nowrap">{billing.public_code_suggestions}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};
