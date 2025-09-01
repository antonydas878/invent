import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { InventoryProvider } from './contexts/InventoryContext';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { InventoryList } from './components/InventoryList';
import { AlertsPanel } from './components/AlertsPanel';
import { AddCommodity } from './components/AddCommodity';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <InventoryList />;
      case 'alerts':
        return <AlertsPanel />;
      case 'add-commodity':
        return <AddCommodity onBack={() => setCurrentView('inventory')} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <InventoryProvider>
      <Layout currentView={currentView} onViewChange={handleViewChange}>
        {renderCurrentView()}
      </Layout>
    </InventoryProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;