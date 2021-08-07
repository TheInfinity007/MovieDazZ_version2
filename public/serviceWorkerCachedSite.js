const CACHE_NAME = 'v1';
const toCache = [
    '/',   
    '/js/pwa.js', 
    '/js/status.js',
    '/stylesheets/index.css',
    '/stylesheets/main.css',
    '/js/script.js',
];

self.addEventListener('install', function(event) {
    console.log('Service Worker: Installing....');

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(toCache)
            })
            .then(self.skipWaiting())
    )
});

self.addEventListener('fetch', function(event) {

    // console.log('Service Worker: Fetch', event.request.url); 

    event.respondWith(
      fetch(event.request)
        .then((res) => {
            // Make clone of the response
            const resClone = res.clone();
            // Open cache
            caches
                .open(CACHE_NAME)
                .then(cache => {
                    // add response to cache
                    cache.put(event.request, resClone);
                }); 
            return res;
        })
        .catch((err) => {
            caches.match(event.request)
                .then((res) => {
                    return res;
                })
                // .then((res) => {
                //     if(!res){
                //         console.log("page is not in cache", res, event.request.url);
                //         send a 404 response
                //         return "Hello";
                //     }
                //     else
                //         return res;
                // })
        })
    );
});


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