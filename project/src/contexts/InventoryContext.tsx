import React, { createContext, useContext, useState, useEffect } from 'react';
import { Commodity, StockMovement, Alert } from '../types/inventory';
import { calculateStockStatus } from '../utils/calculations';

interface InventoryContextType {
  commodities: Commodity[];
  movements: StockMovement[];
  alerts: Alert[];
  addCommodity: (commodity: Omit<Commodity, 'id' | 'lastUpdated' | 'status'>) => void;
  updateCommodity: (id: string, updates: Partial<Commodity>) => void;
  deleteCommodity: (id: string) => void;
  addStockMovement: (movement: Omit<StockMovement, 'id' | 'timestamp'>) => void;
  acknowledgeAlert: (alertId: string) => void;
  generateLowStockAlerts: () => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const DEMO_COMMODITIES: Commodity[] = [
  {
    id: '1',
    name: 'Steel Rods',
    category: 'Raw Materials',
    description: '10mm steel reinforcement rods',
    currentStock: 50,
    minThreshold: 100,
    maxThreshold: 500,
    unit: 'tons',
    unitPrice: 850,
    supplier: 'SteelCorp Industries',
    lastUpdated: new Date(),
    status: 'low'
  },
  {
    id: '2',
    name: 'Concrete Mix',
    category: 'Raw Materials',
    description: 'High-grade concrete mix for construction',
    currentStock: 200,
    minThreshold: 150,
    maxThreshold: 1000,
    unit: 'bags',
    unitPrice: 12.50,
    supplier: 'BuildMaster Supplies',
    lastUpdated: new Date(),
    status: 'normal'
  },
  {
    id: '3',
    name: 'Safety Helmets',
    category: 'Safety Equipment',
    description: 'OSHA-compliant safety helmets',
    currentStock: 25,
    minThreshold: 50,
    maxThreshold: 200,
    unit: 'pieces',
    unitPrice: 35,
    supplier: 'SafetyFirst Equipment',
    lastUpdated: new Date(),
    status: 'critical'
  },
  {
    id: '4',
    name: 'LED Light Bulbs',
    category: 'Electrical',
    description: '60W equivalent LED bulbs',
    currentStock: 850,
    minThreshold: 100,
    maxThreshold: 500,
    unit: 'pieces',
    unitPrice: 8.99,
    supplier: 'BrightLights Co.',
    lastUpdated: new Date(),
    status: 'overstocked'
  }
];

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Load data from localStorage or use demo data
    const storedCommodities = localStorage.getItem('inventory_commodities');
    const storedMovements = localStorage.getItem('inventory_movements');
    const storedAlerts = localStorage.getItem('inventory_alerts');

    if (storedCommodities) {
      const parsed = JSON.parse(storedCommodities);
      const commoditiesWithDates = parsed.map((c: any) => ({
        ...c,
        lastUpdated: new Date(c.lastUpdated)
      }));
      setCommodities(commoditiesWithDates);
    } else {
      setCommodities(DEMO_COMMODITIES);
    }

    if (storedMovements) {
      const parsed = JSON.parse(storedMovements);
      const movementsWithDates = parsed.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp)
      }));
      setMovements(movementsWithDates);
    }

    if (storedAlerts) {
      const parsed = JSON.parse(storedAlerts);
      const alertsWithDates = parsed.map((a: any) => ({
        ...a,
        timestamp: new Date(a.timestamp)
      }));
      setAlerts(alertsWithDates);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('inventory_commodities', JSON.stringify(commodities));
  }, [commodities]);

  useEffect(() => {
    localStorage.setItem('inventory_movements', JSON.stringify(movements));
  }, [movements]);

  useEffect(() => {
    localStorage.setItem('inventory_alerts', JSON.stringify(alerts));
  }, [alerts]);

  const addCommodity = (commodityData: Omit<Commodity, 'id' | 'lastUpdated' | 'status'>) => {
    const newCommodity: Commodity = {
      ...commodityData,
      id: Date.now().toString(),
      lastUpdated: new Date(),
      status: calculateStockStatus({ ...commodityData, id: '', lastUpdated: new Date(), status: 'normal' })
    };
    
    setCommodities(prev => [...prev, newCommodity]);
  };

  const updateCommodity = (id: string, updates: Partial<Commodity>) => {
    setCommodities(prev => 
      prev.map(commodity => {
        if (commodity.id === id) {
          const updated = {
            ...commodity,
            ...updates,
            lastUpdated: new Date()
          };
          updated.status = calculateStockStatus(updated);
          return updated;
        }
        return commodity;
      })
    );
  };

  const deleteCommodity = (id: string) => {
    setCommodities(prev => prev.filter(c => c.id !== id));
    setMovements(prev => prev.filter(m => m.commodityId !== id));
  };

  const addStockMovement = (movementData: Omit<StockMovement, 'id' | 'timestamp'>) => {
    const movement: StockMovement = {
      ...movementData,
      id: Date.now().toString(),
      timestamp: new Date()
    };

    setMovements(prev => [...prev, movement]);

    // Update commodity stock
    updateCommodity(movement.commodityId, {
      currentStock: movement.newStock
    });
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  const generateLowStockAlerts = () => {
    commodities.forEach(commodity => {
      if (commodity.status === 'critical' || commodity.status === 'low') {
        const existingAlert = alerts.find(
          alert => alert.commodityId === commodity.id && !alert.acknowledged
        );

        if (!existingAlert) {
          const newAlert: Alert = {
            id: Date.now().toString() + commodity.id,
            commodityId: commodity.id,
            type: commodity.status === 'critical' ? 'critical_stock' : 'low_stock',
            message: `${commodity.name} is ${commodity.status === 'critical' ? 'critically low' : 'running low'} (${commodity.currentStock} ${commodity.unit})`,
            timestamp: new Date(),
            acknowledged: false
          };

          setAlerts(prev => [...prev, newAlert]);
        }
      }
    });
  };

  useEffect(() => {
    generateLowStockAlerts();
  }, [commodities]);

  return (
    <InventoryContext.Provider value={{
      commodities,
      movements,
      alerts,
      addCommodity,
      updateCommodity,
      deleteCommodity,
      addStockMovement,
      acknowledgeAlert,
      generateLowStockAlerts
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};