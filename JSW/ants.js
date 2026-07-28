
var Ants = {
    create: (y, x, type, col) => {
        return { y: y, x: x, type: type, col: col };
    },

    public: (ant) => {
        return { type: ant.type, color: ant.col.color}
    }
};

















