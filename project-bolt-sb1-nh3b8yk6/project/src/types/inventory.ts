export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Commodity {
  id: string;
  name: string;
  category: string;
  description: string;
  currentStock: number;
  minThreshold: number;
  maxThreshold: number;
  unit: string;
  unitPrice: number;
  supplier: string;
  lastUpdated: Date;
  status: 'critical' | 'low' | 'normal' | 'overstocked';
}

export interface StockMovement {
  id: string;
  commodityId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  performedBy: string;
  timestamp: Date;
  previousStock: number;
  newStock: number;
}

export interface Alert {
  id: string;
  commodityId: string;
  type: 'low_stock' | 'critical_stock' | 'overstocked';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}