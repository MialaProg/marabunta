
var Ants = {
    srvtasks: ['nourrirReine'],

    create: (y, x, lvl, type, col) => {
        const ant = {
            y: y, x, lvl, type: type,
            col: col, tick: randint(0, 15),
            actionID: undefined, moved: false,
            kl: {}, searchType: undefined, dir: undefined,
            vision: 2 * Game.config.cellSize, bag: 0,
        };
        col.ants.push(ant);

        const perfs = AntData[type];
        Object.keys(perfs).forEach((key) => {
            ant[key] = AntData.scale[key][perfs[key]];
        });

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
                if (!ant.bag) {
                    ant.searchType = 'stk'; // todo: nrr dans le futur
                    if (klcell.stk?.dist == 0) {
                        klcell.stk.obj.q -= 1;
                        ant.bag += 1;
                    } else {
                        Dir.move(ant, klcell.stk?.dir);
                    }
                } else {
                    ant.searchType = 'cbr'; // todo: rn
                    if (klcell.cbr?.dist == 0) {
                        ant.col.rn.life += 1;
                        ant.bag -= 1;
                    } else {
                        Dir.move(ant, klcell.cbr?.dir);
                    }
                }
            }
        }
        if (ant.type == 'prt') {
            if (ant.bag) {
                if (ant.lvl = 'gd') {
                    ant.searchType = 'anthill'; // todo: nrr dans le futur
                    if (klcell.anthill?.dist == 0) {
                        ant.lvl = 'undgd';
                    } else {
                        Dir.move(ant, klcell.anthill?.dir);
                    }

                } else {
                    ant.searchType = 'stk'; // todo: nrr dans le futur
                    if (klcell.stk?.dist == 0) {
                        klcell.stk.obj.q += 1;
                        ant.bag -= 1;
                    } else {
                        Dir.move(ant, klcell.stk?.dir);
                    }
                }
            } else {
                if (ant.lvl = 'gd') {
                    ant.searchType = 'miam'; // todo: rn
                    if (klcell.cbr?.dist == 0) {
                        klcell.miam.obj.q -= 1;
                        ant.bag += 1;
                    } else {
                        Dir.move(ant, klcell.cbr?.dir);
                    }
                } else {
                    ant.searchType = 'anthill'; // todo: nrr dans le futur
                    if (klcell.anthill?.dist == 0) {
                        ant.lvl = 'gd';
                    } else {
                        Dir.move(ant, klcell.anthill?.dir);
                    }
                }
            }

        }

        // Autodegats
        ant.life -= ant.autodamage;

        // Sauvegarde des chemins
        if (ant.moved) {
            Object.keys(ant.kl || {}).forEach((type) => {
                ant.kl[type].dist -= 1;
                ant.kl[type].dir = ant.dir;
                if (!klcell[type] || ant.kl[type].dist < klcell[type].dist) {
                    klcell[type] = ant.kl[type];
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
                        console.log('add kcell ', ant, DirDist, env);
                        KnowLedge.add(klcell, ant.searchType, Math.trunc(DirDist[1] / Game.config.cellSize),
                            DirDist[0], env
                        );
                    }
                }
            }
        }

        ant.kl = KnowLedge.copy(klcell);


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
        // console.log('Vie:', Game.cols[1].rn.life);
    },
    move: (col) => {
        col.ants.forEach((ant) => Ants.move(ant));
    }
}
















