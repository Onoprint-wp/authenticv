# Audit SEO Initial — AuthentiCV

*Date d'audit : mai 2026 — À mettre à jour trimestriellement*

---

## 1. Synthèse Exécutive

| Dimension | Statut | Priorité |
|---|---|---|
| Domaine / canonicalisation | 🔴 Double URL accessible | Critique |
| Indexation Google | 🔴 Site absent des résultats | Critique |
| Sitemap | 🔴 Non vérifié / non soumis | Critique |
| Performance (Core Web Vitals) | 🟡 À mesurer | Élevée |
| Balises title/meta | 🟡 Non optimisées SEO | Élevée |
| Schema.org | 🔴 Absent | Élevée |
| Contenu indexable | 🔴 Mono-page uniquement | Haute |
| Backlinks | 🔴 Inexistants (domaine neuf) | Moyenne |
| Mobile-first | 🟢 Responsive (Next.js) | OK |
| HTTPS | 🟢 Forcé (.app TLD) | OK |

**Score global estimé : 2/10 — Fondations à poser intégralement.**

---

## 2. Audit Technique

### 2.1 Architecture URL
- **Domaine principal** : `authenticv.app` ✅ (TLD .app = HTTPS forcé, moderne)
- **Problème** : `authenticv.vercel.app` accessible en parallèle → duplicate content
- **Solution** : Redirect 301 + canonical (voir `01_urgences_techniques.md`)

### 2.2 Rendu JavaScript (SSR/SSG)
- **Stack** : Next.js 15 + App Router → SSR natif disponible ✅
- **À vérifier** : La landing `/` est-elle en SSG (`generateStaticParams`) ou SSR ?
- **Règle** : Pages publiques (landing, blog, modèles) → SSG/ISR impératif
- **Pages privées** (builder `/builder`) → peuvent rester en CSR

**Commande de vérification :**
```bash
curl -s https://authenticv.app | grep -o '<h1[^>]*>[^<]*</h1>'
# Si H1 visible → SSR/SSG OK. Si vide → problème CSR
```

### 2.3 Performance (Core Web Vitals)
*À mesurer sur https://pagespeed.web.dev*

| Métrique | Cible Google | Statut |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s | À mesurer |
| INP (Interaction to Next Paint) | < 200ms | À mesurer |
| CLS (Cumulative Layout Shift) | < 0.1 | À mesurer |
| FCP (First Contentful Paint) | < 1.8s | À mesurer |
| TTFB (Time to First Byte) | < 800ms | À mesurer |

**Points de vigilance Next.js :**
- Lazy loading des composants lourds (PDF viewer, éditeur CV)
- Optimisation images avec `next/image`
- Bundle splitting (éviter les barrel imports dans CLAUDE.md)

### 2.4 Robots.txt et Sitemap
```
# État attendu de robots.txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /builder
Disallow: /login

Sitemap: https://authenticv.app/sitemap.xml
```

### 2.5 Données structurées
- **Actuel** : Aucune donnée structurée détectée
- **À implémenter** : `SoftwareApplication`, `FAQPage`, `BreadcrumbList` (sur les futures pages)

---

## 3. Audit On-Page

### 3.1 Landing Page (page d'accueil)

| Balise | Actuel | Recommandé |
|---|---|---|
| `<title>` | À vérifier | `AuthentiCV — Créez votre CV avec l'IA en 5 minutes | Gratuit` |
| `<meta description>` | À vérifier | `Coach IA Alex vous guide pour créer un CV ATS-optimisé. Export PDF. Gratuit jusqu'à 20 messages, puis 9 €/mois.` |
| `<h1>` | À vérifier | 1 seul H1, contenant le mot-clé principal |
| Maillage interne | N/A (mono-page) | À construire au fil des nouvelles pages |
| Images alt | À vérifier | Toutes les images doivent avoir un `alt` descriptif |

### 3.2 Pages manquantes (à créer)
Aucune de ces pages n'existe aujourd'hui :
- `/blog` — contenu éducatif (trafic top-of-funnel)
- `/modeles-cv` — galerie indexable (levier SEO n°1 du secteur)
- `/modeles-cv/[metier]` — pages programmatiques
- `/exemple-cv` — intention transactionnelle forte
- `/cv-etudiant` — niche volume élevé
- `/cv-sans-experience` — niche conversion élevée
- `/lettre-de-motivation` — produit existant, page dédiée manquante
- `/tarifs` — SEO + conversion

---

## 4. Audit Off-Page

### 4.1 Profil de backlinks
- **DA estimé** : 0-5 (domaine très récent)
- **Backlinks** : Inexistants ou quasi-nuls
- **Objectif 12 mois** : 20-50 backlinks DR > 30

### 4.2 Présence de marque
- **Google** : Site absent des résultats sur "authenticv" → indexation à corriger
- **Réseaux sociaux** : À créer (LinkedIn, Instagram, TikTok selon cible)
- **Google Business Profile** : Non applicable (produit 100% digital)

---

## 5. Analyse Concurrentielle SEO

| Concurrent | Trafic estimé | Stratégie principale |
|---|---|---|
| CVDesignR | ~800K/mois | Galerie modèles + blog massif |
| Canva (CV) | Millions | Autorité domaine + templates |
| MakeMyCV | ~50K/mois | Blog + SEO programmatique |
| AttractiveCV | ~30K/mois | Blog carrière + IA |
| WebCV.app | < 10K/mois | Concurrent direct, même TLD |

**Enseignement** : Tous les concurrents efficaces ont une **galerie de modèles** + **blog**. Ce sont les deux piliers à construire en priorité.

---

## 6. Plan d'Action Priorisé

| Action | Impact | Effort | Délai |
|---|---|---|---|
| Redirect 301 + canonical | 🔴 Critique | Faible | Semaine 1 |
| Soumettre sitemap GSC | 🔴 Critique | Faible | Semaine 1 |
| Optimiser meta tags landing | Élevé | Faible | Semaine 1 |
| Implémenter schema.org | Élevé | Moyen | Semaine 2 |
| Corriger Core Web Vitals | Élevé | Moyen | Semaine 3-4 |
| Créer /modeles-cv | Très élevé | Élevé | Mois 2 |
| Lancer le blog | Très élevé | Très élevé | Mois 2-3 |
| SEO programmatique métiers | Très élevé | Élevé | Mois 4-6 |
