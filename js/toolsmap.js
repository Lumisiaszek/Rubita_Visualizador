// CARGANDO MAPA BASE CON COORDENADAS --------------------------------------------------------------------------------------------------------
var map = L.map('map', {
    zoomControl: false, 
    preferCanvas: true
    }).setView([-27.49, -58.97], 16);

    // Mapa base de OpenStreetMap    
    var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 22,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    // Mapa base CartoDB Gris
    var cartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 22,
    });

    // Mapa  Satelite
    var esriSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 22,
        attribution: 'Tiles &copy; Esri'
    }).addTo(map);


    // Mapa NegroArcGis
    var ArcGis_Dark = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 22,
    });

    var esriTopo = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 22,
        attribution: 'Tiles &copy; Esri'
    });

    var Rubita2023 = L.tileLayer('https://sit.chaco.gob.ar/public/tiles/Piramide_La_Rubita_2023/{z}/{x}/{y}.png', {
    maxZoom: 22,
    attribution: ''
    });

    var Rubita2024 = L.tileLayer('https://sit.chaco.gob.ar/public/tiles/Piramide_La_Rubita_2024/{z}/{x}/{y}.png', {
        maxZoom: 22,
        attribution: ''
    });

    var Rubita2025 = L.tileLayer('https://sit.chaco.gob.ar/public/tiles/Piramide_La_Rubita_2025/{z}/{x}/{y}.png', {
        maxZoom: 22,
        attribution: ''
    });

//PARA TRAER WMS - ejemplo cdt
    const overlayLayers = {};
    const ipgeoserversigide = ('http://idechaco.gob.ar/geoserver/wms') 

    var Cdt137 = L.tileLayer.wms(ipgeoserversigide, {
              layers: 'idechaco:nr_z1_MCh137',
              format: 'image/png',
              transparent: true,
              opacity: 1,
              maxZoom: 22
            });
          overlayLayers['nr_z1_MCh137'] = Cdt137;


    // PANEL DE MAPAS BASES 
    var baseMaps = {
        "OpenStreetMap": osm,
        "Satelital": esriSatellite,
        "CartoDB Gris": cartoDB_Positron,
        "ESRI Dark": ArcGis_Dark,
        "ESRI Topo": esriTopo,
    };

        var overlayMaps = {
        "Rubita 2023": Rubita2023,    
        "Rubita 2024": Rubita2024,
        "Rubita 2025": Rubita2025,
        "Cdt 137": Cdt137,
    };



    L.control.layers(baseMaps, overlayMaps, { position: 'topright' }).addTo(map);


    L.control.zoom({
        position: 'topright' 
        }).addTo(map);



    // Actualizar coordenadas en movimiento del mouse
    map.on("mousemove", function (e) {
    const lat = e.latlng.lat.toFixed(6);
    const lng = e.latlng.lng.toFixed(6);
    document.getElementById("textoCoordenadas").textContent = `Lat: ${lat}, Long: ${lng}`;
    });

    L.control.scale({
    position: 'bottomright', 
    imperial: false,         
    maxWidth: 150
    }).addTo(map);
