import React from 'react';

export const AdminDashboard = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Admin Dashboard</h1>
      <p className="text-lg text-center mb-8 text-muted-foreground">
        Welcome to the admin dashboard. Here you can manage users, merchants, and system settings.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="border rounded-lg p-6 bg-background shadow">
          <h2 className="text-2xl font-semibold mb-2">Users</h2>
          <p className="text-3xl font-bold mb-4">150</p>
          <ul className="mb-4 space-y-2 text-muted-foreground">
            <li>Active Users: 120</li>
            <li>New Users (Today): 5</li>
            <li>Pending Approvals: 3</li>
          </ul>
          <button className="w-full bg-primary text-primary-foreground py-2 rounded">Manage Users</button>
        </div>
        <div className="border rounded-lg p-6 bg-background shadow">
          <h2 className="text-2xl font-semibold mb-2">Merchants</h2>
          <p className="text-3xl font-bold mb-4">45</p>
          <ul className="mb-4 space-y-2 text-muted-foreground">
            <li>Active Merchants: 40</li>
            <li>New Merchants (Today): 2</li>
            <li>Pending Approvals: 1</li>
          </ul>
          <button className="w-full bg-primary text-primary-foreground py-2 rounded">Manage Merchants</button>
        </div>
      </div>
      <div className="aspect-video rounded-lg overflow-hidden shadow-lg mx-auto max-w-2xl">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/9No-FiEInLA"
          title="Admin Dashboard Demo Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default AdminDashboard; 