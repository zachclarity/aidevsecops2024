import OLMap from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { LineString, Point } from 'ol/geom';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Style, Stroke, Text } from 'ol/style';
import mgrs from 'mgrs';

class MGRSGridSource extends VectorSource {
  constructor(options) {
    super(options);
    this.projection = options.projection || 'EPSG:3857';
    this.updateGrid = this.updateGrid.bind(this);
  }

  getGridSize(resolution) {
    // Define grid sizes for different zoom levels (in meters)
    const gridSizes = [
      { maxResolution: 100000, size: 1000000 }, // 1000 km
      { maxResolution: 50000, size: 100000 },   // 100 km
      { maxResolution: 5000, size: 10000 },     // 10 km
      { maxResolution: 500, size: 1000 },       // 1 km
      { maxResolution: 50, size: 100 },         // 100 m
      { maxResolution: 5, size: 10 },           // 10 m
      { maxResolution: 0.5, size: 1 },          // 1 m
      { maxResolution: 0.05, size: 0.1 },       // 10 cm
      { maxResolution: 0.005, size: 0.01 }      // 1 cm
    ];

    for (let i = 0; i < gridSizes.length; i++) {
      if (resolution > gridSizes[i].maxResolution) {
        return gridSizes[i].size;
      }
    }
    return 0.001; // 1 mm for very high zoom levels
  }

  updateGrid(extent, resolution) {
    this.clear();
    const gridSize = this.getGridSize(resolution);
    const features = [];

    const [minLon, minLat, maxLon, maxLat] = extent.map(coord => toLonLat(coord, this.projection));

    for (let lon = Math.floor(minLon / gridSize) * gridSize; lon <= maxLon; lon += gridSize) {
      const line = new LineString([fromLonLat([lon, minLat]), fromLonLat([lon, maxLat])]);
      features.push(new Feature(line));

      // Add label
      const labelPoint = new Point(fromLonLat([lon, (minLat + maxLat) / 2]));
      const labelFeature = new Feature(labelPoint);
      labelFeature.setStyle(new Style({
        text: new Text({
          text: this.formatCoordinate(lon, 'lon'),
          offsetY: 10,
          font: '12px Calibri,sans-serif',
          fill: new Stroke({ color: '#000' }),
          stroke: new Stroke({ color: '#fff', width: 3 })
        })
      }));
      features.push(labelFeature);
    }

    for (let lat = Math.floor(minLat / gridSize) * gridSize; lat <= maxLat; lat += gridSize) {
      const line = new LineString([fromLonLat([minLon, lat]), fromLonLat([maxLon, lat])]);
      features.push(new Feature(line));

      // Add label
      const labelPoint = new Point(fromLonLat([(minLon + maxLon) / 2, lat]));
      const labelFeature = new Feature(labelPoint);
      labelFeature.setStyle(new Style({
        text: new Text({
          text: this.formatCoordinate(lat, 'lat'),
          offsetX: 10,
          font: '12px Calibri,sans-serif',
          fill: new Stroke({ color: '#000' }),
          stroke: new Stroke({ color: '#fff', width: 3 })
        })
      }));
      features.push(labelFeature);
    }

    this.addFeatures(features);
  }

  formatCoordinate(value, type) {
    const absValue = Math.abs(value);
    if (absValue >= 1000) {
      return `${(value / 1000).toFixed(1)}km`;
    } else if (absValue >= 1) {
      return `${value.toFixed(1)}m`;
    } else if (absValue >= 0.001) {
      return `${(value * 100).toFixed(1)}cm`;
    } else {
      return `${(value * 1000).toFixed(1)}mm`;
    }
  }
}

// Create the map
const map = new OLMap({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    new VectorLayer({
      source: new MGRSGridSource(),
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
map.on('moveend', (event) => {
  const extent = map.getView().calculateExtent(map.getSize());
  const resolution = map.getView().getResolution();
  const source = map.getLayers().getArray()[1].getSource();
  source.updateGrid(extent, resolution);
});
