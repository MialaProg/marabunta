var Canvas = {
    main: {
        canvas: document.getElementById('gameCanvas'),
        ctx: document.getElementById('gameCanvas').getContext('2d')
    },
    globalMap: {
        canvas: document.createElement('canvas'),
        ctx: document.createElement('canvas').getContext('2d')
    },
    init: () => {
        workerActions['renderMap'] = (grid) => {
            // A. Effacer le canvas principal
            globalMapCtx.clearRect(0, 0, globalMapCanvas.width, globalMapCanvas.height);

            // C. Dessiner la grille :
            for (let y = 0; y < grid.length; y++) {
                for (let x = 0; x < grid[y].length; x++) {
                    // if (grid[y][x] === 1) {
                    //     offscreenCtx.fillStyle = 'black';
                    // } else {
                    //     offscreenCtx.fillStyle = 'lightgray';
                    // }
                    // offscreenCtx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

                    let cell = Assets[grid[y][x]];
                    let todo = () => {
                        globalMapCtx.drawImage(cell[0], cell[1], cell[2], cell[3], cell[4], x * config.cellSize, y * config.cellSize, config.cellSize, config.cellSize);
                    }
                    // Attendre le chargement de cell[0] (image) si besoin
                    if (!cell[0].complete) {
                        cell[0].onload = () => {
                            todo();
                        };
                    } else {
                        todo();
                    }

                }
            }
        };
        workerActions['renderGame'] = (grid) => {
            // A. Effacer le canvas principal
            mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

            // B. "Blitter" (copier) le fond pré-calculé d'un seul coup (Très rapide !)
            mainCtx.drawImage(
                globalMapCanvas,
                Camera.x,
                Camera.y,
                mainCanvas.width,
                mainCanvas.height,
                0,
                0,
                mainCanvas.width,
                mainCanvas.height
            );

            // C. Dessiner la grille :
            const cellSize = 4; // Taille de chaque cellule
            for (let y = 0; y < grid.length; y++) {
                for (let x = 0; x < grid[y].length; x++) {
                    if (grid[y][x] === 1) {
                        mainCtx.fillStyle = 'green';
                        mainCtx.fillRect(x * cellSize - Camera.x, y * cellSize - Camera.y, cellSize, cellSize);
                    }
                }
            }
        }
    }
};
