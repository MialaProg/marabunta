
var KnowLedge = {
    add: (cell, type, dist, dir, obj) => {
        cell[type] = { dist, dir }; // ,obj
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
    }
}

