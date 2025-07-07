'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';
import { RESOURCES, INITIAL_ORDERS, INITIAL_BALANCE } from '../constants/resources';
import Header from './Header';
import OrderForm from './OrderForm';
import OrderBookTab from './OrderBookTab';
import MarketTab from './MarketTab';

const OrderBookMain = () => {
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
      setUserBalance(INITIAL_BALANCE);
      localStorage.setItem('rivalRegionsBalance', INITIAL_BALANCE.toString());
    }
    
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      setOrders(INITIAL_ORDERS);
      localStorage.setItem('rivalRegionsOrders', JSON.stringify(INITIAL_ORDERS));
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
      alert(`Saldo insuficiente! Você possui ${userBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} $, mas precisa de ${orderTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} $ para esta ordem.`);
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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header 
        currentResource={currentResource}
        userBalance={userBalance}
        showResourceSelector={showResourceSelector}
        setShowResourceSelector={setShowResourceSelector}
        setShowOrderForm={setShowOrderForm}
        selectedResource={selectedResource}
        setSelectedResource={setSelectedResource}
        orders={orders}
        getBestPrice={getBestPrice}
        getSpread={getSpread}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content */}
      <div className="p-4">
        {activeTab === 'orderbook' && (
          <OrderBookTab 
            selectedResource={selectedResource}
            currentResource={currentResource}
            userBalance={userBalance}
            setUserBalance={setUserBalance}
            orders={orders}
            getResourceData={getResourceData}
            getBestPrice={getBestPrice}
            getSpread={getSpread}
          />
        )}

        {activeTab === 'summary' && (
          <MarketTab 
            selectedResource={selectedResource}
            setSelectedResource={setSelectedResource}
            setActiveTab={setActiveTab}
            orders={orders}
            getResourceData={getResourceData}
            getBestPrice={getBestPrice}
          />
        )}
      </div>

      <OrderForm 
        showOrderForm={showOrderForm}
        setShowOrderForm={setShowOrderForm}
        newOrder={newOrder}
        setNewOrder={setNewOrder}
        handleCreateOrder={handleCreateOrder}
        getBestPrice={getBestPrice}
        userBalance={userBalance}
      />
    </div>
  );
};

export default OrderBookMain;