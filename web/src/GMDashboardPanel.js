import React from "react";
import GMQuestTracker from "./GMQuestTracker";
import GMInitiativeTracker from "./GMInitiativeTracker";
import GMTimerUtility from "./GMTimerUtility";
import GMNotesPanel from "./GMNotesPanel";

export default function GMDashboardPanel({ serverId }) {
  return (
    <div className="gm-dashboard" style={{ marginBottom: 12 }}>
      <h3>GM Dashboard</h3>
      <GMQuestTracker serverId={serverId} />
      <GMInitiativeTracker serverId={serverId} />
      <GMTimerUtility serverId={serverId} />
      <GMNotesPanel serverId={serverId} />
    </div>
  );
}