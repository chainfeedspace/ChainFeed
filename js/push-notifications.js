// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCK2nGF_13fJd9pAxSPMQVm67vfg7LcK3Q",
  authDomain: "chainfeed-6db29.firebaseapp.com",
  projectId: "chainfeed-6db29",
  storageBucket: "chainfeed-6db29.firebasestorage.app",
  messagingSenderId: "41766284566",
  appId: "1:41766284566:web:c0ed747e10c3cf69bfb437"
};

// VAPID Key
const VAPID_KEY = "BDj-HEwmigjC8IQQg9edo7KebLwo3eu5EsPXs9mALpOVVnksqzPOLsudqHxcFG5zToqOiLajYkiWn1vCkuiEiv8";

class PushNotificationManager {
  constructor() {
    this.messaging = null;
    this.isSupported = 'Notification' in window && 'serviceWorker' in navigator;
  }

  async init() {
    if (!this.isSupported) {
      console.warn('⚠️ Push notifications no soportadas en este navegador');
      return false;
    }

    try {
      // Importar Firebase dinámicamente
      const firebaseApp = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
      const firebaseMessaging = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js');

      // Inicializar Firebase
      const app = firebaseApp.initializeApp(firebaseConfig);
      this.messaging = firebaseMessaging.getMessaging(app);

      // Escuchar mensajes cuando la app está abierta
      firebaseMessaging.onMessage(this.messaging, (payload) => {
        console.log('📩 Mensaje recibido (app abierta):', payload);
        this.mostrarNotificacion(payload);
      });

      return true;
    } catch (error) {
      console.error('❌ Error inicializando Firebase:', error);
      return false;
    }
  }

  async requestPermission() {
    if (!this.isSupported) {
      console.log('❌ Notificaciones no soportadas');
      return false;
    }

    try {
      console.log('🔔 Solicitando permisos de notificación...');
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('✅ Permiso de notificaciones concedido');
        const token = await this.getToken();
        
        if (token) {
          console.log('✅ Token obtenido y guardado');
          return true;
        } else {
          console.error('❌ No se pudo obtener token');
          return false;
        }
      } else {
        console.log('❌ Permiso de notificaciones denegado');
        return false;
      }
    } catch (error) {
      console.error('❌ Error solicitando permiso:', error);
      return false;
    }
  }

  async getToken() {
    if (!this.messaging) {
      const initialized = await this.init();
      if (!initialized) {
        console.error('❌ No se pudo inicializar Firebase');
        return null;
      }
    }

    try {
      const firebaseMessaging = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js');
      
      // Registrar service worker específico de Firebase
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      await navigator.serviceWorker.ready; // Esperar a que esté listo
      
      const token = await firebaseMessaging.getToken(this.messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration
      });

      if (token) {
        console.log('🔑 Token FCM obtenido:', token);
        const saved = await this.saveToken(token);
        return saved ? token : null;
      } else {
        console.log('⚠️ No se pudo obtener token');
        return null;
      }
    } catch (error) {
      console.error('❌ Error obteniendo token:', error);
      return null;
    }
  }

  async saveToken(token) {
    try {
      const response = await fetch('/api/push-subscribe.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          token: token,
          device_type: 'web'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Token guardado en el servidor');
        localStorage.setItem('fcm_token', token);
        localStorage.removeItem('push_notifications_disabled');
        
        // 🔥 GUARDAR EN BD TAMBIÉN
        await saveNotificationStateToDB(true, token);
        
        return true;
      } else {
        console.error('❌ Error guardando token:', data.error);
        return false;
      }
    } catch (error) {
      console.error('❌ Error en saveToken:', error);
      return false;
    }
  }

  mostrarNotificacion(payload) {
    const title = payload.notification?.title || 'ChainFeed';
    const options = {
      body: payload.notification?.body || '',
      icon: '/icons/pwa-192.png',
      badge: '/icons/pwa-72.png',
      tag: payload.data?.type || 'general',
      data: payload.data || {},
      requireInteraction: false
    };

    if (payload.notification?.image) {
      options.image = payload.notification.image;
    }

    if (Notification.permission === 'granted') {
      new Notification(title, options);
    }
  }

  getPermissionStatus() {
    if (!this.isSupported) {
      return 'not-supported';
    }
    return Notification.permission;
  }

  async disableNotifications() {
    if (!this.isSupported) {
      console.log('❌ Notificaciones no soportadas');
      return false;
    }

    try {
      console.log('🔕 Desactivando notificaciones...');
      const token = localStorage.getItem('fcm_token');
      
      if (!token) {
        console.warn('⚠️ No hay token para eliminar');
      }
      
      // Eliminar del servidor
      const response = await fetch('/api/push-unsubscribe.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          token: token
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Limpiar localStorage
        localStorage.removeItem('fcm_token');
        localStorage.setItem('push_notifications_disabled', 'true');
        
        // 🔥 GUARDAR EN BD TAMBIÉN
        await saveNotificationStateToDB(false, null);
        
        // 🔥 NO DESREGISTRAR EL SERVICE WORKER - solo limpiar token
        // Esto permite reactivar notificaciones sin problemas
        
        console.log('✅ Notificaciones desactivadas correctamente');
        return true;
      } else {
        console.error('❌ Error desactivando notificaciones:', data.error);
        return false;
      }
    } catch (error) {
      console.error('❌ Error en disableNotifications:', error);
      return false;
    }
  }

  async checkSubscriptionStatus() {
    const token = localStorage.getItem('fcm_token');
    const permission = Notification.permission;
    
    return {
      hasToken: !!token,
      permission: permission,
      isActive: permission === 'granted' && !!token
    };
  }
}

