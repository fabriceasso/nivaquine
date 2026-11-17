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
| Hébergement | [Cloudflare Pages](https://pages.cloudflare.com) — connecté au dépôt GitHub (déploiement à chaque `push`) |
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
├── deploy.ps1        # Script de mise en ligne (commit + push)
└── _deploy/          # Dossier de publication généré (ignoré par Git)
```

## Développement locale

Ouvrir `index.html` dans un navigateur, ou servir le dossier :

```powershell
npx serve .
```

## Mise en ligne

Le projet **Cloudflare Pages est connecté au dépôt GitHub** : tout `push` sur la branche
`main` déclenche automatiquement un build et un déploiement sur `nivaquine.com`.

```powershell
.\deploy.ps1                # committe les modifications + push
.\deploy.ps1 "Mon message"  # idem avec un message personnalisé
.\deploy.ps1 -NoCommit      # push seulement
```

Équivalent manuel :

```powershell
git add -A
git commit -m "Ma modification"
git push
```

**Suivre un déploiement :**

```powershell
npx wrangler pages deployment list --project-name nivaquine
```

> ℹ️ Le projet a été recréé en mode *Git-connected* : `wrangler pages deploy` (déploiement
> direct) ne s'applique plus — le dépôt Git est la seule source de vérité.

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
