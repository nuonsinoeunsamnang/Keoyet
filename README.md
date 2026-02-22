# Keoyet Phase-0: Digital Tender Pages

Static tender pages built with Jekyll, deployable to GitHub Pages. Procurement sends tender documents; you add one Markdown file per tender; the site lists them and each tender page has a "Submit Interest / Ask a Question" button linking to an external form (Google Form or Tally) with the tender id prefilled.

## Local development

1. **Ruby**  
   Ensure Ruby 3.x is installed (e.g. `ruby -v`).

2. **Install dependencies**
   ```bash
   bundle install
   ```

3. **Serve locally**
   ```bash
   bundle exec jekyll serve
   ```
   Open [http://localhost:4000](http://localhost:4000). Changes to content and most config/layouts will hot-reload.

## Adding a new tender

1. Copy the template and create a new tender file:
   ```bash
   cp _templates/tender.md _tenders/<slug>.md
   ```
   Use a `slug` for the URL (e.g. `my-org-2026-0003` → `/tenders/my-org-2026-0003/`). See `_templates/README.md` for details.

2. Edit `_tenders/<slug>.md`: fill in the placeholders and remove any sections you don't need. Use the [Data Model](#data-model) below for field descriptions.

3. Set `published: true` when the tender is ready to appear on the homepage. Set `published: false` to hide it (the detail page remains buildable if someone has the URL).

4. Set `vendor_form.base_url` to your Google Form or Tally form URL. The site will append `?tender_id=<tender_id>` (or `&tender_id=...` if the URL already has a query string).

5. Commit and push. The GitHub Action will build and deploy to GitHub Pages.

## Publish / unpublish

- **Publish:** Set `published: true` in the tender’s front matter. It will show on the homepage and in search.
- **Unpublish:** Set `published: false`. It will not appear on the homepage or in search. The tender detail page still exists at `/tenders/<slug>/` if the file remains in `_tenders/`. To remove it entirely, delete the file or move it out of `_tenders/`.

## Language switcher (English / Khmer)

Use **one tender file per tender**. The tender layout is bilingual: each detail page shows an **English | ភាសាខ្មែរ** switcher at the top. Section labels (Deadline, Summary, Scope of Work, etc.) and all content can toggle between English and Khmer. The chosen language is stored in `localStorage` so it persists across visits. The list page shows each tender once; users open the tender and switch language on the detail page if needed.

### Bilingual content (optional Khmer)

To show **translated content** when the user selects Khmer (not just translated labels), add optional Khmer fields in the same tender file. If a Khmer value is missing, the English value is shown as fallback.

| English field | Khmer option | Notes |
|---------------|--------------|--------|
| `title` | `title_km` | |
| `summary` | `summary_km` | |
| `buyer.name` | `buyer_km.name` | |
| `deadline.note` | `deadline_km.note` | |
| `scope` | Each item: string or `{ en: "...", km: "..." }` | Same for `eligibility_requirements`, `required_documents` |
| `submission.rules` | Each item: string or `{ en: "...", km: "..." }` | |
| `submission.instructions` | `submission_km.instructions` | |
| `submission.subject_line_format` | `submission_km.subject_line_format` | |
| `submission.physical_address` | `submission_km.physical_address` | |
| `submission.addresses` | Each item: string or `{ en: "...", km: "..." }` | |
| `submission.clarification_deadline` | `submission_km.clarification_deadline` | |
| `commercial_terms.warranty` | `commercial_terms_km.warranty` | |
| `commercial_terms.payment_terms` | `commercial_terms_km.payment_terms` | |
| `evaluation.criteria` | Each item: string or `{ en: "...", km: "..." }` | |
| `evaluation.scoring[].label` | `label_km` on each scoring item | |
| `required_submissions[].label` | `label_km` on each item | Same for `note_km` |
| `resources[].label` | `label_km` on each item | Same for `note_km` |
| `attachments[].label` | `label_km` on each item | |
| `contacts[].name` | `name_km` on each contact | Same for `role_km`, `location_label_km` |
| `goods[].description` | `description_km` on each item | Same for `specification_km` |
| `key_dates[].label` | `label_km` on each item | Same for `note_km` |
| Body (main content) | `body_km` | Markdown string in front matter; rendered when Khmer is selected |

Example (scope with bilingual items):

```yaml
scope:
  - en: "Component A: Review CGCC's existing bond guarantee framework..."
    km: "ផ្នែក ក៖ ពិនិត្យរូបមន្តធានាមូលបត្រ..."
  - "Single string shows in both languages."
```

## Vendor form link

- In each tender’s front matter, set:
  ```yaml
  vendor_form:
    base_url: "https://forms.gle/XXXX"   # or your Tally link
  ```
- The site adds `?tender_id=<tender_id>` (or `&tender_id=...` if the base URL already contains `?`).
- If `vendor_form.base_url` is missing or empty, the CTA is hidden and a short note is shown: "Vendor response form not available."

## Deploy (GitHub Pages)

1. In the repo: **Settings → Pages**.
2. Under "Build and deployment", set **Source** to **GitHub Actions**.
3. Push to `main`. The workflow `.github/workflows/pages.yml` runs: it installs Ruby, runs `bundle exec jekyll build`, and deploys the `_site` artifact to GitHub Pages.

No need to choose "Jekyll" as a theme or use the legacy Pages build; this workflow builds the site in CI.

## Recommended Phase-0 process

1. Receive tender documents from procurement.
2. Manually extract key info (title, buyer, deadline, submission method, scope, eligibility, required docs, attachment links).
3. Create one file in `_tenders/<slug>.md` with the YAML front matter and optional body.
4. Set `vendor_form.base_url` to your interest/questions form and ensure the form uses the `tender_id` query param if needed.
5. Set `published: true` and push to `main` so the site updates.
6. Share the tender page URL with vendors; they use the CTA to open the form with the tender id prefilled.

## Data model (front matter)

Each tender is a Markdown file in `_tenders/` with at least:

| Field | Required | Description |
|-------|----------|-------------|
| `layout` | Yes | Set to `tender`. The page includes an EN/Khmer language switcher. |
| `title` | Yes | Tender title. |
| `tender_id` | Yes | Unique id (e.g. `FH-2026-0001`). Used for the vendor form query param. |
| `published` | Yes | `true` to show on homepage, `false` to hide. |
| `date_posted` | Yes | `YYYY-MM-DD` for sorting (newest first). |
| `buyer.name` | Yes | Buyer/organization name. |
| `tender_ref` | Optional | Official reference (ITB/RFP/CFA number). Shown under title. |
| `issue_date` | Optional | `YYYY-MM-DD` issue date. Shown under title. |
| `deadline.datetime` | Recommended | ISO 8601 datetime for deadline. |
| `deadline.timezone_label` | Optional | e.g. `ICT (UTC+7)`. |
| `deadline.note` | Optional | Short note (e.g. "Late submissions not accepted"). |
| `key_dates` | Optional | List of `{ label, datetime, timezone_label, note }` for clarification cutoff, bid opening, Q&A, award notice, etc. |
| `contacts` | Optional | List of `{ name, role, phone[], email[], location_label, address }` (procurement, technical, local office). |
| `submission` | Recommended | See submission block below. |
| `summary` | Recommended | Short summary for cards. |
| `scope` | Optional | List of scope items. |
| `eligibility_requirements` | Optional | List. |
| `required_documents` | Optional | List (plain text). |
| `required_submissions` | Optional | Checklist: list of `{ label, type, url, required, note }`. `type`: `form`, `policy_to_sign`, `template`, `certificate`, `proposal_doc`. |
| `commercial_terms` | Optional | `bid_validity_days`, `warranty`, `payment_terms`, `currency`. |
| `evaluation` | Optional | `criteria` (list of strings), `scoring` (list of `{ label, weight }`). |
| `resources` | Optional | List of `{ label, url, note }` (e.g. Drive links, external docs). |
| `attachments` | Optional | List of `label` and `url`. |
| `vendor_form.base_url` | Optional | External form URL; `tender_id` is appended. |
| `location` | Optional | `province`, `district`, `address_text`, etc. |
| `goods` | Optional | List of `{ description, specification, unit, qty }` for goods/items table. |

**Submission block** can include: `methods`, `instructions`, `email`, `physical_address`; and optionally `rules` (array of strings, e.g. "sealed envelope", "no email"), `subject_line_format`, `addresses` (array for multiple offices), `clarification_deadline`, `clarification_emails`.

The body of the file can contain extra Markdown (longer scope, notes, figures, etc.).

## URLs

- Homepage: `/`
- Tender detail: `/tenders/<slug>/` (slug = filename without `.md`)
- 404: `/404.html`

## Tech stack

- Jekyll 4.x (Ruby), minimal dependencies; safe for GitHub Pages.
- Custom CSS in `assets/css/main.css`; no heavy framework.
- Vanilla JS in `assets/js/search.js` for client-side search (no external libs).
- GitHub Actions: Ruby → `bundle install` → `jekyll build` → deploy to Pages.

## Files

- `_config.yml` – Jekyll config, `tenders` collection, permalinks.
- `Gemfile` – Jekyll and webrick.
- `index.html` – Homepage; lists published tenders, search box, embedded JSON for search.
- `_layouts/default.html`, `_layouts/tender.html` – Layouts.
- `_includes/head.html`, `header.html`, `footer.html` – Shared fragments.
- `_tenders/*.md` – One file per tender.
- `assets/css/main.css` – Styles.
- `assets/js/search.js` – Client-side filter.
- `.github/workflows/pages.yml` – Build and deploy to GitHub Pages.
