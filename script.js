



// SERVICE WORKER

// 1. Initialisation du Worker
const gameWorker = new Worker('./worker.js');

// 2. Écouter les données envoyées par le Worker (les positions des fourmis)
gameWorker.onmessage = function(event) {
    const { type, grid } = event.data;
    
    if (type === 'TICK_RENDER') {
        // Appeler votre fonction de rendu ici avec antsData
        renderGame(grid);
    }

    if (type === 'BG_RENDER') {
        // Appeler votre fonction de rendu ici avec antsData
        renderBg(grid);
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

// 1. Récupérer le canvas visible du HTML
const mainCanvas = document.getElementById('gameCanvas');
const mainCtx = mainCanvas.getContext('2d');

// 2. Créer le Canvas Hors-Écran (invisible)
const offscreenCanvas = document.createElement('canvas');
offscreenCanvas.width = mainCanvas.width;
offscreenCanvas.height = mainCanvas.height;
const offscreenCtx = offscreenCanvas.getContext('2d');

function renderBg(grid) {
    // A. Effacer le canvas principal
    offscreenCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    
    // C. Dessiner la grille :
    const cellSize = 4; // Taille de chaque cellule
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === 1) {
                offscreenCtx.fillStyle = 'black';
            } else {
                offscreenCtx.fillStyle = 'lightgray';
            }
            offscreenCtx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}

var Grid = undefined;
function renderGame(grid) {
    Grid = grid;
    // A. Effacer le canvas principal
    mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    
    // B. "Blitter" (copier) le fond pré-calculé d'un seul coup (Très rapide !)
    mainCtx.drawImage(offscreenCanvas, 0, 0);
    
    // C. Dessiner la grille :
    const cellSize = 4; // Taille de chaque cellule
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === 1) {
                mainCtx.fillStyle = 'green';
            mainCtx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);}
        }
    }
}



