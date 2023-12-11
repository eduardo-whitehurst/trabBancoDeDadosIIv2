let mapa;
let marker;
let center = {lat: -6.888463202449027, lng: -38.558930105104125};

document.addEventListener("DOMContentLoaded", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        center.lat = position.coords.latitude;
        center.lng = position.coords.longitude;
        initMap();
      },
      (error) => {
        console.error("Erro ao obter a posição do usuário", error);
        initMap();
      }
    );
  } else {
    console.error("Geolocalização não suportada");
    initMap();
  }
});

async function initMap(){
    mapa = L.map('map').setView([center.lat, center.lng], 13);
    
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    marker = L.marker(center, { draggable: true }).addTo(mapa).bindPopup('Selecione o local da ocorrência.').openPopup();
    mapa.on('click', (evt) => {
        addMarker(evt.latlng, marker);
    });
    
    marker.on('dragend', () => {
        mapa.setView(marker.getLatLng());
    });
     
}

function addMarker(latlng, marker) {
  marker.setLatLng(latlng);
}

async function salvar() {
    const dataTeste = new Date(document.getElementById('data').value);
  
    const obj = {
      titulo: document.getElementById('titulo').value,
      descricao: document.getElementById('descricao').value,
      tipo: document.getElementById('tipo').value,
      data: document.getElementById('data').value,
      hora: document.getElementById('hora').value,
      localizacao: {
        type: 'Point',
        coordinates: [marker.getLatLng().lng, marker.getLatLng().lat],
      },
    };
  
    try {
      const response = await fetch('http://localhost:3000/pontos', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      });
  
      if (response.ok) {
        alert('Salvo com sucesso');
        const responseData = await response.json();
        console.log(responseData);
      } else {
        throw new Error('Falha ao salvar!');
      }
    } catch (error) {
      alert(error.message);
      console.log(error);
    }
  }