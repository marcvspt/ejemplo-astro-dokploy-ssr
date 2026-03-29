import type { APIRoute } from "astro";

import type { BasicPokemon } from "@/scripts/types.ts";

const API_BASE_URL = "https://pokeapi.co/api/v2/pokemon";

const getStat = (stats: Array<{ stat: { name: string }; base_stat: number }>, key: string) => {
    return stats.find((item) => item.stat.name === key)?.base_stat ?? 0;
};

export const GET: APIRoute = async ({ url }) => {
    const query = (url.searchParams.get("q") ?? url.searchParams.get("pokemon"))
        ?.trim()
        .toLowerCase();

    if (!query) {
        return new Response(JSON.stringify({ error: "Debes enviar un pokemon en el parametro q." }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(query)}`);

        if (!response.ok) {
            return new Response(JSON.stringify({ error: "Pokemon no encontrado." }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }

        const data = await response.json();

        const pokemon: BasicPokemon = {
            id: data.id,
            name: data.name,
            height: data.height,
            weight: data.weight,
            types: data.types.map((item: { type: { name: string } }) => item.type.name),
            image:
                data.sprites?.other?.["official-artwork"]?.front_default ??
                data.sprites?.front_default ??
                null,
            stats: {
                hp: getStat(data.stats, "hp"),
                attack: getStat(data.stats, "attack"),
                defense: getStat(data.stats, "defense"),
                speed: getStat(data.stats, "speed")
            }
        };

        return new Response(JSON.stringify(pokemon), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch {
        return new Response(JSON.stringify({ error: "Error consultando PokeAPI." }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};
