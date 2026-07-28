// Tableau contenant l'état de la simulation
var Game = {
    cols: [{ x: 5, y: 5, color: 'red', id: 0, ants: [] }],
    gd: [],
    undgd: [],
    bg: {
    gd: [],
    undgd: []},
    env: {
        gd:[]
    }
};



function createMap() {
    Game.gd = [];
    Game.undgd = [];

    for (let i = 0; i < Game.bg.h; i++) {
        const row = [];
        for (let j = 0; j < Game.bg.w; j++) {
            // row.push(trg);
            if (Math.random() < .3) {
                row.push('sb');
            } else {
                row.push('tr');
            }
        }
        Game.bg.gd.push(row);
    }

    // Game.bg.gd = structuredClone(Game.gd);
    for (let i = 0; i < Game.h; i++) {
        let row = [];
        for (let j = 0; j < Game.w; j++) {
            row.push(Math.random() < .1 ? Env.create(i,j,'miam','blue') : undefined);
        }
        Game.env.gd.push(row);
        row = [];
        for (let j = 0; j < Game.w; j++) {
            row.push(undefined);
        }
        Game.gd.push(row);
    }

    sendActionToMain('BG_RENDER', Game.bg.gd);
    sendActionToMain('ENV_RENDER', Game.env.gd);
}

workerActions.CONFIG_GAME = (config) => {
    Game.config = config;
    const mapSize = config.mapSize;
    Game.h = mapSize[0];
    Game.w = mapSize[1];
    Game.bg.h = Game.h / Game.config.cellSize;
    Game.bg.w = Game.w / Game.config.cellSize;
    createMap();
    Game.cols[0].ants.push(Ants.create(5, 5, 'prt', Game.cols[0]));

    // 2. Boucle de simulation (60 fois par seconde)
    setInterval(() => {

        // Mouvement de la fourmie
        const ant = Game.cols[0].ants[0];
        Game.gd[ant.y][ant.x] = undefined; // Effacer l'ancienne position
        ant.x = (ant.x + 1) % (Game.w); // Déplacer vers la droite
        ant.y = (Game.h + ant.y + 2 * (Math.floor(Math.random() - .5) - .5)) % (Game.h); // Deplacer au hasard en haut ou en bas
        Game.gd[ant.y][ant.x] = Ants.public(ant); // Dessiner la nouvelle position
        sendActionToMain('ANT_MOVE', Game.gd);
    }, 1000 / 18);
};

