var Canvas = {
    main: {
        canvas: document.getElementById('gameCanvas'),
    },
    globalMap: {
        canvas: document.createElement('canvas'),
    },
    init: () => {
        Canvas.main.ctx = Canvas.main.canvas.getContext('2d');
        Canvas.globalMap.ctx = Canvas.globalMap.canvas.getContext('2d');
        document.children[0].children[1].appendChild(Canvas.globalMap.canvas);

        config.mainSize = [Canvas.main.canvas.height, Canvas.main.canvas.width];
        workerActions.BG_RENDER = (grid) => {
            // A. Effacer le canvas principal
            Canvas.globalMap.ctx.clearRect(0, 0, Canvas.globalMap.canvas.width, Canvas.globalMap.canvas.height);

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
                        Canvas.globalMap.ctx.drawImage(cell[0], cell[1], cell[2], cell[3], cell[4], x * config.cellSize, y * config.cellSize, config.cellSize, config.cellSize);
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
        workerActions.ANT_MOVE = (grid) => {
            // A. Effacer le canvas principal
            Canvas.main.ctx.clearRect(0, 0, Canvas.main.canvas.width, Canvas.main.canvas.height);

            // B. "Blitter" (copier) le fond pré-calculé d'un seul coup (Très rapide !)
            Canvas.main.ctx.drawImage(
                Canvas.globalMap.canvas,
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
            const cellSize = 1; // Taille de chaque cellule
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


var canvasJSLoaded = true;