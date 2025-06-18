import React from 'react';
import { Package, TrendingUp } from 'lucide-react';
import { RESOURCES } from '../constants/resources';

const InventoryTab = ({ 
  userInventory,
  setUserInventory,
  selectedResource,
  setSelectedResource,
  setActiveTab,
  getBestPrice
}) => {
  
  const getTotalValue = () => {
    return RESOURCES.reduce((total, resource) => {
      const quantity = userInventory[resource.id] || 0;
      const price = getBestPrice(resource.id, 'sell') || 0;
      return total + (quantity * price);
    }, 0);
  };

  const getTotalItems = () => {
    return Object.values(userInventory).reduce((sum, qty) => sum + qty, 0);
  };

  return (
    <div className="space-y-4">
      {/* Resumo Simples */}
      <div className="bg-gray-800 border border-gray-700 rounded p-4">
        <div className="flex items-center gap-3 mb-4">
          <Package className="text-blue-400" size={24} />
          <h2 className="text-xl font-bold text-white uppercase">Seu Inventário</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-500/10 border border-blue-500/20 rounded">
            <div className="text-xs text-blue-300 mb-1">TOTAL DE ITENS</div>
            <div className="text-2xl font-bold text-blue-400">
              {getTotalItems().toLocaleString()}
            </div>
          </div>
          <div className="text-center p-3 bg-green-500/10 border border-green-500/20 rounded">
            <div className="text-xs text-green-300 mb-1">VALOR ESTIMADO</div>
            <div className="text-2xl font-bold text-green-400">
              {getTotalValue().toLocaleString('pt-BR', { minimumFractionDigits: 0 })} $
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Recursos */}
      <div className="bg-gray-800 border border-gray-700 rounded p-4">
        <h3 className="text-lg font-bold text-white mb-4 uppercase">Seus Recursos</h3>
        
        <div className="space-y-3">
          {RESOURCES.map(resource => {
            const quantity = userInventory[resource.id] || 0;
            const currentPrice = getBestPrice(resource.id, 'sell') || 0;
            const totalValue = quantity * currentPrice;
            const isSelected = selectedResource === resource.id;
            
            return (
              <div 
                key={resource.id}
                className={`p-4 rounded border transition-colors ${
                  isSelected
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-gray-600 bg-gray-750 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  {/* Info do Recurso */}
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{resource.icon}</span>
                    <div>
                      <div className={`font-bold uppercase ${resource.color}`}>
                        {resource.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {quantity.toLocaleString()} {resource.symbol}
                      </div>
                    </div>
                  </div>
                  
                  {/* Valor e Ação */}
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">
                      {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })} $
                    </div>
                    <button
                      onClick={() => {
                        setSelectedResource(resource.id);
                        setActiveTab('orderbook');
                      }}
                      className="mt-2 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-bold uppercase"
                    >
                      Negociar
                    </button>
                  </div>
                </div>
                
                {/* Barra de Progresso Visual (Opcional) */}
                {quantity > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Preço atual: {currentPrice.toFixed(2)} $</span>
                      <span>{((quantity / getTotalItems()) * 100).toFixed(1)}% do total</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full ${resource.bgColor || 'bg-blue-500'}`}
                        style={{ width: `${Math.min((quantity / getTotalItems()) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Ações Rápidas (Demo) */}
      <div className="bg-gray-800 border border-gray-700 rounded p-4">
        <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase">Ações Rápidas (Demo)</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              // Adicionar recursos aleatórios
              const randomResource = RESOURCES[Math.floor(Math.random() * RESOURCES.length)];
              const randomAmount = Math.floor(Math.random() * 1000) + 100;
              setUserInventory(prev => ({
                ...prev,
                [randomResource.id]: (prev[randomResource.id] || 0) + randomAmount
              }));
            }}
            className="p-3 bg-green-600 hover:bg-green-700 text-white rounded font-bold text-sm"
          >
            📦 Adicionar Recursos
          </button>
          
          <button
            onClick={() => {
              // Limpar inventário
              const emptyInventory = {};
              RESOURCES.forEach(resource => {
                emptyInventory[resource.id] = 0;
              });
              setUserInventory(emptyInventory);
            }}
            className="p-3 bg-red-600 hover:bg-red-700 text-white rounded font-bold text-sm"
          >
            🗑️ Limpar Tudo
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryTab;