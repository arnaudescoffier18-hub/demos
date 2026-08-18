# Rapport de contrôle — TDS Déménagement Toulouse

Révision : 18 août 2026 — ajustements homepage.

## Modifications contrôlées
- Le devis reste la première interface de la page d’accueil.
- Le titre du hero est désormais réparti sur trois lignes et la grille passe en disposition verticale plus tôt sur écrans intermédiaires afin d’éviter tout chevauchement avec le devis.
- Les avis clients ont été déplacés après la section agence Toulouse, donc après services, formules, expertise et CTA projet.
- La note Google n’est plus affichée avant le titre dans le premier écran.
- Un trajet vertical A → B est ajouté sur la gauche de la page d’accueil desktop.
- Le camion TDS rose suit la progression réelle du scroll via un listener passif + `requestAnimationFrame`.
- L’animation latérale est masquée sous 1100 px pour ne pas gêner l’expérience mobile/tablette et désactivée avec `prefers-reduced-motion`.

## Contrôles techniques
- Syntaxe JavaScript : OK (`node --check`).
- Liens et ressources locales des fichiers HTML : OK.
- Structure HTML essentielle (`title`, `main`) : OK.
- Contenu essentiel visible sans JavaScript : conservé.
- Le wizard est enrichi par JavaScript mais son contenu reste lisible sans JavaScript.
- Navigation, appels `tel:`, e-mail et itinéraire conservés.

## Responsive visé
Les règles existantes et les nouveaux breakpoints couvrent : 320, 375, 390, 430, 768, 1024 et 1440 px. La nouvelle grille du hero bascule en une colonne à 1100 px, ce qui évite de comprimer simultanément le titre et la carte de devis.

## Ajustement mobile supplémentaire
- Sur téléphone uniquement (`≤ 760 px`), le header se masque après un mouvement continu vers le bas et réapparaît dès que l’utilisateur remonte.
- Le comportement est désactivé sur tablette et desktop (`≥ 761 px`).
- À proximité du haut de page, le header reste visible.
- L’ouverture du menu mobile force le header à rester visible.
- Listener de scroll passif + `requestAnimationFrame` pour limiter le coût de l’interaction.
