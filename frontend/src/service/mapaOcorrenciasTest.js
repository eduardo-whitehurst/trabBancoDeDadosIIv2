let mapa;
let marker;

let mapaEdit;
let markerEdit;

let center = { lat: -6.888463202449027, lng: -38.558930105104125 };

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

async function initMap() {
  mapa = L.map('map').setView([center.lat, center.lng], 14);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    var googleStreets = L.tileLayer(
      'http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}',
      {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }
    );

    googleStreets.addTo(mapa);

  const pontos = await buscarPontos();

  pontos.map((ponto) => {
    let latLng = { lat: ponto.localizacao.coordinates[1], lng: ponto.localizacao.coordinates[0] };

    const novoPonto = L.marker(latLng, { draggable: false }).addTo(mapa);
    novoPonto.bindPopup(
      `<strong>${ponto.titulo}</strong><br>${ponto.descricao}<br>Tipo: ${ponto.tipo}<br>Data: ${ponto.data}<br>Hora: ${ponto.hora}<br><button onclick="deletarPonto('${ponto._id}')">Deletar</button><button onclick="editarPonto('${ponto._id}')">Editar</button>`
    );

    novoPonto.on('click', () => {
      novoPonto.openPopup();
    });
  });
}

const buscarPontos = async () => {
  const pontos = await fetch('http://localhost:3000/pontos').then((resp) => {
    return resp.json();
  });
  return pontos;
};

const deletarPonto = async (id) => {
    fetch(`http://localhost:3000/pontos/${id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          alert('Deletado com sucesso!');
          location.reload();
        })
        .catch((error) => {
          alert('Falha ao deletar!');
          console.error(error);
        });
}


async function editarPonto(id) {
  const ponto = await buscarPontos().then((p) =>{
    return p.find((ponto)=> ponto._id === id)
  });

   mapaEdit = L.map('mapEdit').setView([ponto.localizacao.coordinates[1], ponto.localizacao.coordinates[0]], 14);

   markerEdit = L.marker([ponto.localizacao.coordinates[1], ponto.localizacao.coordinates[0]], { draggable: false }).addTo(mapaEdit);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapaEdit);

    var googleStreets = L.tileLayer(
      'http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}',
      {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }
    );

    googleStreets.addTo(mapaEdit);

  mapaEdit.on('click', (evt) => {
    addMarkerEdit(evt);
  });

  markerEdit.on('dragend', () => {
    mapaEdit.setView(markerEdit.getLatLng());
  });

  document.getElementById('titulo-edit').value = ponto.titulo;
  document.getElementById('descricao-edit').value = ponto.descricao;
  document.getElementById("tipo-edit").value = ponto.tipo;
  document.getElementById('data-edit').value = ponto.data;
  document.getElementById('hora-edit').value = ponto.hora;
  document.getElementById("popup-edit-btn").addEventListener("click", ()=>{
    atualizarPonto(ponto._id);
  })

  openPopupEdit();
}

function addMarkerEdit(evt) {
  markerEdit.setLatLng(evt.latlng);
}

async function atualizarPonto(id) {
  const obj = {
    titulo: document.getElementById('titulo-edit').value,
    descricao: document.getElementById('descricao-edit').value,
    tipo: document.getElementById('tipo-edit').value,
    data: document.getElementById('data-edit').value,
    hora: document.getElementById('hora-edit').value,
    localizacao: {
      type: 'Point',
      coordinates: [markerEdit.getLatLng().lng, markerEdit.getLatLng().lat],
    },
  };

  await fetch(`http://localhost:3000/pontos/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj),
  })
    .then((response) => response.json())
    .then((data) => {
      alert('Atualizado com sucesso!');
      location.reload();
    })
    .catch((error) => {
      alert('Falha ao atualizar!');
      console.error(error);
    });
}

function openPopup() {
  document.getElementById('popup-container').style.display = 'flex';
}

function closePopup() {
  document.getElementById('popup-container').style.display = 'none';
}

function openPopupEdit() {
  document.getElementById('popup-edit').style.display = 'flex';
}

function closePopupEdit() {
  document.getElementById('popup-edit').style.display = 'none';
}


