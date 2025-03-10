mapboxgl.accessToken = 'pk.eyJ1IjoiZ3Vuc2pvaG5zb24iLCJhIjoiY20zOGt3NjFnMG5wbTJucjF2aHBpMmMzMSJ9.CqXAiHaMIBWoQKm3EPiPUQ';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/gunsjohnson/cm4fgrtbp001k01qv5uyu8hoh',
    center: [-0.66987, 52.38075],
    zoom: 9
});

map.on('load', () => {

});

map.on('idle', () => {
  SetLayers()
})

const layerList = document.getElementById('menu');
const inputs = layerList.getElementsByTagName('input');

for (const input of inputs) {
    input.onclick = (layer) => {
        const layerId = layer.target.id;
        map.setStyle('mapbox://styles/' + layerId);
    };
}

function SetLayers() {
  const toggleableLayerIds = ['Agricultural Land Quality England', 'Rock Type', 'Average Temperature', 'Elevation', 'Satellite'];
  const baseLayerIds = ['Elevation', 'Satellite']

  for (const id of toggleableLayerIds) {
      if(!map.getLayer(id)) {
        continue
      }
      if (document.getElementById(id)) {
        continue;
      }

      const link = document.createElement('a');
      link.id = id;
      link.href = '#';
      link.textContent = id;
      link.className = '';

      ClickLayer()

      const layers = document.getElementById('layer_menu');
      layers.appendChild(link);

      function ClickLayer() {
        link.onclick = function (e) {
          const clickedLayer = this.textContent;
          e.preventDefault();
          e.stopPropagation();

          const visibility = map.getLayoutProperty(clickedLayer, 'visibility');

          // Set layer to not visible if it is already visible
          if (visibility === 'visible') {
              this.className = '';
              map.setLayoutProperty(clickedLayer, 'visibility', 'none');

              if (!baseLayerIds.includes(id))
              {
                setLegend(id)
                setFeatures(id)
                resetLegend()
                resetFeatures()
              }
          // Set layer to visible if it is not visible 
          } else {
              this.className = 'active';
              map.setLayoutProperty(clickedLayer, 'visibility', 'visible');

              if (!baseLayerIds.includes(id)) {
                setLegend(id)
                setFeatures(id)
              }
              else {
                for(const layer of layers.children) {
                  if(baseLayerIds.includes(layer.id))
                  {
                    if(layer.id != id) {
                      layer.className = '';
                      map.setLayoutProperty(layer.textContent, 'visibility', 'none');
                    }
                  }
                }
              }
          }
        };
      }
  }
}

function resetFeatures()
{
  const features = document.getElementById('features');
    while (features.firstChild) {
      features.removeChild(features.firstChild);
    }
    features.style.visibility = 'hidden'
}

function setFeatures(id)
{
  const features = document.getElementById('features');

  resetFeatures()

  features.style.visibility = 'visible'
  const name = document.createElement('h2')
  const description = document.createElement('p')
  title = ""
  text = ""
  if  (id == "Agricultural Land Quality England" || id == "Agricultural Land Quality Wales") {
    title = "Agricultural Land Quality"
    text = "Quality of agricultural land in the UK. Grade 1 is the highest quality while grade 5 is the lowest."
  }
  if (id == "Rock Type") {
    title = "Geological Rock Type"
    text = "Shows the type of rock in an area"
  }
  if (id == "Average Temperature") {
    title = "Average Temperature"
    text = "Shows average monthly temperature"
  }
  name.textContent = title
  description.textContent = text
  features.appendChild(name);
  features.appendChild(description);
}

function resetLegend()
{
    const legend = document.getElementById('legend');
    while (legend.firstChild) {
        legend.removeChild(legend.firstChild);
    }
    legend.style.visibility = 'hidden'
}

function setLegend(id) {
  const legend = document.getElementById('legend');

  resetLegend()

  legend.style.visibility = 'visible'
  layers = []
  colors = []
  var gradientKey = false

  if (id == "Agricultural Land Quality England" || id == "Agricultural Land Quality Wales") {
    layers = [
      'Grade 1',
      'Grade 2',
      'Grade 3',
      'Grade 4',
      'Grade 5',
      'Urban',
      'Non Agricultural'
    ];
    colors = [
      '#70f708',
      '#328307',
      '#2d5205',
      '#a1920c',
      '#8e3f0b',
      '#0b5175',
      '#333333'
    ];
  }
  if (id == "Rock Type") {
    layers = [

    ];
    colors = [

    ];
  }
  if (id == "Average Temperature") {
    gradientKey = true
    layers = [
      '-2°C',
      '8°C',
    ];
    colors = [
      '#000000',
      '#fa0a0a',
    ];
  }


    if(!gradientKey) {
      layers.forEach((layer, i) => {
        const color = colors[i];
        const item = document.createElement('div');
        const key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;
      
        const value = document.createElement('span');
        value.innerHTML = `${layer}`;
        item.appendChild(key);
        item.appendChild(value);
        legend.appendChild(item);
      });
    }
    else {
      const bar = document.createElement('div');
      const gradient = document.createElement('span');
      gradient.className = 'gradient-key';
      gradient.style.backgroundImage = 'linear-gradient(to right, ' + colors[0] + ', ' + colors[1] + ')';

      const value = document.createElement('label');
      value.innerHTML = `${layers[0]} ................ ${layers[1]}`;

      bar.appendChild(gradient);
      bar.appendChild(value);
      legend.appendChild(bar);
    }
}