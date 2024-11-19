const routes = {
    '/': 'transmision',
    '/rostros': 'rostros',
    '/notificaciones': 'notificaciones'
};

// Contenido de las páginas
const pageContent = {
    transmision: `
        <div class="container">
            <h1>Transmisión en Vivo</h1>
            <div>
                <button id="startButton" class="button">Iniciar Cámara</button>
                <button id="stopButton" class="button stop" style="display: none;">Detener</button>
            </div>
            <div id="videoContainer">
                <video id="video" playsinline autoplay></video>
                <canvas id="canvas"></canvas>
            </div>
        </div>
    `,
    rostros: `
        <div class="container">
            <h1>Registro de Rostros</h1>
            <div>
                <button id="addFaceButton" class="button">Agregar Nuevo Rostro</button>
            </div>
            <div class="faces-grid">
                <!-- Aquí se cargarán los rostros registrados -->
            </div>
        </div>
    `,
    notificaciones: `
        <div class="container">
            <h1>Notificaciones</h1>
            <div class="notification-list">
                <!-- Aquí se cargarán las notificaciones -->
            </div>
        </div>
    `
};

// Función para manejar la navegación
function router() {
    const path = window.location.hash.slice(1) || '/';
    const page = routes[path] || 'transmision';
    
    // Actualizar contenido
    document.getElementById('app').innerHTML = pageContent[page];
    
    // Actualizar clase activa en la navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.route === page) {
            link.classList.add('active');
        }
    });

    // Inicializar los controladores específicos de cada página
    if (page === 'transmision') {
        initTransmision();
    } else if (page === 'rostros') {
        initRostros();
    } else if (page === 'notificaciones') {
        initNotificaciones();
    }
}

function router() {
    const path = window.location.hash.slice(1) || '/';
    const page = routes[path] || 'transmision';
    
    // Agregar clase de transición
    const appContainer = document.getElementById('app');
    appContainer.style.opacity = '0';
    
    setTimeout(() => {
        // Actualizar contenido
        appContainer.innerHTML = pageContent[page];
        
        // Restaurar opacidad con animación
        appContainer.style.opacity = '1';
        appContainer.classList.add('page-transition');
        
        // Actualizar clase activa en la navegación
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.route === page) {
                link.classList.add('active');
            }
        });

        // Inicializar los controladores específicos de cada página
        if (page === 'transmision') {
            initTransmision();
        } else if (page === 'rostros') {
            initRostros();
        } else if (page === 'notificaciones') {
            initNotificaciones();
        }
    }, 300);
}

// Inicializar el router
window.addEventListener('hashchange', router);
window.addEventListener('load', router);