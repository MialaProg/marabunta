// Tableau contenant l'état de la simulation
var Game = {
    cols: [{ x: 5, y: 5, color: 'red', id: 0, ants: [] }],
    gd: [],
    undgd: [],
    h: 10,
    w: 10
};

function createMap(h, w, trg, tru) {
    Game.gd = [];
    Game.undgd = [];

    for (let i = 0; i < h; i++) {
        const row = [];
        for (let j = 0; j < w; j++) {
            row.push(trg);
        }
        Game.gd.push(row);
    }

    for (let i = 0; i < h; i++) {
        const row = [];
        for (let j = 0; j < w; j++) {
            row.push(tru);
        }
        Game.undgd.push(row);
    }
}

createMap(Game.h, Game.w, 0, 0);

console.log('Worker démarré');

// 1. Écouter les actions envoyées par le thread principal
self.onmessage = function(event) {
    const { type, action } = event.data || {};

    if (type === 'PLAYER_ACTION') {
        console.log('Action reçue dans le worker :', action);
    }
};

// 2. Boucle de simulation (60 fois par seconde)
setInterval(() => {
    const x = Math.floor(Math.random() * Game.w);
    const y = Math.floor(Math.random() * Game.h);

    if (Game.gd[y]) {
        Game.gd[y][x] = Game.gd[y][x] === 1 ? 0 : 1;
    }

    self.postMessage({ type: 'TICK_RENDER', grid: Game.gd });
}, 1000 / 60);