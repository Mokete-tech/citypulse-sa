import React from "react";

export const SidebarLayout: React.FC<{ sidebar: React.ReactNode; children: React.ReactNode }> = ({ sidebar, children }) => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <aside
        style={{
          width: 300,
          backgroundColor: "#f5f3ff",
          borderRight: "1px solid #ddd",
          padding: 16,
          overflowY: "auto",
        }}
      >
        {sidebar}
      </aside>
      <main style={{ flex: 1, overflowY: "auto", padding: 16 }}>{children}</main>
    </div>
  );
};
