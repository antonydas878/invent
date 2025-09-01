import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Plus, 
  Minus,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useInventory } from '../contexts/InventoryContext';
import { useAuth } from '../contexts/AuthContext';
import { Commodity } from '../types/inventory';

export const InventoryList: React.FC = () => {
  const { commodities, updateCommodity, deleteCommodity, addStockMovement } = useInventory();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState<number>(0);

  const filteredCommodities = commodities.filter(commodity => {
    const matchesSearch = commodity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         commodity.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || commodity.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'low': return 'bg-amber-100 text-amber-800';
      case 'normal': return 'bg-green-100 text-green-800';
      case 'overstocked': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStockAdjustment = (commodity: Commodity, type: 'in' | 'out') => {
    if (adjustmentQuantity <= 0) return;

    const previousStock = commodity.currentStock;
    const newStock = type === 'in' 
      ? previousStock + adjustmentQuantity
      : Math.max(0, previousStock - adjustmentQuantity);

    addStockMovement({
      commodityId: commodity.id,
      type: type === 'in' ? 'in' : 'out',
      quantity: adjustmentQuantity,
      reason: type === 'in' ? 'Stock replenishment' : 'Stock consumption',
      performedBy: user?.name || 'Unknown',
      previousStock,
      newStock
    });

    setAdjustmentQuantity(0);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search commodities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="critical">Critical</option>
              <option value="low">Low Stock</option>
              <option value="normal">Normal</option>
              <option value="overstocked">Overstocked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commodity
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thresholds
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                {user?.role === 'admin' && (
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCommodities.map((commodity) => (
                <tr key={commodity.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="bg-gray-100 rounded-lg p-2 mr-3">
                        <Package className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{commodity.name}</div>
                        <div className="text-sm text-gray-500">{commodity.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{commodity.category}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {commodity.currentStock} {commodity.unit}
                    </div>
                    <div className="text-xs text-gray-500">
                      Supplier: {commodity.supplier}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-500">
                      Min: {commodity.minThreshold} {commodity.unit}
                    </div>
                    <div className="text-xs text-gray-500">
                      Max: {commodity.maxThreshold} {commodity.unit}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(commodity.status)}`}>
                      {commodity.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ${(commodity.currentStock * commodity.unitPrice).toLocaleString()}
                  </td>
                  {user?.role === 'admin' && (
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {editingId === commodity.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              value={adjustmentQuantity}
                              onChange={(e) => setAdjustmentQuantity(parseInt(e.target.value) || 0)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="Qty"
                            />
                            <button
                              onClick={() => handleStockAdjustment(commodity, 'in')}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                              title="Add Stock"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStockAdjustment(commodity, 'out')}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Remove Stock"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1 text-gray-600 hover:bg-gray-50 rounded text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingId(commodity.id)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title="Adjust Stock"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteCommodity(commodity.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Delete Commodity"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCommodities.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No commodities found</p>
          </div>
        )}
      </div>
    </div>
  );
};