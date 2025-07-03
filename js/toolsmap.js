// CARGANDO MAPA BASE CON COORDENADAS --------------------------------------------------------------------------------------------------------
var map = L.map('map', {
    zoomControl: false, 
    preferCanvas: true
    }).setView([-27.49, -58.97], 16);

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

    var Rubita2024 = L.tileLayer('https://sit.chaco.gob.ar/public/tiles/Piramide_La_Rubita_2024/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: ''
    });

    var Rubita2025 = L.tileLayer('https://sit.chaco.gob.ar/public/tiles/Piramide_La_Rubita_2025/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: ''
    });
    

    // PANEL DE MAPAS BASES 
    var baseMaps = {
        "OpenStreetMap": osm,
        "Satelital": esriSatellite,
        "CartoDB Gris": cartoDB_Positron,
        "ESRI Dark": ArcGis_Dark,
        "ESRI Topo": esriTopo,
        "Rubita 2024": Rubita2024,
        "Rubita 2025": Rubita2025
    };
    L.control.layers(baseMaps, null, { position: 'topright' }).addTo(map);

    L.control.zoom({
        position: 'topright' 
        }).addTo(map);
