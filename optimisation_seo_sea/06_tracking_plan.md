# Plan de Tracking — AuthentiCV

*Objectif : mesurer l'intégralité du funnel de l'acquisition à la rétention*

---

## 1. Stack Analytique Recommandée

| Outil | Usage | Coût | Priorité |
|---|---|---|---|
| **GA4** | Analytics marketing + funnel acquisition | Gratuit | 🔴 Immédiat |
| **Google Search Console** | SEO, mots-clés, indexation | Gratuit | 🔴 Immédiat |
| **Google Tag Manager** | Conteneur de tags (GTM web) | Gratuit | 🔴 Immédiat |
| **PostHog** | Product analytics (in-app events) | Gratuit jusqu'à 1M events/mois | 🟠 Semaine 2 |
| **Microsoft Clarity** | Heatmaps + session replay | Gratuit illimité | 🟡 Mois 2 |
| **Axeptio / Cookiebot** | Bannière de consentement RGPD | ~10-30 €/mois | 🔴 Avant tout tracking |

---

## 2. Plan de Marquage — Événements à Implémenter

### 2.1 Funnel Acquisition (GA4 + Google Ads)

| Événement | Déclencheur | Propriétés | Priorité |
|---|---|---|---|
| `page_view` | Chaque chargement de page | `page_path`, `page_title` | Auto GA4 |
| `signup_started` | Clic sur "S'inscrire" / "Commencer" | `source`, `medium`, `campaign` | 🔴 |
| `signup_completed` | Création compte réussie | `user_id`, `plan`, `source` | 🔴 |
| `login` | Connexion réussie | `user_id` | 🟠 |

### 2.2 Funnel Activation (PostHog + GA4)

| Événement | Déclencheur | Propriétés | Priorité |
|---|---|---|---|
| `first_message_sent` | Premier message envoyé à Alex | `user_id`, `message_count` | 🔴 |
| `cv_section_added` | Alex ajoute une section au CV | `user_id`, `section_type` | 🟠 |
| `cv_generated` | Premier CV complet généré | `user_id`, `sections_count` | 🔴 |
| `cv_preview_opened` | Onglet Aperçu cliqué | `user_id` | 🟡 |
| `cv_edited_manually` | Modification manuelle dans l'éditeur | `user_id`, `section` | 🟡 |

### 2.3 Funnel Revenue

| Événement | Déclencheur | Propriétés | Priorité |
|---|---|---|---|
| `upgrade_modal_opened` | Modal d'upgrade affichée | `user_id`, `reason` | 🔴 |
| `checkout_started` | Clic "Passer à Pro" | `user_id`, `plan_price` | 🔴 |
| `subscribed_pro` | Paiement Stripe réussi (webhook) | `user_id`, `revenue`, `plan` | 🔴 |
| `subscription_cancelled` | Résiliation | `user_id`, `reason` | 🟠 |

### 2.4 Funnel Engagement (rétention)

| Événement | Déclencheur | Propriétés | Priorité |
|---|---|---|---|
| `pdf_exported` | Téléchargement PDF réussi | `user_id`, `plan` | 🔴 |
| `letter_generated` | Lettre de motivation générée | `user_id` | 🟠 |
| `cv_switched` | Changement entre plusieurs CVs | `user_id`, `cv_count` | 🟡 |
| `upload_cv_completed` | Import PDF CV réussi | `user_id` | 🟠 |
| `job_match_used` | Job Match utilisé | `user_id` | 🟡 |
| `share_cv_clicked` | Lien de partage CV copié | `user_id` | 🟡 |
| `session_replay_week_1` | Réouverture J+7 | `user_id` | 🟡 |

---

## 3. Implémentation GTM

### 3.1 Configuration de base
1. Créer un compte GTM sur tagmanager.google.com
2. Installer le snippet GTM dans `src/app/layout.tsx` :

```typescript
// src/app/layout.tsx
// Dans le <head>
<Script
  id="gtm-script"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-XXXXXXX');`,
  }}
/>

// Dans le <body>
<noscript>
  <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX" height="0" width="0" style={{display:'none', visibility:'hidden'}} />
</noscript>
```

### 3.2 DataLayer — Events à pousser depuis le code

```typescript
// Utilitaire à créer : src/lib/analytics.ts
declare global {
  interface Window { dataLayer: Record<string, unknown>[]; }
}

export const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({ event: eventName, ...params });
  }
};

