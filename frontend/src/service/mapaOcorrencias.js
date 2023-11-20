let mapa;
let marker;

let mapaEdit;//
let markerEdit;//

let center = {lat: -6.888463202449027, lng: -38.558930105104125};

async function initMap() {
  mapa = new google.maps.Map(document.getElementById("map"), {
    center: center,
    zoom: 14,
  });

  const pontos = await buscarPontos();

  pontos.map((ponto)=>{
    let latLng = {lat: ponto.localizacao.coordinates[1], lng: ponto.localizacao.coordinates[0]}

    const novoPonto = new google.maps.Marker({
      position: latLng,
      map: mapa,
      draggable: false,
      title: ponto.titulo
    })

    novoPonto.addListener("click", ()=>{
      document.getElementById("popup-titulo").textContent = ponto.titulo;
      document.getElementById("popup-descricao").textContent = `Descrição: ${ponto.descricao}`;
      document.getElementById("popup-tipo").textContent = `Tipo: ${ponto.tipo}`;
      document.getElementById("popup-data").textContent = `Data: ${ponto.data}`;
      document.getElementById("popup-hora").textContent = `Hora: ${ponto.hora}`;
      document.getElementById("popup-delete").addEventListener("click", ()=>{
        deletarPonto(ponto._id);
        location.reload();
      });

      document.getElementById("popup-edit-anterior").addEventListener("click", ()=>{
        mapaEdit = new google.maps.Map(document.getElementById("mapEdit"), {
          center: {lat: ponto.localizacao.coordinates[1], lng: ponto.localizacao.coordinates[0]},
          zoom: 14,
        });

        markerEdit = new google.maps.Marker({
          map: mapaEdit,
          position: {lat: ponto.localizacao.coordinates[1], lng: ponto.localizacao.coordinates[0]},
          draggable: false
        });

        mapaEdit.addListener("click", (evt) => {
          addMarkerEdit(evt);
        });

        markerEdit.addListener('position_changed', ()=>{
          mapaEdit.setCenter(markerEdit.position);
        });

        document.getElementById("titulo-edit").value = ponto.titulo;
        document.getElementById("descricao-edit").value = ponto.descricao;
        document.getElementById("tipo-edit").value = ponto.tipo;
        document.getElementById("data-edit").value = ponto.data;
        document.getElementById("hora-edit").value = ponto.hora;
        document.getElementById("popup-edit-btn").addEventListener("click", ()=>{
          atualizarPonto(ponto._id);
        })

        openPopupEdit();


      });
      openPopup();
    });

  });
}

const buscarPontos = async () => {
  const pontos = await fetch("http://localhost:3000/pontos").then((resp)=>{
    return resp.json();
  })
  return pontos;
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

const deletarPonto = async (id) => {
  await fetch(`http://localhost:3000/pontos/${id}`,{
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(response => {alert('Deletado com sucesso!')})
}

const atualizarPonto = async (id) => {
  const obj = {
    titulo: document.getElementById('titulo-edit').value,
    descricao: document.getElementById('descricao-edit').value,
    tipo: document.getElementById('tipo-edit').value,
    data: document.getElementById('data-edit').value,
    hora: document.getElementById('hora-edit').value,
    localizacao: {
      type: "Point",
      coordinates: [markerEdit.getPosition().lng(), markerEdit.getPosition().lat()],
    }
  }

  await fetch(`http://localhost:3000/pontos/${id}`,{
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  }).then(reponse => {alert('Atualizado com sucesso!')}).catch(error => {alert('Falha ao atualizar!')})
}

function addMarkerEdit(evt){
  markerEdit.setPosition(evt.latLng);
}

