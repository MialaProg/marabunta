var Canvas = {
    main: {},
    bg: {},
    env: {},
    ui: {
        main: {
            canvas: document.createElement('canvas')
        },
        popup: {}
    },
    resize: (canvas) => {
        canvas = canvas || Canvas.main.canvas;
        const h = canvas.clientWidth;
        const w = canvas.clientHeight;
        canvas.width = h;
        canvas.height = w;
    },
    config: (obj) => {
        obj.canvas = document.createElement('canvas');
        obj.ctx = obj.canvas.getContext('2d');
        obj.canvas.height = config.mapSize[0];
        obj.canvas.width = config.mapSize[1];
        document.children[0].children[1].appendChild(obj.canvas);
    },
    blitter: (from, to = Canvas.main) => {
        const scale = Math.min(to.canvas.width / Camera.wmax, to.canvas.height / Camera.hmax);

        to.ctx.drawImage(
            from.canvas,
            Camera.x,
            Camera.y,
            to.canvas.width / scale,
            to.canvas.height / scale,
            0,
            0,
            to.canvas.width,
            to.canvas.height
        );
    },
    init: () => {
        Canvas.main.canvas = document.getElementById('gameCanvas');
        Canvas.main.ctx = Canvas.main.canvas.getContext('2d');

        Canvas.config(Canvas.bg);
        Canvas.config(Canvas.env);

        Canvas.resize();
        window.addEventListener('resize', Canvas.resize);

        config.mainSize = [Canvas.main.canvas.height, Canvas.main.canvas.width];
        workerActions.BG_RENDER = (grid) => {
            // A. Effacer le canvas principal
            Canvas.bg.ctx.clearRect(0, 0, Canvas.bg.canvas.width, Canvas.bg.canvas.height);

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
                        Canvas.bg.ctx.drawImage(cell[0], cell[1], cell[2], cell[3], cell[4], x * config.cellSize, y * config.cellSize, config.cellSize, config.cellSize);
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
        workerActions.ENV_RENDER = (grid) => {
            // A. Effacer le canvas principal
            Canvas.env.ctx.clearRect(0, 0, Canvas.env.canvas.width, Canvas.env.canvas.height);

            // C. Dessiner la grille :
            for (let y = 0; y < grid.length; y++) {
                for (let x = 0; x < grid[y].length; x++) {
                    if (grid[y][x]) {
                        Canvas.env.ctx.fillStyle = grid[y][x].color;
                        Canvas.env.ctx.fillRect(x, y, 1, 1);
                    }
                }
            }
        };
        workerActions.ANT_MOVE = (grid) => {
            // A. Effacer le canvas principal
            Canvas.main.ctx.clearRect(0, 0, Canvas.main.canvas.width, Canvas.main.canvas.height);

            // B. "Blitter" (copier) le fond pré-calculé d'un seul coup (Très rapide !)
            Canvas.blitter(Canvas.bg);
            Canvas.blitter(Canvas.env);

            // C. Dessiner la grille :
            const cellSize = 1; // Taille de chaque cellule
            for (let y = 0; y < grid.length; y++) {
                for (let x = 0; x < grid[y].length; x++) {
                    const ant = grid[y][x];
                    if (ant) {
                        Canvas.main.ctx.fillStyle = ant.color;
                        Canvas.main.ctx.fillRect(x * cellSize - Camera.x, y * cellSize - Camera.y, cellSize, cellSize);
                    }
                }
            }
        }
    }
};


var canvasJSLoaded = true;