
var Ants = {
    srvtasks: ['nourrirReine', 'nourrirCouvain'],

    create: (y, x, lvl, type, col) => {
        const ant = {
            y: y, x, lvl, type: type, dir: undefined, kl: {},
            col: col, tick: randint(0, 15),
            actionID: undefined, moved: false,
            searchType: undefined,
            vision: 1 * Game.config.cellSize // < 1
            , bag: 0
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

    chgYX: (ant, dy, dx) => {
        const ny = ant.y + dy;
        const nx = ant.x + dx;

        if (0 > nx || 0 > ny || Game.h <= nx || Game.h <= ny) return false;

        const bgx = Math.trunc(nx / Game.config.cellSize);
        const bgy = Math.trunc(ny / Game.config.cellSize);
        if (ant.lvl == 'undgd' && !Game.bg[ant.lvl][bgy][bgx].creused) return false;

        Object.assign(ant, {
            x: nx, y: ny,
            bgx, bgy,
            moved: true
        });
        return true;
    },

    move: (ant) => {
        Game[ant.lvl][ant.y][ant.x] = undefined; // Effacer l'ancienne position

        ant.tick = (ant.tick + 1) % 16;

        ant.obgx = ant.bgx || Math.trunc(ant.x / Game.config.cellSize);
        ant.obgy = ant.bgy || Math.trunc(ant.y / Game.config.cellSize);
        const bgx = ant.obgx, bgy = ant.obgy; // Compatibilité


        let klcell = ant.col.kl[ant.obgy][ant.obgx];


        if (ant.type == 'srv') {
            ant.actionID = ant.actionID || 0;
            const act = Ants.srvtasks[ant.actionID];
            const nextAction = () => {
                ant.actionID = (ant.actionID + 1) % Ants.srvtasks.length;
            };
            if (act == 'nourrirReine') {
                if (!ant.bag) {
                    ant.searchType = 'stk'; // todo: nrr dans le futur
                    if (klcell.stk?.dist == 0) {
                        klcell.stk.obj.q -= 1;
                        ant.bag += 1;
                        console.log('Stk -1');
                    } else {
                        Dir.move(ant, klcell, 'stk');
                    }
                } else {
                    ant.searchType = 'cbr'; // todo: rn
                    if (klcell.cbr?.dist == 0) {
                        ant.col.rn.life += 1;
                        ant.bag -= 1;
                        nextAction();
                        console.log('Cbr +1');
                    } else {
                        Dir.move(ant, klcell, 'cbr');
                    }
                }
            } else if (act == 'nourrirCouvain') {
                if (!ant.bag) {
                    ant.searchType = 'stk'; // todo: nrr dans le futur
                    if (klcell.stk?.dist == 0) {
                        klcell.stk.obj.q -= 1;
                        ant.bag += 1;
                        console.log('Stk -1');
                    } else {
                        Dir.move(ant, klcell, 'stk');
                    }
                } else {
                    ant.searchType = 'cv'; // todo: rn
                    if (klcell.cv?.dist == 0) {
                        ant.bag -= 1;
                        nextAction();
                        console.log('Cv +1');
                    } else {
                        Dir.move(ant, klcell, 'cv');
                    }
                }
            }
        }
        if (ant.type == 'prt') {
            if (ant.bag) {
                if (ant.lvl == 'gd') {
                    ant.searchType = 'anthill'; // todo: nrr dans le futur
                    if (klcell.anthill?.dist == 0) {
                        ant.lvl = 'undgd';
                    } else {
                        Dir.move(ant, klcell, 'anthill');
                    }

                } else {
                    ant.searchType = 'stk'; // todo: nrr dans le futur
                    if (klcell.stk?.dist == 0) {
                        klcell.stk.obj.q += 1;
                        ant.bag -= 1;
                    } else {
                        Dir.move(ant, klcell, 'stk');
                    }
                }
            } else {
                if (ant.lvl == 'gd') {
                    ant.searchType = 'miam'; // todo: rn
                    if (klcell.cbr?.dist == 0) {
                        klcell.miam.obj.q -= 1;
                        ant.bag += 1;
                    } else {
                        Dir.move(ant, klcell, 'cbr');
                    }
                } else {
                    ant.searchType = 'anthill'; // todo: nrr dans le futur
                    if (klcell.anthill?.dist == 0) {
                        ant.lvl = 'gd';
                    } else {
                        Dir.move(ant, klcell, 'anthill');
                    }
                }
            }

        }

        // Autodegats
        ant.life -= ant.autodamage;



        if (ant.moved) {
            if (ant.bgx != ant.obgx || ant.bgy != ant.obgy) {
                klcell = ant.col.kl[ant.bgy][ant.bgx];
                // Decouverte
                if (ant.searchType && !klcell[ant.searchType]) {
                    for (let i = ant.x - ant.vision; i < ant.x + ant.vision; i++) {
                        for (let j = ant.y - ant.vision; j < ant.y + ant.vision; j++) {
                            const env = Game.env[ant.lvl][j][i]
                            if (env && env.type == ant.searchType) {
                                const dy = toBgCell(j) - ant.bgy;
                                const dx = toBgCell(i) - ant.bgx;
                                const dir = Dir.getDir(dy, dx);
                                console.log('add kcell ', ant, dir, env, { j, i });
                                KnowLedge.add(klcell, ant.searchType,
                                    Math.abs(dy) + Math.abs(dx), dir, env
                                );
                            }
                        }
                    }
                }

                // Sauvegarde des chemins
                Object.keys(ant.kl || {}).forEach((type) => {
                    ant.kl[type].dist += 1;
                    ant.kl[type].dir = Dir.inv(ant.dir);
                    if (!klcell[type] || Math.abs(ant.kl[type].dist) < Math.abs(klcell[type].dist)) {
                        klcell[type] = ant.kl[type];
                    }
                });




                if (randint(0, 100) < Game.config.freqantchgmtdir) {
                    ant.dir = undefined;
                    console.log('Ranchgmtdir bgcg');
                }
                ant.readdir = true;
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
            ants: [], kl: [],
            rn: { life: 0 }
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
















