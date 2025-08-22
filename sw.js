// Service Worker para Calculadora de Genética Mendeliana
const CACHE_NAME = 'genetica-mendel-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/style.css',
  '/assets/js/app.js',
  '/assets/js/validation.js',
  '/assets/js/genetics.js',
  '/assets/js/ui.js',
  '/assets/logo.svg',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('🧬 Service Worker instalado');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('❌ Erro ao instalar cache:', error);
      })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker ativado');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retorna o cache se disponível
        if (response) {
          return response;
        }

        // Se não estiver em cache, busca na rede
        return fetch(event.request)
          .then((response) => {
            // Verifica se a resposta é válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clona a resposta para cache
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Fallback para páginas HTML
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Sincronização em background
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('🔄 Sincronização em background');
    event.waitUntil(doBackgroundSync());
  }
});

// Notificações push
self.addEventListener('push', (event) => {
  const options = {
    body: 'Nova funcionalidade disponível na Calculadora de Genética!',
    icon: '/assets/logo.svg',
    badge: '/assets/logo.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explorar',
        icon: '/assets/logo.svg'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/assets/logo.svg'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('🧬 Genética Mendel', options)
  );
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Função de sincronização em background
async function doBackgroundSync() {
  try {
    // Aqui você pode adicionar lógica de sincronização
    // Por exemplo, salvar dados offline, sincronizar configurações, etc.
    console.log('✅ Sincronização concluída');
  } catch (error) {
    console.error('❌ Erro na sincronização:', error);
  }
}

// Mensagens do cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
