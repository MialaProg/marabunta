// Tableau contenant l'état de la simulation
var Game = {
    cols: [{ x: 5, y: 5, color: 'red', id: 0, ants: [{ x: 5, y: 5 }] }],
    gd: [],
    undgd: [],
    gdbg: [],
    undgdbg: []
};



function createMap(h, w, trg, tru) {
    Game.gd = [];
    Game.undgd = [];

    for (let i = 0; i < h/Game.config.cellSize; i++) {
        const row = [];
        for (let j = 0; j < w/Game.config.cellSize; j++) {
            // row.push(trg);
            if (Math.random() < .3) {
                row.push('sb');
            } else {
                row.push('tr');
            }
        }
        Game.gdbg.push(row);
    }

    for (let i = 0; i < h/Game.config.cellSize; i++) {
        const row = [];
        for (let j = 0; j < w/Game.config.cellSize; j++) {
            row.push(tru);
        }
        Game.undgdbg.push(row);
    }

    // Game.gdbg = structuredClone(Game.gd);
    for (let i = 0; i < h; i++) {
        const row = [];
        for (let j = 0; j < w; j++) {
            row.push(0);
        }
        Game.gd.push(row);
    }
    Game.undgd = structuredClone(Game.gd);

    self.postMessage({ type: 'MAP_RENDER', grid: Game.gdbg });
}


console.log('Worker démarré');

// 1. Écouter les actions envoyées par le thread principal
self.onmessage = function (event) {
    const { type, action } = event.data || {};

    if (type === 'PLAYER_ACTION') {
        console.log('Action reçue dans le worker :', action);
    }else if (type === 'CONFIG') {
        Game.config = action;
        const mapSize = action.mapSize;
        Game.h = mapSize[0];
        Game.w = mapSize[1];
        createMap(Game.h, Game.w, 0, 0);


        // 2. Boucle de simulation (60 fois par seconde)
        setInterval(() => {

            // Mouvement de la fourmie
            // TODO: TypeError: can't access property 4, Game.gd[ant.y] is undefined
            const ant = Game.cols[0].ants[0];
            Game.gd[ant.y][ant.x] = 0; // Effacer l'ancienne position
            ant.x = (ant.x + 1) % (Game.w); // Déplacer vers la droite
            ant.y = (Game.h + ant.y + 2 * (Math.floor(Math.random() - .5) - .5)) % (Game.h); // Deplacer au hasard en haut ou en bas
            Game.gd[ant.y][ant.x] = 1; // Dessiner la nouvelle position

            self.postMessage({ type: 'TICK_RENDER', grid: Game.gd });
        }, 1000 / 18);
    } else if (type === 'CAMERA_UPDATE') {
        // Mettre à jour la caméra dans le worker si nécessaire
        Game.camera = action.camera;
    }
};
