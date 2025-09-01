import React from 'react';
import { AlertTriangle, Check, Clock, Package } from 'lucide-react';
import { useInventory } from '../contexts/InventoryContext';
import { format } from 'date-fns';

export const AlertsPanel: React.FC = () => {
  const { alerts, commodities, acknowledgeAlert } = useInventory();

  const sortedAlerts = alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical_stock': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'low_stock': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default: return <Package className="w-5 h-5 text-blue-500" />;
    }
  };

  const getAlertBorderColor = (type: string) => {
    switch (type) {
      case 'critical_stock': return 'border-l-red-500';
      case 'low_stock': return 'border-l-amber-500';
      default: return 'border-l-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Alerts & Notifications</h1>
        <div className="text-sm text-gray-500">
          {alerts.filter(a => !a.acknowledged).length} unacknowledged alerts
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
              <p className="text-2xl font-bold text-red-600">
                {alerts.filter(a => a.type === 'critical_stock' && !a.acknowledged).length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Alerts</p>
              <p className="text-2xl font-bold text-amber-600">
                {alerts.filter(a => a.type === 'low_stock' && !a.acknowledged).length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-amber-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
            </div>
            <Package className="w-8 h-8 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {sortedAlerts.map((alert) => {
            const commodity = commodities.find(c => c.id === alert.commodityId);
            
            return (
              <div
                key={alert.id}
                className={`p-6 border-l-4 ${getAlertBorderColor(alert.type)} ${
                  alert.acknowledged ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-gray-900">
                          {alert.message}
                        </h4>
                        {alert.acknowledged && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                            <Check className="w-3 h-3" />
                            <span>Acknowledged</span>
                          </span>
                        )}
                      </div>
                      {commodity && (
                        <p className="text-xs text-gray-500 mt-1">
                          {commodity.name} • Current: {commodity.currentStock} {commodity.unit} • 
                          Min: {commodity.minThreshold} {commodity.unit}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{format(alert.timestamp, 'PPp')}</span>
                      </div>
                    </div>
                  </div>
                  
                  {!alert.acknowledged && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="ml-4 bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {alerts.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No alerts to display</p>
          </div>
        )}
      </div>
    </div>
  );
};