// Tableau contenant l'état de la simulation
var Game = {
    cols: [{ x: 5, y: 5, color: 'red', id: 0, ants: [{ x: 5, y: 5 }] }],
    gd: [],
    undgd: [],
    gdbg: [],
    undgdbg: [],
    h: 100,
    w: 100
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

    Game.gdbg = structuredClone(Game.gd);
    Game.undgdbg = structuredClone(Game.undgd);
}

createMap(Game.h, Game.w, 0, 0);

console.log('Worker démarré');

// 1. Écouter les actions envoyées par le thread principal
self.onmessage = function (event) {
    const { type, action } = event.data || {};

    if (type === 'PLAYER_ACTION') {
        console.log('Action reçue dans le worker :', action);
    }
};

// 2. Boucle de simulation (60 fois par seconde)
setInterval(() => {
    // Changement du terrain
    if (Math.random() < .01) {
        const x = Math.floor(Math.random() * Game.w);
        const y = Math.floor(Math.random() * Game.h);

        if (Game.gdbg[y]) {
            Game.gdbg[y][x] = Game.gdbg[y][x] === 1 ? 0 : 1;
        }

        self.postMessage({ type: 'BG_RENDER', grid: Game.gdbg });
    }

    // Mouvement de la fourmie
    // TODO: TypeError: can't access property 4, Game.gd[ant.y] is undefined
    const ant = Game.cols[0].ants[0];
    Game.gd[ant.y][ant.x] = 0; // Effacer l'ancienne position
    ant.x = (ant.x + 1) % Game.w; // Déplacer vers la droite
    ant.y = (Game.h + ant.y + 2 * (Math.floor(Math.random() - .5)-.5)) % Game.h; // Deplacer au hasard en haut ou en bas
    Game.gd[ant.y][ant.x] = 1; // Dessiner la nouvelle position

    self.postMessage({ type: 'TICK_RENDER', grid: Game.gd });
}, 1000 / 18);