import React from "react";

export default function ServerSwitcher({ onSelect }) {
  const servers = [{ id: 1, name: "Main Campaign" }, { id: 2, name: "Side Quest" }];
  return (
    <div className="server-switcher">
      <label>Server</label>
      <select onChange={(e) => onSelect(Number(e.target.value))}>
        <option value="">Select Server</option>
        {servers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
    </div>
  );
}