# Reward Fulfillment

The app now separates reward eligibility from gift-card fulfillment.

Students can unlock and request rewards through mastery, tutor reflection, projects, experiments, and delayed recall. Parents approve or reject those requests. Gift-card style rewards require a separate parent/admin fulfillment action before the reward is recorded as redeemed.

## Flow

```txt
student earns level -> student requests reward -> parent approves -> parent fulfills gift card -> app logs mastery benefit
```

Gift cards are never fulfilled directly by a student session.

## Server Configuration

Gift-card fulfillment is disabled by default because provider calls can move real money.

```powershell
$env:GIFT_CARD_FULFILLMENT_ENABLED="true"
$env:GIFT_CARD_PROVIDER="manual"
$env:GIFT_CARD_DEFAULT_CENTS="1000"
$env:GIFT_CARD_MAX_CENTS="1000"
$env:GIFT_CARD_DAILY_LIMIT="5"
$env:GIFT_CARD_CURRENCY="USD"
```

Manual mode does not call an external provider. It creates a provider-style fulfillment record so the parent can deliver the benefit outside the app.

For Tremendous-compatible provider mode:

```powershell
$env:GIFT_CARD_FULFILLMENT_ENABLED="true"
$env:GIFT_CARD_PROVIDER="tremendous"
$env:TREMENDOUS_BASE_URL="https://testflight.tremendous.com/api/v2"
$env:TREMENDOUS_API_KEY="replace-with-provider-api-key"
$env:TREMENDOUS_FUNDING_SOURCE_ID="replace-with-funding-source-id"
$env:TREMENDOUS_PRODUCT_ID="replace-with-product-id"
$env:GIFT_CARD_ALLOW_LIVE_PROVIDER="false"
```

Use the provider sandbox first. The live API host is blocked unless `GIFT_CARD_ALLOW_LIVE_PROVIDER=true`.

## API

```txt
POST /api/rewards/request
POST /api/rewards/decision
POST /api/rewards/fulfill
```

`POST /api/rewards/fulfill` requires a parent, school-admin, or platform-admin session. The request body:

```json
{
  "requestId": "reward-avery-5-...",
  "recipientEmail": "parent@example.com",
  "recipientName": "Parent Name"
}
```

The server stores fulfillment status, provider name, provider reference, recipient email, amount, currency, timestamps, and errors on the reward request. It does not store gift-card redemption codes.

## Database Projection

`reward_approvals` now includes:

- `fulfillment_provider`
- `fulfillment_status`
- `fulfillment_reference`
- `fulfillment_requested_at`
- `fulfillment_completed_at`

Successful fulfillment changes the reward request to `redeemed`, adds a `gift_card_reward` mastery benefit, and logs a `gift_card_fulfilled` learning event.

## Safety Rules

- Students cannot fulfill gift cards.
- Fulfillment is parent/admin only.
- Gift-card amounts are capped by `GIFT_CARD_MAX_CENTS`.
- Daily sends are capped by `GIFT_CARD_DAILY_LIMIT`.
- Live provider mode requires an explicit `GIFT_CARD_ALLOW_LIVE_PROVIDER=true`.
- Provider API keys, funding source ids, and product ids stay server-only.
