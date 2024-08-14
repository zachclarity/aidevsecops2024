function createMGRSGrid(map: Map): void {
    // Define MGRS projection
    proj4.defs('EPSG:32632', '+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs');

    // Function to convert geographic coordinates to MGRS
    const toMGRS = (lonLat: [number, number]): string => {
        const projCoords = proj4('EPSG:4326', 'EPSG:32632', lonLat);
        // Implement MGRS conversion logic based on your preferred library
        // Example using a hypothetical MGRS library:
        const mgrs = mgrsLib.toMGRS(projCoords[0], projCoords[1]);
        return mgrs;
    };

    // Create a vector layer for the MGRS grid
    const mgrsGridLayer = new VectorLayer({
        source: new VectorSource(),
        style: new Style({
            stroke: new Stroke({
                color: 'gray',
                width: 1,
            }),
        }),
    });

    // Generate MGRS grid lines (adjust parameters as needed)
    const gridSpacing = 100000; // Grid spacing in meters
    const extent = map.getView().calculateExtent();
    const minX = Math.floor(extent[0] / gridSpacing) * gridSpacing;
    const minY = Math.floor(extent[1] / gridSpacing) * gridSpacing;
    const maxX = Math.ceil(extent[2] / gridSpacing) * gridSpacing;
    const maxY = Math.ceil(extent[3] / gridSpacing) * gridSpacing;

    for (let x = minX; x <= maxX; x += gridSpacing) {
        const line = new Feature({
            geometry: new Polygon([[
                [x, minY],
                [x, maxY],
            ]]),
        });
        mgrsGridLayer.getSource().addFeature(line);
    }

    for (let y = minY; y <= maxY; y += gridSpacing) {
        const line = new Feature({
            geometry: new Polygon([[
                [minX, y],
                [maxX, y],
            ]]),
        });
        mgrsGridLayer.getSource().addFeature(line);
    }

    // Add the MGRS grid layer to the map
    map.addLayer(mgrsGridLayer);
}
