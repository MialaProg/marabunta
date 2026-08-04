

var AntData = {
    scale: {
        autodamage: [0, 1, 2, 3, 4, 5],
        life: [0, 10, 20, 30, 40, 50],
        velocity: [0, 1, 2, 3, 4, 5]
    },
    rn: {
        life: 5,
        autodamage: 0
    },
    srv: {
        life: 1,
        autodamage: 0,
        velocity: 1
    },
    prt: {
        life: 1,
        autodamage: 0,
        velocity: 1
    },


    init: (config) => {
        Object.assign(AntData, config);
    }
}

var toBgCell = (xy) => { return Math.trunc(xy / Game.config.cellSize) }
    ;
var KnowLedge = {
    add: (cell, type, dist, dir, obj) => {
        cell[type] = { dist, dir, obj };
    },

    copy: (cell) => {
        const newcell = {};
        Object.keys(cell).forEach((type) => {
            newcell[type] = { ...cell[type] };
        });
        return newcell;
    }
}

var Dir = {
    N: [-1, 0],
    S: [1, 0],
    E: [0, 1],
    O: [0, -1],
    dirs: ['N', 'O', 'S', 'E'],

    getDirDist: (dy, dx) => {
        if (Math.abs(dy) >= Math.abs(dx)) {
            return [dy < 0 ? 'N' : dy > 0 ? 'S' : null, dy];
        }
        return [dx > 0 ? 'E' : dx < 0 ? 'O' : null, dx];
    },

    getDir: (dy, dx) => {
        if (Math.abs(dy) >= Math.abs(dx)) {
            return dy < 0 ? 'N' : dy > 0 ? 'S' : null;
        }
        return dx > 0 ? 'E' : dx < 0 ? 'O' : null;
    },

    inv: (dir) => {
        return Dir.dirs[(Dir.dirs.indexOf(dir) + 2) % 4];
    },

    move: (ant, klcell, klid) => {
        // dir = dir || (() => {
        //     // Pas de demi-tours.
        //     if (ant.dir) return Dir.dirs.toSpliced((Dir.dirs.indexOf(ant.dir) + 2) % 4, 1)[randint(0, 2)];
        //     return Dir.dirs[randint(0, 3)];
        // })();
        // ant.dir = dir;
        // const dirlst = Dir[dir];
        // if (!Ants.chgYX(ant, dirlst[0], dirlst[1])) console.log('Bord', ant);

        let dir = undefined;
        if (ant.readdir) {
            dir = klcell[klid]?.dir;
            ant.readdir = false;
        }
        if (randint(0, 100) < Game.config.freqantchgmtdirfocus) {
            ant.dir = undefined;
            console.log('Ranchgmtdir focus');
        }
        const ndir = dir || ant.dir || Dir.dirs[randint(0, 3)];
        ant.dir = ndir;
        const dirlst = Dir[ndir];
        if (!Ants.chgYX(ant, dirlst[0], dirlst[1])) {
            // console.log('Bord', ant);
            ant.dir = undefined;
            // Attention si chgmt de terrain: remove data
            if (dir) klcell[klid] = undefined;
        };
    }

}

