import React, { useRef, useEffect } from 'react';
import OlMap from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import Graticule from 'ol/layer/Graticule';
import Stroke from 'ol/style/Stroke';
import { fromLonLat } from 'ol/proj';

const MapComponent = () => {
  const mapRef = useRef();

  useEffect(() => {
    const osmLayer = new TileLayer({
      source: new OSM({
        wrapX: false,
      }),
    });

    const graticuleLayer = new Graticule({
      strokeStyle: new Stroke({
        color: 'rgba(255,120,0,0.9)',
        width: 2,
        lineDash: [0.5, 4],
      }),
      showLabels: true,
      wrapX: false,
    });

    const map = new OlMap({
      layers: [osmLayer, graticuleLayer],
      view: new View({
        center: fromLonLat([4.8, 47.75]),
        zoom: 5,
      }),
      target: mapRef.current,
    });

    return () => {
      if (map) {
        map.setTarget(null);
      }
    };
  }, []);

  return <div ref={mapRef} className="map-container" style={{ width: '100%', height: '400px' }} />;
};

export default MapComponent;