const CACHE_NAME = 'sw_app_cache';
const toCache = [
    '/',
    '/js/status.js',
    '/stylesheets/index.css',
    '/stylesheets/main.css',
    '/stylesheets/footer.css',
    '/stylesheets/celebrity.css',
    '/js/script.js',
    '/res/images/imdb.svg',
];

self.addEventListener('install', function(event) {
    console.log('Service Worker: Installing....');

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Service Worker: Caching App Shell at the moment......');

                return cache.addAll(toCache)
            })
            // .then(self.skipWaiting())
    )
});

self.addEventListener('fetch', function(event) {

    console.log('Service Worker: Fetch', event.request.url);

    console.log("Url", event.request.url);

    event.respondWith(
      fetch(event.request)
        .catch(() => {
            return caches.open(CACHE_NAME)
                .then((cache) => {
                    return cache.match(event.request)
                })
        })
    )
})


// Fired when the Service Worker starts up
self.addEventListener('activate', function(event) {
    console.log('Service Worker: Activating....');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(cacheNames.map((key) => {
                    if( key !== CACHE_NAME) {
                        console.log('[Service Worker] Removing Old cache', key);
                        return caches.delete(key);
                    }
                }))
            
            })
            .then(() => self.clients.claim())
    )
});