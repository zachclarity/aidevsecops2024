Certainly! I'll update the code to add text labels to the middle of each grid cell for the Graticule layer. We'll create a custom Graticule class that extends the default one and adds our own text rendering logic. Here's the updated code:



```javascript
import Graticule from 'ol/layer/Graticule.js';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import Stroke from 'ol/style/Stroke.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import {fromLonLat, toLonLat} from 'ol/proj.js';
import {Text, Fill} from 'ol/style.js';
import {getCenter} from 'ol/extent.js';

class GraticuleWithCenterText extends Graticule {
  constructor(opt_options) {
    super(opt_options);
    
    this.text = new Text({
      font: '12px Calibri,sans-serif',
      fill: new Fill({
        color: 'rgba(255,120,0,0.9)'
      }),
      stroke: new Stroke({
        color: 'white',
        width: 3
      }),
      textAlign: 'center',
      textBaseline: 'middle'
    });
  }

  renderFrame(frameState, target) {
    super.renderFrame(frameState, target);
    const ctx = target.getContext('2d');
    const extent = frameState.extent;
    const viewState = frameState.viewState;

    ctx.save();
    ctx.scale(frameState.pixelRatio, frameState.pixelRatio);

    const lonLabelInterval = this.lonLabelPosition_;
    const latLabelInterval = this.latLabelPosition_;

    const projExtent = viewState.projection.getExtent();
    const worldWidth = projExtent[2] - projExtent[0];

    const startLon = Math.floor(extent[0] / lonLabelInterval) * lonLabelInterval;
    const startLat = Math.floor(extent[1] / latLabelInterval) * latLabelInterval;

    for (let lon = startLon; lon < extent[2]; lon += lonLabelInterval) {
      for (let lat = startLat; lat < extent[3]; lat += latLabelInterval) {
        const bottomLeft = [lon, lat];
        const topRight = [
          Math.min(lon + lonLabelInterval, extent[2]),
          Math.min(lat + latLabelInterval, extent[3])
        ];
        const center = getCenter([...bottomLeft, ...topRight]);
        const centerLonLat = toLonLat(center, viewState.projection);
        const centerPixel = this.getPixelFromCoordinate(center);

        let text = `${centerLonLat[0].toFixed(1)}°,${centerLonLat[1].toFixed(1)}°`;
        this.text.setText(text);
        this.text.draw(ctx, centerPixel);
      }
    }

    ctx.restore();
  }
}

const map = new Map({
  layers: [
    new TileLayer({
      source: new OSM({
        wrapX: false,
      }),
    }),
    new GraticuleWithCenterText({
      // the style to use for the lines, optional.
      strokeStyle: new Stroke({
        color: 'rgba(255,120,0,0.9)',
        width: 2,
        lineDash: [0.5, 4],
      }),
      showLabels: true,
      wrapX: false,
    }),
  ],
  target: 'map',
  view: new View({
    center: fromLonLat([4.8, 47.75]),
    zoom: 5,
  }),
});

```

Let's break down the key changes and additions:

1. Custom Graticule Class:
   We've created a `GraticuleWithCenterText` class that extends the default `Graticule` class:

   ```javascript
   class GraticuleWithCenterText extends Graticule {
     // ...
   }
   ```

2. Text Style:
   In the constructor, we set up a text style for our center labels:

   ```javascript
   this.text = new Text({
     font: '12px Calibri,sans-serif',
     fill: new Fill({
       color: 'rgba(255,120,0,0.9)'
     }),
     stroke: new Stroke({
       color: 'white',
       width: 3
     }),
     textAlign: 'center',
     textBaseline: 'middle'
   });
   ```

3. Overriding renderFrame:
   We override the `renderFrame` method to add our custom text rendering:

   ```javascript
   renderFrame(frameState, target) {
     super.renderFrame(frameState, target);
     // Custom rendering logic here
   }
   ```

4. Calculating Grid Cell Centers:
   We iterate through the grid cells and calculate their center points:

   ```javascript
   for (let lon = startLon; lon < extent[2]; lon += lonLabelInterval) {
     for (let lat = startLat; lat < extent[3]; lat += latLabelInterval) {
       // ... calculate center point
     }
   }
   ```

5. Drawing Text:
   We set the text content (longitude and latitude) and draw it at the calculated center point:

   ```javascript
   let text = `${centerLonLat[0].toFixed(1)}°,${centerLonLat[1].toFixed(1)}°`;
   this.text.setText(text);
   this.text.draw(ctx, centerPixel);
   ```

6. Using the Custom Graticule:
   Finally, we use our custom `GraticuleWithCenterText` instead of the default `Graticule`:

   ```javascript
   new GraticuleWithCenterText({
     // options...
   }),
   ```

This implementation adds text labels to the center of each grid cell, showing the longitude and latitude coordinates. The labels use the same color scheme as the grid lines for consistency.

You can further customize this by:
- Changing the label content (e.g., using grid cell identifiers instead of coordinates)
- Adjusting the text style (font, size, color)
- Adding logic to show/hide labels based on zoom level

Would you like me to explain any part of this implementation in more detail or suggest any further enhancements?