var Terrain = {
    create: (type, creused = false) => {
        return {type, creused,
            ran: randint(0,8), isTr: true
        };
    },

    isTerrain: (terrain) => {
        return terrain && terrain.isTr;
    },

    getAsset: (terrain) => {
        return terrain.type + '.' +  
        (terrain.creused ? 'cr' : Camera.lvl);
    },

    // Useless, dev uniquement
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




