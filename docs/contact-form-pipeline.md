# Contact Form & Zoho Mail Delivery Pipeline

This document details the configuration and architecture of the contact and lead generation pipeline on [https://www.thesparkstudio.digital/](https://www.thesparkstudio.digital/).

---

## 1. Overview & Architecture

When a prospective client submits the inquiry form in `src/components/ContactSection.jsx`, the following three actions execute concurrently:

1. **Email Relay to Zoho Mail**: Form data is posted to FormSubmit's AJAX endpoint, which formats and delivers an email notification directly to `hello@thesparkstudio.digital`.
2. **Database & Local Storage Backup**: Data is saved to the Supabase `inquiries` table (or cached in browser `localStorage` under `spark_inquiries` if offline or unconfigured).
3. **Analytics Tracking**: A GA4 `generate_lead` event is recorded with the lead's selected project type and budget.

```
Client Form Submit
       │
       ├──► 1. POST https://formsubmit.co/ajax/hello@thesparkstudio.digital
       │         └─► Delivered to Zoho Mail (hello@thesparkstudio.digital)
       │
       ├──► 2. saveInquiry(formData) (src/lib/supabase.js)
       │         └─► Supabase 'inquiries' table (with localStorage fallback)
       │
       └──► 3. trackEvent('generate_lead', { project_type, budget })
                 └─► Google Analytics 4
```

---

## 2. Configuration Details

- **Receiver Email:** `hello@thesparkstudio.digital` (routed to `yashparmar@thesparkstudio.digital` in Zoho Mail)
- **Webmaster Endpoint:** `https://formsubmit.co/ajax/hello@thesparkstudio.digital`
- **Domain Verification:** Activated on `https://www.thesparkstudio.digital/`
- **Activation Token:** `2d6f508ef2845b9fc01eef8596816b63`

### Payload Parameters
| Field | Purpose |
|---|---|
| `name` | Client's full name |
| `email` | Client's contact email |
| `projectType` | Service category (e.g. *Bespoke Website Build ($2,500+)*) |
| `budget` | Selected budget range (e.g. *$3,000 – $6,000*) |
| `message` | Client's project description or message |
| `_subject` | `New Lead: ${formData.name} - ${formData.projectType}` |
| `_template` | `table` (formats fields into a clean HTML table) |
| `_captcha` | `false` (prevents CAPTCHA popups for seamless UX) |

---

## 3. Alternative / Secondary Key (Web3Forms)

A secondary verified Access Key for Web3Forms is also registered to `hello@thesparkstudio.digital` if needed as an alternate provider:
- **Provider:** Web3Forms (`https://api.web3forms.com/submit`)
- **Access Key:** `e1a6ac64-66e3-45a0-826a-af78be10b778`
- **Target Email:** `hello@thesparkstudio.digital`

---

## 4. Troubleshooting & Testing

To test or verify the contact pipeline:
1. Submit an inquiry through the form on `https://www.thesparkstudio.digital/#contact`.
2. Check `https://mail.zoho.in/zm/#mail/folder/inbox`.
3. The email will arrive with the subject format `New Lead: <Name> - <Project>` and sender `submissions@formsubmit.co`.
