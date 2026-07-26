



// SERVICE WORKER

// 1. Initialisation du Worker
const gameWorker = new Worker('./worker.js');

// 2. Écouter les données envoyées par le Worker (les positions des fourmis)
gameWorker.onmessage = function (event) {
    const { type, grid } = event.data;

    if (type === 'TICK_RENDER') {
        // Appeler votre fonction de rendu ici avec antsData
        renderGame(grid);
    }

    if (type === 'MAP_RENDER') {
        // Appeler votre fonction de rendu ici avec antsData
        renderMap(grid);
    }
};

// 3. Exemple d'envoi d'une action utilisateur au Worker
function sendActionToWorker(action) {
    gameWorker.postMessage({ type: 'PLAYER_ACTION', action: action });
}

/*/ PEERJS

// Inclure PeerJS via CDN dans votre HTML : <script src="https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js"></script>

let peer = new Peer();
// Un tableau pour stocker les connexions de tous les clients connectés
let connectedClients = []; 

peer.on('open', (id) => {
    console.log(`Code de la partie (Multi-clients) : ${id}`);
});

// Écouter les connexions de CHAQUE nouveau client
peer.on('connection', (conn) => {
    console.log(`Un nouveau client s'est connecté : ${conn.peer}`);
    
    // 1. Ajouter ce client à notre liste
    connectedClients.push(conn);
    
    // 2. Configurer les écouteurs pour CE client spécifique
    setupClientListeners(conn);
});

function setupClientListeners(conn) {
    conn.on('data', (data) => {
        console.log(`Action reçue du client [${conn.peer}] :`, data);
        
        if (data.type === 'ADD_TO_QUEUE') {
            // On envoie l'action au Web Worker du Maître pour traitement
            gameWorker.postMessage({ 
                type: 'PLAYER_ACTION', 
                action: data.action,
                clientId: conn.peer // Optionnel : pour savoir quel client a agi
            });
        }
    });

    // Gérer la déconnexion d'un joueur
    conn.on('close', () => {
        console.log(`Le client ${conn.peer} a quitté la partie.`);
        connectedClients = connectedClients.filter(c => c.peer !== conn.peer);
    });
}

// --- FONCTION DE DIFFUSION (BROADCAST) ---
// À appeler lorsque le Web Worker renvoie les nouvelles positions des fourmis
function broadcastToAllClients(antsData) {
    const message = { type: 'TICK_RENDER', antsData: antsData };
    
    connectedClients.forEach(client => {
        // On vérifie que la connexion est bien ouverte avant d'envoyer
        if (client.open) {
            client.send(message);
        }
    });
}

// Mise à jour de l'écouteur du Worker côté Maître
gameWorker.onmessage = function(event) {
    const { type, antsData } = event.data;
    
    if (type === 'TICK_RENDER') {
        // 1. Le maître affiche le jeu sur son écran
        renderGame(antsData);
        
        // 2. Le maître envoie les positions à tous les autres joueurs
        broadcastToAllClients(antsData);
    }
};*/

// Offscreen canvas

var config = {
    mapSize: [100, 100],
    cellSize: 10
}

// 1. Récupérer le canvas visible du HTML
const mainCanvas = document.getElementById('gameCanvas');
const mainCtx = mainCanvas.getContext('2d');
config.vueSize = [mainCanvas.height, mainCanvas.width];

// 2. Créer le Canvas Hors-Écran (invisible)
const offscreenCanvas = document.createElement('canvas');
offscreenCanvas.width = mainCanvas.width;
offscreenCanvas.height = mainCanvas.height;
const offscreenCtx = offscreenCanvas.getContext('2d');

const globalMapCanvas = document.createElement('canvas');
globalMapCanvas.width = config.mapSize[1] * config.cellSize;
globalMapCanvas.height = config.mapSize[0] * config.cellSize;
const globalMapCtx = globalMapCanvas.getContext('2d');
document.children[0].children[1].appendChild(globalMapCanvas);

function renderMap(grid) {
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
}

var Grid = undefined;
function renderGame(grid) {
    Grid = grid;
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

const spritesTerrain = new Image();
spritesTerrain.src = './ImgTlbx_tr(2471)x(4479)[1].png';

var Assets = {
    sb: [spritesTerrain, 160, 10, 140, 140],
    tr: [spritesTerrain, 313, 10, 140, 140]
};


gameWorker.postMessage({ type: 'CONFIG', action: config });

var Camera = {
    x: 0,
    y: 0
};

// Controle de la camera
function clampCamera() {
    Camera.x = Math.max(0, Math.min(Camera.x, globalMapCanvas.width - mainCanvas.width));
    Camera.y = Math.max(0, Math.min(Camera.y, globalMapCanvas.height - mainCanvas.height));
    worker.postMessage({ type: 'CAMERA_UPDATE', camera: Camera });
}

const cameraMoveSpeed = 40;

window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        Camera.y -= cameraMoveSpeed;
    } else if (event.key === 'ArrowDown') {
        Camera.y += cameraMoveSpeed;
    } else if (event.key === 'ArrowLeft') {
        Camera.x -= cameraMoveSpeed;
    } else if (event.key === 'ArrowRight') {
        Camera.x += cameraMoveSpeed;
    } else {
        return;
    }

    clampCamera();
    if (Grid) renderGame(Grid);
});

let isPointerDown = false;
let pointerStart = { x: 0, y: 0 };
let cameraStart = { x: 0, y: 0 };

mainCanvas.addEventListener('pointerdown', (event) => {
    isPointerDown = true;
    pointerStart = { x: event.clientX, y: event.clientY };
    cameraStart = { x: Camera.x, y: Camera.y };
    mainCanvas.setPointerCapture(event.pointerId);
});

mainCanvas.addEventListener('pointermove', (event) => {
    if (!isPointerDown) return;
    const dx = event.clientX - pointerStart.x;
    const dy = event.clientY - pointerStart.y;
    Camera.x = cameraStart.x - dx;
    Camera.y = cameraStart.y - dy;
    clampCamera();
    if (Grid) renderGame(Grid);
});

mainCanvas.addEventListener('pointerup', (event) => {
    isPointerDown = false;
    mainCanvas.releasePointerCapture(event.pointerId);
});

mainCanvas.addEventListener('pointercancel', (event) => {
    isPointerDown = false;
    mainCanvas.releasePointerCapture(event.pointerId);
});





