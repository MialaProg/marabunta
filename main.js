function libLoaded(libname) {
    try {
        return eval(libname + 'JSLoaded');
    } catch (e) {
        return;
    }
}

/**
 * Attend qu'une condition soit remplie en vérifiant à intervalles réguliers
 * @param {function} condition - Fonction à tester qui retourne une valeur truthy quand prête
 * @param {number} [interval=100] - Intervalle de vérification en millisecondes
 * @param {number} [timeout=10000] - Délai maximum d'attente en millisecondes
 * @returns {Promise<any>} Promesse résolue avec la valeur retournée par la condition
 * @throws {Error} Si le timeout est atteint ou si la condition lève une erreur
 * 
 * @example
 * // Attendre un élément DOM
 * const button = await wait(() => document.querySelector('#submit-btn'));
 * 
 * @example
 * // Attendre une valeur spécifique avec vérification
 * const data = await wait(
 *   () => api.data?.status === 'ready' ? api.data : null,
 *   200,
 *   5000
 * );
 */
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


var config = {
    fps: 4,
    mapSize: [100, 200],
    cellSize: 10,
    canvasSize: [.5, .5],
    camera: {
        speed: 10,
        wmax: 100,
        hmax: 50,
        viewUnd: true
    },
    moza: 512,
    motte1: [25.6, 12.9],
    freqantchgmtdir: 50,
    freqantchgmtdirfocus: 5,
}
config.ahloc = [parseInt(2.5 * config.cellSize), parseInt(4.5 * config.cellSize)];
config.rloc = [parseInt(4.5 * config.cellSize), parseInt(1.5 * config.cellSize)];

var gameWorker = new Worker('./worker.js');
var workerActions = {
    exemple: (data) => {
        console.log('Exemple d\'action envoyée au worker');
    }
};
var workerJSLoaded = false;
var initMainDone = false;
// Initialisation of the game.
async function initMain() {
    const pbar = document.getElementById("title");
    const setPBar = (percent) => {
        pbar.innerText = percent + '%';
    }
    setPBar(10);
    await wait(() => libLoaded('ui'));
    await wait(() => libLoaded('canvas'));
    Canvas.init();
    setPBar(15);
    await wait(() => libLoaded('camera'));
    Camera.init();
    setPBar(20);
    await wait(() => libLoaded('spritesheet'));
    await wait(() => libLoaded('terrain'));
    setPBar(30);
    await wait(() => spritesheetAssetsLoaded);
    setPBar(67);
    await wait(() => libLoaded('worker'));
    setPBar(98);
    sendActionToWorker('CONFIG_GAME', config);
    setPBar(100);

    initMainDone = true;

}

console.log('Main:init...');
var devFast = false;
document.addEventListener("DOMContentLoaded", function () {
    console.log('Doc loaded');
    initMain();
});

gameWorker.onmessage = function (event) {
    const { type, data } = event.data;

    if (type === 'WORKER_READY') {
        console.log('Worker is ready');
        workerJSLoaded = true;
    } else if (initMainDone) {
        workerActions[type]?.(data);
    }
};

function sendActionToWorker(type, data) {
    // console.log('Send action to SW ', type, data);
    gameWorker.postMessage({ type, data });
}

MainJSLoaded = true;