// src/App.js
import React, { useState, useEffect } from 'react';
import { RESOURCES, INITIAL_ORDERS } from './constants/resources';
import Header from './components/Header';
import OrderBookTab from './components/OrderBookTab';
import FirebasePhoneLogin from './components/FirebasePhoneLogin';
import { updateUserData, getUserData } from './firebase/firebase';
import './globals.css';

function App() {
  // Estados de autenticação
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados do OrderBook
  const [selectedResource, setSelectedResource] = useState('gold');
  const [orders, setOrders] = useState({});
  const [userBalance, setUserBalance] = useState(0);
  const [userInventory, setUserInventory] = useState({});

  // Verificar autenticação ao carregar
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = () => {
    const savedUser = localStorage.getItem('firebaseUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
      loadUserData(userData);
    }
    setIsLoading(false);
  };

  // Carregar dados do usuário do Firebase
  const loadUserData = async (userData) => {
    try {
      // Buscar dados mais recentes do Firebase
      const result = await getUserData(userData.uid);
      
      if (result.success) {
        const freshData = result.data;
        
        // Atualizar estados com dados do Firebase
        setUserBalance(freshData.balance || 189277723.87);
        setUserInventory(freshData.inventory || {
          gold: 2500,
          oil: 1200,
          cash: 5000,
          ore: 800,
          diamond: 150,
          uranium: 75
        });
        
        // Atualizar localStorage com dados frescos
        const updatedUser = { ...userData, ...freshData };
        localStorage.setItem('firebaseUser', JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        // Usar dados do localStorage se Firebase falhar
        setUserBalance(userData.balance || 189277723.87);
        setUserInventory(userData.inventory || {
          gold: 2500,
          oil: 1200,
          cash: 5000,
          ore: 800,
          diamond: 150,
          uranium: 75
        });
      }
      
      // Carregar ordens (compartilhadas entre todos)
      const savedOrders = localStorage.getItem('rivalRegionsOrders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        setOrders(INITIAL_ORDERS);
      }
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Fallback para dados locais
      setUserBalance(userData.balance || 189277723.87);
      setUserInventory(userData.inventory || {});
    }
  };

  // Salvar dados no Firebase quando mudarem
  useEffect(() => {
    if (user && isAuthenticated && (userBalance > 0 || Object.keys(userInventory).length > 0)) {
      saveUserDataToFirebase();
    }
  }, [userBalance, userInventory]);

  const saveUserDataToFirebase = async () => {
    if (!user) return;
    
    try {
      const dataToSave = {
        balance: userBalance,
        inventory: userInventory,
        lastUpdated: new Date().toISOString()
      };
      
      await updateUserData(user.uid, dataToSave);
      
      // Atualizar localStorage também
      const updatedUser = { ...user, ...dataToSave };
      localStorage.setItem('firebaseUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
    } catch (error) {
      console.error('Erro ao salvar no Firebase:', error);
    }
  };

  // Salvar ordens (compartilhadas - localStorage)
  useEffect(() => {
    if (Object.keys(orders).length > 0) {
      localStorage.setItem('rivalRegionsOrders', JSON.stringify(orders));
    }
  }, [orders]);

  // Handles de autenticação
  const handleUserLogin = (userData) => {
    console.log('Usuário logado:', userData);
    setUser(userData);
    setIsAuthenticated(true);
    loadUserData(userData);
  };

  const handleUserLogout = () => {
    console.log('Usuário deslogado');
    setUser(null);
    setIsAuthenticated(false);
    setUserBalance(0);
    setUserInventory({});
    setOrders({});
    localStorage.removeItem('firebaseUser');
  };

  // Funções do OrderBook
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

  const getCurrentResource = () => {
    return RESOURCES.find(r => r.id === selectedResource);
  };

  // Loading state
  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center" 
        style={{ backgroundColor: '#3c3c3c' }}
      >
        <div className="text-white text-xl">
          Carregando...
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, mostrar tela de login
  if (!isAuthenticated) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4" 
        style={{ backgroundColor: '#3c3c3c' }}
      >
        <div className="max-w-md w-full">
          {/* Logo/Título */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Rival Regions Exchange
            </h1>
            <p className="text-gray-400">
              Sistema de intermediação de recursos
            </p>
          </div>

          {/* Componente de Login Firebase */}
          <FirebasePhoneLogin 
            onUserLogin={handleUserLogin}
            onUserLogout={handleUserLogout}
          />

          {/* Informações adicionais */}
          <div 
            className="mt-6 p-4 rounded border text-center"
            style={{ backgroundColor: '#2a2a2a', borderColor: '#555555' }}
          >
            <h3 className="text-white font-bold mb-2">Por que fazer login?</h3>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>🔒 Autenticação segura por SMS</li>
              <li>☁️ Dados salvos na nuvem (Firebase)</li>
              <li>📱 Acesse de qualquer dispositivo</li>
              <li>🔄 Sincronização automática</li>
              <li>📊 Histórico completo de transações</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Interface principal (usuário autenticado)
  return (
    <div className="min-h-screen text-gray-100" style={{ backgroundColor: '#3c3c3c' }}>
      {/* Header com info do usuário */}
      <div 
        className="border-b-2 p-4"
        style={{ backgroundColor: '#2a2a2a', borderColor: '#555555' }}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">
            Rival Regions Exchange
          </h1>
          
          {/* Info do usuário logado */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-white text-sm font-bold">
                {user.displayName}
              </div>
              <div className="text-gray-400 text-xs">
                {user.phoneNumber}
              </div>
            </div>
            
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#22c55e' }}
            >
              <span className="text-white text-sm font-bold">
                {user.displayName?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            
            <button
              onClick={handleUserLogout}
              className="text-red-400 hover:text-red-300 text-xs font-bold uppercase"
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Header do OrderBook */}
      <Header 
        currentResource={getCurrentResource()}
        userBalance={userBalance}
        selectedResource={selectedResource}
        setSelectedResource={setSelectedResource}
        orders={orders}
        getBestPrice={getBestPrice}
      />

      {/* Conteúdo principal */}
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
}

export default App;