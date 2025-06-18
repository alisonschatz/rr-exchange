import React from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { RESOURCES } from '../constants/resources';

const OrderForm = ({ 
  showOrderForm, 
  setShowOrderForm, 
  newOrder, 
  setNewOrder, 
  handleCreateOrder,
  getBestPrice,
  userBalance,
  userInventory
}) => {
  if (!showOrderForm) return null;

  const orderTotal = newOrder.price && newOrder.quantity 
    ? parseFloat(newOrder.price) * parseInt(newOrder.quantity)
    : 0;

  const canAffordPurchase = newOrder.type === 'buy' ? orderTotal <= userBalance : true;
  const hasEnoughResources = newOrder.type === 'sell' 
    ? parseInt(newOrder.quantity || 0) <= (userInventory[newOrder.resource] || 0)
    : true;

  const isFormValid = newOrder.price && newOrder.quantity && canAffordPurchase && hasEnoughResources;

  const getButtonText = () => {
    if (!newOrder.price || !newOrder.quantity) {
      return 'Preencha os campos';
    }
    if (newOrder.type === 'buy' && !canAffordPurchase) {
      return 'Saldo Insuficiente';
    }
    if (newOrder.type === 'sell' && !hasEnoughResources) {
      return 'Recursos Insuficientes';
    }
    return newOrder.type === 'buy' ? 'Criar Ordem de Compra' : 'Criar Ordem de Venda';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-600 rounded max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold uppercase">Nova Ordem</h3>
            <button
              onClick={() => setShowOrderForm(false)}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Seletor de Recurso */}
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-3 uppercase">
              Escolher Recurso para Negociar
            </label>
            
            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
              {RESOURCES.map(resource => {
                const bestPrice = getBestPrice(resource.id, 'sell');
                const userQuantity = userInventory[resource.id] || 0;
                const isSelected = newOrder.resource === resource.id;
                
                return (
                  <button
                    key={resource.id}
                    onClick={() => setNewOrder({...newOrder, resource: resource.id})}
                    className={`p-3 rounded border text-left transition-colors flex items-center gap-3 ${
                      isSelected
                        ? 'border-green-500 bg-green-600 bg-opacity-20 ring-1 ring-green-500'
                        : 'border-gray-600 bg-gray-700 hover:border-gray-500 hover:bg-gray-650'
                    }`}
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded border border-gray-600">
                      <span className="text-xl">{resource.icon}</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className={`font-bold uppercase text-sm ${isSelected ? 'text-white' : resource.color}`}>
                          {resource.name}
                        </div>
                        {isSelected && (
                          <div className="text-green-400 text-xs font-bold">✓</div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-400 uppercase">
                          {resource.symbol} • Você tem: {userQuantity.toLocaleString()}
                        </div>
                        {bestPrice && (
                          <div className="text-xs text-gray-300">
                            {bestPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} $
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tipo de Operação */}
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-3 uppercase">
              Tipo de Operação
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setNewOrder({...newOrder, type: 'buy'})}
                className={`p-4 rounded border font-bold uppercase text-sm transition-all ${
                  newOrder.type === 'buy'
                    ? 'border-green-500 bg-green-600 text-white shadow-lg'
                    : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp size={20} />
                  <span>COMPRAR</span>
                </div>
                <div className="text-xs opacity-75">
                  Você paga com $
                </div>
              </button>
              <button
                onClick={() => setNewOrder({...newOrder, type: 'sell'})}
                className={`p-4 rounded border font-bold uppercase text-sm transition-all ${
                  newOrder.type === 'sell'
                    ? 'border-red-500 bg-red-600 text-white shadow-lg'
                    : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingDown size={20} />
                  <span>VENDER</span>
                </div>
                <div className="text-xs opacity-75">
                  Você recebe $
                </div>
              </button>
            </div>
          </div>

          {/* Preço */}
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2 uppercase">
              Preço por unidade ($)
            </label>
            
            {/* Sugestões de preço */}
            <div className="mb-3">
              <div className="text-xs text-gray-500 mb-2">Preços sugeridos:</div>
              <div className="flex gap-2 flex-wrap">
                {getBestPrice(newOrder.resource, 'buy') && (
                  <button
                    onClick={() => setNewOrder({...newOrder, price: getBestPrice(newOrder.resource, 'buy').toString()})}
                    className="px-3 py-1 bg-green-600 bg-opacity-20 border border-green-600 rounded text-green-400 text-xs hover:bg-opacity-30"
                  >
                    Compra: {getBestPrice(newOrder.resource, 'buy').toFixed(2)}
                  </button>
                )}
                {getBestPrice(newOrder.resource, 'sell') && (
                  <button
                    onClick={() => setNewOrder({...newOrder, price: getBestPrice(newOrder.resource, 'sell').toString()})}
                    className="px-3 py-1 bg-red-600 bg-opacity-20 border border-red-600 rounded text-red-400 text-xs hover:bg-opacity-30"
                  >
                    Venda: {getBestPrice(newOrder.resource, 'sell').toFixed(2)}
                  </button>
                )}
                {getBestPrice(newOrder.resource, 'buy') && getBestPrice(newOrder.resource, 'sell') && (
                  <button
                    onClick={() => {
                      const avg = (getBestPrice(newOrder.resource, 'buy') + getBestPrice(newOrder.resource, 'sell')) / 2;
                      setNewOrder({...newOrder, price: avg.toFixed(2)});
                    }}
                    className="px-3 py-1 bg-blue-600 bg-opacity-20 border border-blue-600 rounded text-blue-400 text-xs hover:bg-opacity-30"
                  >
                    Médio: {((getBestPrice(newOrder.resource, 'buy') + getBestPrice(newOrder.resource, 'sell')) / 2).toFixed(2)}
                  </button>
                )}
              </div>
            </div>
            
            <input
              type="number"
              step="0.01"
              value={newOrder.price}
              onChange={(e) => setNewOrder({...newOrder, price: e.target.value})}
              placeholder="Digite o preço..."
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white text-lg font-mono"
            />
          </div>

          {/* Quantidade */}
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2 uppercase">
              Quantidade
            </label>
            
            {/* Sugestões de quantidade */}
            <div className="mb-3">
              <div className="text-xs text-gray-500 mb-2">Quantidades sugeridas:</div>
              <div className="flex gap-2 flex-wrap">
                {[100, 500, 1000, 5000].map(qty => (
                  <button
                    key={qty}
                    onClick={() => setNewOrder({...newOrder, quantity: qty.toString()})}
                    className="px-3 py-1 bg-gray-600 bg-opacity-50 border border-gray-600 rounded text-gray-300 text-xs hover:bg-opacity-70"
                  >
                    {qty.toLocaleString()}
                  </button>
                ))}
                
                {newOrder.type === 'buy' && newOrder.price && (
                  <button
                    onClick={() => {
                      const maxQty = Math.floor(userBalance / parseFloat(newOrder.price));
                      setNewOrder({...newOrder, quantity: maxQty.toString()});
                    }}
                    className="px-3 py-1 bg-yellow-600 bg-opacity-20 border border-yellow-600 rounded text-yellow-400 text-xs hover:bg-opacity-30"
                  >
                    Máximo: {newOrder.price ? Math.floor(userBalance / parseFloat(newOrder.price)).toLocaleString() : '0'}
                  </button>
                )}
                
                {newOrder.type === 'sell' && (
                  <button
                    onClick={() => {
                      const available = userInventory[newOrder.resource] || 0;
                      setNewOrder({...newOrder, quantity: available.toString()});
                    }}
                    className="px-3 py-1 bg-purple-600 bg-opacity-20 border border-purple-600 rounded text-purple-400 text-xs hover:bg-opacity-30"
                  >
                    Tudo: {(userInventory[newOrder.resource] || 0).toLocaleString()}
                  </button>
                )}
              </div>
            </div>
            
            <input
              type="number"
              value={newOrder.quantity}
              onChange={(e) => setNewOrder({...newOrder, quantity: e.target.value})}
              placeholder="Digite a quantidade..."
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white text-lg font-mono"
            />
          </div>

          {/* Resumo da Ordem */}
          {newOrder.price && newOrder.quantity && (
            <div className="p-3 bg-gray-700 border border-gray-600 rounded">
              <div className="text-gray-400 text-sm uppercase mb-1">
                {newOrder.type === 'buy' ? 'Total a Pagar' : 'Total a Receber'}
              </div>
              <div className="text-xl font-bold text-white">
                {orderTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} $
              </div>
              
              {newOrder.type === 'buy' && (
                <div className="text-xs text-gray-400 mt-1">
                  Saldo após compra: {(userBalance - orderTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} $
                </div>
              )}
              
              {newOrder.type === 'sell' && (
                <div className="text-xs text-gray-400 mt-1">
                  Recursos restantes: {((userInventory[newOrder.resource] || 0) - parseInt(newOrder.quantity || 0)).toLocaleString()} {newOrder.resource.toUpperCase()}
                </div>
              )}
              
              {/* Alertas de validação */}
              {!canAffordPurchase && (
                <div className="text-xs text-red-400 mt-2 p-2 bg-red-900 bg-opacity-30 border border-red-600 rounded">
                  ⚠️ Saldo insuficiente! Você precisa de {orderTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} $ mas tem apenas {userBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} $
                </div>
              )}
              
              {!hasEnoughResources && (
                <div className="text-xs text-red-400 mt-2 p-2 bg-red-900 bg-opacity-30 border border-red-600 rounded">
                  ⚠️ Recursos insuficientes! Você tem {(userInventory[newOrder.resource] || 0).toLocaleString()} {newOrder.resource.toUpperCase()} mas precisa de {parseInt(newOrder.quantity || 0).toLocaleString()}
                </div>
              )}
            </div>
          )}

          {/* Botão de Ação */}
          <button
            onClick={handleCreateOrder}
            disabled={!isFormValid}
            className={`w-full py-3 px-4 rounded font-bold uppercase transition-colors ${
              newOrder.type === 'buy'
                ? 'bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed'
            }`}
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;