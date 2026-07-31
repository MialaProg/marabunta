

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


    init: (config) => {
        Object.assign(AntData, config);
    }
}



var KnowLedge = {
    add: (cell, type, dist, dir, obj) => {
        cell[type] = { dist, dir, obj };
    },

    copy: (cell) => {
        const newcell = {};
        Object.keys(cell).forEach((type) => {
            newcell[type] = { ...cell[type] };
        });
    }
}

var Dir = {
    N: [-1, 0],
    S: [1, 0],
    E: [0, 1],
    O: [0, -1],

    getDirDist: (dy, dx) => {
        if (Math.abs(dy) >= Math.abs(dx)) {
            return [dy < 0 ? 'N' : dy > 0 ? 'S' : null, dy];
        }
        return [dx > 0 ? 'E' : dx < 0 ? 'O' : null, dx];
    },

    move: (ant, dir) => {
        dir = dir || Dir.getDirDist(
            Math.random() - .5,
            Math.random() - .5
        )[0]
        const dirlst = Dir[dir];
        ant.y += dirlst[0];
        ant.x += dirlst[1];
        ant.moved = true;
    }
}

