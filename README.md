# NIVAQUINE – Digital Solutions

Site vitrine du cabinet **NIVAQUINE – Digital Solutions** — conseil en gestion de l'information, géomatique (SIG), analyse de données et transformation numérique.

> « La donnée au service de la décision » — Côte d'Ivoire · Afrique de l'Ouest · International

🌐 **En ligne :** [https://nivaquine.com](https://nivaquine.com)

---

## Stack

| Élément | Détail |
| --- | --- |
| Type | Site statique (HTML / CSS / JS) |
| CSS | Tailwind CSS (CDN) + feuille personnalisée `styles.css` |
| Polices | Inter (texte) · Sora (titres) |
| Hébergement | [Cloudflare Pages](https://pages.cloudflare.com) |
| Domaine | `nivaquine.com` (zone Cloudflare) |

## Structure

```
.
├── index.html        # Page unique (accueil, à propos, expertises, solutions, secteurs, contact)
├── styles.css        # Styles personnalisés et variables de marque
├── script.js         # Menu, navigation active, animations, FR/EN, formulaire
├── 404.html          # Page d'erreur servie par Cloudflare Pages
├── robots.txt        # Règles d'exploration + lien vers le sitemap
├── sitemap.xml       # Plan du site
├── pics/             # Images du site
├── deploy.ps1        # Script de mise en ligne
└── _deploy/          # Dossier de publication généré (ignoré par Git)
```

## Développement locale

Ouvrir `index.html` dans un navigateur, ou servir le dossier :

```powershell
npx serve .
```

## Mise en ligne

Prérequis (une seule fois) : `npx wrangler login`

```powershell
.\deploy.ps1
```

Le script reconstruit le dossier `_deploy/` (sans les images inutilisées) puis exécute
`wrangler pages deploy _deploy --project-name nivaquine --branch main`.

### Domaine personnalisé

Deux domaines sont attachés au projet Pages : `nivaquine.com` (apex) et `www.nivaquine.com`.
Une règle de redirection 301 de `www` vers l'apex est configurée dans la zone Cloudflare
(**Rules → Redirect Rules**).

## Langues

Le site est bilingue **français / anglais**. Le contenu anglais est porté par les attributs
`data-en`, `data-en-placeholder` et `data-en-label` ; la bascule est gérée dans `script.js`
et mémorisée dans `localStorage` (`nq-lang`).

## Contact

- E-mail : nivaquine@yahoo.com
- Téléphone : +225 01 05 40 03 71
- Adresse : 08 BP 2353 ABJ 08, Abidjan (Côte d'Ivoire)
