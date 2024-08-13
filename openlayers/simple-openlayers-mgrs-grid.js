import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { LineString } from 'ol/geom';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Style, Stroke } from 'ol/style';
import { getCenter } from 'ol/extent';
import mgrs from 'mgrs';

function createMGRSGrid(extent, resolution) {
  const features = [];
  const [minLon, minLat, maxLon, maxLat] = extent.map(coord => toLonLat(coord, 'EPSG:3857'));
  
  // Convert extent corners to MGRS
  const bottomLeft = mgrs.forward([minLon, minLat]);
  const topRight = mgrs.forward([maxLon, maxLat]);

  // Generate grid lines (100km grid)
  const gridSize = 100000; // 100km in meters

  for (let easting = Math.floor(bottomLeft.easting / gridSize) * gridSize;
       easting <= topRight.easting;
       easting += gridSize) {
    const line = new LineString([
      fromLonLat(mgrs.inverse({...bottomLeft, easting: easting})),
      fromLonLat(mgrs.inverse({...topRight, easting: easting}))
    ]);
    features.push(new Feature(line));
  }

  for (let northing = Math.floor(bottomLeft.northing / gridSize) * gridSize;
       northing <= topRight.northing;
       northing += gridSize) {
    const line = new LineString([
      fromLonLat(mgrs.inverse({...bottomLeft, northing: northing})),
      fromLonLat(mgrs.inverse({...topRight, northing: northing}))
    ]);
    features.push(new Feature(line));
  }

  return features;
}

// Create the map
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        stroke: new Stroke({
          color: 'rgba(0, 0, 0, 0.4)',
          width: 1
        })
      })
    })
  ],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});

// Update grid on map move
map.on('moveend', () => {
  const extent = map.getView().calculateExtent(map.getSize());
  const resolution = map.getView().getResolution();
  const gridSource = map.getLayers().getArray()[1].getSource();
  
  gridSource.clear();
  const features = createMGRSGrid(extent, resolution);
  gridSource.addFeatures(features);
});
