import type { PokemonFinderElements, PokemonPayload, PokemonErrorPayload } from "@/scripts/types.ts";

const SELECTORS = {
    attack: "#stat-attack",
    card: "#pokemon-card",
    defense: "#stat-defense",
    form: "#pokemon-form",
    hp: "#stat-hp",
    id: "#pokemon-id",
    image: "#pokemon-image",
    name: "#pokemon-name",
    size: "#pokemon-size",
    speed: "#stat-speed",
    status: "#status",
    types: "#pokemon-types"
} as const;

const getElement = <T extends Element>(selector: string): T | null => {
    return document.querySelector<T>(selector);
};

const getPokemonElements = (): PokemonFinderElements => {
    return {
        attackEl: getElement<HTMLElement>(SELECTORS.attack),
        card: getElement<HTMLElement>(SELECTORS.card),
        defenseEl: getElement<HTMLElement>(SELECTORS.defense),
        hpEl: getElement<HTMLElement>(SELECTORS.hp),
        idEl: getElement<HTMLElement>(SELECTORS.id),
        image: getElement<HTMLImageElement>(SELECTORS.image),
        nameEl: getElement<HTMLElement>(SELECTORS.name),
        sizeEl: getElement<HTMLElement>(SELECTORS.size),
        speedEl: getElement<HTMLElement>(SELECTORS.speed),
        status: getElement<HTMLElement>(SELECTORS.status),
        typesEl: getElement<HTMLElement>(SELECTORS.types)
    };
};

const hideCard = ({ card }: PokemonFinderElements): void => {
    card?.classList.add("hidden");
};

const showCard = ({ card }: PokemonFinderElements): void => {
    card?.classList.remove("hidden");
};

const setStatus = (
    { status }: Pick<PokemonFinderElements, "status">,
    message: string
): void => {
    if (status) {
        status.textContent = message;
    }
};

const fillPokemonCard = (
    elements: PokemonFinderElements,
    payload: PokemonPayload
): void => {
    if (elements.nameEl) elements.nameEl.textContent = payload.name;
    if (elements.idEl) elements.idEl.textContent = `#${payload.id}`;
    if (elements.typesEl) {
        elements.typesEl.textContent = `Tipos: ${payload.types.join(", ")}`;
    }
    if (elements.sizeEl) {
        elements.sizeEl.textContent = `Altura: ${payload.height} | Peso: ${payload.weight}`;
    }
    if (elements.hpEl) elements.hpEl.textContent = String(payload.stats.hp);
    if (elements.attackEl) {
        elements.attackEl.textContent = String(payload.stats.attack);
    }
    if (elements.defenseEl) {
        elements.defenseEl.textContent = String(payload.stats.defense);
    }
    if (elements.speedEl) {
        elements.speedEl.textContent = String(payload.stats.speed);
    }
    if (elements.image) {
        elements.image.src = payload.image ?? "";
        elements.image.alt = payload.name
            ? `Imagen de ${payload.name}`
            : "Imagen de Pokemon";
    }
};

const parseQueryFromSubmit = (event: SubmitEvent): string => {
    const form =
        event.currentTarget instanceof HTMLFormElement
            ? event.currentTarget
            : null;
    const formData = form ? new FormData(form) : null;
    return String(formData?.get("pokemon") ?? "").trim();
};

const fetchPokemon = async (query: string): Promise<PokemonPayload> => {
    const response = await fetch(`/api/pokemon?q=${encodeURIComponent(query)}`);
    const payload = (await response.json()) as PokemonPayload | PokemonErrorPayload;

    if (!response.ok) {
        const message =
            "error" in payload
                ? payload.error ?? "No se pudo obtener el Pokemon."
                : "No se pudo obtener el Pokemon.";
        throw new Error(message);
    }

    return payload as PokemonPayload;
};

const handleSearchSubmit = async (
    event: SubmitEvent,
    elements: PokemonFinderElements
): Promise<void> => {
    event.preventDefault();

    const query = parseQueryFromSubmit(event);

    if (!query) {
        setStatus(elements, "Escribe un Pokemon para buscar.");
        hideCard(elements);
        return;
    }

    setStatus(elements, "Buscando...");
    hideCard(elements);

    try {
        const pokemon = await fetchPokemon(query);
        fillPokemonCard(elements, pokemon);
        showCard(elements);
        setStatus(elements, "Pokemon encontrado.");
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Error de red al consultar el Pokemon.";
        setStatus(elements, message);
        hideCard(elements);
    }
};

export const initPokemonFinder = (): void => {
    const form = getElement<HTMLFormElement>(SELECTORS.form);
    if (!form) return;

    const elements = getPokemonElements();

    form.addEventListener("submit", async (event) => {
        await handleSearchSubmit(event, elements);
    });
};
