# Database Connection Management

## Overview

This document outlines the database connection management strategy implemented in this SaaS starter to address scalability concerns in serverless environments like Vercel.

## Problem Statement

In serverless environments, each function instance can potentially create its own database connections. Without proper connection pool management, this can lead to:

- **Connection exhaustion**: Database servers have limited connection slots
- **Performance degradation**: Creating new connections is expensive (20-30ms handshake)
- **Service unavailability**: Too many connections can crash the database server
- **Resource waste**: Idle connections consume memory and resources

## Solution

### Connection Pool Configuration

#### Serverless Environment (Current Configuration)

We've configured the `postgres-js` client with serverless-optimized settings:

```typescript
const sql = postgres(databaseUrl, {
  // Maximum connections per instance (keep low for serverless)
  max: 1,
  
  // Close idle connections after 20 seconds
  idle_timeout: 20,
  
  // Maximum connection lifetime (30 minutes)
  max_lifetime: 60 * 30,
  
  // Connection timeout (30 seconds)
  connect_timeout: 30,
  
  // Enable prepared statements for performance
  prepare: true,
});
```

#### Traditional Server Environment

For traditional server deployments (Docker, VPS, dedicated servers), use these optimized settings:

```typescript
const sql = postgres(databaseUrl, {
  // Higher connection pool for traditional servers
  max: 20,
  
  // Longer idle timeout for persistent applications
  idle_timeout: 300, // 5 minutes
  
  // Longer connection lifetime
  max_lifetime: 60 * 60 * 4, // 4 hours
  
  // Connection timeout
  connect_timeout: 30,
  
  // Enable prepared statements
  prepare: true,
  
  // Transform settings
  transform: {
    column: postgres.toCamel,
    value: postgres.fromCamel,
  },
  
  // Debug mode for development
  debug: process.env.NODE_ENV === 'development',
});
```

### Key Configuration Parameters

#### Serverless Environment Parameters

##### `max: 1`
- **Purpose**: Limits each serverless function instance to a single database connection
- **Rationale**: Serverless functions typically handle one request at a time, so multiple connections per instance are unnecessary
- **Benefit**: Prevents connection pool exhaustion across multiple function instances

##### `idle_timeout: 20`
- **Purpose**: Automatically closes connections that have been idle for 20 seconds
- **Rationale**: Serverless functions are short-lived; long-lived connections are wasteful
- **Benefit**: Frees up database connection slots quickly

#### Traditional Server Environment Parameters

##### `max: 20`
- **Purpose**: Allows multiple concurrent connections for handling simultaneous requests
- **Rationale**: Traditional servers handle multiple concurrent requests and benefit from connection pooling
- **Benefit**: Better throughput and resource utilization for persistent applications

##### `idle_timeout: 300` (5 minutes)
- **Purpose**: Keeps connections alive longer for reuse
- **Rationale**: Traditional servers have longer-lived processes that can benefit from connection reuse
- **Benefit**: Reduces connection overhead for frequently accessed databases

##### `max_lifetime: 14400` (4 hours)
- **Purpose**: Longer connection lifetime for stable environments
- **Rationale**: Traditional servers have more predictable infrastructure
- **Benefit**: Reduces connection churn while still handling failovers

#### Common Parameters

##### `connect_timeout: 30`
- **Purpose**: Fails fast if database is unreachable
- **Rationale**: Better to fail quickly than hang indefinitely
- **Benefit**: Improves user experience and prevents resource waste

### Environment Detection and Dynamic Configuration

For applications that may run in both serverless and traditional environments, implement dynamic configuration:

