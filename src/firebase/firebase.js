// src/firebase/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

// ⚠️ IMPORTANTE: Substitua pelas suas configurações do Firebase Console
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "SEU_PROJECT_ID.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_PROJECT_ID.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth
export const auth = getAuth(app);

// Inicializar Firestore
export const db = getFirestore(app);

// Configurar reCAPTCHA
export const setupRecaptcha = (phoneNumber) => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
        console.log('reCAPTCHA resolvido');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expirado');
      }
    });
  }
  return window.recaptchaVerifier;
};

// Enviar código SMS
export const sendSMSCode = async (phoneNumber) => {
  try {
    const recaptcha = setupRecaptcha(phoneNumber);
    const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptcha);
    return { success: true, confirmation };
  } catch (error) {
    console.error('Erro ao enviar SMS:', error);
    return { success: false, error: error.message };
  }
};

// Verificar código SMS
export const verifySMSCode = async (confirmation, code) => {
  try {
    const result = await confirmation.confirm(code);
    return { success: true, user: result.user };
  } catch (error) {
    console.error('Erro ao verificar código:', error);
    return { success: false, error: error.message };
  }
};

// Logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    return { success: false, error: error.message };
  }
};

// Salvar dados do usuário no Firestore
export const saveUserData = async (userId, userData) => {
  try {
    await setDoc(doc(db, 'users', userId), userData, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    return { success: false, error: error.message };
  }
};

// Buscar dados do usuário
export const getUserData = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: false, error: 'Usuário não encontrado' };
    }
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return { success: false, error: error.message };
  }
};

// Atualizar dados do usuário
export const updateUserData = async (userId, userData) => {
  try {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, userData);
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar dados:', error);
    return { success: false, error: error.message };
  }
};