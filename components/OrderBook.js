'use client';

import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, Menu, X, BarChart3, Activity, Zap, Shield } from 'lucide-react';

const RESOURCES = [
  { 
    id: 'cash', 
    name: 'State Cash', 
    symbol: 'CASH', 
    color: 'text-emerald-400',
    bgGradient: 'from-emerald-500 to-emerald-600',
    lightBg: 'bg-emerald-50 border-emerald-200',
    icon: '💰'
  },
  { 
    id: 'gold', 
    name: 'State Gold', 
    symbol: 'GOLD', 
    color: 'text-yellow-400',
    bgGradient: 'from-yellow-500 to-amber-600',
    lightBg: 'bg-yellow-50 border-yellow-200',
    icon: '🏆'
  },
  { 
    id: 'oil', 
    name: 'Petróleo', 
    symbol: 'OIL', 
    color: 'text-gray-100',
    bgGradient: 'from-gray-800 to-black',
    lightBg: 'bg-gray-50 border-gray-300',
    icon: '⚫'
  },
  { 
    id: 'ore', 
    name: 'Minério', 
    symbol: 'ORE', 
    color: 'text-orange-400',
    bgGradient: 'from-orange-600 to-red-600',
    lightBg: 'bg-orange-50 border-orange-200',
    icon: '⛏️'
  },
  { 
    id: 'diamond', 
    name: 'Diamante', 
    symbol: 'DIA', 
    color: 'text-cyan-400',
    bgGradient: 'from-cyan-500 to-blue-600',
    lightBg: 'bg-cyan-50 border-cyan-200',
    icon: '💎'
  },
  { 
    id: 'uranium', 
    name: 'Urânio', 
    symbol: 'URA', 
    color: 'text-lime-400',
    bgGradient: 'from-lime-500 to-green-600',
    lightBg: 'bg-lime-50 border-lime-200',
    icon: '☢️'
  }
];

