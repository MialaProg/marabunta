const spritesTerrain = new Image();

var sprisheetJSLoaded = false;


spritesTerrain.src = './ImgTlbx_tr(2471)x(4479)[1].png';

var Assets = {
    sb: [spritesTerrain, 160, 10, 140, 140],
    tr: [spritesTerrain, 313, 10, 140, 140],

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
    await wait(() => spritesTerrain.complete);
    console.log('Spritesheet loaded');
    spritesheetJSLoaded = true;
}

waitAssets();