const UrlGeoserver = "https://sit.chaco.gob.ar/geoserver/";

// Función para obtener el link de la capa GeoServer
function ObtenerLinkJsonGeoserver (espacio, capa){ //parametros espacio de trabajo y nombre de capa 
      return UrlGeoserver+espacio+"/ows?service=wfs&version=1.0.0&request=GetFeature&typeName="+espacio+":"+capa+"&srsNAME=urn:ogc:def:crs:OGC:1.3:CRS84&outputFormat=json";
}

// Función para obtener el link de la capa GeoServer con filtro por...
function ObtenerLinkJsonGeoserverFiltro (espacio, capa, campo, valor){
    const filtro = `&CQL_FILTER=${campo} ILIKE '%25${valor}%25'`;
    return UrlGeoserver+espacio+"/ows?service=wfs&version=1.0.0&request=GetFeature&typeName="+espacio+":"+capa+"&srsNAME=urn:ogc:def:crs:OGC:1.3:CRS84&outputFormat=json"+filtro;
}


/* Llamo a la capa y la agrego al mapa SIN FILTROS NI NADA VITE
const url = ObtenerLinkJsonGeoserver("cite", "Restitucion_final_Mayo2025");
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const capaGeoJSON = L.geoJson(data, {
                style: {
                    color: 'blue',
                    weight: 1,
                    fillOpacity: 0.3
                },
                onEachFeature: function (feature, layer) {
                    // Acá armamos el contenido del popup con los atributos
                    if (feature.properties) {
                        const contenidoPopup = Object.entries(feature.properties)
                            .map(([clave, valor]) => `<b>${clave}:</b> ${valor}`)
                            .join("<br>");
                    
                        layer.bindPopup(contenidoPopup);
                    }
                }
            }).addTo(map);
        })
        .catch(error => console.error("Error al cargar capa GeoServer:", error)); */

let capaFiltrada = null; 

// Mostrar la capa por defecto al cargar el mapa
function cargarCapaCompleta() {
    const url = ObtenerLinkJsonGeoserver("cite", "Restitucion_final_Mayo2025");

    fetch(url)
        .then(response => response.json())
        .then(data => {
            capaFiltrada = L.geoJson(data, {
                style: {
                    color: 'blue',
                    weight: 1,
                    fillOpacity: 0.3
                },
                onEachFeature: function (feature, layer) {
                    if (feature.properties) {
                        const contenidoPopup = Object.entries(feature.properties)
                            .map(([k, v]) => `<b>${k}:</b> ${v}`).join("<br>");
                        layer.bindPopup(contenidoPopup);
                    }
                }
            }).addTo(map);
        })
        .catch(error => {
            console.error("Error al cargar capa completa:", error);
        });
}

cargarCapaCompleta();

function limpiarFiltro() {
    document.getElementById("inputCategoria").value = ""; // Limpia el input

    if (capaFiltrada) {
        map.removeLayer(capaFiltrada);
        capaFiltrada = null;
    }

    cargarCapaCompleta(); // Vuelve a mostrar toda la capa
}


// Filtrar capa por tal campo
function filtrarPorCategoria() {
    const valor = document.getElementById("inputCategoria").value.trim();

    if (valor === "") {
        limpiarFiltro(); 
        return;
    }

    if (!valor) {
        if (capaFiltrada) {
            map.removeLayer(capaFiltrada);
            capaFiltrada = null;
        }
        return;
    }

    const url = ObtenerLinkJsonGeoserverFiltro("cite", "Restitucion_final_Mayo2025", "categoria", valor);

    fetch(url)
        .then(response => response.json())
        .then(data => {

            if (capaFiltrada) {
                map.removeLayer(capaFiltrada);
            }

            capaFiltrada = L.geoJson(data, {
                style: {
                    color: 'blue',
                    weight: 1,
                    fillOpacity: 0.3
                },
                onEachFeature: function (feature, layer) {
                    if (feature.properties) {
                        const contenidoPopup = Object.entries(feature.properties)
                            .map(([k, v]) => `<b>${k}:</b> ${v}`).join("<br>");
                        layer.bindPopup(contenidoPopup);
                    }
                }
            }).addTo(map);
        })
        .catch(error => {
            console.error("Error al cargar capa GeoServer:", error);
            alert("No se encontraron resultados o hubo un error de conexión.");
        });
}