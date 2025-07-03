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

//OCULTAR O MOSTRAR PANEL

function togglePanel() {
  const panel = document.getElementById("contenedorpanel");
  const toggle = document.getElementById("togglePanel");

  panel.classList.toggle("oculto");

  if (panel.classList.contains("oculto")) {
    toggle.innerHTML = "❯"; 
  } else {
    toggle.innerHTML = "❮"; 
  }
}

const capasGeoJSON = {};

// SECTORES - RUBITA
function cargarCapasSectores() {
  const url = ObtenerLinkJsonGeoserver("AMGR", "sector_rub");
    fetch(url)
        .then(response => response.json())
        .then(data => {
            capasGeoJSON["sector_rub"] = L.geoJson(data, {
                style: {
                    color: '#e6301d',
                    weight: 2.5,
                    fillOpacity: 0
                },
                onEachFeature: function (feature, layer) {
          // Etiqueta con nu_sector
          if (feature.properties && feature.properties.nu_sector) {
            layer.bindTooltip(
              feature.properties.nu_sector.toString(),
              {
                permanent: true,     
                direction: "center", 
                className: "etiqueta-sectores" 
              }
            );
          }
        }
      });

      const checkbox = document.getElementById("sector_rub");
        if (checkbox && checkbox.checked) {
            capasGeoJSON["sector_rub"].addTo(map);
        }
       })
        .catch(error => console.error("Error al cargar capa GeoServer:", error)); 
}


