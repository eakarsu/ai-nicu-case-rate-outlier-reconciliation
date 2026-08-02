# NICU Case-Rate & Outlier Reconciliation

Reconstruct high-cost neonatal reimbursement and recover omitted acuity, carve-out, stop-loss, and outlier revenue.

**Primary buyer:** Children’s hospitals and neonatal programs. **Evidence:** neonatal contracts, admissions, acuity levels, daily census, procedures, implants, pharmacy, case rates, carve-outs, outliers, claims, and remittances.

Full local application built with React, Vite, Express, PostgreSQL, and OpenRouter. Includes 15 domain-specific capabilities, 105 custom AI workbench fields, three scenario-fill controls per feature, operational registers, workflow transitions, analytics, professional AI decision briefs, audit history, and at least 15 PostgreSQL records per capability.

## Domain capabilities

- Payer contract library
- Neonatal case registry
- Acuity level timeline
- Daily census reconciliation
- Case-rate episode logic
- Included service validation
- Implant carve-out calculation
- Drug carve-out calculation
- Transport carve-out review
- Outlier threshold calculation
- Stop-loss calculation
- Claim remittance matching
- Underpayment detection
- Payer appeal workflow
- Program payer analytics

Run `./start.sh`, then open <http://127.0.0.1:4649>. API: `5649`.

Administrator: `runtime-admin@example.com` / `LocalDemo!2026`. Operator and reviewer credential buttons are available on the login page.