const OrderBook = () => {
  const [selectedResource, setSelectedResource] = useState('gold');
  const [orders, setOrders] = useState({});
  const [newOrder, setNewOrder] = useState({
    type: 'buy',
    price: '',
    quantity: '',
    resource: 'gold'
  });
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [activeTab, setActiveTab] = useState('orderbook');
  const [showResourceSelector, setShowResourceSelector] = useState(false);
  const [userBalance, setUserBalance] = useState(0);

  // Carregar dados do localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem('rivalRegionsOrders');
    const savedBalance = localStorage.getItem('rivalRegionsBalance');
    
    if (savedBalance) {
      setUserBalance(parseFloat(savedBalance));
    } else {
      // Saldo inicial de exemplo
      const initialBalance = 50000.00;
      setUserBalance(initialBalance);
      localStorage.setItem('rivalRegionsBalance', initialBalance.toString());
    }
    
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      const initialOrders = {
        gold: {
          buy: [
            { id: 1, price: 1.25, quantity: 1000, total: 1250, user: 'Player1' },
            { id: 2, price: 1.20, quantity: 2500, total: 3000, user: 'Player2' },
            { id: 3, price: 1.15, quantity: 800, total: 920, user: 'Player3' }
          ],
          sell: [
            { id: 4, price: 1.30, quantity: 500, total: 650, user: 'Player4' },
            { id: 5, price: 1.35, quantity: 1200, total: 1620, user: 'Player5' },
            { id: 6, price: 1.40, quantity: 900, total: 1260, user: 'Player6' }
          ]
        },
        oil: {
          buy: [
            { id: 7, price: 0.85, quantity: 3000, total: 2550, user: 'Player7' }
          ],
          sell: [
            { id: 8, price: 0.90, quantity: 2000, total: 1800, user: 'Player8' }
          ]
        }
      };
      setOrders(initialOrders);
      localStorage.setItem('rivalRegionsOrders', JSON.stringify(initialOrders));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(orders).length > 0) {
      localStorage.setItem('rivalRegionsOrders', JSON.stringify(orders));
    }
  }, [orders]);

  // Salvar saldo quando mudar
  useEffect(() => {
    localStorage.setItem('rivalRegionsBalance', userBalance.toString());
  }, [userBalance]);

  const handleCreateOrder = () => {
    if (!newOrder.price || !newOrder.quantity) return;

    const orderTotal = parseFloat(newOrder.price) * parseInt(newOrder.quantity);
    
    // Verificar se tem saldo suficiente para ordens de compra
    if (newOrder.type === 'buy' && orderTotal > userBalance) {
      alert(`Saldo insuficiente! Você possui ${userBalance.toFixed(2)} RRCoin, mas precisa de ${orderTotal.toFixed(2)} RRCoin para esta ordem.`);
      return;
    }

    const order = {
      id: Date.now(),
      price: parseFloat(newOrder.price),
      quantity: parseInt(newOrder.quantity),
      total: orderTotal,
      user: `Player${Math.floor(Math.random() * 1000)}`
    };

    setOrders(prev => {
      const updated = { ...prev };
      if (!updated[newOrder.resource]) {
        updated[newOrder.resource] = { buy: [], sell: [] };
      }
      
      updated[newOrder.resource][newOrder.type].push(order);
      
      if (newOrder.type === 'buy') {
        updated[newOrder.resource].buy.sort((a, b) => b.price - a.price);
      } else {
        updated[newOrder.resource].sell.sort((a, b) => a.price - b.price);
      }
      
      return updated;
    });

    // Deduzir do saldo apenas para ordens de compra
    if (newOrder.type === 'buy') {
      setUserBalance(prev => prev - orderTotal);
    }

    setNewOrder({ type: 'buy', price: '', quantity: '', resource: selectedResource });
    setShowOrderForm(false);
  };

  const getResourceData = (resourceId) => {
    return orders[resourceId] || { buy: [], sell: [] };
  };

  const getBestPrice = (resourceId, type) => {
    const data = getResourceData(resourceId);
    if (data[type].length === 0) return null;
    return data[type][0].price;
  };

  const getSpread = (resourceId) => {
    const bestBuy = getBestPrice(resourceId, 'buy');
    const bestSell = getBestPrice(resourceId, 'sell');
    if (!bestBuy || !bestSell) return null;
    return ((bestSell - bestBuy) / bestBuy * 100).toFixed(2);
  };

  const currentResource = RESOURCES.find(r => r.id === selectedResource);
  const resourceData = getResourceData(selectedResource);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Mobile Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 shadow-2xl sticky top-0 z-40 border-b border-slate-600">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowResourceSelector(!showResourceSelector)}
                className="p-2 hover:bg-slate-600/50 rounded-xl transition-all duration-200 backdrop-blur-sm"
              >
                <Menu size={20} className="text-slate-300" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <Shield className="text-blue-400" size={20} />
                  <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Rival Exchange
                  </h1>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xl">{currentResource.icon}</span>
                  <span className={`text-sm font-bold ${currentResource.color}`}>
                    {currentResource.symbol}
                  </span>
                  <span className="text-xs text-slate-400">
                    {getBestPrice(selectedResource, 'sell')?.toFixed(3) || '--'}
                  </span>
                  <div className="flex items-center gap-1">
                    <Activity size={12} className="text-green-400" />
                    <span className="text-xs text-green-400">LIVE</span>
                  </div>
                </div>
                {/* Saldo do usuário */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-lg px-2 py-1">
                    <span className="text-yellow-400 text-sm">💰</span>
                    <span className="text-xs text-yellow-300 font-medium">SALDO:</span>
                    <span className="text-sm font-bold text-yellow-400 font-mono">
                      {userBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-xs text-yellow-300">RRCoin</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowOrderForm(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white p-3 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Resource Selector Dropdown */}
        {showResourceSelector && (
          <div className="border-t border-slate-600 bg-gradient-to-b from-slate-800 to-slate-900 backdrop-blur-xl">
            <div className="p-4 grid grid-cols-2 gap-3">
              {RESOURCES.map(resource => {
                const bestPrice = getBestPrice(resource.id, 'sell');
                const trend = Math.random() > 0.5 ? 'up' : 'down';
                return (
                  <button
                    key={resource.id}
                    onClick={() => {
                      setSelectedResource(resource.id);
                      setShowResourceSelector(false);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all duration-300 hover:scale-105 backdrop-blur-sm ${
                      selectedResource === resource.id
                        ? 'border-blue-400 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 shadow-lg shadow-blue-500/20'
                        : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{resource.icon}</span>
                      <div className={`p-1 rounded-lg ${trend === 'up' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        {trend === 'up' ? 
                          <TrendingUp size={12} className="text-green-400" /> : 
                          <TrendingDown size={12} className="text-red-400" />
                        }
                      </div>
                    </div>
                    <div className={`font-bold ${resource.color} text-sm`}>{resource.symbol}</div>
                    <div className="text-xs text-slate-400 truncate mb-2">{resource.name}</div>
                    {bestPrice && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-300 font-mono">{bestPrice.toFixed(3)}</span>
                        <span className={`text-xs ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                          {trend === 'up' ? '+' : '-'}{(Math.random() * 5).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Mobile Tabs */}
        <div className="border-t border-slate-600">
          <div className="flex">
            <button
              onClick={() => setActiveTab('orderbook')}
              className={`flex-1 py-4 px-4 text-sm font-medium border-b-2 transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'orderbook' 
                  ? 'border-blue-400 text-blue-400 bg-blue-500/10' 
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              <BarChart3 size={16} />
              Order Book
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex-1 py-4 px-4 text-sm font-medium border-b-2 transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'summary' 
                  ? 'border-blue-400 text-blue-400 bg-blue-500/10' 
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              <Zap size={16} />
              Análise
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {activeTab === 'orderbook' && (
          <div className="space-y-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Saldo destacado */}
              <div className="col-span-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                      <span className="text-yellow-400 text-xl">💰</span>
                    </div>
                    <div>
                      <div className="text-xs text-yellow-300 font-medium">SEU SALDO</div>
                      <div className="text-lg font-bold text-yellow-400 font-mono">
                        {userBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} RRCoin
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setUserBalance(prev => prev + 10000)}
                    className="text-xs bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 px-3 py-1 rounded-lg border border-yellow-500/30 transition-colors"
                  >
                    + 10k (Demo)
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={16} className="text-green-400" />
                  <div className="text-xs text-green-300 font-medium">MELHOR COMPRA</div>
                </div>
                <div className="text-xl font-bold text-green-400 font-mono">
                  {getBestPrice(selectedResource, 'buy')?.toFixed(3) || '--'}
                </div>
                <div className="text-xs text-green-300/70 mt-1">Bid Price</div>
              </div>
              <div className="bg-gradient-to-br from-red-500/20 to-rose-500/20 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown size={16} className="text-red-400" />
                  <div className="text-xs text-red-300 font-medium">MELHOR VENDA</div>
                </div>
                <div className="text-xl font-bold text-red-400 font-mono">
                  {getBestPrice(selectedResource, 'sell')?.toFixed(3) || '--'}
                </div>
                <div className="text-xs text-red-300/70 mt-1">Ask Price</div>
              </div>
            </div>

            {/* Order Book */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 rounded-xl overflow-hidden backdrop-blur-sm shadow-2xl">
              {/* Sell Orders */}
              <div className="p-4 border-b border-slate-700">
                <h3 className="font-bold text-red-400 mb-4 flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  ORDENS DE VENDA
                </h3>
                <div className="space-y-1">
                  {resourceData.sell.slice(0, 6).reverse().map((order, index) => (
                    <div 
                      key={order.id} 
                      className="flex justify-between items-center py-2 px-3 rounded-lg bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-all duration-200"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-red-400 font-bold text-sm font-mono">{order.price.toFixed(3)}</div>
                        <div className="text-xs text-slate-400">{order.quantity.toLocaleString()}</div>
                      </div>
                      <div className="text-xs text-slate-300 font-mono">{order.total.toFixed(0)}</div>
                    </div>
                  ))}
                  {resourceData.sell.length === 0 && (
                    <div className="text-slate-500 text-sm py-8 text-center border border-dashed border-slate-600 rounded-lg">
                      <TrendingDown className="mx-auto mb-2 text-slate-600" size={24} />
                      Nenhuma ordem de venda
                    </div>
                  )}
                </div>
              </div>

              {/* Spread Indicator */}
              {getSpread(selectedResource) && (
                <div className="px-4 py-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-y border-blue-500/20">
                  <div className="text-center flex items-center justify-center gap-2">
                    <Activity size={14} className="text-blue-400" />
                    <span className="text-xs text-blue-300 font-medium">
                      SPREAD: <span className="font-bold text-blue-400">{getSpread(selectedResource)}%</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Buy Orders */}
              <div className="p-4">
                <h3 className="font-bold text-green-400 mb-4 flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  ORDENS DE COMPRA
                </h3>
                <div className="space-y-1">
                  {resourceData.buy.slice(0, 6).map((order, index) => (
                    <div 
                      key={order.id} 
                      className="flex justify-between items-center py-2 px-3 rounded-lg bg-green-500/5 border border-green-500/10 hover:bg-green-500/10 transition-all duration-200"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-green-400 font-bold text-sm font-mono">{order.price.toFixed(3)}</div>
                        <div className="text-xs text-slate-400">{order.quantity.toLocaleString()}</div>
                      </div>
                      <div className="text-xs text-slate-300 font-mono">{order.total.toFixed(0)}</div>
                    </div>
                  ))}
                  {resourceData.buy.length === 0 && (
                    <div className="text-slate-500 text-sm py-8 text-center border border-dashed border-slate-600 rounded-lg">
                      <TrendingUp className="mx-auto mb-2 text-slate-600" size={24} />
                      Nenhuma ordem de compra
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="space-y-4">
            {/* Market Stats */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 rounded-xl p-6 backdrop-blur-sm shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <BarChart3 size={20} className="text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-200">Análise de Mercado</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="text-xs text-green-300 font-medium mb-1">BID</div>
                    <div className="text-lg font-bold text-green-400 font-mono">
                      {getBestPrice(selectedResource, 'buy')?.toFixed(3) || '--'}
                    </div>
                  </div>
                  {getSpread(selectedResource) && (
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="text-xs text-blue-300 font-medium mb-1">SPREAD</div>
                      <div className="text-lg font-bold text-blue-400">
                        {getSpread(selectedResource)}%
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="text-xs text-red-300 font-medium mb-1">ASK</div>
                    <div className="text-lg font-bold text-red-400 font-mono">
                      {getBestPrice(selectedResource, 'sell')?.toFixed(3) || '--'}
                    </div>
                  </div>
                  <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <div className="text-xs text-purple-300 font-medium mb-1">ORDENS</div>
                    <div className="text-lg font-bold text-purple-400">
                      {resourceData.buy.length + resourceData.sell.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* All Resources Overview */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 rounded-xl p-6 backdrop-blur-sm shadow-2xl">
              <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                <Zap className="text-yellow-400" size={20} />
                Todos os Mercados
              </h3>
              <div className="space-y-3">
                {RESOURCES.map(resource => {
                  const bestSell = getBestPrice(resource.id, 'sell');
                  const data = getResourceData(resource.id);
                  const isActive = resource.id === selectedResource;
                  
                  return (
                    <div 
                      key={resource.id}
                      onClick={() => {
                        setSelectedResource(resource.id);
                        setActiveTab('orderbook');
                      }}
                      className={`flex justify-between items-center p-4 rounded-xl border transition-all duration-300 cursor-pointer hover:scale-[1.02] ${
                        isActive 
                          ? 'border-blue-400 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 shadow-lg shadow-blue-500/20' 
                          : 'border-slate-600 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{resource.icon}</span>
                        <div>
                          <div className={`font-bold ${resource.color}`}>{resource.symbol}</div>
                          <div className="text-xs text-slate-400">{resource.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        {bestSell ? (
                          <div className="text-sm font-bold text-slate-200 font-mono">{bestSell.toFixed(3)}</div>
                        ) : (
                          <div className="text-sm text-slate-500">--</div>
                        )}
                        <div className="text-xs text-slate-400">
                          {data.buy.length + data.sell.length} ordens
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Form Modal */}
      {showOrderForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end justify-center z-50">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600 rounded-t-2xl w-full max-w-md shadow-2xl animate-slide-up">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                  <Plus className="text-blue-400" size={20} />
                  Nova Ordem
                </h3>
                <button
                  onClick={() => setShowOrderForm(false)}
                  className="p-2 hover:bg-slate-700 rounded-xl transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Recurso
                  </label>
                  <select
                    value={newOrder.resource}
                    onChange={(e) => setNewOrder({...newOrder, resource: e.target.value})}
                    className="w-full p-4 bg-slate-800 border border-slate-600 rounded-xl text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    {RESOURCES.map(resource => (
                      <option key={resource.id} value={resource.id}>
                        {resource.icon} {resource.name} ({resource.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Tipo de Ordem
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setNewOrder({...newOrder, type: 'buy'})}
                      className={`p-4 rounded-xl border-2 font-bold transition-all duration-200 ${
                        newOrder.type === 'buy'
                          ? 'border-green-400 bg-green-500/20 text-green-400 shadow-lg shadow-green-500/20'
                          : 'border-slate-600 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      <TrendingUp className="mx-auto mb-1" size={20} />
                      COMPRAR
                    </button>
                    <button
                      onClick={() => setNewOrder({...newOrder, type: 'sell'})}
                      className={`p-4 rounded-xl border-2 font-bold transition-all duration-200 ${
                        newOrder.type === 'sell'
                          ? 'border-red-400 bg-red-500/20 text-red-400 shadow-lg shadow-red-500/20'
                          : 'border-slate-600 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      <TrendingDown className="mx-auto mb-1" size={20} />
                      VENDER
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Preço
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={newOrder.price}
                    onChange={(e) => setNewOrder({...newOrder, price: e.target.value})}
                    placeholder="0.000"
                    className="w-full p-4 bg-slate-800 border border-slate-600 rounded-xl text-slate-200 font-mono text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    value={newOrder.quantity}
                    onChange={(e) => setNewOrder({...newOrder, quantity: e.target.value})}
                    placeholder="0"
                    className="w-full p-4 bg-slate-800 border border-slate-600 rounded-xl text-slate-200 font-mono text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {newOrder.price && newOrder.quantity && (
                  <div className="p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm text-blue-300 font-medium">Total da Ordem</div>
                      <div className="text-xs text-blue-300">
                        {newOrder.type === 'buy' ? 'Custo' : 'Receberá'}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-400 font-mono mb-2">
                      {(parseFloat(newOrder.price) * parseInt(newOrder.quantity || 0)).toFixed(3)} RRCoin
                    </div>
                    {newOrder.type === 'buy' && (
                      <div className="text-xs text-blue-300/70">
                        Saldo após ordem: {(userBalance - (parseFloat(newOrder.price) * parseInt(newOrder.quantity || 0))).toFixed(2)} RRCoin
                      </div>
                    )}
                    {newOrder.type === 'buy' && (parseFloat(newOrder.price) * parseInt(newOrder.quantity || 0)) > userBalance && (
                      <div className="text-xs text-red-400 mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded">
                        ⚠️ Saldo insuficiente! Você precisa de mais RRCoin.
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-8">
                <button
                  onClick={handleCreateOrder}
                  disabled={!newOrder.price || !newOrder.quantity || (newOrder.type === 'buy' && (parseFloat(newOrder.price) * parseInt(newOrder.quantity || 0)) > userBalance)}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
                    newOrder.type === 'buy'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {!newOrder.price || !newOrder.quantity 
                    ? 'PREENCHA OS CAMPOS'
                    : newOrder.type === 'buy' && (parseFloat(newOrder.price) * parseInt(newOrder.quantity || 0)) > userBalance
                    ? '💰 SALDO INSUFICIENTE'
                    : newOrder.type === 'buy' 
                    ? '🚀 CRIAR ORDEM DE COMPRA' 
                    : '💥 CRIAR ORDEM DE VENDA'
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderBook;