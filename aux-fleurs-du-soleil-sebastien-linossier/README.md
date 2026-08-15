# Aux Fleurs Du Soleil — site vitrine

Site statique HTML/CSS/JavaScript, prêt à être prévisualisé et publié sur GitHub Pages.

## Prévisualiser localement

Ouvrir `index.html` dans un navigateur. Pour reproduire au mieux l'environnement web, on peut aussi lancer un petit serveur local :

```bash
python3 -m http.server 8000
```

Puis ouvrir `http://localhost:8000`.

## Publier sur GitHub Pages

1. Créer un nouveau dépôt GitHub.
2. Ajouter tous les fichiers présents à la racine de ce dossier, y compris `.github/`.
3. Faire un commit puis un push sur la branche `main`.
4. Dans GitHub, ouvrir **Settings → Pages** et vérifier que la source est **GitHub Actions**.
5. Le workflow fourni publiera automatiquement le site à chaque push sur `main`.

## Connecter un nom de domaine

Une fois le domaine acheté :

1. Ajouter le domaine personnalisé dans **Settings → Pages → Custom domain**.
2. Configurer les enregistrements DNS demandés par GitHub.
3. Quand l'URL définitive est connue, remplacer `noindex, nofollow` dans `index.html` par `index, follow`.
4. Remplacer le contenu de `robots.txt` pour autoriser l'indexation.
5. Ajouter l'URL définitive dans `sitemap.xml` et, si souhaité, une balise canonical dans `index.html`.

## Contenu

Les informations, horaires, note Google, avis et photos de cette maquette proviennent du brief fourni à partir de la fiche Google Business Profile. Les avis sont reproduits tels qu'ils ont été fournis.

## Structure

- `index.html` : contenu et SEO
- `styles.css` : mise en page et responsive
- `script.js` : animations et interactions en amélioration progressive
- `photos/` : photos fournies
- `favicon.svg`
- `robots.txt`
- `sitemap.xml`
- `.github/workflows/pages.yml` : déploiement GitHub Pages

Le contenu essentiel reste lisible sans JavaScript.
