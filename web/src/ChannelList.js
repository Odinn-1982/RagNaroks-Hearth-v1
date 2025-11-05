import React from "react";

export default function ChannelList({ serverId }) {
  const channels = [{ id: 1, name: "general" }, { id: 2, name: "items" }, { id: 3, name: "scenes" }];
  return (
    <div className="channel-list" style={{ marginTop: 12 }}>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {channels.map(c => <li key={c.id} style={{ padding: 6 }}>{c.name}</li>)}
      </ul>
    </div>
  );
}