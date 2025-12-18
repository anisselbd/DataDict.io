# Guide de Déploiement - Data Dictionary IO

Ce guide explique comment mettre en ligne votre application avec **Vercel** (Frontend) et **Railway** (Backend & Base de données MySQL).
Cette approche vous permet de **garder MySQL** sans rien changer à votre code local.

---

## Prérequis

1. Un compte [GitHub](https://github.com/) (Code déjà pushé sur `main`).
2. Un compte sur [Vercel](https://vercel.com/) (pour le Frontend).
3. Un compte sur [Railway](https://railway.app/) (pour le Backend et la BDD).

---

## Étape 1 : Déployer Backend & MySQL (Railway)

1. Allez sur le [Dashboard Railway](https://railway.app/dashboard) et cliquez sur **New Project**.
2. Choisissez **"Deploy from GitHub repo"** et sélectionnez votre projet.
3. Railway va détecter le projet. Comme c'est un monorepo, nous devons configurer le dossier racine :
   - Cliquez sur la carte du service (le bloc représentant votre repo) -> **Settings**.
   - Cherchez **Root Directory** et mettez : `/backend`.
4. Ajoutez une Base de Données MySQL :
   - Cliquez sur le bouton **New** (ou +) en haut à droite du canvas -> **Database** -> **MySQL**.
   - Une fois ajoutée, cliquez sur la carte MySQL -> **Variables**.
   - Copiez la valeur de `MYSQL_URL` (ou `DATABASE_URL`).
5. Reliez le Backend à la Base :
   - Retournez sur la carte du Backend -> **Variables**.
   - Ajoutez `DATABASE_URL` avec la valeur copiée (l'URL de connexion MySQL).
   - Ajoutez `JWT_SECRET` avec une chaîne aléatoire (ex: `azerty123456`).
   - Ajoutez `PORT` avec la valeur `3001` (ou laissez par défaut, Railway fournit souvent sa propre variable PORT mais NestJS l'utilisera).
6. Configurer le Build et le Start :
   - Dans **Settings** du Backend -> **Build Command** :
     `npm install && npx prisma generate && npm run build`
   - Dans **Start Command** :
     `npx prisma migrate deploy && npm run start:prod`
   - Dans **Networking**, assurez-vous de cliquer sur "Generate Domain" pour avoir une URL publique (ex: `https://backend-production.up.railway.app`).

---

## Étape 2 : Déployer le Frontend (Vercel)

1. Allez sur le [Dashboard Vercel](https://vercel.com/dashboard) -> **Add New...** -> **Project**.
2. Importez votre repo GitHub.
3. Configuration :
   - **Framework Preset**: Next.js.
   - **Root Directory**: Si nécessaire, vérifiez que c'est la racine `./`.
4. Variables d'Environnement :
   - Ajoutez `NEXT_PUBLIC_API_URL` avec l'URL publique de votre backend Railway (Notez-la depuis Railway).
   - **Important** : Ajoutez `/api` à la fin de l'URL si ce n'est pas déjà inclus.
     Exemple : `https://backend-production.up.railway.app/api`
5. Cliquez sur **Deploy**.

---

## Étape 3 : Finalisation (CORS)

1. Une fois le Frontend déployé sur Vercel, copiez son URL (ex: `https://mon-projet.vercel.app`).
2. Retournez sur **Railway** -> Backend -> **Variables**.
3. Ajoutez une variable `FRONTEND_URL` :
   - Nom: `FRONTEND_URL`
   - Valeur: `https://mon-projet.vercel.app` (sans slash à la fin).
4. Railway redémarra automatiquement le backend pour prendre en compte le changement.

🎉 Votre application est en ligne avec MySQL !
