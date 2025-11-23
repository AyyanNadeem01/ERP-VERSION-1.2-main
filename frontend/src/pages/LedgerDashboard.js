import React, { useState } from "react";
import LedgerTable from "../components/LedgerTable";
import ClientLedger from "../components/ClientLedger";

export default function LedgerDashboard() {
  const [selectedClient, setSelectedClient] = useState(null);

  return (
    <div className="p-6 space-y-6">
      <LedgerTable onSelectClient={setSelectedClient} />
      {selectedClient && <ClientLedger clientId={selectedClient} />}
    </div>
  );
}
