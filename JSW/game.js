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