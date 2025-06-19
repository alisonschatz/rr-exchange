import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const OrderBookTab = ({ 
  selectedResource,
  currentResource,
  userBalance,
  setUserBalance,
  orders,
  getResourceData,
  getBestPrice,
  getSpread,
  userInventory,
  setUserInventory
}) => {
  const [buyQuantity, setBuyQuantity] = useState('1');
  const [sellQuantity, setSellQuantity] = useState('1');
  const [showSellOrdersList, setShowSellOrdersList] = useState(false);
  const [showBuyOrdersList, setShowBuyOrdersList] = useState(false);
  const [showCreateBuyOrder, setShowCreateBuyOrder] = useState(false);
  const [showCreateSellOrder, setShowCreateSellOrder] = useState(false);
  const [newBuyPrice, setNewBuyPrice] = useState('');
  const [newBuyQuantity, setNewBuyQuantity] = useState('');
  const [newSellPrice, setNewSellPrice] = useState('');
  const [newSellQuantity, setNewSellQuantity] = useState('');
  
  const resourceData = getResourceData(selectedResource);
  const bestSellOrder = resourceData.sell[0] || null;
  const bestBuyOrder = resourceData.buy[0] || null;
  const userQuantity = userInventory[selectedResource] || 0;

  // Executar compra
  const handleBuy = () => {
    if (!bestSellOrder || !buyQuantity) return;
    
    const quantity = parseInt(buyQuantity);
    const total = bestSellOrder.price * quantity;
    
    if (total > userBalance) {
      alert('Saldo insuficiente!');
      return;
    }

    if (quantity > bestSellOrder.quantity) {
      alert(`Apenas ${bestSellOrder.quantity} unidades disponíveis!`);
      return;
    }

    setUserBalance(prev => prev - total);
    setUserInventory(prev => ({
      ...prev,
      [selectedResource]: (prev[selectedResource] || 0) + quantity
    }));

    alert(`✅ Comprou ${quantity} ${currentResource.symbol} por ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} $`);
    setBuyQuantity('1');
  };

  // Executar venda
  const handleSell = () => {
    if (!bestBuyOrder || !sellQuantity) return;
    
    const quantity = parseInt(sellQuantity);
    const total = bestBuyOrder.price * quantity;
    
    if (quantity > userQuantity) {
      alert('Recursos insuficientes!');
      return;
    }

    if (quantity > bestBuyOrder.quantity) {
      alert(`Comprador quer apenas ${bestBuyOrder.quantity} unidades!`);
      return;
    }

    setUserBalance(prev => prev + total);
    setUserInventory(prev => ({
      ...prev,
      [selectedResource]: (prev[selectedResource] || 0) - quantity
    }));

    alert(`✅ Vendeu ${quantity} ${currentResource.symbol} por ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} $`);
    setSellQuantity('1');
  };

  // Criar ordem de compra
  const handleCreateBuyOrder = () => {
    if (!newBuyPrice || !newBuyQuantity) return;
    
    const price = parseFloat(newBuyPrice);
    const quantity = parseInt(newBuyQuantity);
    const total = price * quantity;
    
    if (total > userBalance) {
      alert('Saldo insuficiente para criar esta ordem!');
      return;
    }

    alert(`✅ Ordem de compra criada: ${quantity} ${currentResource.symbol} por ${price.toFixed(2)} $ cada`);
    setUserBalance(prev => prev - total);
    setNewBuyPrice('');
    setNewBuyQuantity('');
    setShowCreateBuyOrder(false);
  };

  // Criar ordem de venda
  const handleCreateSellOrder = () => {
    if (!newSellPrice || !newSellQuantity) return;
    
    const price = parseFloat(newSellPrice);
    const quantity = parseInt(newSellQuantity);
    
    if (quantity > userQuantity) {
      alert('Recursos insuficientes para criar esta ordem!');
      return;
    }

    alert(`✅ Ordem de venda criada: ${quantity} ${currentResource.symbol} por ${price.toFixed(2)} $ cada`);
    setUserInventory(prev => ({
      ...prev,
      [selectedResource]: (prev[selectedResource] || 0) - quantity
    }));
    setNewSellPrice('');
    setNewSellQuantity('');
    setShowCreateSellOrder(false);
  };

  return (
    <div className="space-y-4" style={{ backgroundColor: '#3c3c3c' }}>
      {/* ========== SEÇÃO DE COMPRA ========== */}
      <div className="border-2" style={{ backgroundColor: '#2a2a2a', borderColor: '#555555' }}>
        {/* Header Compra */}
        <div 
          className="px-4 py-3 border-b-2 flex items-center justify-between"
          style={{ 
            backgroundColor: '#1f1f1f', 
            borderColor: '#444444' 
          }}
        >
          <h3 className="text-white font-bold uppercase tracking-wide">
            Comprar {currentResource.name}
          </h3>
          <button
            onClick={() => setShowCreateBuyOrder(!showCreateBuyOrder)}
            className="flex items-center gap-1 px-3 py-1 rounded text-xs font-bold uppercase transition-colors"
            style={{ 
              backgroundColor: '#16a34a', 
              color: 'white' 
            }}
          >
            <Plus size={14} />
            Criar Ordem
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Formulário Criar Ordem de Compra */}
          {showCreateBuyOrder && (
            <div 
              className="p-4 border-2 rounded space-y-3"
              style={{ 
                backgroundColor: '#1a1a1a', 
                borderColor: '#22c55e' 
              }}
            >
              <h4 className="text-green-400 font-bold uppercase">Criar Nova Ordem de Compra</h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-green-300 uppercase mb-1 font-bold">
                    Preço por unidade ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newBuyPrice}
                    onChange={(e) => setNewBuyPrice(e.target.value)}
                    className="w-full p-2 border text-white text-center"
                    style={{ 
                      backgroundColor: '#333333', 
                      borderColor: '#555555' 
                    }}
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-green-300 uppercase mb-1 font-bold">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    value={newBuyQuantity}
                    onChange={(e) => setNewBuyQuantity(e.target.value)}
                    className="w-full p-2 border text-white text-center"
                    style={{ 
                      backgroundColor: '#333333', 
                      borderColor: '#555555' 
                    }}
                    placeholder="0"
                  />
                </div>
              </div>

              {newBuyPrice && newBuyQuantity && (
                <div className="text-sm text-gray-300">
                  Total: {(parseFloat(newBuyPrice) * parseInt(newBuyQuantity)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} $
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleCreateBuyOrder}
                  disabled={!newBuyPrice || !newBuyQuantity || (parseFloat(newBuyPrice) * parseInt(newBuyQuantity)) > userBalance}
                  className="flex-1 py-2 px-4 rounded text-sm font-bold uppercase transition-colors"
                  style={{ 
                    backgroundColor: (!newBuyPrice || !newBuyQuantity || (parseFloat(newBuyPrice) * parseInt(newBuyQuantity)) > userBalance) ? '#6b7280' : '#16a34a',
                    color: 'white' 
                  }}
                >
                  Confirmar Ordem
                </button>
                <button
                  onClick={() => {
                    setShowCreateBuyOrder(false);
                    setNewBuyPrice('');
                    setNewBuyQuantity('');
                  }}
                  className="py-2 px-4 rounded text-sm font-bold uppercase transition-colors"
                  style={{ 
                    backgroundColor: '#6b7280', 
                    color: 'white' 
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Conteúdo Principal - Compra */}
          {bestSellOrder ? (
            <div className="space-y-4">
              {/* Info da melhor oferta */}
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 border-2 flex items-center justify-center"
                  style={{ 
                    backgroundColor: '#2a2a2a', 
                    borderColor: '#555555' 
                  }}
                >
                  <span className="text-2xl">{currentResource.icon}</span>
                </div>
                
                <div className="flex-1">
                  <div className="text-white font-bold">
                    Melhor oferta: {bestSellOrder.quantity.toLocaleString()} {currentResource.symbol}
                  </div>
                  <div className="text-blue-300 text-sm">
                    {bestSellOrder.user}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-white font-bold text-xl">
                    {bestSellOrder.price.toLocaleString('pt-BR', { minimumFractionDigits: 3 })} $
                  </div>
                  <div className="text-blue-300 text-sm">
                    por unidade
                  </div>
                </div>
              </div>

              {/* Controles de compra */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-blue-300 uppercase mb-1 font-bold">
                    Quantidade:
                  </label>
                  <input
                    type="number"
                    value={buyQuantity}
                    onChange={(e) => setBuyQuantity(e.target.value)}
                    max={bestSellOrder.quantity}
                    min="1"
                    className="w-full p-2 border-2 text-white text-center font-bold text-lg"
                    style={{ 
                      backgroundColor: '#2a2a2a', 
                      borderColor: '#555555',
                      height: '48px'
                    }}
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    Máx: {bestSellOrder.quantity.toLocaleString()}
                  </div>
                </div>
                
                <div className="col-span-2 flex items-end">
                  <button
                    onClick={handleBuy}
                    disabled={
                      !buyQuantity || 
                      parseInt(buyQuantity) > bestSellOrder.quantity ||
                      (bestSellOrder.price * parseInt(buyQuantity)) > userBalance
                    }
                    className="w-full py-3 px-4 font-bold text-sm tracking-wide border-2"
                    style={{ 
                      backgroundColor: (!buyQuantity || (bestSellOrder.price * parseInt(buyQuantity)) > userBalance) ? '#6b7280' : '#16a34a',
                      borderColor: (!buyQuantity || (bestSellOrder.price * parseInt(buyQuantity)) > userBalance) ? '#555555' : '#22c55e',
                      color: 'white',
                      height: '48px'
                    }}
                  >
                    {buyQuantity ? 
                      `Comprar por ${(bestSellOrder.price * parseInt(buyQuantity)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} $` :
                      'Digite quantidade'
                    }
                  </button>
                </div>
              </div>

              {/* Ver todas as ordens de venda */}
              <button
                onClick={() => setShowSellOrdersList(!showSellOrdersList)}
                className="w-full py-2 px-4 text-sm border transition-colors"
                style={{ 
                  backgroundColor: 'transparent', 
                  borderColor: '#3b82f6', 
                  color: '#3b82f6' 
                }}
              >
                {showSellOrdersList ? 'Ocultar' : 'Visualizar todas'} as ordens de venda ({resourceData.sell.length})
              </button>

              {/* Lista expandida */}
              {showSellOrdersList && (
                <div className="border-t-2 pt-3" style={{ borderColor: '#555555' }}>
                  <div className="text-red-400 font-bold text-sm mb-2 uppercase">
                    🔻 Todas as ordens de venda
                  </div>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {resourceData.sell.map((order, index) => (
                      <div 
                        key={order.id} 
                        className="border-2 p-2"
                        style={{ 
                          backgroundColor: '#2a2a2a', 
                          borderColor: '#3b82f6' 
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <div className="text-red-400 font-bold text-sm">
                            {order.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} $
                          </div>
                          <div className="text-white text-sm font-medium">
                            {order.quantity.toLocaleString()}
                          </div>
                          <div className="text-blue-300 text-xs">
                            {order.user}
                          </div>
                        </div>
                        {index === 0 && (
                          <div className="text-xs text-yellow-400 mt-1">← MELHOR OFERTA</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div 
              className="border-2 p-6 text-center"
              style={{ borderColor: '#555555' }}
            >
              <div className="text-gray-400 text-lg font-medium">
                Nenhuma oferta de venda para {currentResource.name}
              </div>
              <div className="text-gray-500 text-sm mt-2">
                Aguarde até que outros jogadores coloquem recursos à venda
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========== SEÇÃO DE VENDA ========== */}
      <div className="border-2" style={{ backgroundColor: '#2a2a2a', borderColor: '#555555' }}>
        {/* Header Venda */}
        <div 
          className="px-4 py-3 border-b-2 flex items-center justify-between"
          style={{ 
            backgroundColor: '#1f1f1f', 
            borderColor: '#444444' 
          }}
        >
          <h3 className="text-white font-bold uppercase tracking-wide">
            Vender {currentResource.name}
          </h3>
          <button
            onClick={() => setShowCreateSellOrder(!showCreateSellOrder)}
            disabled={userQuantity === 0}
            className="flex items-center gap-1 px-3 py-1 rounded text-xs font-bold uppercase transition-colors"
            style={{ 
              backgroundColor: userQuantity === 0 ? '#6b7280' : '#dc2626', 
              color: 'white' 
            }}
          >
            <Plus size={14} />
            Criar Ordem
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Formulário Criar Ordem de Venda */}
          {showCreateSellOrder && userQuantity > 0 && (
            <div 
              className="p-4 border-2 rounded space-y-3"
              style={{ 
                backgroundColor: '#1a1a1a', 
                borderColor: '#ef4444' 
              }}
            >
              <h4 className="text-red-400 font-bold uppercase">Criar Nova Ordem de Venda</h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-red-300 uppercase mb-1 font-bold">
                    Preço por unidade ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newSellPrice}
                    onChange={(e) => setNewSellPrice(e.target.value)}
                    className="w-full p-2 border text-white text-center"
                    style={{ 
                      backgroundColor: '#333333', 
                      borderColor: '#555555' 
                    }}
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-red-300 uppercase mb-1 font-bold">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    value={newSellQuantity}
                    onChange={(e) => setNewSellQuantity(e.target.value)}
                    max={userQuantity}
                    className="w-full p-2 border text-white text-center"
                    style={{ 
                      backgroundColor: '#333333', 
                      borderColor: '#555555' 
                    }}
                    placeholder="0"
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    Máx: {userQuantity.toLocaleString()}
                  </div>
                </div>
              </div>

              {newSellPrice && newSellQuantity && (
                <div className="text-sm text-gray-300">
                  Total: {(parseFloat(newSellPrice) * parseInt(newSellQuantity)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} $
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleCreateSellOrder}
                  disabled={!newSellPrice || !newSellQuantity || parseInt(newSellQuantity) > userQuantity}
                  className="flex-1 py-2 px-4 rounded text-sm font-bold uppercase transition-colors"
                  style={{ 
                    backgroundColor: (!newSellPrice || !newSellQuantity || parseInt(newSellQuantity) > userQuantity) ? '#6b7280' : '#dc2626',
                    color: 'white' 
                  }}
                >
                  Confirmar Ordem
                </button>
                <button
                  onClick={() => {
                    setShowCreateSellOrder(false);
                    setNewSellPrice('');
                    setNewSellQuantity('');
                  }}
                  className="py-2 px-4 rounded text-sm font-bold uppercase transition-colors"
                  style={{ 
                    backgroundColor: '#6b7280', 
                    color: 'white' 
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Conteúdo Principal - Venda */}
          {bestBuyOrder && userQuantity > 0 ? (
            <div className="space-y-4">
              {/* Info da melhor oferta */}
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 border-2 flex items-center justify-center"
                  style={{ 
                    backgroundColor: '#2a2a2a', 
                    borderColor: '#555555' 
                  }}
                >
                  <span className="text-2xl">{currentResource.icon}</span>
                </div>
                
                <div className="flex-1">
                  <div className="text-white font-bold">
                    Melhor compra: {bestBuyOrder.quantity.toLocaleString()} {currentResource.symbol}
                  </div>
                  <div className="text-blue-300 text-sm">
                    {bestBuyOrder.user} • Você tem: {userQuantity.toLocaleString()}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-white font-bold text-xl">
                    {bestBuyOrder.price.toLocaleString('pt-BR', { minimumFractionDigits: 3 })} $
                  </div>
                  <div className="text-blue-300 text-sm">
                    por unidade
                  </div>
                </div>
              </div>

              {/* Controles de venda */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-blue-300 uppercase mb-1 font-bold">
                    Quantidade:
                  </label>
                  <input
                    type="number"
                    value={sellQuantity}
                    onChange={(e) => setSellQuantity(e.target.value)}
                    max={Math.min(userQuantity, bestBuyOrder.quantity)}
                    min="1"
                    className="w-full p-2 border-2 text-white text-center font-bold text-lg"
                    style={{ 
                      backgroundColor: '#2a2a2a', 
                      borderColor: '#555555',
                      height: '48px'
                    }}
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    Máx: {Math.min(userQuantity, bestBuyOrder.quantity).toLocaleString()}
                  </div>
                </div>
                
                <div className="col-span-2 flex items-end">
                  <button
                    onClick={handleSell}
                    disabled={
                      !sellQuantity || 
                      parseInt(sellQuantity) > userQuantity ||
                      parseInt(sellQuantity) > bestBuyOrder.quantity
                    }
                    className="w-full py-3 px-4 font-bold text-sm tracking-wide border-2"
                    style={{ 
                      backgroundColor: (!sellQuantity || parseInt(sellQuantity) > Math.min(userQuantity, bestBuyOrder.quantity)) ? '#6b7280' : '#dc2626',
                      borderColor: (!sellQuantity || parseInt(sellQuantity) > Math.min(userQuantity, bestBuyOrder.quantity)) ? '#555555' : '#ef4444',
                      color: 'white',
                      height: '48px'
                    }}
                  >
                    {sellQuantity ? 
                      `Vender por ${(bestBuyOrder.price * parseInt(sellQuantity)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} $` :
                      'Digite quantidade'
                    }
                  </button>
                </div>
              </div>

              {/* Ver todas as ordens de compra */}
              <button
                onClick={() => setShowBuyOrdersList(!showBuyOrdersList)}
                className="w-full py-2 px-4 text-sm border transition-colors"
                style={{ 
                  backgroundColor: 'transparent', 
                  borderColor: '#3b82f6', 
                  color: '#3b82f6' 
                }}
              >
                {showBuyOrdersList ? 'Ocultar' : 'Visualizar todas'} as ordens de compra ({resourceData.buy.length})
              </button>

              {/* Lista expandida */}
              {showBuyOrdersList && (
                <div className="border-t-2 pt-3" style={{ borderColor: '#555555' }}>
                  <div className="text-green-400 font-bold text-sm mb-2 uppercase">
                    🔺 Todas as ordens de compra
                  </div>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {resourceData.buy.map((order, index) => (
                      <div 
                        key={order.id} 
                        className="border-2 p-2"
                        style={{ 
                          backgroundColor: '#2a2a2a', 
                          borderColor: '#3b82f6' 
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <div className="text-green-400 font-bold text-sm">
                            {order.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} $
                          </div>
                          <div className="text-white text-sm font-medium">
                            {order.quantity.toLocaleString()}
                          </div>
                          <div className="text-blue-300 text-xs">
                            {order.user}
                          </div>
                        </div>
                        {index === 0 && (
                          <div className="text-xs text-yellow-400 mt-1">← MELHOR OFERTA</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : userQuantity === 0 ? (
            <div 
              className="border-2 p-6 text-center"
              style={{ borderColor: '#555555' }}
            >
              <div className="text-gray-400 text-lg font-medium">
                Você não possui {currentResource.name} para vender
              </div>
              <div className="text-gray-500 text-sm mt-2">
                Compre alguns recursos primeiro para poder vendê-los
              </div>
            </div>
          ) : (
            <div 
              className="border-2 p-6 text-center"
              style={{ borderColor: '#555555' }}
            >
              <div className="text-gray-400 text-lg font-medium">
                Nenhuma oferta de compra para {currentResource.name}
              </div>
              <div className="text-gray-500 text-sm mt-2">
                Aguarde até que outros jogadores queiram comprar este recurso
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderBookTab;