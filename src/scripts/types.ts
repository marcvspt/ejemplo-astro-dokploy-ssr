export interface PokemonStats {
    attack: number;
    defense: number;
    hp: number;
    speed: number;
}

export interface PokemonPayload {
    height: number;
    id: number;
    image: string | null;
    name: string;
    stats: PokemonStats;
    types: string[];
    weight: number;
}

export interface BasicPokemon {
    id: number;
    name: string;
    height: number;
    weight: number;
    types: string[];
    image: string | null;
    stats: {
        hp: number;
        attack: number;
        defense: number;
        speed: number;
    };
}

export interface PokemonFinderElements {
    attackEl: HTMLElement | null;
    card: HTMLElement | null;
    defenseEl: HTMLElement | null;
    hpEl: HTMLElement | null;
    idEl: HTMLElement | null;
    image: HTMLImageElement | null;
    nameEl: HTMLElement | null;
    sizeEl: HTMLElement | null;
    speedEl: HTMLElement | null;
    status: HTMLElement | null;
    typesEl: HTMLElement | null;
}

export interface PokemonErrorPayload {
    error?: string;
}