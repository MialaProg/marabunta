var spritesheetAssetsLoaded = false;

const i = {
    ids: [],
    create: (id, src) => {
        i[id] = new Image();
        i[id].src = src;
        i.ids.push(id);
    }
}

i.create('terrain', './IMG/ImgTlbx_tr(2471)x(4479)[1].png');
i.create('ui', './IMG/1785251443411.png');
i.create('env1', './IMG/1785251469089.png');
i.create('trc', 'IMG/mosaique-aquarelle-3x3-693a1e.png');
i.create('trf', 'IMG/mosaique-aquarelle-3x3-944d16.png')

var Assets = {
    sb: {
        gd: [i.terrain, 160, 10, 140, 140],
        undgd: [i.terrain, 160, 10, 140, 140],
        cr: [i.terrain, 160, 10, 140, 140]
    },
    tr: {
        gd: [i.terrain, 313, 10, 140, 140],
        undgd: [i.trf, 'moza'],
        cr: [i.trc, 'moza']
    },
    btnUnd: [i.ui, 397, 167, 280, 268],
    btnNoUnd: [i.ui, 693, 164, 280, 268],
    motte1: [i.env1, 1638, 783, 256, 129],
    btnProd: [i.ui, 78, 719, 275, 260],


    draw: (canvas, id, x, y, w, h, ran) => {
        let cell = eval('Assets.' + id);

        let todo = () => {
            if (typeof cell[1] === 'string' && ran != undefined) {
                cell = [cell[0],
                (ran % 3) * config[cell[1]], Math.trunc(ran / 3) * config[cell[1]],
                config[cell[1]], config[cell[1]]
                ]
            }
            canvas.ctx.drawImage(...cell, x, y, w, h); // cell[0], cell[1], cell[2], cell[3], cell[4]
        }
        // Attendre le chargement de cell[0] (image) si besoin
        if (!cell || !cell[0]) {
            console.error('No cell[0]:', cell, ' args:', [
                canvas, id, x, y, w, h, ran
            ]);
        }
        if (!cell[0].complete) {
            cell[0].onload = () => {
                todo();
            };
        } else {
            todo();
        }
    }
};


function wait(condition, interval = 100, timeout = 10 ** 7) {
    return new Promise((resolve, reject) => {
        let intervalId;
        const timeoutId = setTimeout(() => {
            clearInterval(intervalId);
            reject(new Error(`Timeout after ${timeout}ms`));
        }, timeout);

        const check = () => {
            try {
                const result = condition();
                if (result) {
                    clearTimeout(timeoutId);
                    clearInterval(intervalId);
                    resolve(result);
                }
            } catch (error) {
                clearTimeout(timeoutId);
                clearInterval(intervalId);
                reject(error);
            }
        };

        check(); // Premier check immédiat
        intervalId = setInterval(check, interval);
    });
}

async function waitAssets() {
    await wait(() =>
        i.ids.every(id => i[id].complete)
    );
    console.log('Spritesheet loaded');
    spritesheetAssetsLoaded = true;
}

waitAssets();
spritesheetJSLoaded = true;