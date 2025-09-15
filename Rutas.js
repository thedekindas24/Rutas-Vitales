let currentUser = null;
let currentMap = null;
let currentMapTargetId = null; 


const sampleRoutes = [
    { id: 1, name: "Paseo Histórico por el Centro", location: "Barcelona, España", distance: 5, duration: "1.5 horas", difficulty: "Fácil", difficultyLevel: 1, difficultyBadge: "bg-success", description: "Descubre los secretos del casco antiguo, visitando la catedral, el barrio gótico y las Ramblas.", img: "https://source.unsplash.com/400x300/?barcelona,gothic-quarter", rating: 4.0, ratingCount: 120, elevation: "20m", calories: 250, pois: ["Catedral de Barcelona", "Barrio Gótico", "Las Ramblas", "Mercado de La Boqueria"], recommendations: "Calzado cómodo, agua, cámara de fotos.", startAccess: "Metro L3 Liceu o Jaume I.", type: "city", activity: "caminar", coords: [41.3851, 2.1734], comments: [{user: "Viajero Feliz", rating: 4, text: "Muy bonito, aunque mucha gente en Las Ramblas.", date: "Hace 1 semana"}, {user: "Caminante Urbano", rating: 5, text: "Perfecto para conocer la historia de la ciudad.", date: "Hace 3 días"}] },
    { id: 2, name: "Ascenso al Pico Mirador", location: "Sierra Nevada, España", distance: 12, duration: "5 horas", difficulty: "Difícil", difficultyLevel: 3, difficultyBadge: "bg-danger", description: "Una ruta exigente que te lleva a una de las cumbres más emblemáticas, con vistas panorámicas impresionantes de la cordillera.", img: "https://source.unsplash.com/400x300/?sierra-nevada,mountain-peak", rating: 4.7, ratingCount: 85, elevation: "1200m", calories: 1000, pois: ["Refugio Poqueira", "Cumbre Veleta (vistas)", "Laguna de las Yeguas"], recommendations: "Botas de montaña, ropa de abrigo (incluso en verano), comida energética, agua abundante, protector solar.", startAccess: "Parking Hoya de la Mora (Güéjar Sierra).", type: "mountain", activity: "senderismo", coords: [37.053, -3.317], comments: [{user: "Montañero Pro", rating: 5, text: "¡Vistas que quitan el aliento! Dura pero vale cada paso.", date: "Hace 2 semanas"}] },
    { id: 3, name: "Vuelta al Parque Grande", location: "Zaragoza, España", distance: 7, duration: "1 hora", difficulty: "Fácil", difficultyLevel: 1, difficultyBadge: "bg-success", description: "Un agradable recorrido por el pulmón verde de la ciudad, el Parque Grande José Antonio Labordeta. Ideal para correr, pasear o ir en bici.", img: "https://source.unsplash.com/400x300/?zaragoza,park", rating: 4.2, ratingCount: 200, elevation: "10m", calories: 300, pois: ["Fuente de los Incrédulos", "Estatua Alfonso I El Batallador", "Jardín Botánico", "Río Huerva"], recommendations: "Perfecta para cualquier momento del día. Hay fuentes de agua.", startAccess: "Varias entradas al parque, bien comunicado por transporte público.", type: "city", activity: "correr", coords: [41.6361, -0.8935], comments: [] },
    { id: 4, name: "Ruta Costera de Calas Escondidas", location: "Costa Brava, España", distance: 8, duration: "3 horas", difficulty: "Moderada", difficultyLevel: 2, difficultyBadge: "bg-warning", description: "Explora calas vírgenes y acantilados impresionantes en este sendero costero. Ideal para los amantes del mar y la naturaleza.", img: "https://source.unsplash.com/400x300/?costa-brava,cliffs", rating: 4.9, ratingCount: 150, elevation: "150m", calories: 500, pois: ["Cala Aiguablava", "Cala Sa Tuna", "Faro de Sant Sebastià"], recommendations: "Bañador, toalla, escarpines, protector solar y agua.", startAccess: "Desde el pueblo de Begur o Tamariu.", type: "mountain", activity: "senderismo", coords: [41.9550, 3.2080], comments: [] }
];


