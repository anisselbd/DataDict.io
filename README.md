# Data Dictionary IO

Une application web moderne pour créer, gérer et partager des dictionnaires de données. Documentez vos schémas de base de données de manière professionnelle et partagez-les avec votre équipe.

## 🚀 Fonctionnalités

- **Authentification** : Inscription et connexion sécurisées avec JWT
- **Gestion de projets** : Créer, modifier, supprimer vos dictionnaires
- **Entités et champs** : Définir les tables et leurs colonnes avec types, contraintes, descriptions
- **Export** : Téléchargez en Markdown ou PDF
- **Partage public** : Partagez vos dictionnaires via un lien public
- **Interface moderne** : Design élégant avec shadcn/ui et Tailwind CSS

## 🛠️ Stack technique

### Frontend

- **Framework** : Next.js 15 (App Router)
- **UI** : React, shadcn/ui, Tailwind CSS
- **State** : React Context (AuthContext)
- **HTTP** : Fetch API avec helpers centralisés

### Backend

- **Framework** : NestJS
- **ORM** : Prisma 5
- **Base de données** : MySQL
- **Auth** : JWT avec Passport.js
- **Export PDF** : PDFKit

## 📦 Installation

### Prérequis

- Node.js >= 18
- MySQL >= 8
- npm ou yarn

### 1. Cloner le projet

```bash
git clone <repo-url>
cd Data\ Dictionary\ IO
```

### 2. Installer les dépendances

#### Frontend

```bash
npm install
```

#### Backend

```bash
cd backend
npm install
```

### 3. Configuration

#### Frontend

Créez un fichier `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

#### Backend

Copiez `.env.example` vers `.env` et configurez :

```env
DATABASE_URL="mysql://user:password@localhost:3306/datadict"
JWT_SECRET="votre-secret-jwt-securise"
```

### 4. Base de données

```bash
cd backend
npx prisma migrate dev
```

### 5. Démarrer l'application

#### Terminal 1 - Backend

```bash
cd backend
npm run start:dev
```

#### Terminal 2 - Frontend

```bash
npm run dev
```

L'application sera disponible sur http://localhost:3000

## 📁 Structure du projet

```
Data Dictionary IO/
├── src/                    # Frontend Next.js
│   ├── app/                # Pages et routes
│   │   ├── auth/           # Page de connexion
│   │   ├── dashboard/      # Liste des projets
│   │   ├── editor/         # Éditeur de dictionnaire
│   │   └── p/[slug]/       # Vue publique
│   ├── components/         # Composants React
│   │   ├── ui/             # shadcn/ui
│   │   └── editor/         # Composants éditeur
│   ├── contexts/           # AuthContext
│   └── lib/                # API helpers, utils
│
├── backend/                # Backend NestJS
│   ├── src/
│   │   ├── auth/           # Module auth (JWT)
│   │   ├── projects/       # CRUD projets
│   │   ├── entities/       # CRUD entités
│   │   ├── fields/         # CRUD champs
│   │   ├── export/         # Export MD/PDF
│   │   ├── prisma/         # Service Prisma
│   │   └── common/         # Guards, decorators
│   └── prisma/
│       └── schema.prisma   # Schéma BDD
```

## 🔐 API Endpoints

### Auth

- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Projects

- `GET /api/projects` - Liste des projets
- `POST /api/projects` - Créer un projet
- `GET /api/projects/:id` - Détails d'un projet
- `PATCH /api/projects/:id` - Modifier un projet
- `DELETE /api/projects/:id` - Supprimer un projet
- `GET /api/projects/public/:slug` - Vue publique (sans auth)

### Entities

- `GET /api/entities?projectId=:id` - Liste des entités
- `POST /api/entities` - Créer une entité
- `GET /api/entities/:id` - Détails avec champs
- `PATCH /api/entities/:id` - Modifier une entité
- `DELETE /api/entities/:id` - Supprimer une entité

### Fields

- `POST /api/fields` - Créer un champ
- `GET /api/fields/:id` - Détails d'un champ
- `PATCH /api/fields/:id` - Modifier un champ
- `DELETE /api/fields/:id` - Supprimer un champ

### Export

- `GET /api/projects/:id/export/markdown` - Export Markdown
- `GET /api/projects/:id/export/pdf` - Export PDF

## 📝 Licence

MIT
