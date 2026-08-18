# Rapport de contrôle

Contrôles exécutés sur la livraison :

- 30 documents HTML analysés (29 pages + 404).
- 1 seul H1 présent sur chaque document.
- Titres HTML présents sur chaque page.
- Vérification automatique des liens internes et des chemins d'assets : **0 chemin cassé détecté**.
- Validation syntaxique de `assets/js/script.js` avec Node.js : **OK**.
- Images réelles converties en WebP et limitées à 1800 px pour réduire le poids.
- Contenu essentiel présent dans le HTML sans dépendre de JavaScript.
- Breakpoints CSS prévus pour petits mobiles, mobiles, tablettes et desktop (`420`, `760`, `1050` px + styles fluides).
- `prefers-reduced-motion` pris en charge.
- CTA mobile fixe avec `env(safe-area-inset-bottom)`.
- Carte Google intégrée en iframe et liens d'itinéraire présents.
- `robots.txt`, `sitemap.xml`, canonical, OpenGraph et données structurées présents.

## Limite de l'environnement de test

Le binaire Chromium fourni dans l'environnement de génération ne démarre pas correctement, même sur `about:blank` (problème D-Bus/zygote de l'environnement). Le contrôle visuel automatisé par navigateur n'a donc pas pu être exécuté ici. La structure responsive et les chemins ont été vérifiés statiquement ; un dernier contrôle réel dans Safari iOS / Chrome Android est recommandé avant mise en production, comme pour toute migration.