const sampleChallenges = [
    { id: "novice_explorer", name: "Explorador Novato", description: "Completa tu primera ruta (ciudad o montaña).", points: 50, icon: "fa-shoe-prints", condition: (user) => user.completedRoutes.length >= 1 },
    { id: "urban_passport", name: "Pasaporte Urbano", description: "Completa 3 rutas diferentes en ciudad.", points: 100, icon: "fa-city", condition: (user) => user.completedRoutes.filter(rId => sampleRoutes.find(r=>r.id === rId)?.type === 'city').length >= 3 },
    { id: "peak_conqueror", name: "Conquistador de Cimas", description: "Completa 3 rutas diferentes en montaña.", points: 150, icon: "fa-mountain", condition: (user) => user.completedRoutes.filter(rId => sampleRoutes.find(r=>r.id === rId)?.type === 'mountain').length >= 3 },
    { id: "photo_adventurer", name: "Fotógrafo Aventurero", description: "Sube 5 fotos de tus rutas a la comunidad.", points: 75, icon: "fa-camera-retro", condition: (user) => user.uploadedPhotos >= 5 },
    { id: "constructive_critic", name: "Crítico Constructivo", description: "Comenta y valora 3 rutas.", points: 50, icon: "fa-comments", condition: (user) => user.routeComments >= 3 },  
];


let sampleCommunityPosts = [
    { id: 1, userId: "AnaAventurera", userAvatar: "https://i.pravatar.cc/40?u=AnaAventurera", image: "https://source.unsplash.com/600x400/?city,sunset", description: "¡Atardecer espectacular desde el mirador de la ciudad! Ruta: Paseo Histórico por el Centro.", routeId: 1, likes: 12, comments: [], timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) }, // Hace 3 horas
    { id: 2, userId: "CarlosSenderista", userAvatar: "https://i.pravatar.cc/40?u=CarlosSenderista", image: "https://source.unsplash.com/600x400/?mountain,hiking", description: "¡Cumbre conquistada! El Ascenso al Pico Mirador es duro pero recompensa. #senderismo #naturaleza", routeId: 2, likes: 25, comments: [], timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Hace 1 día
];



function showPage(pageId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo(0, 0); 
    }

    const bsCollapse = document.getElementById('navbarNav') ? new bootstrap.Collapse(document.getElementById('navbarNav'), {toggle: false}) : null;
    if (bsCollapse && window.innerWidth < 992 && bsCollapse._element.classList.contains('show')) { bsCollapse.hide();
    }

    if (pageId === 'route-detail-page' && currentMapTargetId) {
        const route = sampleRoutes.find(r => r.id === currentMapTargetId);
        if(route) initMap(route.coords[0], route.coords[1], route.name);
    } else if (pageId !== 'route-detail-page' && currentMap) {
        
    }
}


function handleRegistration(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const acceptTerms = document.getElementById('regAcceptTerms').checked;

    if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return;
    }
    if (!acceptTerms) {
        alert("Debes aceptar los términos y condiciones.");
        return;
    }
    
    
    alert(`¡Cuenta creada para ${username}! Por favor, inicia sesión.`);
    document.getElementById('registerForm').reset();
    showPage('login-page');
}

function handleLogin(e) {
    e.preventDefault();
    const usernameOrEmail = document.getElementById('loginEmail').value;
    
    currentUser = {
        username: usernameOrEmail.split('@')[0], 
        email: usernameOrEmail,
        preferences: {},
        points: 0,
        level: 'Principiante',
        completedRoutes: [],
        favoriteRoutes: [],
        uploadedPhotos: 0,
        routeComments: 0,
        achievements: [] 
    };
    localStorage.setItem('rutaActivaUser', JSON.stringify(currentUser));
    updateUIForLoggedInUser();
    document.getElementById('onboardingUsername').textContent = currentUser.username;
    showPage('onboarding-page');
}

