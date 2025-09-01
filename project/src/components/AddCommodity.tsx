import React, { useState } from 'react';
import { Package, Save, ArrowLeft } from 'lucide-react';
import { useInventory } from '../contexts/InventoryContext';

interface AddCommodityProps {
  onBack: () => void;
}

export const AddCommodity: React.FC<AddCommodityProps> = ({ onBack }) => {
  const { addCommodity } = useInventory();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    currentStock: 0,
    minThreshold: 0,
    maxThreshold: 0,
    unit: '',
    unitPrice: 0,
    supplier: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.unit.trim()) newErrors.unit = 'Unit is required';
    if (!formData.supplier.trim()) newErrors.supplier = 'Supplier is required';
    if (formData.currentStock < 0) newErrors.currentStock = 'Stock cannot be negative';
    if (formData.minThreshold < 0) newErrors.minThreshold = 'Min threshold cannot be negative';
    if (formData.maxThreshold <= formData.minThreshold) {
      newErrors.maxThreshold = 'Max threshold must be greater than min threshold';
    }
    if (formData.unitPrice <= 0) newErrors.unitPrice = 'Unit price must be greater than 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      addCommodity(formData);
      onBack();
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Add New Commodity</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Basic Information</span>
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commodity Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter commodity name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select category</option>
                  <option value="Raw Materials">Raw Materials</option>
                  <option value="Safety Equipment">Safety Equipment</option>
                  <option value="Tools">Tools</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter description"
                />
              </div>
            </div>

            {/* Stock Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Stock Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Stock *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.currentStock}
                    onChange={(e) => handleChange('currentStock', parseInt(e.target.value) || 0)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.currentStock ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {errors.currentStock && <p className="text-red-500 text-xs mt-1">{errors.currentStock}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit *
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => handleChange('unit', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.unit ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., pieces, kg, tons"
                  />
                  {errors.unit && <p className="text-red-500 text-xs mt-1">{errors.unit}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Threshold *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minThreshold}
                    onChange={(e) => handleChange('minThreshold', parseInt(e.target.value) || 0)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.minThreshold ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {errors.minThreshold && <p className="text-red-500 text-xs mt-1">{errors.minThreshold}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Threshold *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.maxThreshold}
                    onChange={(e) => handleChange('maxThreshold', parseInt(e.target.value) || 0)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.maxThreshold ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {errors.maxThreshold && <p className="text-red-500 text-xs mt-1">{errors.maxThreshold}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit Price *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.unitPrice}
                    onChange={(e) => handleChange('unitPrice', parseFloat(e.target.value) || 0)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.unitPrice ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.unitPrice && <p className="text-red-500 text-xs mt-1">{errors.unitPrice}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supplier *
                  </label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => handleChange('supplier', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.supplier ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter supplier name"
                  />
                  {errors.supplier && <p className="text-red-500 text-xs mt-1">{errors.supplier}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Add Commodity</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};