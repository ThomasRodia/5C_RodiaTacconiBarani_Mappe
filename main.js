
const prendiDati = (via) => {
    return new Promise((resolve, reject) => {
        fetch("https://us1.locationiq.com/v1/search?key=pk.6ce44662827952ac04f47a6165745bb3&q="+via +"&format=json&"
            
        )
        .then(r => r.json())
        .then(r => {
            resolve(r);
        })
        .catch(error => reject(error));
    });
};

let places = [
  { name: "Piazza del Duomo", coords: [45.4639102, 9.1906426] },
  { name: "Darsena", coords: [45.4536286, 9.1755852] },
  { name: "Parco Lambro", coords: [45.4968296, 9.2505173] },
  { name: "Stazione Centrale", coords: [45.48760768, 9.2038215] }
];

let zoom = 12;
let maxZoom = 19;
let map = L.map('map').setView(places[0].coords, zoom);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: maxZoom,
  attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Funzione per creare marker per ogni luogo in places
function render() {
  places.forEach((place) => {
    const marker = L.marker(place.coords).addTo(map);
    marker.bindPopup(`<b>${place.name}</b>`);
  });
}

// Inizializza la mappa con i marker iniziali
render();

const viaInput = document.getElementById("via");
const InviaInput = document.getElementById("invia");

InviaInput.onclick = () => {
  let viaT = viaInput.value.trim();
  viaInput.value = ""; // Reset dell'input

  // Ottieni le coordinate dell'indirizzo inserito
  prendiDati(viaT).then((response) => {
      if (response && response.length > 0) {
          let valToUse = response[0];
          let long = parseFloat(valToUse["lon"]);
          let lat = parseFloat(valToUse["lat"]);

          // Aggiungi il nuovo indirizzo a places
          let newPlace = { name: viaT, coords: [lat, long] };
          places.push(newPlace);

          // Aggiungi il marker sulla mappa per il nuovo indirizzo
          const marker = L.marker(newPlace.coords).addTo(map);
          marker.bindPopup(`<b>${newPlace.name}</b>`).openPopup();

          // Centra la mappa sul nuovo marker
          map.setView(newPlace.coords, zoom);
      } else {
          console.error("Indirizzo non trovato");
      }
  }).catch(error => {
      console.error("Errore nella ricerca dell'indirizzo:", error);
  });
};