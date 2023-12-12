const listaDelegacias = document.getElementById('listaDelegacias');
let tituloDelegacia = document.createElement('h2');
let listaCrimes = document.createElement('div');


async function filtrarDelegacias() {
    const delegacias = await fetch('http://localhost:3000/delegacias').then((resp) => {
        return resp.json();
    });

    const tipoSelecionado = document.getElementById('tipoDelegacia').value;

    if(tipoSelecionado==='A'){
        console.log('Chegou A');
        atualizarListaDelegacias(delegacias[0]);
    } else if(tipoSelecionado==='B'){
        console.log('Chegou B');
        atualizarListaDelegacias(delegacias[1]);
    }
  }

  function atualizarListaDelegacias(delegacias) {

    tituloDelegacia.innerHTML = `${delegacias.nomeDelegacia}`;
    listaDelegacias.appendChild(tituloDelegacia);
    listaDelegacias.appendChild(listaCrimes);
    console.log(delegacias);

    listaCrimes.innerHTML = '';
  
    delegacias.pontos.forEach(crimes => {
      const listItem = document.createElement('li');
      listItem.textContent = crimes;
      listaCrimes.appendChild(listItem);
    });
  }

  filtrarDelegacias();