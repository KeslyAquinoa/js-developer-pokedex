const pokeApi = {}

window.convertPokeApiDetailToPokemon = function(pokeDetail)  {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default
    
    // Novos detalhes
    pokemon.height = pokeDetail.height / 10 // Convertendo para metros
    pokemon.weight = pokeDetail.weight / 10 // Convertendo para kg
    
    pokemon.abilities = pokeDetail.abilities.map(ability => ability.ability.name)
    
    pokeDetail.stats.forEach(stat => {
        switch(stat.stat.name) {
            case 'hp':
                pokemon.stats.hp = stat.base_stat
                break
            case 'attack':
                pokemon.stats.attack = stat.base_stat
                break
            case 'defense':
                pokemon.stats.defense = stat.base_stat
                break
            case 'special-attack':
                pokemon.stats.specialAttack = stat.base_stat
                break
            case 'special-defense':
                pokemon.stats.specialDefense = stat.base_stat
                break
            case 'speed':
                pokemon.stats.speed = stat.base_stat
                break
        }
    })

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 10) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}