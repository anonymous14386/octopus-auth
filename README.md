# Octopus Auth - Centralized Authentication Service

Unified authentication service for all Octopus apps (Budget, Health, and future apps).

## Features

- Single sign-on for all Octopus services
- JWT-based authentication with 7-day token expiration
- User registration and login
- Token verification endpoint for other services
- Rate limiting and security headers

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |
| POST | `/api/auth/verify` | Verify a token (for other services) |
| POST | `/api/auth/refresh` | Refresh an existing token |
| GET | `/health` | Health check |

## Setup

### Using Docker Compose (Recommended)

```bash
# Create the shared network first (if not exists)
docker network create octopus-network

# Set your JWT secret
export JWT_SECRET="your-secure-secret-here"

# Start the service
docker-compose up -d
```

### Manual Setup

```bash
npm install
JWT_SECRET="your-secure-secret" node index.js
```

## Integration with Other Services

Other Octopus services should:

1. **Remove local auth routes** - Delete their own `/api/auth/login` and `/api/auth/register` endpoints
2. **Use shared JWT_SECRET** - Set the same `JWT_SECRET` environment variable
3. **Validate tokens** - Either verify locally with the shared secret, or call `/api/auth/verify`

### Example: Validating tokens in other services

```javascript
// In your service's auth middleware
const JWT_SECRET = process.env.JWT_SECRET || 'octopus-shared-secret-change-in-production';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const token = authHeader.substring(7);
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3002 | Server port |
| `JWT_SECRET` | (insecure default) | **MUST set in production** |
| `NODE_ENV` | development | Environment mode |

## Mobile App Integration

The mobile app should:
1. Login via `https://auth.octopustechnology.net/api/auth/login`
2. Use the returned token for all other services
3. Token works across Budget, Health, and all future Octopus apps
# octopus-auth
# octopus-auth
