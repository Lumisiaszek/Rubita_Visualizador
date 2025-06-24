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


// ESPACIOS VERDES - RUBITA
function cargarCapaEspVerde() {
  const url = ObtenerLinkJsonGeoserver("AMGR", "espacio_verde_rubita");
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const capaGeoJSON = L.geoJson(data, {
                style: {
                    color: '#9FCF7D',
                    weight: 0.5,
                    fillOpacity: 0.5
                },
                onEachFeature: function (feature, layer) {
                  //PopUp
                    if (feature.properties) {
                        const contenidoPopup = Object.entries(feature.properties)
                            .map(([clave, valor]) => `<b>${clave}:</b> ${valor}`)
                            .join("<br>");
                    
                        layer.bindPopup(contenidoPopup);
                    }
                }
            }).addTo(map);
        })
        .catch(error => console.error("Error al cargar capa GeoServer:", error)); 
}

// CAPA PARCELARIO - RUBITA ESTA SE ESTA MOSTRANDO
function cargarCapaParcelario() {
    const url = ObtenerLinkJsonGeoserver("AMGR", "parcelario_rubita");
    fetch(url)
        .then(response => response.json())
        .then(data => {
            capaFiltrada = L.geoJson(data, {
                style: {
                    color: '#9E9E9E',
                    weight: 0.7,
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


// CAPA CAVAS - RUBITA 
function cargarCapaCavas() {
    const url = ObtenerLinkJsonGeoserver("AMGR", "cavas");
    fetch(url)
        .then(response => response.json())
        .then(data => {
            capaFiltrada = L.geoJson(data, {
                style: {
                    color: '#ACC4DB',
                    weight: 0.5,
                    fillOpacity: 0.5
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


cargarCapaEspVerde();
cargarCapaParcelario(); 
cargarCapaCavas();






//TABS DEL PANEL DE CAPAS
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    const tabId = tab.getAttribute('data-tab');
    document.getElementById('tab-' + tabId).classList.add('active');
  });
});





// Manejo de capas API - Registros BD

const capasActivas = {}; // Guarda las capas activadas para poder removerlas después

function cargarPanelCapas() {
  fetch("http://192.168.43.78/getcapas/P")
    .then(response => response.json())
    .then(capas => {
      const contenedor = document.getElementById("capasCheckboxContainer");
      contenedor.innerHTML = ""; // Limpiar antes de agregar

      capas.forEach(capa => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = capa.nombre;
        checkbox.checked = capa.visible;
        
        const label = document.createElement("label");
        label.htmlFor = capa.nombre;
        label.innerText = " " + capa.titulo;

        const div = document.createElement("div");
        div.classList.add("item-capa");
        div.appendChild(checkbox);
        div.appendChild(label);
        
        contenedor.appendChild(div);

        if (capa.visible) {
          agregarCapaAlMapa(capa);
        }

        checkbox.addEventListener("change", () => {
          if (checkbox.checked) {
            agregarCapaAlMapa(capa);
          } else {
            quitarCapaDelMapa(capa.nombre);
          }
        });
      });
    })
    .catch(err => {
      console.error("Error al cargar panel de capas:", err);
    });
}

function agregarCapaAlMapa(capa) {
  const url = ObtenerLinkJsonGeoserver(capa.espacio, capa.nombre);
  fetch(url)
    .then(resp => resp.json())
    .then(data => {
      const capaLeaflet = L.geoJson(data, {
        style: {
          color: 'blue',
          weight: 1,
          fillOpacity: 0.3
        },
        onEachFeature: function (feature, layer) {
          if (feature.properties) {
            const popupContent = Object.entries(feature.properties)
              .map(([k, v]) => `<b>${k}:</b> ${v}`).join("<br>");
            layer.bindPopup(popupContent);
          }
        }
      }).addTo(map);

      capasActivas[capa.nombre] = capaLeaflet;
    })
    .catch(error => {
      console.error("Error al cargar la capa:", error);
    });
}

function quitarCapaDelMapa(nombreCapa) {
  if (capasActivas[nombreCapa]) {
    map.removeLayer(capasActivas[nombreCapa]);
    delete capasActivas[nombreCapa];
  }
}

cargarPanelCapas();


