# Webhook Idempotency Implementation

This document explains the idempotency implementation for webhook processing to ensure that duplicate webhook events don't cause data inconsistencies or unwanted side effects.

## Problem Statement

Webhook providers (like Creem, Stripe) may send the same event multiple times due to:
- Network timeouts
- Server errors (5xx responses)
- Retry mechanisms
- Infrastructure issues

Without idempotency checks, duplicate events could cause:
- Duplicate database records
- Multiple email notifications
- Incorrect billing calculations
- Resource allocation errors

## Solution Overview

We implement idempotency using a dedicated `webhook_events` table that tracks processed events:

1. **Event ID Generation**: Create unique identifiers for each webhook event
2. **Pre-processing Check**: Verify if event was already processed
3. **Event Recording**: Store event details before processing
4. **Atomic Operations**: Use database transactions for consistency

## Implementation Details

### Database Schema

```sql
CREATE TABLE "webhook_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "eventId" text NOT NULL UNIQUE,
  "eventType" text NOT NULL,
  "provider" text NOT NULL DEFAULT 'creem',
  "processed" boolean NOT NULL DEFAULT true,
  "processedAt" timestamp NOT NULL DEFAULT now(),
  "payload" text,
  "createdAt" timestamp NOT NULL DEFAULT now()
);
```

### Event ID Strategy

For Creem webhooks, we generate event IDs using:
```typescript
const eventId = `${event.object.id}_${event.eventType}`;
```

This ensures uniqueness across:
- Different objects (checkout, payment, subscription)
- Different event types for the same object
- Multiple webhook deliveries of the same event

### Processing Flow

```typescript
// 1. Verify webhook signature
const isValid = verifyCreemSignature(payload, signature, secret);

// 2. Generate unique event ID
const eventId = `${event.object.id}_${event.eventType}`;

// 3. Check if already processed (within transaction)
const alreadyProcessed = await isWebhookEventProcessed(eventId, 'creem', tx);
if (alreadyProcessed) {
  console.log(`Event ${eventId} already processed, skipping.`);
  return;
}

// 4. Record event as being processed
await recordWebhookEvent(eventId, event.eventType, 'creem', payload, tx);

// 5. Process the actual webhook logic
switch (event.eventType) {
  case 'checkout.completed':
    await processCheckoutCompletedEvent(eventObject, tx);
    break;
  // ... other cases
}
```

## API Functions

### `isWebhookEventProcessed(eventId, provider?, tx?)`

Checks if a webhook event has already been processed.

**Parameters:**
- `eventId`: Unique identifier for the event
- `provider`: Webhook provider name (default: 'creem')
- `tx`: Optional database transaction

**Returns:** `Promise<boolean>`

### `recordWebhookEvent(eventId, eventType, provider?, payload?, tx?)`

Records a webhook event as processed.

**Parameters:**
- `eventId`: Unique identifier for the event
- `eventType`: Type of webhook event
- `provider`: Webhook provider name (default: 'creem')
- `payload`: Original webhook payload (optional, for debugging)
- `tx`: Optional database transaction

**Returns:** `Promise<void>`

## Benefits

1. **Data Consistency**: Prevents duplicate database operations
2. **User Experience**: Avoids duplicate notifications and charges
3. **System Reliability**: Handles network issues gracefully
4. **Debugging**: Stores original payloads for troubleshooting
5. **Audit Trail**: Maintains history of processed events

## Performance Considerations

- **Indexes**: Created on `eventId` and `provider` for fast lookups
- **Transaction Scope**: Idempotency checks happen within the same transaction as business logic
- **Cleanup**: Consider implementing cleanup for old webhook events (e.g., older than 30 days)

## Testing

The implementation includes comprehensive unit tests covering:
- First-time event processing
- Duplicate event detection
- Invalid signature handling
- Different event types
- Error scenarios

Run tests with:
```bash
pnpm test webhook.test.ts
```

## Migration

To add the webhook_events table to an existing database:

```bash
# Run the migration script
psql -d your_database -f database/migrations/001_add_webhook_events_table.sql
```

## Monitoring

Consider monitoring:
- Duplicate event frequency
- Processing time impact
- Table growth rate
- Failed webhook processing

## Future Enhancements

1. **Multi-provider Support**: Extend for Stripe, PayPal, etc.
2. **Event Replay**: Ability to reprocess events for debugging
3. **Cleanup Jobs**: Automated removal of old webhook events
4. **Metrics**: Dashboard for webhook processing statistics
5. **Alerting**: Notifications for unusual duplicate event patterns