import React from 'react';
import { RESOURCES } from '../constants/resources';

const Header = ({ 
  currentResource, 
  userBalance, 
  selectedResource,
  setSelectedResource,
  orders,
  getBestPrice
}) => {
  const getResourceData = (resourceId) => {
    return orders[resourceId] || { buy: [], sell: [] };
  };

  return (
    <div className="border-b-2 sticky top-0 z-40" style={{ backgroundColor: '#2a2a2a', borderColor: '#555555' }}>
      {/* Saldo no Topo - Estilo RR */}
      <div className="border-b-2 px-4 py-3" style={{ backgroundColor: '#1f1f1f', borderColor: '#444444' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-green-400 flex items-center justify-center" style={{ backgroundColor: '#2a2a2a', borderColor: '#38a169' }}>
              <span className="text-green-400 text-sm font-bold">$</span>
            </div>
            <div>
              <div className="text-xs text-green-400 uppercase font-bold tracking-wider">SALDO DISPONÍVEL</div>
              <div className="text-lg font-bold text-white tracking-wider">
                {userBalance.toLocaleString('pt-BR', { minimumFractionDigits: 3 })} $
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-blue-300 uppercase font-bold tracking-wider">MERCADO ATUAL</div>
            <div className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="text-lg">{currentResource.icon}</span>
              {currentResource.name}
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Recursos - Estilo RR */}
      <div className="border-b-2" style={{ borderColor: '#444444' }}>
        <div className="border-b-2 px-4 py-2" style={{ 
          backgroundImage: 'linear-gradient(to right, #333333, #2a2a2a)', 
          borderColor: '#444444' 
        }}>
          <div className="text-gray-200 font-bold text-sm tracking-wide">RECURSOS:</div>
        </div>
        
        <div className="p-3" style={{ backgroundColor: '#2a2a2a' }}>
          <div className="grid grid-cols-3 gap-2">
            {RESOURCES.map(resource => {
              const bestPrice = getBestPrice(resource.id, 'sell');
              const data = getResourceData(resource.id);
              const isActive = selectedResource === resource.id;
              
              return (
                <button
                  key={resource.id}
                  onClick={() => setSelectedResource(resource.id)}
                  className="p-2 text-left transition-colors border-2"
                  style={{ 
                    backgroundColor: isActive ? '#404040' : '#2a2a2a',
                    borderColor: isActive ? '#38a169' : '#555555',
                    ':hover': { backgroundColor: '#333333' }
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{resource.icon}</span>
                    <div className={`text-xs font-bold uppercase tracking-wide ${isActive ? 'text-white' : 'text-gray-200'}`}>
                      {resource.symbol}
                    </div>
                    {isActive && (
                      <div className="ml-auto">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {bestPrice ? (
                      <div className="text-xs text-blue-300 font-medium tracking-wide">
                        {bestPrice.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} $
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500">--</div>
                    )}
                    
                    <div className="text-xs text-blue-300 font-medium">
                      {data.buy.length + data.sell.length}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div>
        <div className="flex">
          <button
            onClick={() => setActiveTab('orderbook')}
            className="w-full py-3 px-4 text-sm font-bold uppercase tracking-wide"
            style={{ 
              backgroundColor: '#2a2a2a',
              color: '#38a169',
              borderTop: '2px solid #38a169'
            }}
          >
            Order Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;