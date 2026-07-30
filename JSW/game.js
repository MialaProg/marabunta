// Tableau contenant l'état de la simulation
var Game = {
    cols: [{ x: 5, y: 5, color: 'red', id: 0, ants: [] }],
    gd: [],
    undgd: [],
    bg: {
        gd: [],
        undgd: []
    },
    env: { gd: [], undgd: [] },
    
    
    
    
    
    uid: 0,
    getUID:()=>{Game.uid +=1;return Game.uid}
};



workerActions.CAMERA_UPDATE = (data, forced) => {
    const oldLvl = Game.camera?.lvl || 'updt';
    Game.camera = data;
    if (forced || Game.camera.lvl != oldLvl) {
        Game.lvl = Game.camera.lvl; // Option de compatibilité
        sendActionToMain('BG_RENDER', Game.bg[Game.lvl]);
        sendActionToMain('ENV_RENDER', Game.env[Game.lvl]);
    }
}


function createMap() {
    for (let i = 0; i < Game.bg.h; i++) {
        const row = [];
        for (let j = 0; j < Game.bg.w; j++) {
            // row.push(trg);
            if (Math.random() < .3) {
                row.push(Terrain.create('sb'));
            } else {
                row.push(Terrain.create('tr'));
            }
        }
        Game.bg.gd.push(row);
    }
    Game.bg.undgd = structuredClone(Game.bg.gd);

    [
        [3, 5], [4, 5], [5, 5], [6, 5], [5, 4],
        [4, 2], [5, 2], [6, 2],
        [4, 3], [5, 3], [6, 3],
        [4, 1], [5, 1], [6, 1]
    ].forEach((coords) => {
        Game.bg.gd[coords[0]][coords[1]] = Terrain.create('tr');
        Game.bg.undgd[coords[0]][coords[1]] = Terrain.create('tr', true);
    });

    // Game.bg.gd = structuredClone(Game.gd);
    for (let i = 0; i < Game.h; i++) {
        let row = [];
        for (let j = 0; j < Game.w; j++) {
            row.push(Math.random() < .01 ? Env.create('miam', 'blue') : undefined);
        }
        Game.env.gd.push(row);
        row = [];
        for (let j = 0; j < Game.w; j++) {
            row.push(undefined);
        }
        Game.gd.push(row);
        Game.undgd.push([...row]);
        Game.env.undgd.push([...row]);
    }

    Game.env.gd[Game.config.ahloc[0]][Game.config.ahloc[1]] =
        Env.create('anthill', undefined, 'motte1', ...Game.config.motte1);

    const cf = Game.config.cellSize;
    Game.env.undgd[4 * cf][1 * cf] = Env.create('cbr', 'orange');
    Game.env.undgd[6 * cf][1 * cf] = Env.create('stk', 'yellow');
    Game.env.undgd[4 * cf][3 * cf] = Env.create('cv', 'white');
    Game.env.undgd[6 * cf][3 * cf] = Env.create('csn', 'red');

    if (Game.camera) {
        workerActions.CAMERA_UPDATE(Game.camera, true);
    }
}

workerActions.CONFIG_GAME = (config) => {
    Game.config = config;
    const mapSize = config.mapSize;
    Game.h = mapSize[0];
    Game.w = mapSize[1];
    Game.bg.h = Game.h / Game.config.cellSize;
    Game.bg.w = Game.w / Game.config.cellSize;
    createMap();

    const col = AntHill.create(...Game.config.ahloc, 'orange');
    Ants.create(...Game.config.rloc, 'undgd', 'rn', col);
    Ants.create(...Game.config.rloc, 'undgd', 'srv', col);

    // 2. Boucle de simulation (60 fois par seconde)
    setInterval(() => {
        AntHill.moves();
        sendActionToMain('ANT_MOVE', Game[Game.lvl]);
    }, 1000 / Game.config.fps);
};
