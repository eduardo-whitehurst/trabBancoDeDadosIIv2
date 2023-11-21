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

async function initMap() {
  mapa = new google.maps.Map(document.getElementById("map"), {
    center: center,
    zoom: 14,
  });

  marker = new google.maps.Marker({
    map: mapa,
    position: center,
    draggable: true,
  });

  mapa.addListener("click", (evt) => {
    addMarker(evt);
  });

  marker.addListener('position_changed', () => {
    mapa.setCenter(marker.position);
  });
}

function addMarker(evt){
    marker.setPosition(evt.latLng);
}

async function salvar(){
    const dataTeste = new Date(document.getElementById('data').value)

    const obj = {
        titulo: document.getElementById('titulo').value,
        descricao: document.getElementById('descricao').value,
        tipo: document.getElementById('tipo').value,
        data: document.getElementById('data').value,
        hora: document.getElementById('hora').value,
        localizacao: {
            type: "Point",
            coordinates: [marker.getPosition().lng(), marker.getPosition().lat()]
        }
    };

    fetch("http://localhost:3000/pontos",{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    }).then(response =>{alert('Salvo com sucesso')}).then((resp)=>{
        console.log(resp);
    })
    .catch(error => {alert('Falha ao salvar!'); console.log(error);});    
}
