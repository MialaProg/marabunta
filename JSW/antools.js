
var KnowLedge = {
    add: (cell, type, dist, dir, obj) => {
        cell[type] = { dist, dir, obj };
    }
}

var Dir = {
    N: [-1, 0],
    S: [1, 0],
    E: [0, 1],
    O: [0, -1]
}