```typescript
// database/config.ts
function getConnectionConfig() {
  const isServerless = 
    process.env.VERCEL || 
    process.env.AWS_LAMBDA_FUNCTION_NAME || 
    process.env.NETLIFY ||
    process.env.RAILWAY_ENVIRONMENT;

  if (isServerless) {
    return {
      max: 1,
      idle_timeout: 20,
      max_lifetime: 60 * 30,
      connect_timeout: 30,
      prepare: true,
    };
  }

  // Traditional server configuration
  return {
    max: parseInt(process.env.DB_POOL_SIZE || '20'),
    idle_timeout: parseInt(process.env.DB_IDLE_TIMEOUT || '300'),
    max_lifetime: parseInt(process.env.DB_MAX_LIFETIME || '14400'),
    connect_timeout: parseInt(process.env.DB_CONNECT_TIMEOUT || '30'),
    prepare: true,
    debug: process.env.NODE_ENV === 'development',
  };
}

// database/index.ts
const sql = postgres(databaseUrl, getConnectionConfig());
```

### Environment Variables for Traditional Servers

Add these environment variables for fine-tuning:

```bash
# .env for traditional server deployment
DB_POOL_SIZE=20
DB_IDLE_TIMEOUT=300
DB_MAX_LIFETIME=14400
DB_CONNECT_TIMEOUT=30
```

## Best Practices

### 1. Use Connection Pooling
- Always use a connection pool, even in serverless environments
- Configure pool size appropriately for your deployment model
- **Serverless**: Keep pool size minimal (1-2 connections)
- **Traditional**: Scale based on expected concurrent load

### 2. Monitor Connection Usage
- Track active connections in your database
- Set up alerts for high connection usage
- Monitor connection pool metrics
- **PostgreSQL**: Use `SELECT * FROM pg_stat_activity;` to monitor connections

### 3. Graceful Shutdown
- Always close connections when the application shuts down
- Use the provided `closeDatabase()` function for cleanup
- Implement proper signal handling for SIGTERM/SIGINT

### 4. Error Handling
- Implement proper error handling for connection failures
- Use retry logic with exponential backoff for transient errors
- Log connection errors for debugging
- Implement circuit breaker pattern for database failures

### 5. Environment-Specific Configuration
- Use different connection pool settings for different environments
- **Development**: Higher connection limits for debugging
- **Staging**: Production-like settings for testing
- **Production**: Conservative limits for stability

### 6. Load Testing and Optimization
- **Traditional Servers**: Test with expected concurrent load
- **Serverless**: Test cold start performance and connection reuse
- Monitor database CPU and memory usage under load
- Adjust pool sizes based on actual usage patterns

## Alternative Solutions

### Connection Pooling Services
For high-traffic applications, consider using external connection pooling services:

- **PgBouncer**: Popular PostgreSQL connection pooler
- **Supabase**: Managed PostgreSQL with built-in pooling
- **AWS RDS Proxy**: AWS-managed connection pooling
- **Google Cloud SQL Proxy**: Google Cloud connection pooling

### HTTP-based Database APIs
For ultimate scalability, consider HTTP-based database APIs:

- **Supabase REST API**: HTTP interface to PostgreSQL
- **Hasura**: GraphQL API over PostgreSQL
- **AWS Aurora Data API**: HTTP interface to Aurora

## Monitoring and Debugging

### Connection Metrics to Monitor
- Active connections count
- Connection pool utilization
- Connection creation rate
- Connection errors
- Query execution time

### Common Issues and Solutions

#### "Too many connections" Error
- **Cause**: Connection pool exhaustion
- **Solution**: Reduce `max` setting or implement connection retry logic

#### Slow Query Performance
- **Cause**: Connection overhead or network latency
- **Solution**: Enable prepared statements, optimize queries, consider caching

#### Connection Timeouts
- **Cause**: Database overload or network issues
- **Solution**: Increase `connect_timeout`, implement retry logic

## Testing

The database configuration includes comprehensive tests to verify:
- Connection pool functionality
- Error handling
- Graceful shutdown
- Basic query execution

Run tests with:
```bash
pnpm test database/index.test.ts
```

## References

- [Vercel Connection Pooling Guide](https://vercel.com/guides/connection-pooling-with-serverless-functions)
- [postgres-js Documentation](https://github.com/porsager/postgres)
- [PostgreSQL Connection Management](https://www.postgresql.org/docs/current/runtime-config-connection.html)
- [Serverless Database Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/configuration-database.html)