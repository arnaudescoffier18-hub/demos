# Philippe Fleurs — site vitrine

Site statique HTML/CSS/JavaScript pour **Philippe Fleurs**, 54 Rue Bergson, 42000 Saint-Étienne.

## Prévisualiser localement

Ouvrir `index.html` dans un navigateur. Pour tester exactement comme sur GitHub Pages, lancer par exemple :

```bash
python3 -m http.server 8000
```

puis ouvrir `http://localhost:8000`.

## Publier sur GitHub Pages

1. Créer un nouveau repository GitHub.
2. Ajouter tous les fichiers de ce dossier à la racine du repository.
3. Faire un commit puis un push sur la branche `main`.
4. Le workflow `.github/workflows/pages.yml` publie automatiquement le site.
5. Dans **Settings → Pages**, vérifier que la source est **GitHub Actions**.

## Connecter un domaine

Une fois le domaine acheté :

1. Ajouter le domaine personnalisé dans **Settings → Pages → Custom domain**.
2. Configurer les enregistrements DNS demandés par GitHub auprès du registrar.
3. Attendre la propagation DNS et activer **Enforce HTTPS**.

## Passage en production

Cette version est volontairement une **maquette de prospection** :

- la page contient `noindex, nofollow` ;
- `robots.txt` bloque l’indexation ;
- le sitemap contient un domaine placeholder ;
- aucune donnée n’est envoyée par formulaire.

Avant une vraie mise en ligne client :

- remplacer `noindex, nofollow` par les directives SEO voulues ;
- mettre `robots.txt` en autorisation ;
- remplacer `https://www.nomentreprise.fr/` par le domaine final dans `sitemap.xml` ;
- ajouter une URL canonique et mettre à jour les métadonnées OpenGraph avec l’URL finale.

## Structure

- `index.html` — contenu et SEO
- `styles.css` — design responsive et animations
- `script.js` — menu, interactions et effets progressifs
- `photos/` — photos fournies
- `favicon.svg` — favicon
- `robots.txt` — blocage d’indexation pour la maquette
- `sitemap.xml` — modèle de sitemap
- `.github/workflows/pages.yml` — déploiement GitHub Pages
