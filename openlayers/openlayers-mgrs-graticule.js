import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { LineString } from 'ol/geom';
import { Stroke, Style } from 'ol/style';
import mgrs from 'mgrs';

class MGRSGraticule extends VectorLayer {
  constructor(options) {
    super({
      source: new VectorSource(),
      style: new Style({
        stroke: new Stroke({
          color: 'rgba(0,0,0,0.2)',
          width: 1
        })
      })
    });

    this.projection = options.projection;
    this.gridInterval = options.gridInterval || 100000; // 100km grid by default
  }

  updateGrid(extent) {
    const source = this.getSource();
    source.clear();

    const [minX, minY, maxX, maxY] = extent;

    for (let x = Math.floor(minX / this.gridInterval) * this.gridInterval; x <= maxX; x += this.gridInterval) {
      const line = new LineString([[x, minY], [x, maxY]]);
      source.addFeature(new Feature(line));
    }

    for (let y = Math.floor(minY / this.gridInterval) * this.gridInterval; y <= maxY; y += this.gridInterval) {
      const line = new LineString([[minX, y], [maxX, y]]);
      source.addFeature(new Feature(line));
    }
  }
}

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: fromLonLat([0, 0]),
    zoom: 2
  })
});

const mgrsGraticule = new MGRSGraticule({
  projection: map.getView().getProjection()
});

map.addLayer(mgrsGraticule);

map.on('moveend', () => {
  const extent = map.getView().calculateExtent(map.getSize());
  mgrsGraticule.updateGrid(extent);
});
