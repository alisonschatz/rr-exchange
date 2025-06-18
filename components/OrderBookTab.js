import React, { useState } from 'react';
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, Zap } from 'lucide-react';

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
  const [customBuyForm, setCustomBuyForm] = useState({ price: '', quantity: '' });
  const [customSellForm, setCustomSellForm] = useState({ price: '', quantity: '' });
  const [quickBuyQuantity, setQuickBuyQuantity] = useState('');
  const [quickSellQuantity, setQuickSellQuantity] = useState('');
  
  const resourceData = getResourceData(selectedResource);
  const bestBuyPrice = getBestPrice(selectedResource, 'buy');
  const bestSellPrice = getBestPrice(selectedResource, 'sell');
  const userQuantity = userInventory[selectedResource] || 0;

  // Compra rápida pelo melhor preço
  const handleQuickBuy = () => {
    if (!bestSellPrice || !quickBuyQuantity) return;
    
    const quantity = parseInt(quickBuyQuantity);
    const total = bestSellPrice * quantity;
    
    if (total > userBalance) {
      alert('Saldo insuficiente!');
      return;
    }

    setUserBalance(prev => prev - total);
    setUserInventory(prev => ({
      ...prev,
      [selectedResource]: (prev[selectedResource] || 0) + quantity
    }));

    setQuickBuyQuantity('');
    alert(`✅ Compra instantânea! ${quantity} ${currentResource.symbol} por ${total.toFixed(2)} $`);
  };

  // Venda rápida pelo melhor preço
  const handleQuickSell = () => {
    if (!bestBuyPrice || !quickSellQuantity) return;
    
    const quantity = parseInt(quickSellQuantity);
    const total = bestBuyPrice * quantity;
    
    if (quantity > userQuantity) {
      alert('Recursos insuficientes!');
      return;
    }

    setUserBalance(prev => prev + total);
    setUserInventory(prev => ({
      ...prev,
      [selectedResource]: (prev[selectedResource] || 0) - quantity
    }));

    setQuickSellQuantity('');
    alert(`✅ Venda instantânea! ${quantity} ${currentResource.symbol} por ${total.toFixed(2)} $`);
  };

  // Compra customizada
  const handleCustomBuy = () => {
    if (!customBuyForm.price || !customBuyForm.quantity) return;
    
    const total = parseFloat(customBuyForm.price) * parseInt(customBuyForm.quantity);
    
    if (total > userBalance) {
      alert('Saldo insuficiente!');
      return;
    }

    setUserBalance(prev => prev - total);
    setUserInventory(prev => ({
      ...prev,
      [selectedResource]: (prev[selectedResource] || 0) + parseInt(customBuyForm.quantity)
    }));

    setCustomBuyForm({ price: '', quantity: '' });
    alert(`✅ Compra realizada! ${customBuyForm.quantity} ${currentResource.symbol} por ${total.toFixed(2)} $`);
  };

  // Venda customizada
  const handleCustomSell = () => {
    if (!customSellForm.price || !customSellForm.quantity) return;
    
    const quantity = parseInt(customSellForm.quantity);
    const total = parseFloat(customSellForm.price) * quantity;
    
    if (quantity > userQuantity) {
      alert('Recursos insuficientes!');
      return;
    }

    setUserBalance(prev => prev + total);
    setUserInventory(prev => ({
      ...prev,
      [selectedResource]: (prev[selectedResource] || 0) - quantity
    }));

    setCustomSellForm({ price: '', quantity: '' });
    alert(`✅ Venda realizada! ${quantity} ${currentResource.symbol} por ${total.toFixed(2)} $`);
  };

  return (
    <div className="space-y-4">
      {/* Header com Info do Recurso */}
      <div className="bg-gray-800 border border-gray-700 rounded p-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{currentResource.icon}</span>
          <div>
            <h2 className="text-xl font-bold text-white uppercase">{currentResource.name}</h2>
            <div className="text-sm text-gray-400">Você possui: {userQuantity.toLocaleString()} {currentResource.symbol}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-500/10 border border-green-500/20 rounded">
            <div className="text-xs text-green-300 mb-1">COMPRANDO POR</div>
            <div className="text-lg font-bold text-green-400">
              {bestBuyPrice ? `${bestBuyPrice.toFixed(2)} $` : 'Sem ordens'}
            </div>
          </div>
          <div className="text-center p-3 bg-red-500/10 border border-red-500/20 rounded">
            <div className="text-xs text-red-300 mb-1">VENDENDO POR</div>
            <div className="text-lg font-bold text-red-400">
              {bestSellPrice ? `${bestSellPrice.toFixed(2)} $` : 'Sem ordens'}
            </div>
          </div>
          <div className="text-center p-3 bg-blue-500/10 border border-blue-500/20 rounded">
            <div className="text-xs text-blue-300 mb-1">SPREAD</div>
            <div className="text-lg font-bold text-blue-400">
              {getSpread(selectedResource) ? `${getSpread(selectedResource)}%` : '--'}
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Negociação Rápida */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Compra Instantânea */}
        <div className="bg-gray-800 border border-gray-700 rounded p-4">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="text-yellow-400" size={20} />
            <h3 className="text-lg font-bold text-green-400">COMPRA INSTANTÂNEA</h3>
          </div>
          
          {bestSellPrice ? (
            <div className="space-y-4">
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded">
                <div className="text-sm text-green-300 mb-1">Melhor preço disponível:</div>
                <div className="text-2xl font-bold text-green-400">{bestSellPrice.toFixed(2)} $ por unidade</div>
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 uppercase mb-2">Quantidade para comprar</label>
                <input
                  type="number"
                  value={quickBuyQuantity}
                  onChange={(e) => setQuickBuyQuantity(e.target.value)}
                  placeholder="0"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white font-mono text-lg"
                />
                <div className="flex gap-2 mt-2">
                  {[100, 500, 1000].map(qty => (
                    <button
                      key={qty}
                      onClick={() => setQuickBuyQuantity(qty.toString())}
                      className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-gray-300 rounded text-xs"
                    >
                      {qty}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      const max = Math.floor(userBalance / bestSellPrice);
                      setQuickBuyQuantity(max.toString());
                    }}
                    className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 text-white rounded text-xs"
                  >
                    MÁXIMO
                  </button>
                </div>
              </div>
              
              {quickBuyQuantity && (
                <div className="p-3 bg-gray-700 rounded">
                  <div className="text-sm text-gray-300">Total a pagar:</div>
                  <div className="text-xl font-bold text-white">
                    {(bestSellPrice * parseInt(quickBuyQuantity || 0)).toFixed(2)} $
                  </div>
                </div>
              )}
              
              <button
                onClick={handleQuickBuy}
                disabled={!quickBuyQuantity || (bestSellPrice * parseInt(quickBuyQuantity || 0)) > userBalance}
                className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded font-bold"
              >
                ⚡ COMPRAR AGORA
              </button>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart size={32} className="mx-auto mb-2 opacity-50" />
              <div>Nenhuma ordem de venda disponível</div>
            </div>
          )}
        </div>

        {/* Venda Instantânea */}
        <div className="bg-gray-800 border border-gray-700 rounded p-4">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="text-yellow-400" size={20} />
            <h3 className="text-lg font-bold text-red-400">VENDA INSTANTÂNEA</h3>
          </div>
          
          {bestBuyPrice && userQuantity > 0 ? (
            <div className="space-y-4">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded">
                <div className="text-sm text-red-300 mb-1">Melhor preço disponível:</div>
                <div className="text-2xl font-bold text-red-400">{bestBuyPrice.toFixed(2)} $ por unidade</div>
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 uppercase mb-2">
                  Quantidade para vender (máx: {userQuantity.toLocaleString()})
                </label>
                <input
                  type="number"
                  value={quickSellQuantity}
                  onChange={(e) => setQuickSellQuantity(e.target.value)}
                  placeholder="0"
                  max={userQuantity}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white font-mono text-lg"
                />
                <div className="flex gap-2 mt-2">
                  {[100, 500, Math.min(1000, userQuantity)].filter(qty => qty <= userQuantity).map(qty => (
                    <button
                      key={qty}
                      onClick={() => setQuickSellQuantity(qty.toString())}
                      className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-gray-300 rounded text-xs"
                    >
                      {qty}
                    </button>
                  ))}
                  <button
                    onClick={() => setQuickSellQuantity(userQuantity.toString())}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs"
                  >
                    TUDO
                  </button>
                </div>
              </div>
              
              {quickSellQuantity && (
                <div className="p-3 bg-gray-700 rounded">
                  <div className="text-sm text-gray-300">Total a receber:</div>
                  <div className="text-xl font-bold text-white">
                    {(bestBuyPrice * parseInt(quickSellQuantity || 0)).toFixed(2)} $
                  </div>
                </div>
              )}
              
              <button
                onClick={handleQuickSell}
                disabled={!quickSellQuantity || parseInt(quickSellQuantity || 0) > userQuantity}
                className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded font-bold"
              >
                ⚡ VENDER AGORA
              </button>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <DollarSign size={32} className="mx-auto mb-2 opacity-50" />
              <div>
                {userQuantity === 0 
                  ? 'Você não possui este recurso' 
                  : 'Nenhuma ordem de compra disponível'
                }
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Seção de Preços Customizados */}
      <div className="bg-gray-800 border border-gray-700 rounded p-4">
        <h3 className="text-lg font-bold text-white mb-4">DEFINIR PREÇOS CUSTOMIZADOS</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Compra Customizada */}
          <div className="p-4 border border-gray-600 rounded">
            <h4 className="text-sm font-bold text-green-400 mb-3 uppercase">Comprar por preço específico</h4>
            
            <div className="space-y-3">
              <input
                type="number"
                step="0.01"
                value={customBuyForm.price}
                onChange={(e) => setCustomBuyForm({...customBuyForm, price: e.target.value})}
                placeholder="Preço por unidade"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
              />
              
              <input
                type="number"
                value={customBuyForm.quantity}
                onChange={(e) => setCustomBuyForm({...customBuyForm, quantity: e.target.value})}
                placeholder="Quantidade"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
              />
              
              {customBuyForm.price && customBuyForm.quantity && (
                <div className="text-xs text-gray-300">
                  Total: {(parseFloat(customBuyForm.price) * parseInt(customBuyForm.quantity || 0)).toFixed(2)} $
                </div>
              )}
              
              <button
                onClick={handleCustomBuy}
                disabled={!customBuyForm.price || !customBuyForm.quantity}
                className="w-full py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded text-sm font-bold"
              >
                Comprar
              </button>
            </div>
          </div>

          {/* Venda Customizada */}
          <div className="p-4 border border-gray-600 rounded">
            <h4 className="text-sm font-bold text-red-400 mb-3 uppercase">Vender por preço específico</h4>
            
            <div className="space-y-3">
              <input
                type="number"
                step="0.01"
                value={customSellForm.price}
                onChange={(e) => setCustomSellForm({...customSellForm, price: e.target.value})}
                placeholder="Preço por unidade"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
              />
              
              <input
                type="number"
                value={customSellForm.quantity}
                onChange={(e) => setCustomSellForm({...customSellForm, quantity: e.target.value})}
                placeholder={`Quantidade (máx: ${userQuantity})`}
                max={userQuantity}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
              />
              
              {customSellForm.price && customSellForm.quantity && (
                <div className="text-xs text-gray-300">
                  Total: {(parseFloat(customSellForm.price) * parseInt(customSellForm.quantity || 0)).toFixed(2)} $
                </div>
              )}
              
              <button
                onClick={handleCustomSell}
                disabled={!customSellForm.price || !customSellForm.quantity || parseInt(customSellForm.quantity || 0) > userQuantity}
                className="w-full py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded text-sm font-bold"
              >
                Vender
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Order Book Simplificado */}
      <div className="bg-gray-800 border border-gray-700 rounded p-4">
        <h3 className="text-lg font-bold text-white mb-4">OUTRAS ORDENS NO MERCADO</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
              <TrendingDown size={16} />
              Vendendo
            </h4>
            <div className="space-y-1">
              {resourceData.sell.slice(0, 5).map((order) => (
                <div key={order.id} className="flex justify-between p-2 bg-red-500/5 rounded text-sm">
                  <span className="text-red-400 font-bold">{order.price.toFixed(2)} $</span>
                  <span className="text-gray-400">{order.quantity.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-bold text-green-400 mb-3 flex items-center gap-2">
              <TrendingUp size={16} />
              Comprando
            </h4>
            <div className="space-y-1">
              {resourceData.buy.slice(0, 5).map((order) => (
                <div key={order.id} className="flex justify-between p-2 bg-green-500/5 rounded text-sm">
                  <span className="text-green-400 font-bold">{order.price.toFixed(2)} $</span>
                  <span className="text-gray-400">{order.quantity.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBookTab;