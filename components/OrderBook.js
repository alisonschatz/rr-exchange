'use client';

import React, { useState, useEffect } from 'react';
import { RESOURCES, INITIAL_ORDERS, INITIAL_BALANCE } from '../constants/resources';
import Header from './Header';
import OrderForm from './OrderForm';
import OrderBookTab from './OrderBookTab';
import InventoryTab from './InventoryTab';

const OrderBook = () => {
  // Estados principais
  const [selectedResource, setSelectedResource] = useState('gold');
  const [orders, setOrders] = useState({});
  const [userBalance, setUserBalance] = useState(0);
  const [userInventory, setUserInventory] = useState({});
  const [activeTab, setActiveTab] = useState('orderbook');
  const [showOrderForm, setShowOrderForm] = useState(false);
  
  // Estado do formulário
  const [newOrder, setNewOrder] = useState({
    type: 'buy',
    price: '',
    quantity: '',
    resource: 'gold'
  });

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

  // Validar se pode criar ordem
  const canCreateOrder = () => {
    if (!newOrder.price || !newOrder.quantity) return false;

    const orderTotal = parseFloat(newOrder.price) * parseInt(newOrder.quantity);
    const quantity = parseInt(newOrder.quantity);

    if (newOrder.type === 'buy') {
      return orderTotal <= userBalance;
    } else {
      return quantity <= (userInventory[newOrder.resource] || 0);
    }
  };

  // Criar nova ordem
  const handleCreateOrder = () => {
    if (!newOrder.price || !newOrder.quantity) {
      alert('Preencha todos os campos!');
      return;
    }

    const orderTotal = parseFloat(newOrder.price) * parseInt(newOrder.quantity);
    const quantity = parseInt(newOrder.quantity);

    // Validações
    if (newOrder.type === 'buy' && orderTotal > userBalance) {
      alert(`Saldo insuficiente! Você tem ${userBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} $ mas precisa de ${orderTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} $`);
      return;
    }

    if (newOrder.type === 'sell') {
      const available = userInventory[newOrder.resource] || 0;
      if (quantity > available) {
        alert(`Recursos insuficientes! Você tem ${available.toLocaleString()} ${newOrder.resource.toUpperCase()} mas precisa de ${quantity.toLocaleString()}`);
        return;
      }
    }

    // Criar ordem
    const order = {
      id: Date.now(),
      price: parseFloat(newOrder.price),
      quantity: quantity,
      total: orderTotal,
      user: `Player${Math.floor(Math.random() * 1000)}`
    };

    // Adicionar ordem ao book
    setOrders(prev => {
      const updated = { ...prev };
      
      if (!updated[newOrder.resource]) {
        updated[newOrder.resource] = { buy: [], sell: [] };
      }
      
      updated[newOrder.resource][newOrder.type].push(order);
      
      // Ordenar ordens
      if (newOrder.type === 'buy') {
        updated[newOrder.resource].buy.sort((a, b) => b.price - a.price);
      } else {
        updated[newOrder.resource].sell.sort((a, b) => a.price - b.price);
      }
      
      return updated;
    });

    // Atualizar saldo e inventário
    if (newOrder.type === 'buy') {
      // Compra: reduzir dinheiro, aumentar recursos
      setUserBalance(prev => prev - orderTotal);
      setUserInventory(prev => ({
        ...prev,
        [newOrder.resource]: (prev[newOrder.resource] || 0) + quantity
      }));
    } else {
      // Venda: aumentar dinheiro, reduzir recursos
      setUserBalance(prev => prev + orderTotal);
      setUserInventory(prev => ({
        ...prev,
        [newOrder.resource]: (prev[newOrder.resource] || 0) - quantity
      }));
    }

    // Limpar formulário
    setNewOrder({
      type: 'buy',
      price: '',
      quantity: '',
      resource: selectedResource
    });
    setShowOrderForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header com navegação */}
      <Header 
        currentResource={getCurrentResource()}
        userBalance={userBalance}
        selectedResource={selectedResource}
        setSelectedResource={setSelectedResource}
        orders={orders}
        getBestPrice={getBestPrice}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Conteúdo principal */}
      <div className="p-4">
        {activeTab === 'orderbook' && (
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
        )}

        {activeTab === 'summary' && (
          <InventoryTab 
            userInventory={userInventory}
            setUserInventory={setUserInventory}
            selectedResource={selectedResource}
            setSelectedResource={setSelectedResource}
            setActiveTab={setActiveTab}
            getBestPrice={getBestPrice}
          />
        )}
      </div>

      {/* Modal de criação de ordem */}
      <OrderForm 
        showOrderForm={showOrderForm}
        setShowOrderForm={setShowOrderForm}
        newOrder={newOrder}
        setNewOrder={setNewOrder}
        handleCreateOrder={handleCreateOrder}
        getBestPrice={getBestPrice}
        userBalance={userBalance}
        userInventory={userInventory}
      />
    </div>
  );
};

export default OrderBook;