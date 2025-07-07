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
    <div className="space-y-4" style={{ backgroundColor: '#3c3c3c' }}>
      {/* Inventário estilo RR */}
      <div className="border rounded p-4" style={{ backgroundColor: '#2a2a2a', borderColor: '#555555' }}>
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
                className="p-4 rounded border cursor-pointer transition-colors"
                style={{
                  borderColor: selectedResource === resource.id ? '#22c55e' : '#555555',
                  backgroundColor: selectedResource === resource.id ? '#333333' : '#2d2d2d'
                }}
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
      <div className="border rounded p-4" style={{ backgroundColor: '#2a2a2a', borderColor: '#555555' }}>
        <h3 className="text-white font-bold uppercase mb-4">Estatísticas do Mercado</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between p-3 rounded" style={{ backgroundColor: '#333333' }}>
            <span className="text-gray-300 uppercase text-sm font-medium">Volume Total:</span>
            <span className="text-white font-bold">2.847.293 $</span>
          </div>
          <div className="flex justify-between p-3 rounded" style={{ backgroundColor: '#333333' }}>
            <span className="text-gray-300 uppercase text-sm font-medium">Ordens Ativas:</span>
            <span className="text-white font-bold">
              {Object.values(orders).reduce((total, resource) => 
                total + resource.buy.length + resource.sell.length, 0
              )}
            </span>
          </div>
          <div className="flex justify-between p-3 rounded" style={{ backgroundColor: '#333333' }}>
            <span className="text-gray-300 uppercase text-sm font-medium">Spread Médio:</span>
            <span className="text-green-400 font-bold">4.2%</span>
          </div>
          <div className="flex justify-between p-3 rounded" style={{ backgroundColor: '#333333' }}>
            <span className="text-gray-300 uppercase text-sm font-medium">Traders Ativos:</span>
            <span className="text-blue-400 font-bold">1.247</span>
          </div>
          <div className="flex justify-between p-3 rounded" style={{ backgroundColor: '#333333' }}>
            <span className="text-gray-300 uppercase text-sm font-medium">Volume 24h:</span>
            <span className="text-yellow-400 font-bold">847.392 $</span>
          </div>
        </div>
      </div>

      {/* Recursos Mais Negociados */}
      <div className="border rounded p-4" style={{ backgroundColor: '#2a2a2a', borderColor: '#555555' }}>
        <h3 className="text-white font-bold uppercase mb-4">Recursos Mais Negociados</h3>
        
        <div className="space-y-2">
          {RESOURCES.slice(0, 4).map((resource, index) => {
            const data = getResourceData(resource.id);
            const orderCount = data.buy.length + data.sell.length;
            const bestPrice = getBestPrice(resource.id, 'sell');
            
            return (
              <div 
                key={resource.id}
                className="flex items-center justify-between p-3 rounded cursor-pointer transition-colors"
                style={{ backgroundColor: '#333333' }}
                onClick={() => {
                  setSelectedResource(resource.id);
                  setActiveTab('orderbook');
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="text-sm font-bold text-gray-400">#{index + 1}</div>
                  <span className="text-lg">{resource.icon}</span>
                  <div>
                    <div className={`font-bold text-sm ${resource.color}`}>
                      {resource.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {orderCount} ordens ativas
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  {bestPrice && (
                    <>
                      <div className="text-sm text-white font-bold">
                        {bestPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} $
                      </div>
                      <div className="text-xs text-green-400">
                        +{(Math.random() * 10).toFixed(1)}%
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MarketTab;