// ============================================
// 🔥 FUNCIONES PARA SINCRONIZACIÓN CON BD
// ============================================

/**
 * Guardar estado en BD
 */
async function saveNotificationStateToDB(enabled, token = null) {
  try {
    console.log(`💾 Guardando estado en BD - Enabled: ${enabled}, Token: ${token ? 'SI' : 'NO'}`);
    
    const response = await fetch('/php/actualizar_notificaciones.php', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        enabled: enabled,
        fcm_token: token
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Estado guardado en BD exitosamente');
      return true;
    } else {
      console.error('❌ Error guardando estado en BD:', data.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Error en saveNotificationStateToDB:', error);
    return false;
  }
}

/**
 * Cargar estado desde BD
 */
async function loadNotificationStateFromDB() {
  try {
    console.log('🔍 Cargando estado desde BD...');
    
    const response = await fetch('/php/obtener_perfil.php', {
      method: 'GET',
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success) {
      const pushEnabled = data.profile.push_notifications_enabled || false;
      const fcmToken = data.profile.fcm_token || null;
      
      console.log(`📊 Estado desde BD - Enabled: ${pushEnabled}, Token: ${fcmToken ? 'SI' : 'NO'}`);
      
      // Sincronizar con localStorage
      if (pushEnabled && fcmToken) {
        localStorage.setItem('fcm_token', fcmToken);
        localStorage.removeItem('push_notifications_disabled');
        console.log('✅ localStorage sincronizado: ACTIVADO');
      } else {
        localStorage.removeItem('fcm_token');
        localStorage.setItem('push_notifications_disabled', 'true');
        console.log('✅ localStorage sincronizado: DESACTIVADO');
      }
      
      return {
        enabled: pushEnabled,
        token: fcmToken
      };
    }
    
    console.warn('⚠️ No se pudo obtener estado desde BD');
    return { enabled: false, token: null };
    
  } catch (error) {
    console.error('❌ Error en loadNotificationStateFromDB:', error);
    return { enabled: false, token: null };
  }
}

// Exponer funciones globalmente
window.saveNotificationStateToDB = saveNotificationStateToDB;
window.loadNotificationStateFromDB = loadNotificationStateFromDB;

// Instancia global
window.pushManager = new PushNotificationManager();

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.pushManager.init();
  });
} else {
  window.pushManager.init();
}