// Variables globales para la transmisión
let stream = null;
let detectInterval = null;

// Funciones de inicialización para cada página
function initTransmision() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    
    if (!video || !canvas || !startButton || !stopButton) return;

    const ctx = canvas.getContext('2d');
    
    // Configurar el tamaño del canvas
    canvas.width = 640;
    canvas.height = 480;

    startButton.addEventListener('click', async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: 640,
                    height: 480
                } 
            });
            video.srcObject = stream;
            startButton.style.display = 'none';
            stopButton.style.display = 'inline-block';
            startDetection(video, canvas, ctx);
        } catch (err) {
            console.error('Error al acceder a la cámara:', err);
            alert('No se pudo acceder a la cámara. Por favor, verifica los permisos.');
        }
    });

    stopButton.addEventListener('click', () => {
        stopDetection();
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }
        video.srcObject = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        startButton.style.display = 'inline-block';
        stopButton.style.display = 'none';
    });
}

function initRostros() {
    const addFaceButton = document.getElementById('addFaceButton');
    if (!addFaceButton) return;

    loadRegisteredFaces();
    
    addFaceButton.addEventListener('click', () => {
        // Aquí irá la lógica para agregar nuevos rostros
        console.log('Implementar función para agregar rostros');
    });
}

function initNotificaciones() {
    loadNotifications();
}

// Funciones auxiliares
function startDetection(video, canvas, ctx) {
    detectInterval = setInterval(() => detectFaces(video, canvas, ctx), 100);
}

function stopDetection() {
    if (detectInterval) {
        clearInterval(detectInterval);
        detectInterval = null;
    }
}

async function detectFaces(video, canvas, ctx) {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg');

    try {
        const response = await fetch('http://localhost:5000/detect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: imageData
            })
        });

        const data = await response.json();
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        data.faces.forEach(face => {
            ctx.strokeRect(face.x, face.y, face.w, face.h);
        });
    } catch (error) {
        console.error('Error en la detección:', error);
    }
}

async function loadRegisteredFaces() {
    const facesGrid = document.querySelector('.faces-grid');
    if (!facesGrid) return;

    // Aquí deberías hacer una llamada a tu API para obtener los rostros registrados
    // Por ahora, mostraremos datos de ejemplo
    const sampleFaces = [
        { id: 1, name: 'Usuario 1', timestamp: '2024-01-01' },
        { id: 2, name: 'Usuario 2', timestamp: '2024-01-02' },
    ];

    facesGrid.innerHTML = sampleFaces.map(face => `
        <div class="face-card">
            <h3>${face.name}</h3>
            <p>Registrado: ${face.timestamp}</p>
            <button class="button" onclick="editFace(${face.id})">Editar</button>
        </div>
    `).join('');
}

async function loadNotifications() {
    const notificationList = document.querySelector('.notification-list');
    if (!notificationList) return;

    // Aquí deberías hacer una llamada a tu API para obtener las notificaciones
    // Por ahora, mostraremos datos de ejemplo
    const sampleNotifications = [
        { id: 1, message: 'Rostro no reconocido detectado', timestamp: '2024-01-01 10:00' },
        { id: 2, message: 'Nuevo registro de acceso', timestamp: '2024-01-02 15:30' },
    ];

    notificationList.innerHTML = sampleNotifications.map(notification => `
        <div class="notification-item">
            <div>
                <h3>${notification.message}</h3>
                <p>${notification.timestamp}</p>
            </div>
        </div>
    `).join('');
}

function editFace(id) {
    // Implementar la lógica de edición de rostros
    console.log('Editar rostro:', id);
}