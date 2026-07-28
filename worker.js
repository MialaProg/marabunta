function sendActionToMain(type, data) {
    self.postMessage({ type, data });
}

var workerActions = {
    exemple: (data) => {
        console.log('Exemple d\'action envoyée au worker');
    }
};


importScripts('./JSW/game.js');
importScripts('./JSG/terrain.js');
importScripts('./JSW/ants.js');
importScripts('./JSW/env.js');


console.log('Worker démarré');

// 1. Écouter les actions envoyées par le thread principal
self.onmessage = function (event) {
    const { type, data } = event.data || {};

    workerActions[type]?.(data);

    if (type === 'PLAYER_ACTION') {
        console.log('Action reçue dans le worker :', action);
    } else if (type === 'CAMERA_UPDATE') {
        // Mettre à jour la caméra dans le worker si nécessaire
        Game.camera = data;
    }
};

sendActionToMain('WORKER_READY', { message: 'Worker is ready' });
