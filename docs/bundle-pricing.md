# Spark Studio — Bundle Pricing & Discount Architecture

> **Last Updated:** November 2026  
> **Status:** Active Production  
> **Maximum Discount Cap:** 48% (Capped across all bundles, previously 68%)

---

## 1. Executive Summary

All template bundles and studio vaults in Spark Studio are strictly capped at a **maximum discount of 48%** relative to individual catalog prices. The previous legacy cap of 68% has been revised down to 48% across all code, internationalization locales (EN, DE, ES, FR), documentation, and active Lemon Squeezy payment checkouts.

Additionally, **Vellum Edition** (`vellum-edition`) individual price has been updated from **$29** to **$39** (39 €), and all bundle combinations incorporating Vellum Edition have been mathematically recalculated.

---

## 2. Individual Template Catalog Pricing

| # | Template Slug | Template Name | Category | Retail Price (USD) | Retail Price (EUR) | Status |
|---|---|---|---|---|---|---|
| 1 | `aurelle-estates` | Aurelle Estates | Editorial luxury real estate | **$99** | 99 € | Active Paid |
| 2 | `onyx-atelier` | Onyx Atelier | Monolithic architecture & interior | **$79** | 79 € | Active Paid |
| 3 | `mavric-estate` | Mavric Estate | Modern real estate CMS & realtor | **$69** | 69 € | Active Paid |
| 4 | `terra` | TERRA | Editorial store for furniture & design | **$69** | 69 € | Active Paid |
| 5 | `sasso-architect` | SASSO Architect | Architecture & interior studio monograph | **$69** | 69 € | Active Paid |
| 6 | `tessovra` | TESSOVRA | Tile & surface ecommerce showroom | **$69** | 69 € | Active Paid |
| 7 | `halden-edition` | Halden Edition | Custom furniture & object studio | **$59** | 59 € | Active Paid |
| 8 | `grain-form` | Grain & Form | Artisan homeware & tactile commerce | **$58** | 58 € | Active Paid |
| 9 | `vellum-edition` | **Vellum Edition** | Editorial architecture monograph | **$39** *(was $29)* | 39 € *(was 29 €)* | **Updated Price** |
| 10| `slowgrain` | SLOWGRAIN | Solid timber & heirloom furniture | **Free** ($0) | 0 € | Free Gift |

**Total Catalog Valuation (All 9 Paid Templates):**  
$99 + $79 + $69 + $69 + $69 + $69 + $59 + $58 + $39 = **$602** (Nominal anchor: **$600 retail value**).

---

## 3. Vault & Pack Pricing Architecture (Max 48% Discount)

### A. Main Studio Vaults

| Bundle ID | Bundle Name | Retail Anchor Value | Sale Price | Absolute Savings | Effective Discount | Lemon Squeezy UUID |
|---|---|---|---|---|---|---|
| `pick-any-3` | **Pick Any 3 Starter Pack** | $190 | **$99** (99 €) | $91 (91 €) | **47.89% (~48% OFF)** | `964d9218-93b1-4110-a9cf-c2a897adc31b` |
| `solo-vault` | **Complete Studio Vault (Solo)** | $600 | **$312** (312 €) | $288 (288 €) | **48.00% (48% OFF)** | `b482e2fd-0fa0-4433-9fc8-f91db20b9cf1` |
| `agency-vault` | **Complete Studio Vault (Agency)** | $960 | **$500** (500 €) | $460 (460 €) | **47.92% (~48% OFF)** | `e4d03d2d-2408-4a55-92e4-84c50735f47d` |

#### Mathematical Proofs
- **Pick Any 3 ($99):**  
  Anchor value: $190 (average 3 mid-tier production templates).  
  Discount: `(190 - 99) / 190 = 91 / 190 = 47.89%` ≤ 48%.
