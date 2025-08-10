# API Documentation

API endpoints and integration guides for MTK Care Help.

## Contents

- [Reference](./reference.md) - Complete API reference
- [Help API](./help-api.md) - Help system API endpoints
- [Authentication](./authentication.md) - API authentication methods
- [Examples](./examples.md) - Usage examples and code samples

## API Structure

The MTK Care Help platform provides RESTful APIs for various functionalities:

### Base URL
- **Development**: `http://localhost:3001/api`
- **Production**: `https://your-domain.com/api`

### Available Endpoints

#### Help System APIs
- `GET /api/help/content` - Retrieve help content
- `GET /api/help/content/[id]` - Get specific help topic
- `GET /api/help/popular` - Get popular help topics
- `POST /api/help/analytics` - Track help usage analytics

## Response Format

All API responses follow a consistent format:

```json
{
  "data": "...",
  "error": null,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Error Handling

Standard HTTP status codes are used:
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error