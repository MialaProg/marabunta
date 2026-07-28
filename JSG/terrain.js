var Terrain = {
    create: (x, y, type) => {
        return {x: x, y: y, type: type};
    },

    getImage: (x, y, grid, level) => {
        const currentType = grid[y][x].type;
        const getCellType = (offsetY, offsetX) => {
            const row = grid[y + offsetY];
            if (!row) {
                return currentType;
            }

            const cell = row[x + offsetX];
            const type = cell ? cell.type : currentType;
            return type + level;
        };

        const cellType = {
            'br': getCellType(0,0),
            'tl': getCellType(-1, -1),
            'tr': getCellType(-1, 0),
            'bl': getCellType(0, -1)
        };

        return Assets[cellType.tl][cellType.tr][cellType.bl][cellType.br];
    }

};






var terrainJSLoaded = true;




