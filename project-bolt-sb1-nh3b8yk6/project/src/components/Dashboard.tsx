import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Package, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import { useInventory } from '../contexts/InventoryContext';
import { calculateTotalValue } from '../utils/calculations';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const Dashboard: React.FC = () => {
  const { commodities, alerts } = useInventory();

  const totalValue = calculateTotalValue(commodities);
  const lowStockItems = commodities.filter(c => c.status === 'low' || c.status === 'critical').length;
  const totalItems = commodities.length;
  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged).length;

  // Stock levels chart data
  const stockLevelsData = {
    labels: commodities.map(c => c.name),
    datasets: [
      {
        label: 'Current Stock',
        data: commodities.map(c => c.currentStock),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'Min Threshold',
        data: commodities.map(c => c.minThreshold),
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Category distribution chart data
  const categories = commodities.reduce((acc, commodity) => {
    acc[commodity.category] = (acc[commodity.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = {
    labels: Object.keys(categories),
    datasets: [
      {
        data: Object.values(categories),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  // Stock status distribution
  const statusCounts = commodities.reduce((acc, commodity) => {
    acc[commodity.status] = (acc[commodity.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = {
    labels: ['Critical', 'Low', 'Normal', 'Overstocked'],
    datasets: [
      {
        data: [
          statusCounts.critical || 0,
          statusCounts.low || 0,
          statusCounts.normal || 0,
          statusCounts.overstocked || 0,
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(99, 102, 241, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-3xl font-bold text-gray-900">{totalItems}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-3xl font-bold text-gray-900">${totalValue.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
              <p className="text-3xl font-bold text-gray-900">{lowStockItems}</p>
            </div>
            <div className="bg-amber-100 rounded-full p-3">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Alerts</p>
              <p className="text-3xl font-bold text-gray-900">{unacknowledgedAlerts}</p>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Levels Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Levels vs Thresholds</h3>
          <div className="h-64">
            <Bar data={stockLevelsData} options={chartOptions} />
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory by Category</h3>
          <div className="h-64">
            <Doughnut data={categoryData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Stock Status Overview */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Status Distribution</h3>
        <div className="h-64">
          <Doughnut data={statusData} options={chartOptions} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
        <div className="space-y-3">
          {alerts.slice(0, 5).map((alert) => {
            const commodity = commodities.find(c => c.id === alert.commodityId);
            return (
              <div key={alert.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <AlertTriangle className={`w-5 h-5 ${
                  alert.type === 'critical_stock' ? 'text-red-500' : 
                  alert.type === 'low_stock' ? 'text-amber-500' : 'text-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-500">
                    {alert.timestamp.toLocaleDateString()} at {alert.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {!alert.acknowledged && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    New
                  </span>
                )}
              </div>
            );
          })}
          {alerts.length === 0 && (
            <p className="text-gray-500 text-center py-4">No alerts to display</p>
          )}
        </div>
      </div>
    </div>
  );
};