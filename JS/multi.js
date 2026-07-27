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