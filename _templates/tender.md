---
# Tender template – copy to _tenders/<slug>.md (e.g. _tenders/my-org-2026-0003.md)
# Slug = filename without .md → URL /tenders/<slug>/
# Remove any section you don't need. Add _km / en+km for bilingual content.

layout: tender
title: "Tender title in English"
# title_km: "ការចំណងជើងជាភាសាខ្មែរ"   # optional
tender_id: "ORG-2026-0001"
published: false
date_posted: 2026-01-01
tender_ref: "RFP/ITB/CFA number"
issue_date: 2026-01-01

buyer:
  name: "Full organization name"
  # name_km: "..."  # optional; or use buyer_km.name below
  address: "Street, City, Country"
  phone: []
  email: ["procurement@example.org"]
  website: "https://example.org"

# buyer_km:           # optional Khmer
#   name: "..."

location:
  province: "Phnom Penh"
  district: ""
  commune: ""
  village: ""
  address_text: ""

deadline:
  datetime: "2026-02-01T17:00:00+07:00"
  timezone_label: "Phnom Penh (UTC+7)"
  note: "e.g. Late submissions not accepted."

# deadline_km:
#   note: "..."

# key_dates:          # optional
#   - label: "Clarification deadline"
#     datetime: "2026-01-15"
#     timezone_label: "Phnom Penh (UTC+7)"
#   - label: "Bid opening"
#     datetime: "2026-02-02"

vendor_form:
  base_url: "https://forms.gle/XXXX"

submission:
  methods: ["email"]
  rules:
    - "Rule 1."
    - "Rule 2."
  # For bilingual, use:  - en: "..." / km: "..."
  email: "procurement@example.org"
  physical_address: ""
  subject_line_format: "Tender title – Ref number"
  instructions: "Submit by [time], [date]. Email subject: [subject]. Enquiries: [subject] - Enquiry."

# submission_km:      # optional
#   instructions: "..."
#   subject_line_format: "..."

contacts:
  - name: "Contact name"
    # name_km: "..."
    role: "Procurement"
    # role_km: "..."
    email: ["procurement@example.org"]
    location_label: "Program / Office"
    # location_label_km: "..."

summary: "One or two sentences describing the tender."
# summary_km: "..."

scope:
  - "Scope item 1."
  - "Scope item 2."
# Bilingual: use  - en: "..." / km: "..."  per item

eligibility_requirements:
  - "Eligibility 1."
  - "Eligibility 2."

required_documents:
  - "Document 1"
  - "Document 2"

# goods:              # optional – table of items
#   - description: "Item name"
#     description_km: ""
#     specification: "Spec text"
#     unit: "unit"
#     qty: 1

commercial_terms:
  bid_validity_days: 90
  warranty: ""
  payment_terms: "As per contract."
  currency: "USD"

# commercial_terms_km:
#   payment_terms: "..."

evaluation:
  criteria:
    - "Criterion 1"
    - "Criterion 2"
  # scoring:          # optional
  #   - label: "Technical"
  #     weight: "70%"
  #   - label: "Financial"
  #     weight: "30%"

required_submissions:
  - label: "Technical Response Form"
    # label_km: "..."
    type: "form"
    url: "/assets/tenders/<slug>/form.docx"
    required: true
    note: "Complete and submit with proposal."
    # note_km: "..."

# resources:          # optional links
#   - label: "Guideline"
#     url: "https://..."
#     note: ""

attachments:
  - label: "Tender document (PDF)"
    # label_km: "..."
    url: "/assets/tenders/<slug>/tender.pdf"

# body_km: |          # optional Khmer body (markdown)
#   អត្ថបទខ្មែរ...
---

Optional body text in English (Markdown). Shown below all sections. Add any additional terms, notes, or instructions here.
