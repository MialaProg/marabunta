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
    resize: (envt, canvas) => {
        console.log('resize');
        canvas = canvas || Canvas.main.canvas;
        const w = window.innerWidth * config.canvasSize[1];
        const h = window.innerHeight * config.canvasSize[0];
        canvas.width = w;
        canvas.height = h;
        Canvas.scale = Math.max(canvas.width / config.camera.wmax, canvas.height / config.camera.hmax);    
        UI.updateButtons();
    },

    config: (obj) => {
        obj.canvas = document.createElement('canvas');
        obj.ctx = obj.canvas.getContext('2d');
        obj.canvas.height = config.mapSize[0];
        obj.canvas.width = config.mapSize[1];
        const body = document.children[0].children[1];
        body.appendChild(document.createElement('br'));
        body.appendChild(obj.canvas);
    },
    blitter: (from, to = Canvas.main) => {
        to.ctx.drawImage(
            from.canvas,
            Camera.x,
            Camera.y,
            to.canvas.width / Canvas.scale,
            to.canvas.height / Canvas.scale,
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

                    Assets.draw(Canvas.bg, Terrain.getAsset(grid[y][x]), x * config.cellSize, y * config.cellSize, config.cellSize, config.cellSize, grid[y][x].ran);
                }
            }
        };
        workerActions.ENV_RENDER = (grid) => {
            // A. Effacer le canvas principal
            Canvas.env.ctx.clearRect(0, 0, Canvas.env.canvas.width, Canvas.env.canvas.height);

            // C. Dessiner la grille :
            for (let y = 0; y < grid.length; y++) {
                for (let x = 0; x < grid[y].length; x++) {
                    const obj = grid[y][x];
                    if (obj) {
                        if (obj.srcID) {
                            Assets.draw(Canvas.env, obj.srcID, x, y, obj.w, obj.h);
                        } else {
                            Canvas.env.ctx.fillStyle = grid[y][x].color;
                            Canvas.env.ctx.fillRect(x, y, 1, 1);
                        }
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
                        Canvas.main.ctx.fillRect((x * cellSize - Camera.x) * Canvas.scale, (y * cellSize - Camera.y) * Canvas.scale, cellSize * Canvas.scale, cellSize * Canvas.scale);
                    }
                }
            }

            UI.draw();
        }
    }
};


var canvasJSLoaded = true;