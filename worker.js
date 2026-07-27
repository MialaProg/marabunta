function sendActionToMain(type, data) {
    self.postMessage({ type, data });
}

var workerActions = {
    exemple: (data) => {
        console.log('Exemple d\'action envoyée au worker');
    }
};


importScripts('./JSW/game.js');


console.log('Worker démarré');

// 1. Écouter les actions envoyées par le thread principal
self.onmessage = function (event) {
    const { type, action } = event.data || {};

    workerActions[type]?.(data);

    if (type === 'PLAYER_ACTION') {
        console.log('Action reçue dans le worker :', action);
    } else if (type === 'CAMERA_UPDATE') {
        // Mettre à jour la caméra dans le worker si nécessaire
        Game.camera = action.camera;
    }
};

sendActionToMain('WORKER_READY', { message: 'Worker is ready' });
