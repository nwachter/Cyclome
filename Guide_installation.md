# Cyclôme : mise en place de l'environnement de développement

Suivre les étapes dans l'ordre pour installer l'application. Sautez à l'étape 11 pour l'installation en production.

## 0. Prérequis - DEVELOPPEMENT

| Outil | Version | Vérification |

| Node.js | 22 LTS (20.11 minimum) | `node -v` |
| npm | fourni avec Node | `npm -v` |
| Docker/Docker Desktop (Linux/Windows) | récent, **démarré** | `docker --version` puis `docker ps` |
| Git | récent | `git --version` |

Si _docker ps_ renvoie une erreur de connexion (surtout sur Windows), Docker Desktop n'est pas lancé.

## 1. Repository, Branches

Pour récupérer le repository et travailler dans l'environnement de développement, entrez ces commandes dans votre terminal :

```bash
git clone https://github.com/<votre-organisation>/cyclome.git
cd cyclome
git checkout -b dev
git push -u origin dev
```

3 niveaux de branches :

- main : ce qui tourne en production. Personne n'y pousse directement.
- dev : intégration. Toutes les fonctionnalités y arrivent par pull request.
- feature/[nom-US] : une branche par , par exemple : feature/admin-zones.

## 2. Dépendances

```bash
npm install
```

Un `package-lock.json` validé est déjà présent : il fige un arbre de 1001 paquets qui se résout
sans conflit de pairs. Ne le supprimez pas, et committez-le à chaque ajout de dépendance : c'est
lui qui garantit que chaque poste et la CI installent exactement les mêmes versions.

## 3. Variables d'environnement

Copier les variables d'environnement (.env a 5 variables dons les noms sont vérifiables dans la version example).

```bash
cp .env.example .env
```

Générez une vraie clé de session pour l'auth et remplacez la valeur de BETTER_AUTH_SECRET :

```bash
# Linux :
openssl rand -base64 32

# Windows  :
 `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
```

## 4. Base de données

Sur Windows, en dev, Démarrez Docker Desktop, puis démarrer la base de données

```bash
npm run db:up
```

2 conteneurs démarrent : PostgreSQL 16 (port 5432), et Adminer (http://localhost:8080), client léger pour pour inspecter/modifier les tables

## 5. Schéma et première migration

```bash
npx prisma generate
npm run db:migrate -- --name init
```

Le script db:migrate les tables et enregistre la migration prisma. Pour vérifier, consulter les tables dans Adminer.

## 6. Authentification

Better Auth gère ses propres tables, meme si le schéma en contient une version (Session, etc...)

```bash
npm run auth:generate
```

## 7. Jeu de données (uniquement en développement)

```bash
npm run db:seed
```

Crée la société, six forfaits, cinq produits, la zone Est avec son technicien, 3 semaines de créneaux du lundi au samedi de 8h à 19h, et une intervention. 3 comptes de démonstration sont notamment affichés en fin d'exécution, leurs ids sont disponibles dans les cahiers de tests.

## 8. Premier lancement

```bash
npm run dev
```

Ouvrez http://localhost:3000 : la page d'accueil doit s'afficher.

## 9. Tests, lints, qualité

Pour lancer les tests (npm run test doit afficher trois suites en vert.) :

```bash
npm run test          # tests unitaires
npx playwright install --with-deps chromium
npm run build && npm run e2e   # tests E2E
```

Pour lancer les linters, et le typecheck, et la vérification des tokens

```bash
npm run lint
npm run typecheck
npm run tokens:check
```

La dernière commande compare le thème Tailwind dans globals.css au fichier de tokens du design system conçu via Figma.

## 10 Documentation d'API

La documentation d'api est faite grace à Swagger utilisé dans les fichiers de
_src/app/api_ (avec @swagger). La documentation est consultable sur http://localhost:3000/api-docs

## 11. Connexion au VPS - PRODUCTION

La connexion au serveur se fait en SSH. Dans votre terminal, tapez :

```bash
ssh -p 1234 user@123.45.67.89
```

### 12 Caddy

Lancer le reverse proxy caddy.

```bash
cd ~/apps/caddy && docker compose up -d
```

Attention, comme le réseau est crée par le compose de Cyclome (et le réseau docker aussi), une erreur peut se lever, dans ce cas , faire d'abord le 12.1

### 12.1 Premier déploiement

```bash
cd ~/apps
git clone https://github.com/nwachter/Cyclome.git cyclome
cd cyclome

cat > .env <<'FIN'
POSTGRES_PASSWORD=<mot_de_passe>
BETTER_AUTH_SECRET=<clé générée par openssl rand -base64 32>
APP_URL=https://cyclome.nwproject.fr
FIN

chmod 600 .env

docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml exec -T app npx prisma migrate deploy
```

La commande `curl https://cyclome.nwproject.fr/api/health` doit répondre `{"status":"ok","database":"up"}` depuis votre PC.
