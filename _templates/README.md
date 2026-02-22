# Tender template

Use this to create a new tender page.

## Steps

1. **Copy the template**
   ```bash
   cp _templates/tender.md _tenders/<slug>.md
   ```
   Choose a `slug` that will become the URL: `/tenders/<slug>/`.  
   Example: `cp _templates/tender.md _tenders/wfp-2026-0003.md` → URL `/tenders/wfp-2026-0003/`.

2. **Fill in the placeholders** in `_tenders/<slug>.md`:
   - `title`, `tender_id`, `tender_ref`, `date_posted`, `issue_date`
   - `buyer.name`, `buyer.address`, `buyer.email`
   - `deadline.datetime`, `deadline.note`
   - `submission` (methods, rules, email, instructions, subject_line_format)
   - `summary`, `scope`, `eligibility_requirements`, `required_documents`
   - `vendor_form.base_url` (Google Form or Tally link)
   - `contacts`, `attachments`, `required_submissions` as needed

3. **Optional: bilingual (Khmer)**  
   Add `_km` fields or `en`/`km` objects so the language switcher shows Khmer content. See README “Bilingual content (optional Khmer)” for the full list.

4. **Assets**  
   Put PDFs, forms, etc. under `assets/tenders/<slug>/` and point `url` in attachments/required_submissions to those paths.

5. **Publish**  
   Set `published: true` when the tender should appear on the homepage. Use `published: false` to hide it while drafting.

## Data model

See the main [README Data model](../README.md#data-model-front-matter) for required vs optional fields and descriptions.
