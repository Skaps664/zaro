# Checkout Integration (Google Sheets)

Your checkout route posts orders to Google Sheets using either:

1. `GOOGLE_SHEET_WEBHOOK_URL` (recommended)
2. `GOOGLE_FORM_ACTION_URL` + `GOOGLE_FORM_ORDER_FIELD`

## Option A: Webhook URL (recommended)

Use a Google Apps Script web app that writes incoming JSON to a sheet.

Set in `.env`:

- `GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/.../exec`

The checkout API sends:

- `orderMessage` (formatted multiline string)
- `payload` (full structured order JSON)

## Option B: Google Form action endpoint

Set in `.env`:

- `GOOGLE_FORM_ACTION_URL=https://docs.google.com/forms/d/e/.../formResponse`
- `GOOGLE_FORM_ORDER_FIELD=entry.123456789`

The API submits `orderMessage` to that one field.

## Required checkout customer fields

- Full name
- Phone number
- City
- Address

## Manual payment flow shown to customer

- Customer places order from checkout page
- Customer manually transfers payment to provided account details
- Customer sends payment proof on WhatsApp
- Team manually confirms order after verification
