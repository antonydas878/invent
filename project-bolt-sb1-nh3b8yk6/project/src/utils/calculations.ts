import { Commodity, StockMovement } from '../types/inventory';

export const calculateStockStatus = (commodity: Commodity): Commodity['status'] => {
  const { currentStock, minThreshold, maxThreshold } = commodity;
  
  if (currentStock <= minThreshold * 0.5) return 'critical';
  if (currentStock <= minThreshold) return 'low';
  if (currentStock >= maxThreshold) return 'overstocked';
  return 'normal';
};

export const calculateTotalValue = (commodities: Commodity[]): number => {
  return commodities.reduce((total, commodity) => 
    total + (commodity.currentStock * commodity.unitPrice), 0
  );
};

export const getStockTrend = (movements: StockMovement[], commodityId: string, days: number = 7): number[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  const relevantMovements = movements
    .filter(m => m.commodityId === commodityId && m.timestamp >= cutoffDate)
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  
  const dailyStock: number[] = [];
  let currentStock = relevantMovements[0]?.previousStock || 0;
  
  for (let i = 0; i < days; i++) {
    const dayStart = new Date(cutoffDate);
    dayStart.setDate(dayStart.getDate() + i);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    
    const dayMovements = relevantMovements.filter(m => 
      m.timestamp >= dayStart && m.timestamp < dayEnd
    );
    
    if (dayMovements.length > 0) {
      currentStock = dayMovements[dayMovements.length - 1].newStock;
    }
    
    dailyStock.push(currentStock);
  }
  
  return dailyStock;
};