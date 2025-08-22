// --- Módulo PWA para Calculadora de Genética Mendeliana ---

class PWAManager {
  constructor() {
    this.deferredPrompt = null;
    this.installButton = null;
    this.isInstalled = false;
    this.init();
  }

  init() {
    this.registerServiceWorker();
    this.setupInstallPrompt();
    this.checkInstallationStatus();
    this.setupOfflineDetection();
  }

  // Registra o Service Worker
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('✅ Service Worker registrado:', registration);
        
        // Atualização do Service Worker
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.showUpdateNotification();
            }
          });
        });
      } catch (error) {
        console.error('❌ Erro ao registrar Service Worker:', error);
      }
    }
  }

  // Configura o prompt de instalação
  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('📱 Prompt de instalação disponível');
      // Não previne o comportamento padrão imediatamente
      this.deferredPrompt = e;
      // Aguarda um pouco antes de mostrar o botão
      setTimeout(() => {
        this.showInstallButton();
      }, 2000);
    });

    window.addEventListener('appinstalled', () => {
      console.log('✅ App instalado com sucesso');
      this.isInstalled = true;
      this.hideInstallButton();
      this.showInstallationSuccess();
      this.deferredPrompt = null;
    });
  }

  // Verifica se o app já está instalado
  checkInstallationStatus() {
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
      this.isInstalled = true;
      this.hideInstallButton();
    }
  }

  // Configura detecção de conexão offline
  setupOfflineDetection() {
    window.addEventListener('online', () => {
      this.showOnlineStatus();
    });

    window.addEventListener('offline', () => {
      this.showOfflineStatus();
    });
  }

  // Mostra botão de instalação
  showInstallButton() {
    if (this.isInstalled || !this.deferredPrompt) return;

    // Cria o botão de instalação se não existir
    if (!this.installButton) {
      this.installButton = this.createInstallButton();
      document.body.appendChild(this.installButton);
    }

    this.installButton.style.display = 'block';
  }

  // Esconde botão de instalação
  hideInstallButton() {
    if (this.installButton) {
      this.installButton.style.display = 'none';
    }
  }

  // Cria botão de instalação
  createInstallButton() {
    const button = document.createElement('div');
    button.innerHTML = `
      <div id="install-prompt" class="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <img src="/assets/logo.png" alt="Logo" class="w-8 h-8" />
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-sm">Instalar App</h3>
            <p class="text-xs opacity-90">Acesse rapidamente a calculadora de genética</p>
          </div>
          <div class="flex space-x-2">
            <button id="install-btn" class="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 transition-colors">
              Instalar
            </button>
            <button id="dismiss-btn" class="text-white opacity-70 hover:opacity-100 transition-opacity">
              ✕
            </button>
          </div>
        </div>
      </div>
    `;

    // Event listeners
    button.querySelector('#install-btn').addEventListener('click', () => {
      this.installApp();
    });

    button.querySelector('#dismiss-btn').addEventListener('click', () => {
      this.hideInstallButton();
    });

    return button;
  }

  // Instala o app
  async installApp() {
    if (!this.deferredPrompt) return;

    // Previne o comportamento padrão apenas quando o usuário clica
    this.deferredPrompt.preventDefault();
    
    try {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('✅ Usuário aceitou a instalação');
      } else {
        console.log('❌ Usuário recusou a instalação');
      }
    } catch (error) {
      console.error('❌ Erro durante a instalação:', error);
    }

    this.deferredPrompt = null;
    this.hideInstallButton();
  }

  // Mostra notificação de sucesso na instalação
  showInstallationSuccess() {
    this.showNotification('🎉 App instalado com sucesso!', 'Agora você pode acessar a calculadora diretamente do seu dispositivo.');
  }

  // Mostra notificação de atualização
  showUpdateNotification() {
    this.showNotification('🔄 Nova versão disponível', 'Clique para atualizar o app.');
  }

  // Mostra status online
  showOnlineStatus() {
    this.showNotification('🌐 Conectado', 'Conexão com a internet restaurada.');
  }

  // Mostra status offline
  showOfflineStatus() {
    this.showNotification('📱 Modo Offline', 'Algumas funcionalidades podem estar limitadas.');
  }

  // Mostra notificação
  showNotification(title, message) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/assets/logo.png',
        badge: '/assets/logo.png'
      });
    } else {
      // Fallback para notificação visual
      this.showToastNotification(title, message);
    }
  }

  // Mostra notificação toast
  showToastNotification(title, message) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm transform transition-all duration-300 translate-x-full';
    toast.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0">
          <img src="/assets/logo.png" alt="Logo" class="w-6 h-6" />
        </div>
        <div class="flex-1">
          <h3 class="font-semibold text-sm">${title}</h3>
          <p class="text-xs opacity-90">${message}</p>
        </div>
        <button class="text-white opacity-70 hover:opacity-100 transition-opacity" onclick="this.parentElement.parentElement.remove()">
          ✕
        </button>
      </div>
    `;

    document.body.appendChild(toast);
    
    // Anima entrada
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
    }, 100);

    // Remove automaticamente após 5 segundos
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => {
        if (toast.parentElement) {
          toast.remove();
        }
      }, 300);
    }, 5000);
  }

  // Solicita permissão para notificações
  async requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('✅ Permissão de notificação concedida');
      }
    }
  }

  // Verifica se está em modo standalone (app instalado)
  isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches || 
           window.navigator.standalone === true;
  }

  // Verifica se está offline
  isOffline() {
    return !navigator.onLine;
  }
}

// Inicializa o PWA Manager
const pwaManager = new PWAManager();

// Exporta para uso em outros módulos
export default pwaManager;
