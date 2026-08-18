# Cyclôme

> La réparation vélo à domicile : application de réservation et de gestion des interventions.

Un client réserve un créneau, l'application l'attribue au technicien de sa zone, qui intervient à domicile, et valide l'intervention depuis son téléphone.

## Démarrage rapide

```bash
npm install
cp .env.example .env        # puis renseigner BETTER_AUTH_SECRET
npm run db:up               # PostgreSQL + Adminer
npx prisma generate
npm run db:migrate -- --name init
npm run db:seed
npm run dev
```

## Stack technique

| Domaine                | Choix                                                           |
| ---------------------- | --------------------------------------------------------------- |
| Interface              | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4   |
| Formulaires et données | React Hook Form, TanStack Query, Zod                            |
| Cartographie           | Leaflet, Leaflet-Geoman, Turf.js, Base Adresse Nationale        |
| Base de données        | PostgreSQL 16, Prisma                                           |
| Authentification       | Better Auth : sessions en cookie HttpOnly, mots de passe hachés |
| Documentation d'API    | next-swagger-doc, interface Swagger sur `/api-docs`             |
| Tests                  | Jest (unitaires), Playwright (bout en bout)                     |
| Livraison              | Docker, Docker Compose, GitHub Actions, VPS                     |

## Structure

```
prisma/          schéma, migrations, jeu de données de départ
src/app/         routes, mises en page, routes d'API
src/lib/         règles métier réutilisables (créneaux, géographie, validation)
src/server/      cas d'usage transactionnels (réservation, annulation)
design/          tokens partagés avec Figma
tests/unit/      tests Jest
tests/e2e/       scénarios Playwright
scripts/         outillage, dont la vérification des tokens
```

## Commandes

| Commande                     | Effet                           |
| ---------------------------- | ------------------------------- |
| `npm run dev`                | serveur de développement        |
| `npm run db:up` / `db:down`  | base de données locale          |
| `npm run db:migrate`         | nouvelle migration              |
| `npm run db:seed`            | jeu de données de démonstration |
| `npm run db:studio`          | explorateur de données Prisma   |
| `npm run test`               | tests unitaires                 |
| `npm run e2e`                | tests E2E                       |
| `npm run lint` / `typecheck` | qualité du code                 |
| `npm run tokens:check`       | cohérence maquette / code       |
