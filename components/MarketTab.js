import React from 'react';
import { RESOURCES } from '../constants/resources';

const MarketTab = ({ 
  selectedResource,
  setSelectedResource,
  setActiveTab,
  orders,
  getResourceData,
  getBestPrice
}) => {
  return (
    <div className="space-y-4">
      {/* Inventário estilo RR */}
      <div className="bg-gray-800 border border-gray-700 rounded p-4">
        <h3 className="text-white font-bold uppercase mb-4">Seus Recursos</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {RESOURCES.map(resource => {
            const data = getResourceData(resource.id);
            const bestPrice = getBestPrice(resource.id, 'sell');
            const quantity = Math.floor(Math.random() * 50000) + 1000;
            
            return (
              <div 
                key={resource.id}
                onClick={() => {
                  setSelectedResource(resource.id);
                  setActiveTab('orderbook');
                }}
                className={`p-4 rounded border cursor-pointer transition-colors ${
                  selectedResource === resource.id
                    ? 'border-green-500 bg-gray-700'
                    : 'border-gray-600 bg-gray-750 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">{resource.icon}</span>
                  <div>
                    <div className={`font-bold uppercase text-sm ${resource.color}`}>
                      {resource.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {quantity.toLocaleString()} {resource.symbol.toLowerCase()}
                    </div>
                  </div>
                </div>
                
                {bestPrice && (
                  <div className="text-right">
                    <div className="text-sm text-white font-bold">
                      {bestPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} $
                    </div>
                    <div className="text-xs text-gray-400">
                      {data.buy.length + data.sell.length} ofertas
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats do mercado */}
      <div className="bg-gray-800 border border-gray-700 rounded p-4">
        <h3 className="text-white font-bold uppercase mb-4">Estatísticas do Mercado</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400 uppercase text-sm">Volume Total:</span>
            <span className="text-white font-bold">2.847.293 $</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 uppercase text-sm">Ordens Ativas:</span>
            <span className="text-white font-bold">
              {Object.values(orders).reduce((total, resource) => 
                total + resource.buy.length + resource.sell.length, 0
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 uppercase text-sm">Spread Médio:</span>
            <span className="text-green-400 font-bold">4.2%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketTab;