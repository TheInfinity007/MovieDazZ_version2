// Register the service Worker

document.addEventListener('DOMContentLoaded', init, false);

function init() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/serviceWorkerCachedSite.js')
            .then((registration) => {
                console.log('Service worker registered -->', registration);
            }, (err) => {
                console.error('Service worker not registered -->', err);
            });
    }
}
