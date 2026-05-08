# Urgences Techniques — À faire cette semaine

## 🔴 Priorité 1 : Double domaine / Duplicate content

### Problème
`authenticv.vercel.app` et `authenticv.app` sont tous les deux accessibles.
Google voit deux versions identiques → dilution d'autorité, indexation de la mauvaise URL.

### Actions

#### 1.1 Redirect 301 dans Vercel (5 min)
1. Ouvrir le dashboard Vercel → projet AuthentiCV
2. Settings → Domains
3. Définir `authenticv.app` comme domaine **Primary**
4. Vercel proposera automatiquement de rediriger `authenticv.vercel.app` → `authenticv.app` en 301
5. Activer la redirection

#### 1.2 Noindex sur le sous-domaine Vercel (next.config.ts)
Ajouter dans `next.config.ts` pour bloquer l'indexation si le header host contient `.vercel.app` :

```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: process.env.VERCEL_URL?.includes('vercel.app') ? 'noindex, nofollow' : 'index, follow',
          },
        ],
      },
    ];
  },
};
```

#### 1.3 Balise canonical dans Next.js App Router
Dans `src/app/layout.tsx` (ou chaque page), ajouter :

```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://authenticv.app'),
  alternates: {
    canonical: '/',
  },
  // ...
};
```

Pour les pages dynamiques, générer le canonical page par page :
```typescript
// src/app/blog/[slug]/page.tsx
export async function generateMetadata({ params }) {
  return {
    alternates: { canonical: `/blog/${params.slug}` },
  };
}
```

---

## 🔴 Priorité 2 : Google Search Console

### Actions
1. Aller sur https://search.google.com/search-console
2. Ajouter la propriété `https://authenticv.app` (vérification DNS ou fichier HTML)
3. Soumettre le sitemap : `https://authenticv.app/sitemap.xml`
4. Vérifier que Next.js génère bien un sitemap (sinon, utiliser `next-sitemap`)

### Installation next-sitemap si absent
```bash
npm install next-sitemap
```

```javascript
// next-sitemap.config.js
module.exports = {
  siteUrl: 'https://authenticv.app',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/builder'] },
    ],
  },
};
```

Ajouter dans `package.json` :
```json
"postbuild": "next-sitemap"
```

---

## 🟠 Priorité 3 : Meta tags Landing Page

### État actuel à vérifier
Ouvrir https://authenticv.app → View Source → chercher `<title>` et `<meta name="description">`

### Cibles recommandées
```html
<title>AuthentiCV — Créez votre CV avec l'IA en 5 minutes | Gratuit</title>
<meta name="description" content="AuthentiCV génère votre CV professionnel grâce à Alex, votre coach IA. Optimisé ATS, export PDF. Gratuit jusqu'à 20 messages, puis 9 €/mois.">

<!-- Open Graph -->
<meta property="og:title" content="AuthentiCV — Votre CV par IA conversationnelle">
<meta property="og:description" content="Discutez avec Alex, créez un CV percutant en 5 minutes. ATS-optimisé, export PDF.">
<meta property="og:image" content="https://authenticv.app/og-image.png">
<meta property="og:url" content="https://authenticv.app">
<meta property="og:type" content="website">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="AuthentiCV — CV par IA">
<meta name="twitter:description" content="Créez votre CV professionnel avec Alex, votre coach IA. Gratuit.">
```

---

## 🟠 Priorité 4 : Schema.org

### SoftwareApplication (landing)
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "AuthentiCV",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "description": "Générateur de CV par intelligence artificielle conversationnelle",
  "url": "https://authenticv.app",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "EUR",
    "description": "Plan gratuit — 20 messages/mois"
  }
}
```

### FAQPage (section FAQ existante)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "AuthentiCV est-il gratuit ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Oui, AuthentiCV est gratuit jusqu'à 20 messages par mois. Le plan Pro à 9 €/mois débloque les messages illimités, l'export PDF et le Job Match."
      }
    },
    {
      "@type": "Question",
      "name": "Comment fonctionne le coach IA Alex ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Alex est un coach IA conversationnel. Il vous pose des questions sur votre parcours et construit votre CV en temps réel, section par section."
      }
    }
  ]
}
```

---

## Checklist de validation

- [ ] `authenticv.vercel.app` redirige bien en 301 vers `authenticv.app`
- [ ] `curl -I https://authenticv.vercel.app` → HTTP 301 Location: https://authenticv.app
- [ ] `<link rel="canonical" href="https://authenticv.app/">` présent dans le `<head>`
- [ ] Sitemap soumis dans Search Console
- [ ] 0 URL en erreur de couverture dans Search Console
- [ ] Rich results test valide sur https://search.google.com/test/rich-results
