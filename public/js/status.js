document.addEventListener('DOMContentLoaded', init, false);

function init() {
    if (!navigator.onLine) {
    // const statusElem = document.querySelector('.page-status')
    // statusElem.innerHTML = 'offline'
        console.log('offline');
    } else {
        console.log('online');
    }
}
