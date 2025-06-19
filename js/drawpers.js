// Ocultar el menú de dibujo al iniciar
document.getElementById('drawButtons').style.display = 'none';

// Mostrar/ocultar menú de dibujo
document.getElementById('toggleDrawMenu').addEventListener('click', function () {
  var drawButtons = document.getElementById('drawButtons');
  drawButtons.style.display = drawButtons.style.display === 'none' ? 'block' : 'none';
});

// FeatureGroup para almacenar dibujos
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// Control Draw (sin mostrar herramientas por defecto)
var drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems,
    remove: false // removemos nosotros manualmente
  },
  draw: false
});

// Función para iniciar una herramienta de dibujo individual
function startDraw(type) {
  let drawer = null;
  switch (type) {
    case 'marker':
      drawer = new L.Draw.Marker(map);
      break;
    case 'polygon':
      drawer = new L.Draw.Polygon(map);
      break;
    case 'polyline':
      drawer = new L.Draw.Polyline(map);
      break;
    case 'rectangle':
      drawer = new L.Draw.Rectangle(map);
      break;
    case 'circle':
      drawer = new L.Draw.Circle(map);
      break;
  }

  if (drawer) {
    drawer.enable();
  }
}

// Agregar la geometría al mapa al finalizar el dibujo
map.on(L.Draw.Event.CREATED, function (e) {
  const layer = e.layer;
  drawnItems.addLayer(layer);

  // Permitir borrar al hacer clic
  layer.on('click', function () {
    drawnItems.removeLayer(layer);
  });
});

// --- Editar geometrías ---
let editHandler = null;

function startEdit() {
  if (editHandler) {
    editHandler.disable();
    editHandler = null;
  }

  editHandler = new L.EditToolbar.Edit(map, {
    featureGroup: drawnItems
  });

  editHandler.enable();
}

// --- Borrar todas las geometrías ---
function startDelete() {
  drawnItems.clearLayers();
}
