// Tableau contenant l'état de la simulation
var Game = {
    cols: [{ x: 5, y: 5, color: 'red', id: 0, ants: [{ x: 5, y: 5 }] }],
    gd: [],
    undgd: [],
    bg: {
    gd: [],
    undgd: []}
};



function createMap() {
    Game.gd = [];
    Game.undgd = [];

    for (let i = 0; i < Game.bg.h / Game.config.cellSize; i++) {
        const row = [];
        for (let j = 0; j < Game.bg.w / Game.config.cellSize; j++) {
            // row.push(trg);
            if (Math.random() < .3) {
                row.push('sb');
            } else {
                row.push('tr');
            }
        }
        Game.bg.gd.push(row);
    }

    for (let i = 0; i < Game.bg.h / Game.config.cellSize; i++) {
        const row = [];
        for (let j = 0; j < Game.bg.w / Game.config.cellSize; j++) {
            row.push(tru);
        }
        Game.bg.undgd.push(row);
    }

    // Game.bg.gd = structuredClone(Game.gd);
    for (let i = 0; i < Game.h; i++) {
        const row = [];
        for (let j = 0; j < Game.w; j++) {
            row.push(0);
        }
        Game.gd.push(row);
    }
    Game.undgd = structuredClone(Game.gd);

    sendActionToMain('BG_RENDER', Game.bg.gd);
}

workerActions.CONFIG_GAME = (config) => {
    Game.config = config;
    const mapSize = config.mapSize;
    Game.h = mapSize[0];
    Game.w = mapSize[1];
    Game.bg.h = Game.h / Game.config.cellSize;
    Game.bg.w = Game.w / Game.config.cellSize;
    createMap();


    // 2. Boucle de simulation (60 fois par seconde)
    setInterval(() => {

        // Mouvement de la fourmie
        // TODO: TypeError: can't access property 4, Game.gd[ant.y] is undefined
        const ant = Game.cols[0].ants[0];
        Game.gd[ant.y][ant.x] = 0; // Effacer l'ancienne position
        ant.x = (ant.x + 1) % (Game.w); // Déplacer vers la droite
        ant.y = (Game.h + ant.y + 2 * (Math.floor(Math.random() - .5) - .5)) % (Game.h); // Deplacer au hasard en haut ou en bas
        Game.gd[ant.y][ant.x] = 1; // Dessiner la nouvelle position
        sendActionToMain('ANT_MOVE', Game.gd);
    }, 1000 / 18);
};