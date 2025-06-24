
document.getElementById('drawButtons').style.display = 'none';

document.getElementById('toggleDrawMenu').addEventListener('click', function () {
  var drawButtons = document.getElementById('drawButtons');
  drawButtons.style.display = drawButtons.style.display === 'none' ? 'block' : 'none';
});

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems,
    remove: false 
  },
  draw: false
});

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

map.on(L.Draw.Event.CREATED, function (e) {
  const layer = e.layer;
  drawnItems.addLayer(layer);

if (e.layerType === 'marker') {
    const { lat, lng } = layer.getLatLng();
    const textoCoord = `Lat: ${lat.toFixed(6)}, Long: ${lng.toFixed(6)}`;
    layer.bindPopup(textoCoord).openPopup();
}  

  layer.on('click', function () {
    drawnItems.removeLayer(layer);
  });
});

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

function startDelete() {
  drawnItems.clearLayers();
}
