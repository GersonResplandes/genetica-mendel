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
  '/assets/js/pwa.js',
  '/assets/logo.png'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('🧬 Service Worker instalado');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Cache aberto');
        // Adiciona recursos um por um para melhor tratamento de erros
        return Promise.allSettled(
          urlsToCache.map(url => 
            cache.add(url).catch(error => {
              console.warn(`⚠️ Não foi possível cachear: ${url}`, error);
              return null;
            })
          )
        );
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
  // Estratégia diferente para recursos externos
  if (event.request.url.includes('cdn.tailwindcss.com') || 
      event.request.url.includes('fonts.googleapis.com')) {
    // Para recursos externos, usa estratégia "Network First"
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Se a rede falhar, não faz nada (deixa o navegador lidar)
          return response;
        })
        .catch(() => {
          // Fallback silencioso para recursos externos
          return new Response('', { status: 404 });
        })
    );
    return;
  }

  // Para recursos locais, usa estratégia "Cache First"
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
            if (!response || response.status !== 200) {
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
            return new Response('', { status: 404 });
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