// ESPACIOS VERDES - RUBITA
function cargarCapaEspVerde() {
  const url = ObtenerLinkJsonGeoserver("AMGR", "espVer_rub");
    fetch(url)
        .then(response => response.json())
        .then(data => {
            capasGeoJSON["espVer_rub"] = L.geoJson(data, {
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

// CAPA PARCELARIO - RUBITA 

function cargarCapaParcelario() {
    const url = ObtenerLinkJsonGeoserver("AMGR", "parcelario_rub");
    fetch(url)
        .then(response => response.json())
        .then(data => {
            capasGeoJSON["parcelario_rub"] = L.geoJson(data, {
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

                    layer.options.originalStyle = {
                        color: '#9E9E9E',
                        weight: 0.7,
                        fillOpacity: 0.3,
                        opacity: 1
                    }
                }
            }).addTo(map);

        })
        .catch(error => {
            console.error("Error al cargar capa completa:", error);
        });
}

// Filtro por parcela

function filtrarPorCategoria() {
    const valor = document.getElementById("inputCategoria").value.trim().toLowerCase();
    const botonLimpiar = document.getElementById("btnLimpiar");

    botonLimpiar.style.display = valor ? "inline-block" : "none";

    const capa = capasGeoJSON["parcelario_rub"];
    if (!capa) return; 

    capa.eachLayer(layer => {
        const props = layer.feature?.properties;
        const texto = props?.nu_par?.toString().toLowerCase(); 

      if (!valor) {
              if (layer.options.originalStyle) {
                      layer.setStyle(layer.options.originalStyle);
              }
              } else if (texto && texto.includes(valor)) {
                  layer.setStyle({
                      color: "#f26df9",
                      weight: 1,
                      fillOpacity: 0.6,
                      opacity: 1
                  });
              } else {
                  layer.setStyle({
                      color: "#9E9E9E",
                      weight: 0.7,
                      fillOpacity: 0,
                      opacity: 0
                  });
              }
          });
}

function limpiarFiltro() {
    document.getElementById("inputCategoria").value = "";
    document.getElementById("btnLimpiar").style.display = "none";
    filtrarPorCategoria();
}

// MANZANAS - RUBITA 
function cargarCapaMz() {
    const url = ObtenerLinkJsonGeoserver("AMGR", "mz_rub");
    fetch(url)
        .then(response => response.json())
        .then(data => {
            capasGeoJSON["mz_rub"] = L.geoJson(data, {
                style: {
                    color: '#2a2a2a',
                    weight: 1,
                    fillOpacity: 0
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
    const url = ObtenerLinkJsonGeoserver("AMGR", "cavas_rub");
    fetch(url)
        .then(response => response.json())
        .then(data => {
            capasGeoJSON["cavas_rub"] = L.geoJson(data, {
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

// CAPA EJES DE CALLE - RUBITA 
function cargarCapaEjesCalle() {
    const url = ObtenerLinkJsonGeoserver("AMGR", "ejeCalles_rub");
    fetch(url)
        .then(response => response.json())
        .then(data => {
            capasGeoJSON["ejeCalles_rub"] = L.geoJson(data, {
                style: {
                    color: '#c76c25',
                    weight: 2.5,
                    fillOpacity: 0
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

// EQUIPAMIENTO - RUBITA 
function cargarCapaEquipam() {
    const url = ObtenerLinkJsonGeoserver("AMGR", "equipam_rub");
    fetch(url)
        .then(response => response.json())
        .then(data => {
            capasGeoJSON["equipam_rub"] = L.geoJson(data, {
                style: {
                    color: '#6c93d7',
                    weight: 2,
                    fillOpacity: 0.7
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



//TABS DEL PANEL IZQUIERDA (CAPAS Y REFERENCIAS)
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    const tabId = tab.getAttribute('data-tab');
    document.getElementById('tab-' + tabId).classList.add('active');

    if (tabId === "referencias") {
      mostrarReferencias(); 
    }
    
  });

});



// PANEL DE CAPAS - Registros BD 

function mostrarPanelCapas() {
  fetch("https://sit.chaco.gob.ar/getcapas/P")
    .then(response => response.json())
    .then(registros => {


      let cadenaEscritorio = "";
      let cadenaMobile = "";

      registros.forEach(capa => {

        cadenaEscritorio += `
          <div class='item-capa'>
              <input type='checkbox' id='${capa.NoGeoserver}' value='${capa.NoGeoserver}' onchange='activarCapa("${capa.NoGeoserver}")'>
              <label for='${capa.NoGeoserver}'>${capa.NoShape}</label><br>

              <div>
                <p class='TextOp'>Opacidad</p>
                <input type='range' min='0' max='1' step='0.1' value='1' class='slider-opacidad' 
                  onchange='cambiarOpacidad("${capa.NoGeoserver}", this.value)'>
              </div>  
          </div>
        `;

        cadenaMobile += `
          <div class='item-capa'>
              <input type='checkbox' id='${capa.NoGeoserver}_m' value='${capa.NoGeoserver}' onchange='activarCapa("${capa.NoGeoserver}")'>
              <label for='${capa.NoGeoserver}_m'>${capa.NoShape}</label>
          </div>
        `;
      });

      // Panel de escritorio
      const contenedorEscritorio = document.querySelector("#capasCheckboxContainer");
      if (contenedorEscritorio) contenedorEscritorio.innerHTML = cadenaEscritorio;
      // Panel movil
      const contenedorMobile = document.querySelector("#capasCheckboxContainerMobile");
      if (contenedorMobile) contenedorMobile.innerHTML = cadenaMobile;
      })
      
    .catch(error => console.error("Error al cargar panel de capas:", error));
}

mostrarPanelCapas();

function activarCapa(nombreCapa) {
  const checkboxDesktop = document.getElementById(nombreCapa);
  const checkboxMobile = document.getElementById(nombreCapa + "_m");

  // Evaluamos si alguno está activado
  const isChecked = (
    (checkboxDesktop && checkboxDesktop.checked) ||
    (checkboxMobile && checkboxMobile.checked)
  );

  // Si no existe aún la capa, cargarla
  if (!capasGeoJSON[nombreCapa]) {
    switch (nombreCapa) {
      case "espVer_rub":
        cargarCapaEspVerde();
        break;
      case "parcelario_rub":
        cargarCapaParcelario();
        break;
      case "sector_rub":
        cargarCapasSectores();
        break;
      case "mz_rub":
        cargarCapaMz();
        break;
      case "equipam_rub":
        cargarCapaEquipam();
        break;
      case "cavas_rub":
        cargarCapaCavas();
        break;
      case "ejeCalles_rub":
        cargarCapaEjesCalle();
        break;
    }

    setTimeout(() => {
      if (capasGeoJSON[nombreCapa]) {
        if (isChecked) {
          capasGeoJSON[nombreCapa].addTo(map);
        }
        mostrarReferencias();
      }
    }, 500);
    return;
  }

  if (isChecked) {
    capasGeoJSON[nombreCapa].addTo(map);
  } else {
    map.removeLayer(capasGeoJSON[nombreCapa]);
  }

  mostrarReferencias();
}


// REFERENCIAS DEL MAPA

function mostrarReferencias() {
  let html = '<ul class="leyenda-lista">';

  for (let nombreCapa in capasGeoJSON) {
    const layer = capasGeoJSON[nombreCapa];

    if (map.hasLayer(layer)) {
      const color = obtenerColorCapa(nombreCapa);
      const tipo = obtenerTipoForzado(nombreCapa);
      const nombreBonito = formatearNombreCapa(nombreCapa);

      html += `
        <li class="leyenda-item">
          <span class="simbolo tipo-${tipo}" style="background-color: ${color};"></span>
          ${nombreBonito}
        </li>
      `;
    }
  }

  html += '</ul>';
    // Escritorio
    const panelEscritorio = document.getElementById("tab-referencias");
    if (panelEscritorio) panelEscritorio.innerHTML = html;

    // Móvil
    const panelMobile = document.getElementById("panel-referencias");
    if (panelMobile) panelMobile.innerHTML = html;
}

function obtenerColorCapa(nombre) {
  const colores = {
    "espVer_rub": "#9FCF7D",
    "parcelario_rub": "#9E9E9E",
    "sector_rub": "red",
    "mz_rub": "#2a2a2a",
    "equipam_rub": "blue",
    "cavas_rub": "#ACC4DB",
    "ejeCalles_rub": "#c76c25"
  };
  return colores[nombre] || "gray";
}

function obtenerTipoForzado(nombreCapa) {
  const tipos = {
    "espVer_rub": "poligono",
    "parcelario_rub": "poligono",
    "sector_rub": "poligono",
    "mz_rub": "poligono",
    "equipam_rub": "poligono",
    "cavas_rub": "poligono",
    "ejeCalles_rub": "linea"
  };
  return tipos[nombreCapa] || "poligono";
}

function formatearNombreCapa(nombre) {
  return nombre.replace("_rub", "").replace(/_/g, " ");
}

// CONTROL DE OPACIDAD CAPA EN PANEL DE CAPAS
function cambiarOpacidad(nombreCapa, valorOpacidad) {
  const capa = capasGeoJSON[nombreCapa];
  if (capa) {
    capa.setStyle({
      fillOpacity: parseFloat(valorOpacidad),
      opacity: parseFloat(valorOpacidad)
    });
  }
}

// CONTROL DE FILTROS

document.addEventListener('DOMContentLoaded', () => {
  const inputPrincipal = document.getElementById('inputCategoria');
  const inputMobile = document.getElementById('inputCategoriaMobile');
  const botonLimpiar = document.getElementById('btnLimpiar');

  if (inputPrincipal && inputMobile) {
    inputPrincipal.addEventListener('input', (e) => {
      inputMobile.value = e.target.value;
      filtrarPorCategoria();
    });

    inputMobile.addEventListener('input', (e) => {
      inputPrincipal.value = e.target.value;
      filtrarPorCategoria();
    });
  }

  if (botonLimpiar) {
    botonLimpiar.addEventListener('click', () => {
      if (inputPrincipal) inputPrincipal.value = '';
      if (inputMobile) inputMobile.value = '';
      botonLimpiar.style.display = 'none';
      filtrarPorCategoria();
    });
  }
});

//PANEL DE MOVIL
function toggleMobilePanel(nombre) {
  const paneles = document.querySelectorAll(".mobile-panel");

  paneles.forEach(p => {
    if (p.id === "panel-" + nombre) {
      p.classList.toggle("active");
    } else {
      p.classList.remove("active");
    }
  });
}
