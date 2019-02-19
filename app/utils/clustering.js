import SuperCluster from 'supercluster';

function convertGeoJSON(bars) {
  return Object.keys(bars).map((key) => {
    const bar = bars[key];
    const lat = bar.location[0];
    const lon = bar.location[1];
    return {
      type: 'Feature',
      properties: {
        ...bar,
        lat_y: lat,
        long_x: lon,
      },
      geometry: {
        type: 'Point',
        coordinates: [lon, lat],
      },
    };
  });
}
export function getClusters(bars, zoom) {
  const points = convertGeoJSON(bars);
  const index = new SuperCluster({ log: false, radius: 20 });
  index.load(points);
  return index.getClusters([-180, -85, 180, 85], zoom);
}
