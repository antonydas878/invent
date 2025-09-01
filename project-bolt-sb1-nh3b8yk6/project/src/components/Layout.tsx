import React, { useState } from 'react';
import { 
  Package, 
  BarChart3, 
  AlertTriangle, 
  Plus, 
  Menu, 
  X, 
  LogOut, 
  User,
  Settings
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useInventory } from '../contexts/InventoryContext';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { alerts } = useInventory();

  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'inventory', name: 'Inventory', icon: Package },
    { id: 'alerts', name: 'Alerts', icon: AlertTriangle, badge: unacknowledgedAlerts.length },
    ...(user?.role === 'admin' ? [{ id: 'add-commodity', name: 'Add Commodity', icon: Plus }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 rounded-lg p-2">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Smart Inventory</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-6">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-6 py-3 text-left transition-colors ${
                  currentView === item.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </div>
                {item.badge && item.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gray-300 rounded-full p-2">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sign out</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              {unacknowledgedAlerts.length > 0 && (
                <div className="flex items-center space-x-2 bg-red-50 text-red-700 px-3 py-1 rounded-full">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {unacknowledgedAlerts.length} alert{unacknowledgedAlerts.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};