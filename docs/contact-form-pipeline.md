# Contact Form & Email Delivery Pipeline (FormSubmit → Zoho Mail)

This document details the configuration and architecture of the contact and lead generation pipeline on [https://www.thesparkstudio.digital/](https://www.thesparkstudio.digital/).

---

## 1. Overview & Architecture

When a prospective client submits the inquiry form in `src/components/ContactSection.jsx`, it first passes a spam check (see section 3). Then the email relay and the database save run at the same time, and the analytics event fires once either succeeds:

1. **Email via FormSubmit**: Form data is posted to FormSubmit's AJAX endpoint. FormSubmit formats it and emails it to `hello@thesparkstudio.digital`, which is a Zoho Mail mailbox. The site does not connect to Zoho directly.
2. **Database Persistence**: Data is saved directly to the Supabase `inquiries` table via `saveInquiry` in `src/lib/supabase.js`.
3. **Analytics Tracking**: A GA4 `generate_lead` event is recorded with the lead's selected project type and timeline.

```
Client Form Submit
       │
       ├──► 0. Spam check (honeypot + 3s minimum) — bots get a fake "sent", nothing is delivered
       │
       ├──► 1. POST https://formsubmit.co/ajax/hello@thesparkstudio.digital
       │         └─► FormSubmit emails hello@thesparkstudio.digital (Zoho Mail inbox)
       │
       ├──► 2. saveInquiry(formData) (src/lib/supabase.js)
       │         └─► Supabase 'inquiries' table
       │
       └──► 3. trackEvent('generate_lead', { project_type, timeline })
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
| `projectType` | Service category (e.g. *Bespoke Website Build*) |
| `timeline` | When they want to start (e.g. *Within a month*). Stored in the dedicated Supabase `timeline` column. |
| `message` | Client's project description or message |
| `_subject` | `New Lead: ${formData.name} - ${formData.projectType}` |
| `_template` | `table` (formats fields into a clean HTML table) |
| `_captcha` | `false` (prevents CAPTCHA popups for seamless UX) |
| `_honey` | Honeypot. Empty for real people; FormSubmit drops the message if it's filled |

---

> **No prices in the form.** The form deliberately shows no costs or budget ranges: visitors who see
> price ranges often don't get in touch. Pricing is discussed after the first reply.

## 3. Spam Protection

Defined in `src/lib/formGuard.js` (tested by `scripts/test-forms.mjs`):

- **Honeypot**: a hidden `_honey` input, positioned off-screen and hidden from screen readers and keyboard focus. Bots that fill every field get caught.
- **Minimum fill time**: submissions within 3 seconds of the form appearing are treated as bots.
- A caught submission shows the normal "sent" message (so bots don't retry) but **nothing is emailed or saved**.

---

## 4. Alternative / Secondary Key (Web3Forms)

A secondary verified Access Key for Web3Forms is also registered to `hello@thesparkstudio.digital` if needed as an alternate provider:
- **Provider:** Web3Forms (`https://api.web3forms.com/submit`)
- **Access Key:** `e1a6ac64-66e3-45a0-826a-af78be10b778`
- **Target Email:** `hello@thesparkstudio.digital`

---

## 5. Troubleshooting & Testing

To test or verify the contact pipeline:
1. Submit an inquiry through the form on `https://www.thesparkstudio.digital/#contact`. Wait at least 3 seconds after the page loads, or it will be treated as spam.
2. Check `https://mail.zoho.in/zm/#mail/folder/inbox`.
3. The email will arrive with the subject format `New Lead: <Name> - <Project>` and sender `submissions@formsubmit.co`.
