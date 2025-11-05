import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PluginLoader() {
  const [plugins, setPlugins] = useState([]);
  useEffect(() => {
    // placeholder: would call /api/plugin/list
    setPlugins([]);
  }, []);
  return (
    <div className="plugin-panel" style={{ marginTop: 12 }}>
      <h3>Plugins</h3>
      {plugins.length === 0 ? <p style={{ color:"#9fb0d6" }}>No plugins installed</p> : plugins.map(p => <div key={p.id}>{p.name}</div>)}
    </div>
  );
}