- **Complete Studio Vault Solo ($312):**  
  Anchor value: $600 retail value (9 paid templates sum $602).  
  Discount: `(600 - 312) / 600 = 288 / 600 = 48.00%` = Exactly 48%.  
  Includes all 9 paid templates + SLOWGRAIN (10 total templates) with single commercial license.
- **Complete Studio Vault Agency ($500):**  
  Commercial valuation: $960+ commercial value.  
  Discount: `(960 - 500) / 960 = 460 / 960 = 47.92%` ≤ 48%.  
  Includes all 10 templates with unlimited commercial client deployments.

---

### B. Category-Wise Niche Packs

| Pack ID | Pack Name | Included Templates | Combined Retail | Sale Price | Absolute Savings | Effective Discount | Lemon Squeezy UUID |
|---|---|---|---|---|---|---|---|
| `real-estate-duo` | **Luxury Real Estate Flagship Duo** | Aurelle Estates ($99) + Mavric Estate ($69) | **$168** | **$99** (99 €) | $69 (69 €) | **41.07% (~41% OFF)** | `e3f375d8-3a4c-4d46-9b37-f5c27bfd6f98` |
| `architecture-duo` | **Monograph Architecture Duo** | Onyx Atelier ($79) + Vellum Edition ($39) | **$118** *(was $108)* | **$69** (69 €) | **$49** *(was $39)* | **41.53% (~42% OFF)** | `2daaa04b-a936-499a-abec-1d66c1c4f859` |
| `artisan-suite` | **Artisan Living & E-Commerce Suite** | TESSOVRA ($69) + Halden ($59) + Grain & Form ($58) + Slowgrain ($0) | **$186** | **$119** (119 €) | $67 (67 €) | **36.02% (~36% OFF)** | `bc9f4aac-c012-4609-8b58-2781198aba64` |

#### Monograph Architecture Duo Recalculation Detail
- **Previous Calculation:** Onyx Atelier ($79) + Vellum Edition ($29) = $108 retail value. At $69 price: Savings = $39 (36.11% OFF).
- **Updated Calculation:** Onyx Atelier ($79) + Vellum Edition ($39) = **$118** retail value. At $69 price: Savings = **$49** (**41.53% ~ 42% OFF**).
- **Compliance:** 41.53% < 48% maximum discount cap.

---

## 4. Multi-Language i18n Synchronization

All localized strings across English, German, Spanish, and French reflect the synchronized pricing and 48% discount cap:

- **Section Eyebrow:** `EXCLUSIVE BUNDLES & VAULT ACCESS`
- **Section Heading:** `Save up to 48% with curated template bundles.`
  - DE: `Bis zu 48 % sparen mit kuratierten Vorlagen-Paketen.`
  - ES: `Ahorre hasta un 48% con packs exclusivos de plantillas.`
  - FR: `Économisez jusqu’à 48 % avec nos packs de templates sélectionnés.`
- **Solo Vault:** $312 / 312 € (Save $288 / 288 € · 48% OFF)
- **Agency Vault:** $500 / 500 € (Save $460 / 460 € · 48% OFF)
- **Pick Any 3:** $99 / 99 € (Save $91 / 91 € · 48% OFF)
- **Architecture Duo:** $69 / 69 € ($118 regular value · Save $49 / 49 € · 42% OFF)
- **Real Estate Duo:** $99 / 99 € ($168 regular value · Save $69 / 69 € · 41% OFF)
- **Artisan Suite:** $119 / 119 € ($186 regular value · Save $67 / 67 € · 36% OFF)

---

## 5. Lemon Squeezy Store Product Records

The live Lemon Squeezy store (`yashparmar.lemonsqueezy.com`) has been updated to match these values:
- `1474868`: **VELLUM — Architecture & Editorial Framer Template** → **$39.00**
- `1507410`: **Complete Studio Vault (Solo Commercial License)** → **$312.00**
- `1507420`: **Complete Studio Vault (Agency Commercial License)** → **$500.00**
