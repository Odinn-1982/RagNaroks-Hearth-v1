import React from "react";

export default function SnapshotManagerPanel({ serverId }) {
  return (
    <div className="snapshot-manager" style={{ marginTop: 12 }}>
      <h4>Snapshot Manager</h4>
      <button>Export Snapshot</button>
      <button style={{ marginLeft: 8 }}>Import Snapshot</button>
    </div>
  );
}