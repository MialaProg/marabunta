



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

// 3. Dessiner le décor de fond UNE SEULE FOIS (ou uniquement quand il change)
function drawStaticMap() {
    offscreenCtx.fillStyle = '#e5c19d'; // Couleur de la terre
    offscreenCtx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    
    // Dessiner des tunnels ou des obstacles statiques
    offscreenCtx.fillStyle = '#8b5a2b';
    offscreenCtx.fillRect(50, 50, 300, 40); // Exemple de tunnel
}
/*
// 4. Boucle de rendu principale (60 FPS)
function renderGame(antsData) {
    // A. Effacer le canvas principal
    mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    
    // B. "Blitter" (copier) le fond pré-calculé d'un seul coup (Très rapide !)
    mainCtx.drawImage(offscreenCanvas, 0, 0);
    
    // C. Dessiner les entités dynamiques (les fourmis) par-dessus avec positions arrondies
    antsData.forEach(ant => {
        const posX = (ant.x + 0.5) | 0; // Arrondi rapide en entier
        const posY = (ant.y + 0.5) | 0;
        
        // Exemple avec un carré (à remplacer par ctx.drawImage de votre Spritesheet)
        mainCtx.fillStyle = 'black';
        mainCtx.fillRect(posX, posY, 4, 4);
    });
}
*/

var Grid = undefined;
function renderGame(grid) {
    Grid = grid;
    // A. Effacer le canvas principal
    mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    
    // B. "Blitter" (copier) le fond pré-calculé d'un seul coup (Très rapide !)
    // mainCtx.drawImage(offscreenCanvas, 0, 0);
    
    // C. Dessiner la grille : 0=noir, 1=blanc
    const cellSize = 4; // Taille de chaque cellule
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === 1) {
                mainCtx.fillStyle = 'green';
            } else {
                mainCtx.fillStyle = 'black';
            }
            mainCtx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}



// Initialisation
drawStaticMap();

