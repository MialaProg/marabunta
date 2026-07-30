function sendActionToMain(type, data) {
    self.postMessage({ type, data });
}

function randint(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

var workerActions = {
    exemple: (data) => {
        console.log('Exemple d\'action envoyée au worker');
    }
};


importScripts('./JSW/antools.js');
importScripts('./JSW/game.js');
importScripts('./JSG/terrain.js');
importScripts('./JSW/ants.js');
importScripts('./JSW/env.js');


console.log('Worker démarré');

// 1. Écouter les actions envoyées par le thread principal
self.onmessage = function (event) {
    const { type, data } = event.data || {};

    workerActions[type]?.(data);
};

sendActionToMain('WORKER_READY', { message: 'Worker is ready' });
