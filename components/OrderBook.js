'use client';

import React, { useState, useEffect } from 'react';
import { RESOURCES, INITIAL_ORDERS, INITIAL_BALANCE } from '../constants/resources';
import Header from './Header';
import OrderBookTab from './OrderBookTab';

const OrderBook = () => {
  // Estados principais
  const [selectedResource, setSelectedResource] = useState('gold');
  const [orders, setOrders] = useState({});
  const [userBalance, setUserBalance] = useState(0);
  const [userInventory, setUserInventory] = useState({});
  
  // Inicialização dos dados
  useEffect(() => {
    loadDataFromStorage();
  }, []);

  // Salvar dados automaticamente
  useEffect(() => {
    if (Object.keys(orders).length > 0) {
      localStorage.setItem('rivalRegionsOrders', JSON.stringify(orders));
    }
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('rivalRegionsBalance', userBalance.toString());
  }, [userBalance]);

  useEffect(() => {
    if (Object.keys(userInventory).length > 0) {
      localStorage.setItem('rivalRegionsInventory', JSON.stringify(userInventory));
    }
  }, [userInventory]);

  // Carregar dados do localStorage
  const loadDataFromStorage = () => {
    // Carregar saldo
    const savedBalance = localStorage.getItem('rivalRegionsBalance');
    if (savedBalance) {
      setUserBalance(parseFloat(savedBalance));
    } else {
      setUserBalance(INITIAL_BALANCE);
    }

    // Carregar inventário
    const savedInventory = localStorage.getItem('rivalRegionsInventory');
    if (savedInventory) {
      setUserInventory(JSON.parse(savedInventory));
    } else {
      const initialInventory = {
        gold: 2500,
        oil: 1200,
        cash: 5000,
        ore: 800,
        diamond: 150,
        uranium: 75
      };
      setUserInventory(initialInventory);
    }

    // Carregar ordens
    const savedOrders = localStorage.getItem('rivalRegionsOrders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      setOrders(INITIAL_ORDERS);
    }
  };

  // Obter dados de um recurso específico
  const getResourceData = (resourceId) => {
    return orders[resourceId] || { buy: [], sell: [] };
  };

  // Obter melhor preço de compra ou venda
  const getBestPrice = (resourceId, type) => {
    const data = getResourceData(resourceId);
    if (data[type].length === 0) return null;
    return data[type][0].price;
  };

  // Calcular spread entre compra e venda
  const getSpread = (resourceId) => {
    const bestBuy = getBestPrice(resourceId, 'buy');
    const bestSell = getBestPrice(resourceId, 'sell');
    if (!bestBuy || !bestSell) return null;
    return ((bestSell - bestBuy) / bestBuy * 100).toFixed(2);
  };

  // Obter recurso atual selecionado
  const getCurrentResource = () => {
    return RESOURCES.find(r => r.id === selectedResource);
  };

  return (
    <div className="min-h-screen text-gray-100" style={{ backgroundColor: '#3c3c3c' }}>
      {/* Header com navegação */}
      <Header 
        currentResource={getCurrentResource()}
        userBalance={userBalance}
        selectedResource={selectedResource}
        setSelectedResource={setSelectedResource}
        orders={orders}
        getBestPrice={getBestPrice}
      />

      {/* Conteúdo principal - sempre OrderBook */}
      <div className="p-4">
        <OrderBookTab 
          selectedResource={selectedResource}
          currentResource={getCurrentResource()}
          userBalance={userBalance}
          setUserBalance={setUserBalance}
          orders={orders}
          getResourceData={getResourceData}
          getBestPrice={getBestPrice}
          getSpread={getSpread}
          userInventory={userInventory}
          setUserInventory={setUserInventory}
        />
      </div>
    </div>
  );
};

export default OrderBook;