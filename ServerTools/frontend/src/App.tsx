import React, { useState } from 'react';
import { Server, Settings as SettingsIcon, Users, Package } from 'lucide-react';
import Dashboard from './Dashboard';
import Settings from './Settings';
import Players from './Players';
import ModsList from './ModsList';

function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar glass" style={{ borderRadius: '0 32px 32px 0', borderLeft: 'none' }}>
        <div className="brand">
          <Server size={28} />
          ATM Lite
        </div>
        
        <div className="nav-links">
          <div 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Server size={20} />
            Dashboard
          </div>
          <div 
            className={`nav-item ${activeTab === 'players' ? 'active' : ''}`}
            onClick={() => setActiveTab('players')}
          >
            <Users size={20} />
            Jogadores
          </div>
          <div 
            className={`nav-item ${activeTab === 'mods' ? 'active' : ''}`}
            onClick={() => setActiveTab('mods')}
          >
            <Package size={20} />
            Mods
          </div>
          <div 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <SettingsIcon size={20} />
            Configuracoes
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'players' && <Players />}
        {activeTab === 'mods' && <ModsList />}
        {activeTab === 'settings' && <Settings />}
      </div>
    </div>
  );
}

export default App;
