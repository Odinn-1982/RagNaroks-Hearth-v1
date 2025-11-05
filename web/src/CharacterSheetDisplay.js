import React from "react";

export default function CharacterSheetDisplay() {
  return (
    <div className="character-sheet" style={{ padding: 12, background: "#081226", borderRadius: 8 }}>
      <h4>Character Sheet</h4>
      <div>Name: Tharn</div>
      <div>Class: Barbarian</div>
      <div>HP: 38 / 52</div>
    </div>
  );
}