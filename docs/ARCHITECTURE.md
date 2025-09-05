# Projet Swipto – Architecture & Plan de Migration

## Arborescence cible
```
src/
├─ api/                 # Logique métier côté serveur (services Prisma/Firebase)
├─ components/          # Composants UI réutilisables (PascalCase)
│  ├─ cards/           # Cartes de swipe, leaderboard...
│  ├─ chat/            # Bulles de conversation et assistants
│  ├─ animations/      # Effets visuels (ex: LikeExplosion)
│  ├─ layout/          # Layouts globaux
│  └─ sidebar/         # Composants de la barre latérale
├─ context/             # Contextes React
├─ hooks/               # Hooks personnalisés
├─ lib/                 # Clients externes (Prisma, Firebase, helpers)
├─ pages/               # Routage Next.js (Page Router)
│  └─ api/
│     └─ sql/           # Endpoints API -> services dans `src/api`
├─ styles/              # Styles globaux

tests/
├─ api/                 # Tests des services
├─ pages/               # Tests des routes API
└─ components/          # Tests des composants React
   └─ cards/           # Tests des cartes
```

## Conventions
- **PascalCase** pour les composants React et fichiers contenant des classes.
- **camelCase** pour les fonctions, hooks et fichiers utilitaires.
- Chaque fichier exporte par défaut un unique élément principal.

## Plan de migration
1. **Créer les dossiers** `api/` et `tests/` à la racine de `src`.
2. **Déplacer** la logique métier des routes `pages/api/*` dans `src/api/*`.
3. **Importer** ces services depuis les routes `pages/api` correspondantes.
4. **Centraliser** les utilitaires (Prisma, Firebase, helpers) dans `src/lib`.
5. **Déplacer** les composants UI dans `src/components` et les contextes dans `src/context`.
6. **Ajouter** des tests unitaires avec Jest + React Testing Library.
7. **Mettre à jour** les imports pour utiliser l'alias `@/` vers `src/`.

Cette organisation facilite la scalabilité et clarifie la séparation entre l'UI, la logique métier et les endpoints API.
