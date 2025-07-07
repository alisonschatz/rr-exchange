// src/components/FirebasePhoneLogin.js
import React, { useState, useEffect } from 'react';
import { Phone, Shield, LogOut, User, Edit3 } from 'lucide-react';
import { sendSMSCode, verifySMSCode, logoutUser, saveUserData, getUserData } from '../firebase/firebase';

const FirebasePhoneLogin = ({ onUserLogin, onUserLogout }) => {
  const [user, setUser] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [step, setStep] = useState('phone'); // 'phone', 'verification', 'profile'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState({
    displayName: '',
    telegramUsername: '',
    country: 'BR'
  });

  useEffect(() => {
    // Verificar se usuário já está logado
    const savedUser = localStorage.getItem('firebaseUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      onUserLogin && onUserLogin(userData);
    }
  }, [onUserLogin]);

  const formatPhoneNumber = (value) => {
    // Remover caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    
    // Formatar para padrão brasileiro
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const getInternationalPhone = (phone) => {
    // Converter para formato internacional
    const numbers = phone.replace(/\D/g, '');
    
    // Se começa com 55 (Brasil), manter
    if (numbers.startsWith('55')) {
      return `+${numbers}`;
    }
    
    // Se não, adicionar código do Brasil
    return `+55${numbers}`;
  };

  const handleSendCode = async () => {
    if (!phoneNumber.trim()) {
      setError('Digite um número de telefone válido');
      return;
    }

    setIsLoading(true);
    setError('');

    const internationalPhone = getInternationalPhone(phoneNumber);
    const result = await sendSMSCode(internationalPhone);

    if (result.success) {
      setConfirmation(result.confirmation);
      setStep('verification');
      setError('');
    } else {
      setError(result.error || 'Erro ao enviar código SMS');
    }

    setIsLoading(false);
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setError('Digite o código de verificação');
      return;
    }

    setIsLoading(true);
    setError('');

    const result = await verifySMSCode(confirmation, verificationCode);

    if (result.success) {
      const firebaseUser = result.user;
      
      // Verificar se usuário já tem perfil
      const userData = await getUserData(firebaseUser.uid);
      
      if (userData.success) {
        // Usuário existente
        const completeUserData = {
          uid: firebaseUser.uid,
          phoneNumber: firebaseUser.phoneNumber,
          ...userData.data,
          lastLogin: new Date().toISOString()
        };
        
        // Atualizar último login
        await saveUserData(firebaseUser.uid, { lastLogin: completeUserData.lastLogin });
        
        localStorage.setItem('firebaseUser', JSON.stringify(completeUserData));
        setUser(completeUserData);
        onUserLogin && onUserLogin(completeUserData);
        setStep('phone');
      } else {
        // Novo usuário - precisa completar perfil
        setStep('profile');
      }
    } else {
      setError(result.error || 'Código de verificação inválido');
    }

    setIsLoading(false);
  };

  const handleCompleteProfile = async () => {
    if (!userProfile.displayName.trim()) {
      setError('Digite seu nome');
      return;
    }

    setIsLoading(true);
    setError('');

    const completeUserData = {
      uid: confirmation.user?.uid,
      phoneNumber: confirmation.user?.phoneNumber,
      displayName: userProfile.displayName,
      telegramUsername: userProfile.telegramUsername,
      country: userProfile.country,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      balance: 189277723.87, // Saldo inicial
      inventory: {
        gold: 2500,
        oil: 1200,
        cash: 5000,
        ore: 800,
        diamond: 150,
        uranium: 75
      }
    };

    const result = await saveUserData(completeUserData.uid, completeUserData);

    if (result.success) {
      localStorage.setItem('firebaseUser', JSON.stringify(completeUserData));
      setUser(completeUserData);
      onUserLogin && onUserLogin(completeUserData);
      setStep('phone');
      
      // Reset form
      setPhoneNumber('');
      setVerificationCode('');
      setUserProfile({ displayName: '', telegramUsername: '', country: 'BR' });
    } else {
      setError(result.error || 'Erro ao salvar perfil');
    }

    setIsLoading(false);
  };

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      localStorage.removeItem('firebaseUser');
      setUser(null);
      setStep('phone');
      setPhoneNumber('');
      setVerificationCode('');
      setConfirmation(null);
      onUserLogout && onUserLogout();
    }
  };

  const resetForm = () => {
    setStep('phone');
    setPhoneNumber('');
    setVerificationCode('');
    setConfirmation(null);
    setError('');
  };

  if (user) {
    // Usuário logado
    return (
      <div 
        className="p-4 rounded border"
        style={{ backgroundColor: '#2a2a2a', borderColor: '#555555' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#22c55e' }}
            >
              <User size={20} className="text-white" />
            </div>
            
            <div>
              <div className="text-white font-bold">
                {user.displayName}
              </div>
              <div className="text-gray-400 text-sm">
                {user.phoneNumber}
              </div>
              {user.telegramUsername && (
                <div className="text-blue-300 text-xs">
                  @{user.telegramUsername}
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1 rounded text-sm font-bold uppercase transition-colors"
            style={{ 
              backgroundColor: '#dc2626', 
              color: 'white' 
            }}
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div 
            className="p-2 rounded text-center"
            style={{ backgroundColor: '#333333' }}
          >
            <div className="text-gray-400">Saldo</div>
            <div className="text-green-400 font-bold">
              {user.balance?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} $
            </div>
          </div>
          <div 
            className="p-2 rounded text-center"
            style={{ backgroundColor: '#333333' }}
          >
            <div className="text-gray-400">Membro desde</div>
            <div className="text-blue-400 font-bold">
              {new Date(user.createdAt).toLocaleDateString('pt-BR')}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Container reCAPTCHA (invisível) */}
      <div id="recaptcha-container"></div>

      {error && (
        <div 
          className="p-3 rounded border text-red-400 text-sm"
          style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            borderColor: '#ef4444' 
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {step === 'phone' && (
        <div 
          className="p-6 rounded border"
          style={{ backgroundColor: '#2a2a2a', borderColor: '#555555' }}
        >
          <h3 className="text-white font-bold mb-4 flex items-center gap-2 uppercase">
            <Phone size={18} />
            Login com Telefone
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2 font-bold uppercase">
                Número de Telefone
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                placeholder="(11) 99999-9999"
                maxLength={15}
                className="w-full p-3 rounded border text-white text-lg text-center font-mono"
                style={{ 
                  backgroundColor: '#333333', 
                  borderColor: '#555555' 
                }}
              />
              <div className="text-xs text-gray-400 mt-1">
                📱 Digite seu número com DDD (Brasil)
              </div>
            </div>
            
            <button
              onClick={handleSendCode}
              disabled={isLoading || !phoneNumber.trim()}
              className="w-full py-3 px-4 rounded font-bold uppercase transition-colors"
              style={{ 
                backgroundColor: (isLoading || !phoneNumber.trim()) ? '#6b7280' : '#22c55e',
                color: 'white'
              }}
            >
              {isLoading ? 'Enviando...' : 'Enviar Código SMS'}
            </button>
          </div>
        </div>
      )}

      {step === 'verification' && (
        <div 
          className="p-6 rounded border"
          style={{ backgroundColor: '#2a2a2a', borderColor: '#555555' }}
        >
          <h3 className="text-white font-bold mb-4 flex items-center gap-2 uppercase">
            <Shield size={18} />
            Verificação SMS
          </h3>
          
          <div className="space-y-4">
            <div className="text-gray-300 text-sm text-center">
              Enviamos um código de 6 dígitos para:
              <div className="text-white font-bold mt-1">
                {getInternationalPhone(phoneNumber)}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm mb-2 font-bold uppercase">
                Código de Verificação
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
                placeholder="123456"
                maxLength={6}
                className="w-full p-3 rounded border text-white text-xl text-center font-mono tracking-widest"
                style={{ 
                  backgroundColor: '#333333', 
                  borderColor: '#555555' 
                }}
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleVerifyCode}
                disabled={isLoading || verificationCode.length !== 6}
                className="flex-1 py-3 px-4 rounded font-bold uppercase transition-colors"
                style={{ 
                  backgroundColor: (isLoading || verificationCode.length !== 6) ? '#6b7280' : '#22c55e',
                  color: 'white'
                }}
              >
                {isLoading ? 'Verificando...' : 'Verificar Código'}
              </button>
              
              <button
                onClick={resetForm}
                className="py-3 px-4 rounded font-bold uppercase transition-colors"
                style={{ 
                  backgroundColor: '#6b7280', 
                  color: 'white' 
                }}
              >
                Voltar
              </button>
            </div>
            
            <div className="text-xs text-gray-400 text-center">
              Não recebeu o código? Aguarde 60 segundos e tente novamente
            </div>
          </div>
        </div>
      )}

      {step === 'profile' && (
        <div 
          className="p-6 rounded border"
          style={{ backgroundColor: '#2a2a2a', borderColor: '#555555' }}
        >
          <h3 className="text-white font-bold mb-4 flex items-center gap-2 uppercase">
            <Edit3 size={18} />
            Complete seu Perfil
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2 font-bold uppercase">
                Nome de Exibição *
              </label>
              <input
                type="text"
                value={userProfile.displayName}
                onChange={(e) => setUserProfile({...userProfile, displayName: e.target.value})}
                placeholder="Seu nome ou apelido"
                className="w-full p-3 rounded border text-white"
                style={{ 
                  backgroundColor: '#333333', 
                  borderColor: '#555555' 
                }}
              />
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm mb-2 font-bold uppercase">
                Username do Telegram (opcional)
              </label>
              <input
                type="text"
                value={userProfile.telegramUsername}
                onChange={(e) => setUserProfile({...userProfile, telegramUsername: e.target.value.replace('@', '')})}
                placeholder="seuusername"
                className="w-full p-3 rounded border text-white"
                style={{ 
                  backgroundColor: '#333333', 
                  borderColor: '#555555' 
                }}
              />
              <div className="text-xs text-gray-400 mt-1">
                💬 Para conectar com outros jogadores
              </div>
            </div>
            
            <button
              onClick={handleCompleteProfile}
              disabled={isLoading || !userProfile.displayName.trim()}
              className="w-full py-3 px-4 rounded font-bold uppercase transition-colors"
              style={{ 
                backgroundColor: (isLoading || !userProfile.displayName.trim()) ? '#6b7280' : '#22c55e',
                color: 'white'
              }}
            >
              {isLoading ? 'Salvando...' : 'Criar Conta'}
            </button>
          </div>
        </div>
      )}

      {/* Informações sobre segurança */}
      <div 
        className="p-4 rounded border text-center"
        style={{ backgroundColor: '#2a2a2a', borderColor: '#555555' }}
      >
        <div className="text-xs text-gray-400 space-y-1">
          <div>🔒 Autenticação segura via Firebase</div>
          <div>📱 Verificação por SMS</div>
          <div>☁️ Dados sincronizados na nuvem</div>
          <div>🌍 Acesse de qualquer dispositivo</div>
        </div>
      </div>
    </div>
  );
};

export default FirebasePhoneLogin;