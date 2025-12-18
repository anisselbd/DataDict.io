# Data Dictionary IO - Backend

API REST NestJS pour l'application Data Dictionary IO.

## 🛠️ Technologies

- **NestJS** - Framework Node.js
- **Prisma** - ORM
- **MySQL** - Base de données
- **JWT** - Authentification
- **PDFKit** - Génération PDF

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos paramètres

# Créer la base de données et appliquer les migrations
npx prisma migrate dev

# Démarrer en développement
npm run start:dev

# Démarrer en production
npm run build
npm run start:prod
```

## ⚙️ Configuration (.env)

```env
# Base de données MySQL
DATABASE_URL="mysql://user:password@localhost:3306/datadict"

# JWT
JWT_SECRET="votre-secret-jwt-securise"
```

## 📁 Structure

```
backend/
├── src/
│   ├── auth/               # Authentification JWT
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── dto/            # DTOs validation
│   │   └── strategies/     # Passport JWT strategy
│   │
│   ├── projects/           # Gestion des projets
│   │   ├── projects.controller.ts
│   │   ├── projects.service.ts
│   │   └── dto/
│   │
│   ├── entities/           # Gestion des entités
│   │   ├── entities.controller.ts
│   │   ├── entities.service.ts
│   │   └── dto/
│   │
│   ├── fields/             # Gestion des champs
│   │   ├── fields.controller.ts
│   │   ├── fields.service.ts
│   │   └── dto/
│   │
│   ├── export/             # Export Markdown/PDF
│   │   ├── export.controller.ts
│   │   └── export.service.ts
│   │
│   ├── prisma/             # Service Prisma
│   │   └── prisma.service.ts
│   │
│   ├── common/             # Utilitaires partagés
│   │   ├── guards/         # JWT Guard
│   │   ├── decorators/     # CurrentUser
│   │   └── dto/            # Pagination
│   │
│   ├── app.module.ts       # Module principal
│   └── main.ts             # Point d'entrée
│
└── prisma/
    └── schema.prisma       # Schéma de base de données
```

## 🔐 Authentification

L'API utilise JWT. Pour accéder aux endpoints protégés :

```http
Authorization: Bearer <token>
```

Le token est obtenu via `POST /api/auth/login`.

## 📝 Scripts

| Commande             | Description                                 |
| -------------------- | ------------------------------------------- |
| `npm run start:dev`  | Démarrer en mode développement (hot reload) |
| `npm run build`      | Compiler pour la production                 |
| `npm run start:prod` | Démarrer en production                      |
| `npm run lint`       | Vérifier le code                            |
| `npx prisma studio`  | Interface admin pour la BDD                 |

## 🗄️ Modèle de données

```prisma
model User {
  id        String    @id @default(uuid())
  email     String    @unique
  password  String
  name      String?
  projects  Project[]
}

model Project {
  id          String    @id @default(uuid())
  name        String
  slug        String    @unique
  description String?
  userId      String
  entities    Entity[]
}

model Entity {
  id          String    @id @default(uuid())
  name        String
  description String?
  projectId   String
  fields      Field[]
}

model Field {
  id           String       @id @default(uuid())
  name         String
  type         String
  description  String?
  defaultValue String?
  required     Boolean      @default(false)
  unique       Boolean      @default(false)
  indexed      Boolean      @default(false)
  entityId     String
  constraints  Constraint[]
}
```