// Usage dans le code :
// import { trackEvent } from '@/lib/analytics';
// trackEvent('signup_completed', { user_id: user.id, plan: 'free' });
// trackEvent('cv_generated', { user_id: user.id });
// trackEvent('pdf_exported', { user_id: user.id, plan: 'pro' });
```

### 3.3 Tags GTM à créer

| Tag | Type | Déclencheur |
|---|---|---|
| GA4 Configuration | GA4 Config | All Pages |
| GA4 — signup_completed | GA4 Event | dataLayer event = signup_completed |
| GA4 — cv_generated | GA4 Event | dataLayer event = cv_generated |
| GA4 — subscribed_pro | GA4 Event | dataLayer event = subscribed_pro |
| GA4 — pdf_exported | GA4 Event | dataLayer event = pdf_exported |
| Google Ads — Conversion CV | GAds Conversion | dataLayer event = cv_generated |
| Google Ads — Conversion Pro | GAds Conversion | dataLayer event = subscribed_pro |

---

## 4. PostHog — Product Analytics

### 4.1 Installation Next.js

```bash
npm install posthog-js posthog-node
```

```typescript
// src/providers/PostHogProvider.tsx
'use client'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
      capture_pageview: true,
      capture_pageleave: true,
    })
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
```

### 4.2 Identification utilisateur (important pour les cohortes)

```typescript
// À appeler après le signup et le login
import posthog from 'posthog-js'

// Après signup/login :
posthog.identify(user.id, {
  email: user.email,
  plan: 'free', // ou 'pro'
  created_at: user.created_at,
})

// À la souscription Pro :
posthog.capture('subscribed_pro', { revenue: 9 })
posthog.setPersonProperties({ plan: 'pro' })
```

---

## 5. Tracking Stripe → GA4

Pour remonter les conversions payantes vers GA4 et Google Ads.

### Option A — Webhook Stripe (recommandée)
Dans `src/app/api/stripe/webhook/route.ts`, après la confirmation de paiement, envoyer un événement server-side à GA4 via Measurement Protocol :

```typescript
// À ajouter dans le webhook Stripe, après subscription créée
const measurementId = process.env.GA4_MEASUREMENT_ID;
const apiSecret = process.env.GA4_API_SECRET;

await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`, {
  method: 'POST',
  body: JSON.stringify({
    client_id: userId, // ou cookie GA4 _ga si disponible
    events: [{
      name: 'subscribed_pro',
      params: { currency: 'EUR', value: 9.0, user_id: userId },
    }],
  }),
});
```

### Option B — Stripe Checkout redirect
Après paiement réussi, le redirect vers `/builder?upgraded=true` peut déclencher un événement GA4 côté client (déjà partiellement implémenté avec `UpgradeToastDetector`).

---

## 6. Bannière de Consentement RGPD

**Obligatoire avant d'activer tout tracking.**

### Options recommandées
- **Axeptio** (français, simple) — ~12 €/mois
- **Cookiebot** — ~10 €/mois
- **Osano** — 0 € (open source limité)

### Configuration GTM avec consentement
Activer le mode Consentement Google dans GTM :
- `analytics_storage` → contrôle GA4
- `ad_storage` → contrôle Google Ads
- `ad_user_data` + `ad_personalization` → Enhanced Conversions

```javascript
// Dans GTM : Consent Initialization trigger
window.dataLayer = window.dataLayer || [];
window.dataLayer.push('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  wait_for_update: 500
});
```

---

## 7. Dashboard Looker Studio

Créer un dashboard unique consolidant toutes les sources :
- **Sources** : GA4 (connecteur natif), Google Ads (connecteur natif), Search Console (connecteur natif)
- **Pages du dashboard** :
  1. Vue d'ensemble acquisition (sessions, signups, coût, CAC par canal)
  2. Funnel (activation, rétention, conversion Free→Pro)
  3. SEO (positions, impressions, clics, pages performantes)
  4. SEA (campagnes, CPC, conversions, ROAS)
  5. Revenue (MRR, churn, LTV estimée)

---

## 8. Checklist Tracking

- [ ] Bannière de consentement RGPD déployée et fonctionnelle
- [ ] GTM installé et vérifié (mode Preview)
- [ ] GA4 configuré avec les 4 événements prioritaires
- [ ] Search Console vérifiée + sitemap soumis
- [ ] PostHog installé + identification utilisateur
- [ ] Événement `subscribed_pro` remonté depuis le webhook Stripe
- [ ] Conversions importées dans Google Ads
- [ ] Dashboard Looker Studio créé
- [ ] Test en mode debug GTM : Tag Assistant Chrome extension
