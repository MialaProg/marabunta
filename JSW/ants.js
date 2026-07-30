
var Ants = {
    srvtasks: ['nourrirReine'],

    create: (y, x, lvl, type, col) => {
        const ant = {
            y: y, x, lvl, type: type,
            col: col, tick: randint(0, 15),
            actionID: undefined, moved: false,
            kl: {}, searchType: undefined, dir: undefined,
            vision: 3 * Game.config.cellSize
        };
        col.ants.push(ant);
        return ant;
    },

    public: (ant) => {
        return { type: ant.type, color: ant.col.color, tick: ant.tick }
    },

    move: (ant) => {
        Game[ant.lvl][ant.y][ant.x] = undefined; // Effacer l'ancienne position

        ant.tick = (ant.tick + 1) % 16;

        const bgx = Math.trunc(ant.x / Game.config.cellSize);
        const bgy = Math.trunc(ant.y / Game.config.cellSize);

        const klcell = ant.col.kl[bgy][bgx];


        if (ant.type == 'srv') {
            ant.actionID = ant.actionID || 0;
            const act = Ants.srvtasks[ant.actionID];
            if (act == 'nourrirReine') {
                ant.searchType= 'stk'
            }
        }

        // Sauvegarde des chemins
        if (ant.moved) {
            Object.keys(ant.kl).forEach((type) => {
                ant.kl.type.dist -= 1;
                ant.kl.type.dir = ant.dir;
                if (!klcell.type || ant.kl.type.dist < klcell.type.dist) {
                    klcell.type = ant.kl.type;
                }
            });
        }

        // Decouverte
        if (ant.searchType && !klcell[ant.searchType]) {
            for (let i = ant.x - ant.vision; i < ant.x + ant.vision; i++) {
                for (let j = ant.y - ant.vision; j < ant.y + ant.vision; j++) {
                    const env = Game.env[ant.lvl][j][i]
                    if (env && env.type == ant.searchType) {
                        const DirDist = Dir.getDirDist(
                            j - ant.y, i - ant.x
                        );
                        KnowLedge.add(klcell, ant.searchType, DirDist[1],
                            DirDist[0], env
                        );
                    }
                }
            }
        }

        ant.kl = structuredClone(klcell);


        Game[ant.lvl][ant.y][ant.x] = Ants.public(ant); // Dessiner la nouvelle position

    }
};

var AntHill = {
    create: (y, x, color) => {
        const ah = {
            y, x, color,
            ants: [], kl: []
        };
        ah.idx = Game.cols.push(ah) - 1;
        // Knowledge grid
        for (let i = 0; i < Game.bg.h; i++) {
            const row = [];
            for (let j = 0; j < Game.bg.w; j++) {
                row.push({});
            }
            ah.kl.push(row);
        }
        return ah;
    },

    moves: () => {
        Game.cols.forEach((col) => AntHill.move(col));
    },
    move: (col) => {
        col.ants.forEach((ant) => Ants.move(ant));
    }
}
















