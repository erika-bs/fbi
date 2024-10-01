let fullWantedList = []; // Array para armazenar todos os procurados
let tenWantedList = []; // Array para armazenar os 10 procurados

const url = 'https://api.fbi.gov/wanted/v1/list'; 

// Faz uma requisição para a API
fetch(url)
.then(response => {
    // Verifica se a resposta da requisição é OK (status 200)
    if (!response.ok) {
        throw new Error("Erro ao carregar a lista de procurados" + response.statusText);
    }
    // Converte a resposta para JSON
    return response.json();
})
.then(data => {
    // Armazena todos os procurados 
    fullWantedList = data.items;
    // Seleciona os 10 primeiros procurados
    tenWantedList = fullWantedList.slice(0, 10);
    // Exibe a lista dos 10 procurados
    displayWantedList(tenWantedList);
    // Carrega a lista de favoritos
    loadFavs();
})
.catch(error => {
    // Exibe qualquer erro encontrado no console
    console.error(error);
});

// Função para exibir a lista de procurados
function displayWantedList(wantedList) {
    const list = document.getElementById('wanted'); 
    list.innerHTML = ''; // Limpa a lista antes de exibir os dados

    // Itera sobre cada pessoa na lista de procurados
    wantedList.forEach(person => {
        if (person) { // Verifica se a pessoa é válida
            const personCard = document.createElement('div'); 
            personCard.classList.add('wantedCriminal'); 

            const picUrl = person.images[0].original;

            personCard.innerHTML = `
            <h2>${person.title}</h2> 
            <div class="criminalPic" style="background-image: url('${picUrl}');"></div>
            <ul style="display:none;" class="hiddenInfo"> 
                <li><b>Sex:</b> ${person.sex || 'Unknown'}</li>
                <li><b>Subjects:</b> ${person.subjects || 'Unknown'}</li>
                <li><b>Description:</b> ${person.description || 'Unknown'}</li>
                <li><b>Place of birth:</b> ${person.place_of_birth || 'Unknown'}</li>
                <li><b>Nationality:</b> ${person.nationality || 'Unknown'}</li>
                <li><b>Hair:</b> ${person.hair_raw || 'Unknown'}</li>
                <li><b>Eyes:</b> ${person.eyes || 'Unknown'}
                <li><b>Remarks:</b> ${person.remarks || 'Unknown'}</li>
                <li><b>Details:</b> ${person.details || 'Unknown'}</li> 
                <li><b>Reward:</b> ${person.reward_text || 'Unknown'}</li>
            </ul>
            <button class="favButton">Adicionar aos favoritos</button>
`;

            // Mostra ou esconde as informações ao clicar na imagem
            personCard.querySelector('.criminalPic').addEventListener('click', () => {
                const hiddenInfo = personCard.querySelector('.hiddenInfo'); 
                hiddenInfo.style.display = hiddenInfo.style.display === 'none' ? 'block' : 'none'; // Alterna a visibilidade
            });

            // Adiciona ao favoritos
            personCard.querySelector('.favButton').addEventListener('click', () => {
                const favsList = JSON.parse(localStorage.getItem('favs')) || []; // Recupera a lista de favoritos do localStorage
                const isFav = favsList.some(fav => fav.title === person.title); // Verifica se já é favorito

                if (!isFav) { // Se não for favorito
                    favsList.push(person); // Adiciona a pessoa à lista de favoritos
                    localStorage.setItem('favs', JSON.stringify(favsList)); // Atualiza o localStorage
                    loadFavs(); // Atualiza a exibição da lista de favoritos
                } else {
                    alert('Essa pessoa já está na lista de favoritos!'); // Alerta se já estiver nos favoritos
                }
            });

            list.appendChild(personCard);
        }
    });
}

// Função para lidar com o campo de busca
document.getElementById('search').addEventListener('click', () => {
    const crimeType = document.getElementById('crimeType').value.toLowerCase(); // Obtém o que foi digitado pelo usuario
    const filteredList = fullWantedList.filter(person => 
        person.description && person.description.toLowerCase().includes(crimeType) // Filtra pela descrição
    );

    // Se a lista filtrada estiver vazia
    if (filteredList.length === 0) {
        alert("Nenhum resultado encontrado. Tente buscar por outro tipo de crime."); 
    } else {
        displayWantedList(filteredList);
    }
});

// Função para carregar e exibir a lista de favoritos
function loadFavs() {
    let favsList = JSON.parse(localStorage.getItem('favs')) || []; // Recupera a lista de favoritos do localStorage
    const favsDiv = document.getElementById('favs'); 
    favsDiv.innerHTML = ''; // Limpa a lista de favoritos antes de exibir

    if (favsList.length === 0) { // Se não houver favoritos
        favsDiv.innerHTML = `<p>Nenhum favorito foi adicionado ainda!</p>`; 
    } else {
        // Itera sobre cada pessoa na lista de favoritos
        favsList.forEach(person => {
            const favCard = document.createElement('div'); 
            favCard.classList.add('favCriminal');

            const picUrl = person.images[0].original;

            favCard.innerHTML = `
                <h2>${person.title}</h2>
                <div class="criminalPic" style="background-image: url('${picUrl}');"></div>
                <ul style="display:none;" class="hiddenInfo">
                <li><b>Description:</b> ${person.description || 'Unknown'}</li>
                <li><b>Place of birth:</b> ${person.place_of_birth || 'Unknown'}</li>
                <li><b>Nationality:</b> ${person.nationality || 'Unknown'}</li>
                <li><b>Remarks:</b> ${person.remarks || 'Unknown'}</li>
            </ul>
                <button class="removeFav">Remover dos favoritos</button>
            `;

            // Mostra ou esconde as informações ao clicar na imagem
            favCard.querySelector('.criminalPic').addEventListener('click', () => {
                const hiddenInfo = favCard.querySelector('.hiddenInfo'); 
                hiddenInfo.style.display = hiddenInfo.style.display === 'none' ? 'block' : 'none'; // Alterna a visibilidade
            });

            // Remove da lista de favoritos
            favCard.querySelector('.removeFav').addEventListener('click', () => {
                const index = favsList.findIndex(fav => fav.title === person.title); // Encontra o índice do favorito

                if (index > -1) { // Se o favorito for encontrado
                    favsList.splice(index, 1); // Remove da lista de favoritos
                    localStorage.setItem('favs', JSON.stringify(favsList)); // Atualiza o localStorage
                    loadFavs(); // Atualiza a exibição da lista de favoritos
                }
            });

            favsDiv.appendChild(favCard);
        });
    }
}

// menu hamburguer
const hamburguerMenu = document.querySelector('.hamburguerMenu');
const offScreenMenu = document.querySelector(".off-screen-menu");
const closeIcon = document.querySelector(".close-icon");

hamburguerMenu.addEventListener("click", () => {
  offScreenMenu.classList.toggle("active");
});

closeIcon.addEventListener("click", () => {
    offScreenMenu.classList.remove("active");
});

const menuItems = document.querySelectorAll('.off-screen-menu ul li a');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            offScreenMenu.classList.remove("active");
        });
});