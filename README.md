# Pokemon Finderw (Astro + Tailwind)

Aplicacion SSR en Astro para buscar Pokemon por nombre o numero. El frontend consulta un endpoint interno y ese endpoint se comunica con PokeAPI.

> Este proyecto se realizó como un ejemplo para desplegar aplicaciones web de Astro con SSR en Dokploy.

## Desplegar para desarrollo

1. Instalar dependencias:

```bash
pnpm install
```

2. Inicia el servidor de desarrollo:

```sh
pnpm run dev #http://localhost:4321
```

## API

### 1) Health

- Ruta: `/api/health`
- Método: `GET`
- Respuesta:

```json
{
  "status": "ok"
}
```


### 2) Obtener información de Pokemon

- Ruta: `/api/pokemon?q=<nombrePokemon|idPokemon>`
- Método: `GET`
- Query params:
  - `q` (requerido): nombre o ID de Pokemon.

Respuestas de error comunes:

- 400: falta query.
- 404: Pokemon no encontrado.
- 500: error consultando PokeAPI.

## Estructura del proyecto

```text
src/
├─ components/
│  ├─ App.astro
│  ├─ PokemonCard.astro
│  ├─ PokemonSearchForm.astro
│  └─ PokemonStatItem.astro
├─ layouts/
│  └─ BaseLayout.astro
├─ pages/
│  ├─ api/
│  │  ├─ health.ts
│  │  └─ pokemon.ts
│  └─ index.astro
├─ scripts/
│  ├─ types.ts
│  └─ utils.ts
└─ styles/
   └─ global.css
```