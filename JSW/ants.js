
var Ants = {
    create: (y, x, lvl, type, col) => {
        const ant = { y: y, x, lvl, type: type,
            col: col, tick:randint(0,15)};
        col.ants.push(ant);
        return ant;
    },

    public: (ant) => {
        return { type: ant.type, color: ant.col.color, tick: ant.tick}
    },

    move:(ant) => {
        Game[ant.lvl][ant.y][ant.x] = undefined; // Effacer l'ancienne position
        
        ant.tick = (ant.tick + 1) % 16

                
        Game[ant.lvl][ant.y][ant.x] = Ants.public(ant); // Dessiner la nouvelle position
        
    }
};

var AntHill = {
    create: (y, x, color) => {
        const ah = {
            y, x, color,
            ants: []
        };
        ah.idx = Game.cols.push(ah) - 1;
        return ah;
    },

    moves: () => {
        Game.cols.forEach((col)=>AntHill.move(col));
    },
    move: (col) => {
        col.ants.forEach((ant)=>Ants.move(ant));
    }
}

















