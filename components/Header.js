import React from 'react';
import { DollarSign } from 'lucide-react';
import { RESOURCES } from '../constants/resources';

const Header = ({ 
  currentResource, 
  userBalance, 
  selectedResource,
  setSelectedResource,
  orders,
  getBestPrice,
  activeTab,
  setActiveTab
}) => {
  const getResourceData = (resourceId) => {
    return orders[resourceId] || { buy: [], sell: [] };
  };

  return (
    <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
      {/* Saldo no Topo */}
      <div className="bg-gray-900 border-b border-gray-600 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DollarSign className="text-green-400" size={20} />
            <div>
              <div className="text-xs text-gray-400 uppercase">Saldo Disponível</div>
              <div className="text-lg font-bold text-green-400">
                {userBalance.toLocaleString('pt-BR', { minimumFractionDigits: 3 })} $
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400 uppercase">Mercado Atual</div>
            <div className="text-sm font-bold text-white uppercase">
              {currentResource.icon} {currentResource.name}
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Recursos - Compacto */}
      <div className="border-b border-gray-700 bg-gray-800">
        <div className="p-3">
          <div className="text-white font-bold uppercase mb-2 text-xs">RECURSOS:</div>
          <div className="grid grid-cols-3 gap-2">
            {RESOURCES.map(resource => {
              const bestPrice = getBestPrice(resource.id, 'sell');
              const data = getResourceData(resource.id);
              const isActive = selectedResource === resource.id;
              
              return (
                <button
                  key={resource.id}
                  onClick={() => setSelectedResource(resource.id)}
                  className={`p-2 rounded border text-left transition-colors ${
                    isActive
                      ? 'border-green-500 bg-green-600 bg-opacity-20'
                      : 'border-gray-600 bg-gray-750 hover:border-gray-500 hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{resource.icon}</span>
                    <div className={`text-xs font-bold uppercase ${isActive ? 'text-white' : resource.color}`}>
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
                      <div className="text-xs text-gray-300 font-mono">
                        {bestPrice.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} $
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500">--</div>
                    )}
                    
                    <div className="text-xs text-gray-500">
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
            className={`flex-1 py-3 px-4 text-sm font-bold uppercase border-r border-gray-700 ${
              activeTab === 'orderbook' 
                ? 'bg-gray-700 text-green-400' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Order Book
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-3 px-4 text-sm font-bold uppercase ${
              activeTab === 'summary' 
                ? 'bg-gray-700 text-green-400' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Inventário
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;