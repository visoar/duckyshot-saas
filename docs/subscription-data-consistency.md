# Subscription Data Consistency Guide

## Problem Description

The `getUserSubscription` function previously had a potential race condition issue where multiple active subscriptions for the same user could lead to unpredictable behavior. This could occur due to:

- Webhook delivery delays
- Race conditions during subscription updates
- Manual data manipulation
- Payment provider synchronization issues

## Solution Implemented

### 1. Enhanced getUserSubscription Function

The function now:
- Orders subscriptions by creation date (descending) for deterministic behavior
- Logs warnings when multiple active/trialing subscriptions are detected
- Always returns the most recent active/trialing subscription
- Falls back to the most recent subscription if no active ones exist

### 2. Monitoring and Alerting

The function logs detailed warnings when data inconsistencies are detected:

```typescript
console.warn(
  `User ${userId} has ${activeSubscriptions.length} active/trialing subscriptions. ` +
  `This may indicate a data consistency issue. Returning the most recent one.`,
  { 
    userId, 
    subscriptionIds: activeSubscriptions.map(s => s.subscriptionId),
    statuses: activeSubscriptions.map(s => s.status)
  }
);
```

## Recommended Database Constraints

To prevent multiple active subscriptions at the database level, consider adding a partial unique constraint:

```sql
-- PostgreSQL example: Only one active/trialing subscription per user
CREATE UNIQUE INDEX CONCURRENTLY idx_user_active_subscription 
ON subscriptions (user_id) 
WHERE status IN ('active', 'trialing');
```

## Webhook Idempotency

Ensure webhook handlers are idempotent to prevent duplicate subscription records:

1. Use webhook event IDs for deduplication
2. Implement proper transaction handling
3. Add unique constraints on external subscription IDs

## Monitoring Recommendations

### 1. Database Queries for Detection

```sql
-- Find users with multiple active subscriptions
SELECT 
  user_id,
  COUNT(*) as active_count,
  ARRAY_AGG(subscription_id) as subscription_ids
FROM subscriptions 
WHERE status IN ('active', 'trialing')
GROUP BY user_id 
HAVING COUNT(*) > 1;
```

### 2. Application Metrics

- Track the frequency of multiple active subscription warnings
- Monitor subscription creation/update patterns
- Set up alerts for unusual subscription state changes

### 3. Regular Data Audits

Run periodic checks to identify and resolve data inconsistencies:

```sql
-- Weekly audit query
SELECT 
  DATE_TRUNC('week', created_at) as week,
  COUNT(DISTINCT user_id) as users_with_multiple_active
FROM (
  SELECT user_id, created_at
  FROM subscriptions 
  WHERE status IN ('active', 'trialing')
  GROUP BY user_id, created_at
  HAVING COUNT(*) > 1
) subquery
GROUP BY week
ORDER BY week DESC;
```

## Prevention Strategies

### 1. Webhook Processing

- Implement proper locking mechanisms
- Use database transactions for subscription updates
- Handle webhook retries gracefully

### 2. Application Logic

- Always check for existing active subscriptions before creating new ones
- Implement proper state transitions
- Use optimistic locking for concurrent updates

### 3. Testing

- Test race condition scenarios
- Verify webhook idempotency
- Test subscription state transitions

## Recovery Procedures

If multiple active subscriptions are detected:

1. **Immediate Action**: The system will automatically use the most recent subscription
2. **Investigation**: Check webhook logs and payment provider records
3. **Resolution**: Manually update subscription statuses to resolve conflicts
4. **Prevention**: Implement additional constraints if patterns are identified

## Code Changes Summary

- Modified `getUserSubscription` in `/lib/database/subscription.ts`
- Added comprehensive unit tests in `/lib/database/subscription.test.ts`
- Improved error logging and monitoring
- Enhanced deterministic behavior for subscription selection

This solution maintains backward compatibility while providing better reliability and observability for subscription management.