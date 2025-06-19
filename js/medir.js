// Grupo donde se guardan las líneas de medición
const drawnItemsMedir = new L.FeatureGroup().addTo(map);

// Herramienta de medición (solo línea)
const drawMedir = new L.Draw.Polyline(map, {
  shapeOptions: {
    color: 'red',
    weight: 3
  },
  metric: true,
  feet: false,
  showLength: true
});

// Activar herramienta de medición desde el botón personalizado
function activarMedicion() {
  drawMedir.enable();
}

// Borrar todas las líneas de medición
function startDelete() {
  drawnItemsMedir.clearLayers();
}

// Al finalizar el dibujo, calcular distancia y mostrar tooltip
map.on(L.Draw.Event.CREATED, function (e) {
  const layer = e.layer;
  if (e.layerType === 'polyline') {
    const latlngs = layer.getLatLngs();
    let distancia = 0;
    for (let i = 0; i < latlngs.length - 1; i++) {
      distancia += latlngs[i].distanceTo(latlngs[i + 1]);
    }
    const distanciaTexto = (distancia / 1000).toFixed(2) + ' km';
    layer.bindTooltip(distanciaTexto, { permanent: true, className: 'medir-tooltip' }).openTooltip();
  }
  drawnItemsMedir.addLayer(layer);
});

// Alternar visibilidad del submenú de botones
function toggleHerramientaMedir() {
  const menu = document.getElementById("medirButtons");
  menu.style.display = menu.style.display === "none" ? "block" : "none";
}
