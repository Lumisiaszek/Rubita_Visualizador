// CARGANDO MAPA BASE CON COORDENADAS --------------------------------------------------------------------------------------------------------
var map = L.map('map', {
    zoomControl: false, 
    preferCanvas: true
    }).setView([-26.35, -60.28], 7.5);

    // Mapa base de OpenStreetMap    
    var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    // Mapa base CartoDB Gris
    var cartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19
    });

    // Mapa  Satelite
    var esriSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri'
    }).addTo(map);


    // Mapa NegroArcGis
    var ArcGis_Dark = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 19
    });

    var esriTopo = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 20,
        attribution: 'Tiles &copy; Esri'
    });

    // PANEL DE MAPAS BASES 
    var baseMaps = {
        "OpenStreetMap": osm,
        "Satelital": esriSatellite,
        "CartoDB Gris": cartoDB_Positron,
        "ESRI Dark": ArcGis_Dark,
        "ESRI Topo": esriTopo
    };
    L.control.layers(baseMaps, null, { position: 'topright' }).addTo(map);

    L.control.zoom({
        position: 'topright' 
        }).addTo(map);


/* VISIBILIDAD DEL PANEL DE CAPAS --------------------------------------------------------------------------------------------------------
function togglePanel() {
    var panel = document.getElementById("contenedorpanel");
    var icon = document.getElementById("toggle-icon");

    // Alternar la clase 'hidden' que oculta el panel
    panel.classList.toggle("hidden");

    // Cambiar el icono para mostrar/ocultar
    if (panel.classList.contains("hidden")) {
        icon.src = "./assets/iconos/flechader.png";  // Icono para mostrar el panel
        icon.style.width = "40px"; 
        icon.style.height = "auto"; 
    } else {
        icon.src = "./assets/iconos/flechaizq.png";  // Icono para ocultar el panel
        icon.style.width = "10px"; 
        icon.style.height = "auto"; 
    }
}


/* VISIBILIDAD DE CAPAS (OJOS) --------------------------------------------------------------------------------------------------------
function toggleLayer(layerType, button) {
    let layer;

    // Asignar la capa según el tipo
    if (layerType === 'urbano') {
        layer = parcurb;
    } else if (layerType === 'rural') {
        layer = parcrur;
    } else if (layerType === 'localidades') {
        layer = local_chaco;
    } else if (layerType === 'ejidos') {
        layer = lim_ejidos;
    } else if (layerType === 'areaurb') {
        layer = areasurb;
    } else if (layerType === 'redvial') {
        layer = red_vial;
    }

    const icon = button.querySelector("img");

    if (map.hasLayer(layer)) {
        map.removeLayer(layer);
        icon.src = './assets/iconos/icon_eyeclose.png';  
    } else {
        map.addLayer(layer);
        icon.src = './assets/iconos/icon_eyeopen.png';   
    }
}

function updateEyeIcon(layer, buttonId) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    const icon = button.querySelector("img");
    if (map.hasLayer(layer)) {
        icon.src = './assets/iconos/icon_eyeopen.png';
    } else {
        icon.src = './assets/iconos/icon_eyeclose.png';
    }
}*/