function handleOnboarding(e) {
    e.preventDefault();
    if (!currentUser) return;
    currentUser.preferences = {
        activityLevel: document.getElementById('activityLevel').value,
        interests: Array.from(document.querySelectorAll('#onboardingForm input[type="checkbox"][id^="interest"]:checked')).map(cb => cb.value),
        preferredActivities: Array.from(document.querySelectorAll('#onboardingForm input[type="checkbox"][id^="activity"]:checked')).map(cb => cb.value),
        timeAvailability: document.getElementById('timeAvailability').value,
        activityCompanion: document.getElementById('activityCompanion').value
    };
    localStorage.setItem('rutaActivaUser', JSON.stringify(currentUser));
    alert('¡Preferencias guardadas! Ya puedes explorar rutas.');
    updateUserProfileData(); 
    showPage('explore-routes');
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('rutaActivaUser');
    updateUIForLoggedOutUser();
    showPage('landing-page');
}

function updateUIForLoggedInUser() {
    document.getElementById('nav-login').classList.add('d-none');
    document.getElementById('nav-register').classList.add('d-none');
    document.getElementById('nav-profile').classList.remove('d-none');
    document.getElementById('nav-challenges').classList.remove('d-none');
    document.getElementById('nav-community').classList.remove('d-none');
    document.getElementById('nav-logout').classList.remove('d-none');

    if (currentUser) {
        updateUserProfileData();
        renderChallenges();
        populateUploadRouteTags(); 
    }
}

function updateUIForLoggedOutUser() {
    document.getElementById('nav-login').classList.remove('d-none');
    document.getElementById('nav-register').classList.remove('d-none');
    document.getElementById('nav-profile').classList.add('d-none');
    document.getElementById('nav-challenges').classList.add('d-none');
    document.getElementById('nav-community').classList.add('d-none');
    document.getElementById('nav-logout').classList.add('d-none');
}

function updateUserProfileData() {
    if (!currentUser) return;
    document.getElementById('profileUsernameDisplay').textContent = currentUser.username;
    document.getElementById('settingsUsername').value = currentUser.username;
    
    document.getElementById('profileUserBio').textContent = currentUser.preferences?.bio || "Añade una bio en configuración.";
    document.getElementById('profileUserCity').textContent = currentUser.preferences?.city || "Añade tu ciudad.";

    
    const cityRoutesCount = currentUser.completedRoutes.filter(rId => sampleRoutes.find(r=>r.id === rId)?.type === 'city').length;
    const mountainRoutesCount = currentUser.completedRoutes.filter(rId => sampleRoutes.find(r=>r.id === rId)?.type === 'mountain').length;
    document.getElementById('profileCityRoutes').textContent = cityRoutesCount;
    document.getElementById('profileMountainRoutes').textContent = mountainRoutesCount;
    

    renderFavoriteRoutes();
    renderUserAchievements();
}

function handleProfileSettingsSave(e) {
    e.preventDefault();
    if (!currentUser) return;

    currentUser.username = document.getElementById('settingsUsername').value;
    
    currentUser.preferences.bio = document.getElementById('settingsBio').value;
    currentUser.preferences.city = document.getElementById('settingsCity').value;


    

    localStorage.setItem('rutaActivaUser', JSON.stringify(currentUser));
    alert("Perfil actualizado.");
    updateUserProfileData(); 
    showPage('user-profile');
}



function renderRoutes(routesToRender = sampleRoutes) {
    const routeListContainer = document.getElementById('routeList');
    if (!routeListContainer) return;
    routeListContainer.innerHTML = '';

    if (routesToRender.length === 0) {
        routeListContainer.innerHTML = '<p class="text-center col-12">No se encontraron rutas con los filtros seleccionados.</p>';
        return;
    }

    routesToRender.forEach(route => {
        const col = document.createElement('div');
        col.className = 'col-lg-4 col-md-6 mb-4'; 
        col.innerHTML = `
            <div class="card route-card h-100 shadow-sm">
                <img src="${route.img}" class="card-img-top" alt="${route.name}">
                <div class="card-body">
                    <div>
                        <h5 class="card-title">${route.name}</h5>
                        <p class="card-text text-muted small"><i class="fas fa-map-marker-alt me-1"></i> ${route.location}</p>
                        <ul class="list-unstyled small mb-2">
                            <li><i class="fas fa-ruler-horizontal me-1 text-primary"></i> Distancia: ${route.distance} km</li>
                            <li><i class="far fa-clock me-1 text-primary"></i> Duración: ${route.duration}</li>
                            <li><i class="fas fa-tachometer-alt me-1 text-primary"></i> Dificultad: <span class="badge ${route.difficultyBadge}">${route.difficulty}</span></li>
                        </ul>
                        <p class="card-text small d-none d-lg-block">${route.description.substring(0,70)}...</p>
                    </div>
                    <div class="mt-auto d-flex justify-content-between align-items-center">
                        <span class="text-warning small">
                            ${getStarRatingHTML(route.rating)} (${route.rating.toFixed(1)})
                        </span>
                        <button class="btn btn-sm btn-outline-primary" onclick="showRouteDetailPage(${route.id})">Ver Detalles</button>
                    </div>
                </div>
            </div>
        `;
        routeListContainer.appendChild(col);
    });
}

function getStarRatingHTML(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

function showRouteDetailPage(routeId) {
    const route = sampleRoutes.find(r => r.id === routeId);
    if (!route) {
        console.error('Ruta no encontrada');
        return;
    }
    currentMapTargetId = routeId;

    document.getElementById('routeNameDetail').textContent = route.name;
    document.getElementById('routeLocationDetail').textContent = route.location;

    const carouselInner = document.querySelector('#routeCarousel .carousel-inner');
    carouselInner.innerHTML = `<div class="carousel-item active"><img src="${route.img.replace('400x300', '800x400').replace('?','')}" class="d-block w-100" alt="${route.name}"></div>`; // Usar imagen más grande

    document.getElementById('routeDescriptionDetail').textContent = route.description;

    const poiList = document.getElementById('routePOIDetail');
    poiList.innerHTML = '';
    route.pois.forEach(poi => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = poi;
        poiList.appendChild(li);
    });

    document.getElementById('routeDistanceDetail').textContent = route.distance;
    document.getElementById('routeElevationDetail').textContent = route.elevation;
    document.getElementById('routeTimeDetail').textContent = route.duration;
    document.getElementById('routeCaloriesDetail').textContent = route.calories;
    const difficultyBadge = document.getElementById('routeDifficultyDetail');
    difficultyBadge.textContent = route.difficulty;
    difficultyBadge.className = `badge ${route.difficultyBadge}`;

    document.getElementById('routeRecommendationsDetail').textContent = route.recommendations;
    document.getElementById('routeStartAccessDetail').textContent = route.startAccess;

    document.getElementById('routeRatingCount').textContent = route.ratingCount + (route.comments?.length || 0);
    document.getElementById('routeOverallRatingStars').innerHTML = `${getStarRatingHTML(route.rating)} ${route.rating.toFixed(1)}`;

    renderRouteComments(routeId);
    showPage('route-detail-page');
}

function handleRouteFilters() {
    const searchTerm = document.getElementById('routeSearchInput').value.toLowerCase();
    const environment = document.getElementById('filterEnvironment').value;
    const activityType = document.getElementById('filterActivityType').value;
    const difficulty = document.getElementById('filterDifficulty').value;

    let filteredRoutes = sampleRoutes.filter(route => {
        const nameMatch = route.name.toLowerCase().includes(searchTerm) || route.location.toLowerCase().includes(searchTerm);
        const envMatch = environment === 'all' || route.type === environment || (environment === 'both' && (route.type === 'city' || route.type === 'mountain'));
        const activityMatch = activityType === 'all' || route.activity === activityType;
        const difficultyMatch = difficulty === 'all' || route.difficulty.toLowerCase() === difficulty;
        


        return nameMatch && envMatch && activityMatch && difficultyMatch;
    });
    renderRoutes(filteredRoutes);
}

function renderRouteComments(routeId) {
    const route = sampleRoutes.find(r => r.id === routeId);
    const commentsContainer = document.getElementById('routeCommentsContainer');
    commentsContainer.innerHTML = ''; 

    if (route && route.comments && route.comments.length > 0) {
        route.comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'card mb-3';
            commentDiv.innerHTML = `
                <div class="card-body">
                    <strong>${comment.user}:</strong> <span class="text-warning">${getStarRatingHTML(comment.rating)}</span>
                    <p>${comment.text}</p>
                    <small class="text-muted">${comment.date}</small>
                </div>
            `;
            commentsContainer.appendChild(commentDiv);
        });
    } else {
        commentsContainer.innerHTML = '<p class="text-muted">No hay comentarios aún. ¡Sé el primero!</p>';
    }
}

function handleCommentSubmit(e) {
    e.preventDefault();
    if (!currentUser || !currentMapTargetId) {
        alert("Debes iniciar sesión para comentar.");
        return;
    }
    const route = sampleRoutes.find(r => r.id === currentMapTargetId);
    if (!route) return;

    const rating = parseInt(document.getElementById('commentRating').value);
    const text = document.getElementById('commentText').value;

    if (!text.trim()) {
        alert("El comentario no puede estar vacío.");
        return;
    }

    const newComment = {
        user: currentUser.username,
        rating: rating,
        text: text,
        date: "Ahora mismo" 
    };

    if (!route.comments) route.comments = [];
    route.comments.unshift(newComment); 

    
    route.ratingCount = (route.ratingCount || 0) + 1;
    
    const totalRatingSum = route.comments.reduce((sum, c) => sum + c.rating, 0);
    route.rating = parseFloat((totalRatingSum / route.comments.length).toFixed(1));


    currentUser.routeComments = (currentUser.routeComments || 0) + 1;
    checkAndAwardAchievements();
    localStorage.setItem('rutaActivaUser', JSON.stringify(currentUser));


    document.getElementById('commentForm').reset();
    renderRouteComments(currentMapTargetId); 
    
    document.getElementById('routeRatingCount').textContent = route.ratingCount;
    document.getElementById('routeOverallRatingStars').innerHTML = `${getStarRatingHTML(route.rating)} ${route.rating.toFixed(1)}`;
    alert("Comentario publicado.");
}


function initMap(lat, lng, markerTitle = "Punto de Interés") {
    const mapContainer = document.getElementById('mapDetail');
    if (!mapContainer) return;

    if (currentMap) {
        currentMap.remove();
        currentMap = null;
    }

    if (typeof L === 'undefined' || !mapContainer.offsetParent) {
        console.warn("Leaflet no cargado o contenedor de mapa no visible. Se intentará inicializar.");
        
    }

    try {
        currentMap = L.map('mapDetail').setView([lat, lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(currentMap);
        L.marker([lat, lng]).addTo(currentMap)
            .bindPopup(markerTitle)
            .openPopup();

        
        setTimeout(() => {
            if (currentMap) currentMap.invalidateSize();
        }, 100);

    } catch (error) {
        console.error("Error inicializando el mapa:", error);
        mapContainer.innerHTML = "<p class='text-center text-danger'>Error al cargar el mapa. Intenta recargar la página.</p>";
    }
}


function renderChallenges() {
    if (!currentUser) return;
    const challengesContainer = document.getElementById('challengesListContainer');
    if (!challengesContainer) return;
    challengesContainer.innerHTML = '';

    sampleChallenges.forEach(challenge => {
        const isCompleted = currentUser.achievements.includes(challenge.id);
        const challengeDiv = document.createElement('div');
        challengeDiv.className = `list-group-item list-group-item-action ${isCompleted ? 'list-group-item-success' : ''}`;
        challengeDiv.innerHTML = `
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1"><i class="fas ${challenge.icon} me-2"></i>${challenge.name} ${isCompleted ? '<span class="badge bg-success">¡Completado!</span>' : ''}</h5>
                <small>+${challenge.points} puntos</small>
            </div>
            <p class="mb-1 small">${challenge.description}</p>
            ${!isCompleted && challenge.progress ? `<div class="progress mt-1" style="height: 5px;"><div class="progress-bar bg-warning" role="progressbar" style="width: ${challenge.progress(currentUser)}%;"></div></div>` : ''}
        `;
        challengesContainer.appendChild(challengeDiv);
    });

    
    document.getElementById('userPoints').textContent = currentUser.points;
    document.getElementById('userLevel').textContent = currentUser.level;
    
    
    const pointsForNextLevel = 1000; 
    const progressPercent = (currentUser.points / pointsForNextLevel) * 100;
    const progressBar = document.getElementById('userPointsProgressBar');
    progressBar.style.width = `${Math.min(progressPercent, 100)}%`;
    progressBar.textContent = `${currentUser.points} / ${pointsForNextLevel} pts para sig. nivel`;
}

function checkAndAwardAchievements() {
    if (!currentUser) return;
    let achievementAwarded = false;
    sampleChallenges.forEach(challenge => {
        if (!currentUser.achievements.includes(challenge.id) && challenge.condition(currentUser)) {
            currentUser.achievements.push(challenge.id);
            currentUser.points += challenge.points;
            achievementAwarded = true;
            alert(`¡Logro desbloqueado: ${challenge.name}! Has ganado ${challenge.points} puntos.`);
            
        }
    });
    if (achievementAwarded) {
        localStorage.setItem('rutaActivaUser', JSON.stringify(currentUser));
        renderChallenges(); 
        updateUserProfileData(); 
    }
}

function renderUserAchievements() {
    if (!currentUser) return;
    const container = document.getElementById('profileAchievementsContainer');
    if (!container) return;
    container.innerHTML = '';

    if (currentUser.achievements.length === 0) {
        container.innerHTML = '<p class="col-12 text-muted">Aún no has desbloqueado logros. ¡Sal a explorar!</p>';
        return;
    }

    currentUser.achievements.forEach(achId => {
        const achievement = sampleChallenges.find(ch => ch.id === achId);
        if (achievement) {
            const achDiv = document.createElement('div');
            achDiv.className = 'col-4 text-center mb-3';
            achDiv.innerHTML = `
                <i class="fas ${achievement.icon} achievement-icon" title="${achievement.name}"></i>
                <p class="small">${achievement.name}</p>
            `;
            container.appendChild(achDiv);
        }
    });
}

// --- COMUNIDAD ---
function renderCommunityFeed(postsToRender = sampleCommunityPosts) {
    const feedContainer = document.getElementById('communityPostsContainer');
    if (!feedContainer) return;
    feedContainer.innerHTML = '';

    postsToRender.sort((a,b) => b.timestamp - a.timestamp); 
    postsToRender.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.className = 'col-md-8 offset-md-2 mb-4';
        const routeName = post.routeId ? sampleRoutes.find(r => r.id === post.routeId)?.name : '';
        const timeAgo = formatTimeAgo(post.timestamp);

        postDiv.innerHTML = `
            <div class="card community-post shadow-sm">
                <div class="card-header bg-light py-2 px-3 d-flex align-items-center">
                    <img src="${post.userAvatar || 'https://via.placeholder.com/40.png?text=U'}" class="rounded-circle me-2" alt="User Avatar">
                    <a href="#" onclick="showOtherUserProfile('${post.userId}')" class="fw-bold text-decoration-none text-dark">${post.userId}</a>
                    <small class="text-muted ms-auto">${timeAgo}</small>
                </div>
                <img src="${post.image}" class="card-img-top" alt="Foto de ${routeName || 'ruta'}">
                <div class="card-body">
                    <p class="card-text">${post.description} ${routeName ? `Ruta: <a href="#" onclick="showRouteDetailPage(${post.routeId})">${routeName}</a>.` : ''}</p>
                    <div>
                        <button class="btn btn-sm btn-outline-danger"><i class="fas fa-heart"></i> Me Gusta (${post.likes})</button>
                        <button class="btn btn-sm btn-outline-secondary ms-1"><i class="fas fa-comment"></i> Comentar (${post.comments.length})</button>
                        <button class="btn btn-sm btn-outline-secondary ms-1"><i class="fas fa-share"></i> Compartir</button>
                    </div>
                </div>
            </div>
        `;
        feedContainer.appendChild(postDiv);
    });
}

function handleCommunityPostUpload() {
    if (!currentUser) {
        alert("Debes iniciar sesión para publicar.");
        return;
    }
    const fileInput = document.getElementById('uploadFile');
    const description = document.getElementById('uploadDescription').value;
    const routeTagId = document.getElementById('uploadRouteTag').value;
    

    if (!fileInput.files || fileInput.files.length === 0) {
        alert("Por favor, selecciona un archivo.");
        return;
    }
    const file = fileInput.files[0];

    
    const reader = new FileReader();
    reader.onload = function(e) {
        const newPost = {
            id: sampleCommunityPosts.length + 1,
            userId: currentUser.username,
            userAvatar: `https://i.pravatar.cc/40?u=${currentUser.username}`, 
            image: e.target.result, 
            description: description,
            routeId: routeTagId ? parseInt(routeTagId) : null,
            likes: 0,
            comments: [],
            timestamp: new Date()
        };
        sampleCommunityPosts.unshift(newPost); 
        renderCommunityFeed();

        currentUser.uploadedPhotos = (currentUser.uploadedPhotos || 0) + 1;
        checkAndAwardAchievements();
        localStorage.setItem('rutaActivaUser', JSON.stringify(currentUser));

        alert("Publicación subida con éxito (simulado).");
        const uploadModalEl = document.getElementById('uploadModal');
        const uploadModal = bootstrap.Modal.getInstance(uploadModalEl);
        if (uploadModal) uploadModal.hide();
        document.getElementById('uploadForm').reset();
    };
    reader.readAsDataURL(file); 
}

function populateUploadRouteTags() {
    const select = document.getElementById('uploadRouteTag');
    if (!select) return;
    select.innerHTML = '<option value="">Selecciona una ruta...</option>'; 
    sampleRoutes.forEach(route => {
        const option = document.createElement('option');
        option.value = route.id;
        option.textContent = route.name;
        select.appendChild(option);
    });
}

function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `Hace ${interval} años`;
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `Hace ${interval} meses`;
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `Hace ${interval} días`;
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `Hace ${interval} horas`;
    interval = Math.floor(seconds / 60);
    if (interval > 1) return `Hace ${interval} minutos`;
    return `Hace ${Math.floor(seconds)} segundos`;
}

function showOtherUserProfile(username) {
    alert(`Mostrando perfil de ${username}. (Funcionalidad a implementar)\nEn una app real, cargarías los datos de este usuario y los mostrarías en una vista de perfil pública.`);
}

function renderFavoriteRoutes() {
    if (!currentUser) return;
    const container = document.getElementById('profileFavoriteRoutes');
    if (!container) return;
    container.innerHTML = '';

    if (currentUser.favoriteRoutes.length === 0) {
        container.innerHTML = '<li class="list-group-item text-muted">No has añadido rutas a favoritos.</li>';
        return;
    }
    currentUser.favoriteRoutes.forEach(routeId => {
        const route = sampleRoutes.find(r => r.id === routeId);
        if (route) {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                <a href="#" onclick="showRouteDetailPage(${route.id})">${route.name}</a>
                <button class="btn btn-sm btn-outline-danger" onclick="toggleFavoriteRoute(${route.id}, this)">
                    <i class="fas fa-heart"></i> Quitar
                </button>
            `; 
            container.appendChild(li);
        }
    });
}



document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    
    document.getElementById('registerForm')?.addEventListener('submit', handleRegistration);
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('onboardingForm')?.addEventListener('submit', handleOnboarding);
    document.getElementById('profileSettingsForm')?.addEventListener('submit', handleProfileSettingsSave);
    document.getElementById('commentForm')?.addEventListener('submit', handleCommentSubmit);
    document.getElementById('publishUploadButton')?.addEventListener('click', handleCommunityPostUpload);


    
    document.getElementById('routeSearchInput')?.addEventListener('input', handleRouteFilters);
    document.getElementById('filterEnvironment')?.addEventListener('change', handleRouteFilters);
    document.getElementById('filterActivityType')?.addEventListener('change', handleRouteFilters);
    document.getElementById('filterDifficulty')?.addEventListener('change', handleRouteFilters);
    document.getElementById('applyFiltersButton')?.addEventListener('click', handleRouteFilters); 

    
    const storedUser = localStorage.getItem('rutaActivaUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        updateUIForLoggedInUser();
        if (currentUser.preferences && Object.keys(currentUser.preferences).length > 0) {
            showPage('explore-routes');
        } else {
            document.getElementById('onboardingUsername').textContent = currentUser.username;
            showPage('onboarding-page');
        }
    } else {
        updateUIForLoggedOutUser();
        showPage('landing-page');
    }

    renderRoutes(); 
    renderCommunityFeed(); 

    const ctx = document.getElementById('caloriesChart');
    if (ctx && typeof Chart !== 'undefined') {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Calorías Quemadas',
                    data: [300, 450, 600, 500, 750, 320, 480],
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: { scales: { y: { beginAtZero: true } }, responsive: true, maintainAspectRatio: false }
        });
    }
});