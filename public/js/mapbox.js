export const displayMap = (locations) => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiYWRlbC1lc3NhbSIsImEiOiJjbHV4eWRzaGYwdHN2Mmxtb2V6MGFtN25lIn0.Z-ySs0eY9dVdC-zKB7W-kA";
  var map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/adel-essam/clv16ig90009301ph4yft7tej",
    scrollZoom: false,
    //     center: [-74.5, 40], // starting position [lng, lat]
    //     zoom: 10, // starting zoom
    //     interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create Marker
    const el = document.createElement("div");
    el.className = "marker";

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: "bottom",
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day: ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map to include current loaction
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
