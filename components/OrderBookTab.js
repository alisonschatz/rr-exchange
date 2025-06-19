import React, { useState } from 'react';

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

  return (
    <div className="space-y-3">
      {/* Seção de Compra */}
      {bestSellOrder ? (
        <div className="bg-gray-800 border-2 border-gray-600" style={{ borderColor: '#4a5568' }}>
          <div className="bg-gradient-to-r from-gray-700 to-gray-600 border-b-2 border-gray-500 px-4 py-2">
            <div className="text-gray-200 font-bold text-sm tracking-wide">Comprar {currentResource.name}</div>
          </div>
          
          <div className="p-4 bg-gray-800">
            {/* Informações da melhor oferta */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 border-2 border-gray-500 flex items-center justify-center" style={{ backgroundColor: '#2d3748', borderColor: '#4a5568' }}>
                <span className="text-2xl">{currentResource.icon}</span>
              </div>
              
              <div className="flex-1">
                <div className="text-white font-bold text-base tracking-wide">
                  Melhor oferta: {bestSellOrder.quantity.toLocaleString()} {currentResource.symbol}
                </div>
                <div className="text-blue-300 text-sm font-medium">
                  {bestSellOrder.user}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-white font-bold text-xl tracking-wider">
                  {bestSellOrder.price.toLocaleString('pt-BR', { minimumFractionDigits: 3 })} $
                </div>
                <div className="text-blue-300 text-sm font-medium">
                  por unidade
                </div>
              </div>
            </div>

            {/* Controles de compra */}
            <div className="space-y-3">
              <div className="grid grid-cols-5 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs text-blue-300 uppercase mb-1 font-bold">QUANTIDADE:</label>
                  <input
                    type="number"
                    value={buyQuantity}
                    onChange={(e) => setBuyQuantity(e.target.value)}
                    max={bestSellOrder.quantity}
                    className="w-full p-2 bg-gray-700 border-2 border-gray-500 text-white text-center font-bold text-lg"
                    style={{ backgroundColor: '#2d3748', borderColor: '#4a5568' }}
                    min="1"
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    Máx: {bestSellOrder.quantity.toLocaleString()}
                  </div>
                </div>
                
                <div className="col-span-3">
                  <div className="h-full flex items-end">
                    <button
                      onClick={handleBuy}
                      disabled={
                        !buyQuantity || 
                        parseInt(buyQuantity) > bestSellOrder.quantity ||
                        (bestSellOrder.price * parseInt(buyQuantity)) > userBalance
                      }
                      className="w-full text-white py-2 px-4 font-bold text-sm tracking-wide border-2"
                      style={{ 
                        backgroundColor: (!buyQuantity || (bestSellOrder.price * parseInt(buyQuantity)) > userBalance) ? '#4a5568' : '#38a169',
                        borderColor: (!buyQuantity || (bestSellOrder.price * parseInt(buyQuantity)) > userBalance) ? '#2d3748' : '#2f855a'
                      }}
                    >
                      {buyQuantity ? 
                        `Comprar por ${(bestSellOrder.price * parseInt(buyQuantity)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} $` :
                        'Digite quantidade'
                      }
                    </button>
                  </div>
                </div>
              </div>

              {/* Botão para ver todas as ordens de venda */}
              <button
                onClick={() => setShowSellOrdersList(!showSellOrdersList)}
                className="w-full text-blue-300 py-2 px-4 text-sm border border-blue-600 hover:bg-blue-600 hover:bg-opacity-20 transition-colors tracking-wide"
                style={{ borderColor: '#3182ce' }}
              >
                {showSellOrdersList ? 'Ocultar' : 'Visualizar todas'} as ordens de venda ({resourceData.sell.length})
              </button>

              {/* Lista expandida de ordens de venda */}
              {showSellOrdersList && (
                <div className="border-t-2 border-gray-600 pt-3">
                  <div className="text-red-400 font-bold text-sm mb-2 uppercase tracking-wide">
                    🔻 Todas as ordens de venda
                  </div>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {resourceData.sell.map((order, index) => (
                      <div key={order.id} className="border-2 border-blue-600 p-2" style={{ backgroundColor: '#2d3748', borderColor: '#3182ce' }}>
                        <div className="flex justify-between items-center">
                          <div className="text-red-400 font-bold text-sm tracking-wide">
                            {order.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} $
                          </div>
                          <div className="text-white text-sm font-medium">
                            {order.quantity.toLocaleString()}
                          </div>
                          <div className="text-blue-300 text-xs font-medium">
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
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 border-2 border-gray-600 p-6 text-center" style={{ borderColor: '#4a5568' }}>
          <div className="text-gray-400 text-lg font-medium">
            Nenhuma oferta de venda para {currentResource.name}
          </div>
          <div className="text-gray-500 text-sm mt-2">
            Aguarde até que outros jogadores coloquem recursos à venda
          </div>
        </div>
      )}

      {/* Seção de Venda */}
      {bestBuyOrder && userQuantity > 0 ? (
        <div className="bg-gray-800 border-2 border-gray-600" style={{ borderColor: '#4a5568' }}>
          <div className="bg-gradient-to-r from-gray-700 to-gray-600 border-b-2 border-gray-500 px-4 py-2">
            <div className="text-gray-200 font-bold text-sm tracking-wide">Vender {currentResource.name}</div>
          </div>
          
          <div className="p-4 bg-gray-800">
            {/* Informações da melhor oferta */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 border-2 border-gray-500 flex items-center justify-center" style={{ backgroundColor: '#2d3748', borderColor: '#4a5568' }}>
                <span className="text-2xl">{currentResource.icon}</span>
              </div>
              
              <div className="flex-1">
                <div className="text-white font-bold text-base tracking-wide">
                  Melhor compra: {bestBuyOrder.quantity.toLocaleString()} {currentResource.symbol}
                </div>
                <div className="text-blue-300 text-sm font-medium">
                  {bestBuyOrder.user} • Você tem: {userQuantity.toLocaleString()}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-white font-bold text-xl tracking-wider">
                  {bestBuyOrder.price.toLocaleString('pt-BR', { minimumFractionDigits: 3 })} $
                </div>
                <div className="text-blue-300 text-sm font-medium">
                  por unidade
                </div>
              </div>
            </div>

            {/* Controles de venda */}
            <div className="space-y-3">
              <div className="grid grid-cols-5 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs text-blue-300 uppercase mb-1 font-bold">QUANTIDADE:</label>
                  <input
                    type="number"
                    value={sellQuantity}
                    onChange={(e) => setSellQuantity(e.target.value)}
                    max={Math.min(userQuantity, bestBuyOrder.quantity)}
                    className="w-full p-2 bg-gray-700 border-2 border-gray-500 text-white text-center font-bold text-lg"
                    style={{ backgroundColor: '#2d3748', borderColor: '#4a5568' }}
                    min="1"
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    Máx: {Math.min(userQuantity, bestBuyOrder.quantity).toLocaleString()}
                  </div>
                </div>
                
                <div className="col-span-3">
                  <div className="h-full flex items-end">
                    <button
                      onClick={handleSell}
                      disabled={
                        !sellQuantity || 
                        parseInt(sellQuantity) > userQuantity ||
                        parseInt(sellQuantity) > bestBuyOrder.quantity
                      }
                      className="w-full text-white py-2 px-4 font-bold text-sm tracking-wide border-2"
                      style={{ 
                        backgroundColor: (!sellQuantity || parseInt(sellQuantity) > Math.min(userQuantity, bestBuyOrder.quantity)) ? '#4a5568' : '#e53e3e',
                        borderColor: (!sellQuantity || parseInt(sellQuantity) > Math.min(userQuantity, bestBuyOrder.quantity)) ? '#2d3748' : '#c53030'
                      }}
                    >
                      {sellQuantity ? 
                        `Vender por ${(bestBuyOrder.price * parseInt(sellQuantity)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} $` :
                        'Digite quantidade'
                      }
                    </button>
                  </div>
                </div>
              </div>

              {/* Botão para ver todas as ordens de compra */}
              <button
                onClick={() => setShowBuyOrdersList(!showBuyOrdersList)}
                className="w-full text-blue-300 py-2 px-4 text-sm border border-blue-600 hover:bg-blue-600 hover:bg-opacity-20 transition-colors tracking-wide"
                style={{ borderColor: '#3182ce' }}
              >
                {showBuyOrdersList ? 'Ocultar' : 'Visualizar todas'} as ordens de compra ({resourceData.buy.length})
              </button>

              {/* Lista expandida de ordens de compra */}
              {showBuyOrdersList && (
                <div className="border-t-2 border-gray-600 pt-3">
                  <div className="text-green-400 font-bold text-sm mb-2 uppercase tracking-wide">
                    🔺 Todas as ordens de compra
                  </div>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {resourceData.buy.map((order, index) => (
                      <div key={order.id} className="border-2 border-blue-600 p-2" style={{ backgroundColor: '#2d3748', borderColor: '#3182ce' }}>
                        <div className="flex justify-between items-center">
                          <div className="text-green-400 font-bold text-sm tracking-wide">
                            {order.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} $
                          </div>
                          <div className="text-white text-sm font-medium">
                            {order.quantity.toLocaleString()}
                          </div>
                          <div className="text-blue-300 text-xs font-medium">
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
          </div>
        </div>
      ) : userQuantity === 0 ? (
        <div className="bg-gray-800 border-2 border-gray-600 p-6 text-center" style={{ borderColor: '#4a5568' }}>
          <div className="text-gray-400 text-lg font-medium">
            Você não possui {currentResource.name} para vender
          </div>
          <div className="text-gray-500 text-sm mt-2">
            Compre alguns recursos primeiro para poder vendê-los
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 border-2 border-gray-600 p-6 text-center" style={{ borderColor: '#4a5568' }}>
          <div className="text-gray-400 text-lg font-medium">
            Nenhuma oferta de compra para {currentResource.name}
          </div>
          <div className="text-gray-500 text-sm mt-2">
            Aguarde até que outros jogadores queiram comprar este recurso
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderBookTab;