const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');

const maxRecords = 151;
const limit = 10;
let offset = 0;
let loadedPokemons = []; // Armazena todos os Pokémon carregados

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function createPokemonDetailHTML(pokemon) {
    return `
       <div class="pokemon-detail"> <!-- A classe do tipo será adicionada depois -->
            <div class="pokemon-detail-header">
                <span class="name">${pokemon.name}</span>
                <span class="number">#${pokemon.number.toString().padStart(3, '0')}</span>
            </div>
            
            <div class="pokemon-detail-types">
                ${pokemon.types.map(type => `<span class="type ${type}">${type}</span>`).join('')}
            </div>
            
            <img src="${pokemon.photo}" alt="${pokemon.name}" style="width: 200px; height: 200px;">
            
            <div class="pokemon-detail-body">
                <div>
                    <p>Height: ${pokemon.height}m</p>
                    <p>Weight: ${pokemon.weight}kg</p>
                </div>
                <div>
                    <p>Abilities: ${pokemon.abilities.join(', ')}</p>
                </div>
            </div>
            
            <div class="pokemon-detail-stats">
                ${Object.entries(pokemon.stats).map(([stat, value]) => `
                    <div class="stat-row">
                        <span class="stat-name">${stat}:</span>
                        <span class="stat-value">${value}</span>
                        <div class="stat-bar">
                            <div class="stat-bar-fill" style="width: ${(value / 255) * 100}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function loadPokemonItems(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        loadedPokemons = [...loadedPokemons, ...pokemons];
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml;
        
        // Atualiza os eventos de clique para todos os Pokémon
        updateClickEvents();
    });
}

function updateClickEvents() {
    const pokemonElements = document.querySelectorAll('.pokemon');
    pokemonElements.forEach((element, index) => {
        element.addEventListener('click', () => {
            showPokemonDetail(loadedPokemons[index]);
        });
    });
}


function showPokemonDetail(pokemon) {
    const modal = document.getElementById('pokemonDetailModal');
    const content = document.getElementById('pokemonDetailContent');
    
    // Limpa classes anteriores
    modal.className = 'modal';
    content.className = 'pokemon-detail';
    
    // Adiciona classe do tipo primário ao modal e ao content
    const primaryType = pokemon.types[0];
    modal.classList.add('modal-pokemon', primaryType);
    content.classList.add(primaryType);
    
    content.innerHTML = `
        <span class="close">&times;</span>
        <div class="pokemon-detail-header">
            <h2 class="name">${pokemon.name}</h2>
            <span class="number">#${pokemon.number.toString().padStart(3, '0')}</span>
        </div>
        
        <div class="pokemon-detail-types">
            ${pokemon.types.map(type => `<span class="type ${type}">${type}</span>`).join('')}
        </div>
        
        <img class="pokemon-detail-image" src="${pokemon.photo}" alt="${pokemon.name}">
        
        <div class="pokemon-detail-body">
            <div class="detail-row">
                <span>Height:</span>
                <span>${pokemon.height}m</span>
            </div>
            <div class="detail-row">
                <span>Weight:</span>
                <span>${pokemon.weight}kg</span>
            </div>
            <div class="detail-row">
                <span>Abilities:</span>
                <span>${pokemon.abilities.join(', ')}</span>
            </div>
        </div>
        
        <div class="pokemon-detail-stats">
            ${Object.entries(pokemon.stats).map(([stat, value]) => `
                <div class="stat-row">
                    <span class="stat-name">${stat}:</span>
                    <span class="stat-value">${value}</span>
                    <div class="stat-bar">
                        <div class="stat-bar-fill" style="width: ${(value / 255) * 100}%"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    modal.style.display = 'block';
    
    // Fechar modal
    document.querySelector('.close').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.close').addEventListener('click', closeModal);
    
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('pokemonDetailModal');
        if (event.target === modal) {
            closeModal();
        }
    });
});

// Carrega os primeiros Pokémon
loadPokemonItems(offset, limit);

// Evento do botão "Load More"
loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNextPage = offset + limit;

    if (qtdRecordsWithNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItems(offset, newLimit);
        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItems(offset, limit);
    }
});