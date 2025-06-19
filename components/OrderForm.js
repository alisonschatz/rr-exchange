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
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
    >
      <div 
        className="border rounded max-w-md w-full max-h-[90vh] overflow-y-auto" 
        style={{ backgroundColor: '#2a2a2a', borderColor: '#555555' }}
      >
        {/* Header */}
        <div className="p-4 border-b" style={{ borderColor: '#555555' }}>
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold uppercase">Nova Ordem</h3>
            <button
              onClick={() => setShowOrderForm(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Seletor de Recurso */}
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-3 uppercase">
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
                    className="p-3 rounded border text-left transition-colors flex items-center gap-3"
                    style={{
                      borderColor: isSelected ? '#22c55e' : '#555555',
                      backgroundColor: isSelected ? 'rgba(34, 197, 94, 0.2)' : '#333333'
                    }}
                  >
                    <div 
                      className="flex items-center justify-center w-10 h-10 rounded border" 
                      style={{ backgroundColor: '#2a2a2a', borderColor: '#555555' }}
                    >
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
                        <div className="text-xs text-gray-300 uppercase">
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
            <label className="block text-gray-300 text-sm font-bold mb-3 uppercase">
              Tipo de Operação
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setNewOrder({...newOrder, type: 'buy'})}
                className="p-4 rounded border font-bold uppercase text-sm transition-all"
                style={{
                  borderColor: newOrder.type === 'buy' ? '#22c55e' : '#555555',
                  backgroundColor: newOrder.type === 'buy' ? '#16a34a' : '#333333',
                  color: 'white'
                }}
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
                className="p-4 rounded border font-bold uppercase text-sm transition-all"
                style={{
                  borderColor: newOrder.type === 'sell' ? '#ef4444' : '#555555',
                  backgroundColor: newOrder.type === 'sell' ? '#dc2626' : '#333333',
                  color: 'white'
                }}
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
            <label className="block text-gray-300 text-sm font-bold mb-2 uppercase">
              Preço por unidade ($)
            </label>
            
            {/* Sugestões de preço */}
            <div className="mb-3">
              <div className="text-xs text-gray-400 mb-2">Preços sugeridos:</div>
              <div className="flex gap-2 flex-wrap">
                {getBestPrice(newOrder.resource, 'buy') && (
                  <button
                    onClick={() => setNewOrder({...newOrder, price: getBestPrice(newOrder.resource, 'buy').toString()})}
                    className="px-3 py-1 border rounded text-green-400 text-xs transition-colors"
                    style={{ 
                      backgroundColor: 'rgba(34, 197, 94, 0.2)', 
                      borderColor: '#22c55e' 
                    }}
                  >
                    Compra: {getBestPrice(newOrder.resource, 'buy').toFixed(2)}
                  </button>
                )}
                
                {getBestPrice(newOrder.resource, 'sell') && (
                  <button
                    onClick={() => setNewOrder({...newOrder, price: getBestPrice(newOrder.resource, 'sell').toString()})}
                    className="px-3 py-1 border rounded text-red-400 text-xs transition-colors"
                    style={{ 
                      backgroundColor: 'rgba(239, 68, 68, 0.2)', 
                      borderColor: '#ef4444' 
                    }}
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
                    className="px-3 py-1 border rounded text-blue-400 text-xs transition-colors"
                    style={{ 
                      backgroundColor: 'rgba(59, 130, 246, 0.2)', 
                      borderColor: '#3b82f6' 
                    }}
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
              className="w-full p-3 border rounded text-white text-lg font-mono"
              style={{ 
                backgroundColor: '#333333', 
                borderColor: '#555555' 
              }}
            />
          </div>

          {/* Quantidade */}
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2 uppercase">
              Quantidade
            </label>
            
            {/* Sugestões de quantidade */}
            <div className="mb-3">
              <div className="text-xs text-gray-400 mb-2">Quantidades sugeridas:</div>
              <div className="flex gap-2 flex-wrap">
                {[100, 500, 1000, 5000].map(qty => (
                  <button
                    key={qty}
                    onClick={() => setNewOrder({...newOrder, quantity: qty.toString()})}
                    className="px-3 py-1 border rounded text-gray-300 text-xs transition-colors"
                    style={{ 
                      backgroundColor: 'rgba(107, 114, 128, 0.5)', 
                      borderColor: '#6b7280' 
                    }}
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
                    className="px-3 py-1 border rounded text-yellow-400 text-xs transition-colors"
                    style={{ 
                      backgroundColor: 'rgba(245, 158, 11, 0.2)', 
                      borderColor: '#f59e0b' 
                    }}
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
                    className="px-3 py-1 border rounded text-purple-400 text-xs transition-colors"
                    style={{ 
                      backgroundColor: 'rgba(147, 51, 234, 0.2)', 
                      borderColor: '#9333ea' 
                    }}
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
              className="w-full p-3 border rounded text-white text-lg font-mono"
              style={{ 
                backgroundColor: '#333333', 
                borderColor: '#555555' 
              }}
            />
          </div>

          {/* Resumo da Ordem */}
          {newOrder.price && newOrder.quantity && (
            <div 
              className="p-3 border rounded" 
              style={{ backgroundColor: '#333333', borderColor: '#555555' }}
            >
              <div className="text-gray-300 text-sm uppercase mb-1">
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
                <div 
                  className="text-xs text-red-400 mt-2 p-2 border rounded" 
                  style={{ 
                    backgroundColor: 'rgba(185, 28, 28, 0.3)', 
                    borderColor: '#dc2626' 
                  }}
                >
                  ⚠️ Saldo insuficiente! Você precisa de {orderTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} $ mas tem apenas {userBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} $
                </div>
              )}
              
              {!hasEnoughResources && (
                <div 
                  className="text-xs text-red-400 mt-2 p-2 border rounded" 
                  style={{ 
                    backgroundColor: 'rgba(185, 28, 28, 0.3)', 
                    borderColor: '#dc2626' 
                  }}
                >
                  ⚠️ Recursos insuficientes! Você tem {(userInventory[newOrder.resource] || 0).toLocaleString()} {newOrder.resource.toUpperCase()} mas precisa de {parseInt(newOrder.quantity || 0).toLocaleString()}
                </div>
              )}
            </div>
          )}

          {/* Botão de Ação */}
          <button
            onClick={handleCreateOrder}
            disabled={!isFormValid}
            className="w-full py-3 px-4 rounded font-bold uppercase transition-colors"
            style={{
              backgroundColor: newOrder.type === 'buy' 
                ? (isFormValid ? '#16a34a' : '#6b7280')
                : (isFormValid ? '#dc2626' : '#6b7280'),
              color: 'white',
              cursor: isFormValid ? 'pointer' : 'not-allowed'
            }}
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;