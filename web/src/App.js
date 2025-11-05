import React, { useState, useEffect } from "react";
import ServerSwitcher from "./ServerSwitcher";
import ChannelList from "./ChannelList";
import CharacterSheetDisplay from "./CharacterSheetDisplay";
import ItemListFeed from "./ItemListFeed";
import SceneFeed from "./SceneFeed";
import GMDashboardPanel from "./GMDashboardPanel";
import PluginLoader from "./PluginLoader";
import SnapshotManagerPanel from "./SnapshotManagerPanel";
import NotificationCenter from "./NotificationCenter";

export default function App() {
  const [serverId, setServerId] = useState(null);
  useEffect(() => {
    // placeholder: could fetch servers, set default server
    setServerId(1);
  }, []);
  return (
    <div>
      <header className="app-header">RagNarok's Hearth</header>
      <div className="app-shell">
        <aside className="left-col">
          <ServerSwitcher onSelect={setServerId} />
          <ChannelList serverId={serverId} />
        </aside>
        <main className="main-col">
          <div className="chat-area" style={{ minHeight: 300, background: "#061124", padding: 12, borderRadius: 8 }}>
            {/* Chat UI placeholder */}
            <div style={{ color: "#9fb0d6" }}>Chat area (placeholder)</div>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <CharacterSheetDisplay />
            <ItemListFeed />
            <SceneFeed />
          </div>
        </main>
        <aside className="right-col">
          <GMDashboardPanel serverId={serverId} />
          <PluginLoader />
          <SnapshotManagerPanel serverId={serverId} />
          <NotificationCenter />
        </aside>
      </div>
    </div>
  );
}