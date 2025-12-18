# Guide de Déploiement - Data Dictionary IO

Ce guide explique comment mettre en ligne votre application Full Stack avec **GitHub**, **Render** (Backend/DB) et **Vercel** (Frontend).

---

## Prérequis

1. Un compte [GitHub](https://github.com/).
2. Un compte sur [Vercel](https://vercel.com/) (pour le Frontend).
3. Un compte sur [Render](https://render.com/) (pour le Backend et la Base de données).

---

## Étape 1 : GitHub

1. Créez un nouveau repository sur GitHub.
2. Poussez votre code local vers ce repository.
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/VOTRE_USER/VOTRE_REPO.git
   git push -u origin main
   ```

---

## Étape 2 : Déployer la Base de Données (Render)

1. Allez sur le [Dashboard Render](https://dashboard.render.com/).
2. Cliquez sur **New +** -> **PostgreSQL**.
3. Configuration :
   - **Name**: `datadictionary-db` (par exemple).
   - **Database**: laissez vide (généré) ou `datadictionary`.
   - **User**: laissez vide (généré).
   - **Region**: Choisissez la plus proche de vous (ex: Frankfurt).
   - **Plan**: Free (suffisant pour tester).
4. Cliquez sur **Create Database**.
5. Une fois créée, copiez l'**Internal Database URL** (pour un usage interne) et l'**External Database URL** (pour se connecter depuis votre ordi si besoin, mais Render utilisera l'internal pour communiquer entre ses services, sauf que si vous utilisez le plan Free, les services Web Render ne peuvent parfois pas utiliser l'Internal URL si ce n'est pas le même réseau privé virtual... Pour le plan Free, utilisez **External Database URL** pour simplifier la connexion, car le web service sera public).
   Prenez l'**External Database URL**.

---

## Étape 3 : Déployer le Backend (Render)

1. Sur le Dashboard Render, cliquez sur **New +** -> **Web Service**.
2. Connectez votre compte GitHub et sélectionnez votre repo.
3. Configuration :
   - **Name**: `datadictionary-api`.
   - **Region**: La même que la base de données.
   - **Branch**: `main`.
   - **Root Directory**: `backend` (Très important, car votre backend est dans ce dossier).
   - **Runtime**: `Node`.
   - **Build Command**: `npm install && npx prisma generate && npm run build` (Pour installer, générer le client Prisma et compiler NestJS).
   - **Start Command**: `npx prisma migrate deploy && npm run start:prod` (Pour appliquer les migrations DB et lancer le serveur).
4. Variables d'Environnement (**Environment Variables**) :
   Ajoutez les clés suivantes :
   - `DATABASE_URL` : Collez l'**External Database URL** de votre base PostgreSQL Render. (Important : ajoutez `?sslmode=require` à la fin si ce n'est pas déjà présent et que Render l'exige, mais généralement l'URL copiée depuis Render fonctionne telle quelle).
   - `JWT_SECRET` : Une chaîne aléatoire complexe (ex: `super_secret_key_123`).
   - `PORT` : `10000` (Optionnel, Render le définit automatiquement, mais c'est bien de l'avoir).
5. Cliquez sur **Create Web Service**.
6. Attendez que le déploiement se finisse. Render vous donnera une URL (ex: `https://datadictionary-api.onrender.com`). Notez-la.

---

## Étape 4 : Déployer le Frontend (Vercel)

1. Allez sur le [Dashboard Vercel](https://vercel.com/dashboard).
2. Cliquez sur **Add New...** -> **Project**.
3. Importez votre repo GitHub.
4. Configuration :
   - **Framework Preset**: Next.js.
   - **Root Directory**: Si Vercel ne détecte pas automatiquement, choisissez la racine `./` (là où est votre `package.json` principal).
5. Variables d'Environnement :
   - Déroulez "Environment Variables".
   - Ajoutez `NEXT_PUBLIC_API_URL` avec comme valeur l'URL de votre backend Render **SANS le slash final** (ex: `https://datadictionary-api.onrender.com/api`).
     _Note: Votre backend a un préfixe global `/api`, donc ajoutez `/api` à l'URL. Exemple : `https://datadictionary-api.onrender.com/api`_.
6. Cliquez sur **Deploy**.

---

## Étape 5 : Finalisation (CORS)

1. Une fois le Frontend déployé sur Vercel, copiez son URL (ex: `https://datadictionary-frontend.vercel.app`).
2. Retournez sur **Render** -> Web Service (Backend) -> **Environment**.
3. Ajoutez une nouvelle variable :
   - `FRONTEND_URL` : Collez l'URL Vercel (ex: `https://datadictionary-frontend.vercel.app`).
4. Render va redémarrer automatiquement votre service.

🎉 Votre application est en ligne !
