// const DOMAIN = "http://localhost:5000/"

const CACHE_NAME = 'v1';
const filesToCache = [
    '/',   
    // '/js/status.js',
    // '/stylesheets/index.css',
    // '/stylesheets/main.css',
    // '/js/script.js',
    // '/offline.html',
];
let count = 0;

// cache the static resources in the install event 
// like html, css, js 
self.addEventListener('install', function(event) {
    console.log('Service Worker: Installing....');

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(filesToCache)
            })
            .then(() => self.skipWaiting())
    );
});

function isSameDomain(domain){
    console.log("same domain");
}

const updateCache = async (event) => {

    return fetch(event.request).then((response) => {
        caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response);
            console.log("Cache updated");
        });
        
        return Promise.resolve();
    }).catch((err) => {
        console.log("error in fetching uri");
        return Promise.resolve();
    });

}

// render cache and update the cache in background with network
self.addEventListener('fetch', function(event) {

    event.respondWith(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.match(event.request).then(async (response) => {

                if (response) {
                    updateCache(event);
                    return response;
                }
                
                return fetch(event.request).then(function(response) {
                    cache.put(event.request, response.clone());
                    return response;
                });

            });
        })
    );

});


// cache falling back to the network
// this is most useful for Offline first web app
// self.addEventListener('fetch', function(event) {

//     event.respondWith(
//         caches.open(CACHE_NAME).then(function(cache) {
//             return cache.match(event.request).then(function (response) {
//                 return response || fetch(event.request).then(function(response) {
//                     cache.put(event.request, response.clone());
//                     return response;
//                 });
//             });
//         })
//     );
// });



/*

// Network falling back to the cache
self.addEventListener('fetch', function(event) {

    // console.log('Service Worker: Fetch', event.request.url); 

    event.respondWith(

      fetch(event.request).then((res) => {
            // Make clone of the response
            const resClone = res.clone();
            
            caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, resClone);
            }); 
            return res;
        })
        .catch((err) => {
            caches.match(event.request).then((res) => {
                    return res;
            })
            .then((res) => {
                if(!res){
                    console.log("page is not in cache", res, event.request.url);
                    //send a 404 response
                    return "You are offline";
                }
                else
                    return res;
            })
            .catch((err) => {
                return "You are offline";
            })
                
        })
    );
});
*/


// Fired when the Service Worker starts up
self.addEventListener('activate', function(event) {
    console.log('Service Worker: Activating....');

    // delete any caches that aren't in expectedCaches
    // or delete outdated caches
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(cacheNames.map((key) => {
                if( key !== CACHE_NAME) {
                    console.log('[Service Worker] Removing Old cache', key);
                    return caches.delete(key);
                }
            }))
        }));
    return self.clients.claim();
});