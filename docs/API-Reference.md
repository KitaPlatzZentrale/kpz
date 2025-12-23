# API Reference

Complete API documentation for Kitaplatz-Zentrale backend.

## Base URL

- **Production**: `https://api.kitaplatz-zentrale.de` (verify actual URL)
- **Development**: `http://localhost:3000`

## External Documentation

Complete interactive API documentation is available at:
**[SwaggerHub API Documentation](https://app.swaggerhub.com/apis/Darjusch/KPZ_API_DOC/1.0.0)**

## Authentication

Currently, the API does not require authentication for public endpoints.

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP address
- **Headers**:
  - `Rate-Limit-Limit` - Total requests allowed in window
  - `Rate-Limit-Remaining` - Requests remaining in current window
  - `Rate-Limit-Reset` - Time when limit resets

**Example Response (429 Too Many Requests)**:
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

## Endpoints

### Signup Endpoints

#### POST `/signup/kita-finder`

Subscribe to the Kita finder service to receive notifications about Kitas matching user preferences.

**Request Body**:
```json
{
  "email": "parent@example.com",
  "preferences": {
    "location": {
      "lat": 52.5200,
      "lng": 13.4050
    },
    "radius": 2500,
    "minAge": 0,
    "maxAge": 6,
    "languages": ["German", "English"],
    "pedagogicalConcepts": ["Montessori"]
  }
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Signup successful. Please check your email to confirm.",
  "signupId": "uuid-here"
}
```

**Validation Rules**:
- `email` - Required, valid email format
- `preferences.location.lat` - Required, valid latitude (-90 to 90)
- `preferences.location.lng` - Required, valid longitude (-180 to 180)
- `preferences.radius` - Optional, default 2500 meters

---

#### POST `/signup/single`

Subscribe to notifications for a specific Kita's availability.

**Request Body**:
```json
{
  "email": "parent@example.com",
  "kitaId": "kita-uuid-here"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Subscribed to notifications for this Kita.",
  "subscriptionId": "uuid-here"
}
```

**Validation Rules**:
- `email` - Required, valid email format
- `kitaId` - Required, valid UUID

---

### Consent Management Endpoints

#### GET `/revoke-consent/:consentId`

Revoke email consent and unsubscribe from all notifications.

**Parameters**:
- `consentId` (path) - UUID of the consent record

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Consent revoked successfully."
}
```

**Response (404 Not Found)**:
```json
{
  "success": false,
  "message": "Consent record not found."
}
```

---

#### GET `/confirm-consent/:consentId`

Confirm email consent after signup.

**Parameters**:
- `consentId` (path) - UUID of the consent record

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Email confirmed successfully."
}
```

**Response (404 Not Found)**:
```json
{
  "success": false,
  "message": "Consent record not found."
}
```

---

### Location Service (Lambda)

#### POST `/location/search` (Actual endpoint TBD)

Search for Kitas within a specified radius.

**Request Body**:
```json
{
  "lat": 52.5200,
  "lng": 13.4050,
  "radius": 2500,
  "page": 1,
  "limit": 50
}
```

**Response (200 OK)**:
```json
{
  "kitas": [
    {
      "uuid": "kita-uuid-1",
      "name": "Kita Sunshine",
      "location": {
        "type": "Point",
        "coordinates": [13.4050, 52.5200]
      },
      "address": {
        "street": "Hauptstraße",
        "houseNumber": "123",
        "zip": "10115",
        "city": "Berlin"
      },
      "availability": {
        "2025-01-15": true,
        "2025-02-01": false
      },
      "imageUrl": "https://example.com/image.jpg",
      "distance": 450
    }
  ],
  "total": 127,
  "page": 1,
  "limit": 50,
  "hasMore": true
}
```

**Parameters**:
- `lat` - Required, latitude
- `lng` - Required, longitude
- `radius` - Optional, default 2500 (meters)
- `page` - Optional, default 1
- `limit` - Optional, default 50, max 100

---

## Data Models

### Kita

```typescript
interface Kita {
  uuid: string;
  name: string;
  number: string;
  location: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };
  address: {
    street: string;
    houseNumber: string;
    zip: string;
    city: string;
  };
  availability: {
    [date: string]: boolean; // "2025-01-15": true
  };
  imageUrl: string;
}
```

### KitaDetail

Extends `Kita` with additional fields:

```typescript
interface KitaDetail extends Kita {
  capacity: {
    total: number;
    underThree: number;
  };
  minimumAcceptanceAgeInMonths: number;
  contactDetails: {
    email?: string;
    phone?: string;
    website?: string;
  };
  openingHours: {
    [weekday: string]: {
      from: string; // "08:00"
      to: string;   // "17:00"
    };
  };
  approach: {
    pedagogicalConcepts: string[];
    emphasis: string[];
    languages?: string[];
    mixedAgesDescriptions?: string[];
  };
  foundingDate: string;
  closingDate?: string;
  version?: string;
}
```

### Signup

```typescript
interface Signup {
  _id: ObjectId;
  email: string;
  preferences: {
    location: {
      lat: number;
      lng: number;
    };
    radius: number;
    minAge?: number;
    maxAge?: number;
    languages?: string[];
    pedagogicalConcepts?: string[];
  };
  consentId: string;
  confirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 429 Too Many Requests
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error. Please try again later."
}
```

## Security Headers

All API responses include security headers:

```
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-Powered-By: PHP/7.4.21 (obfuscated)
```

## CORS

CORS is enabled for the frontend domain. Cross-origin requests from other domains will be rejected.

## Request/Response Examples

### Example: Subscribe to Kita Finder

**Request**:
```bash
curl -X POST https://api.kitaplatz-zentrale.de/signup/kita-finder \
  -H "Content-Type: application/json" \
  -d '{
    "email": "parent@example.com",
    "preferences": {
      "location": {
        "lat": 52.5200,
        "lng": 13.4050
      },
      "radius": 3000
    }
  }'
```

**Response**:
```json
{
  "success": true,
  "message": "Signup successful. Please check your email to confirm.",
  "signupId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

### Example: Search for Kitas

**Request**:
```bash
curl -X POST https://api.kitaplatz-zentrale.de/location/search \
  -H "Content-Type: application/json" \
  -d '{
    "lat": 52.5200,
    "lng": 13.4050,
    "radius": 2000,
    "page": 1,
    "limit": 20
  }'
```

**Response**:
```json
{
  "kitas": [
    {
      "uuid": "kita-uuid-1",
      "name": "Kita Regenbogen",
      "location": {
        "type": "Point",
        "coordinates": [13.4050, 52.5200]
      },
      "address": {
        "street": "Berliner Straße",
        "houseNumber": "42",
        "zip": "10115",
        "city": "Berlin"
      },
      "availability": {
        "2025-03-01": true
      },
      "imageUrl": "https://example.com/kita1.jpg",
      "distance": 320
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 20,
  "hasMore": true
}
```

## Testing the API

### Using cURL

```bash
# Health check (if available)
curl https://api.kitaplatz-zentrale.de/health

# Signup
curl -X POST https://api.kitaplatz-zentrale.de/signup/kita-finder \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","preferences":{"location":{"lat":52.52,"lng":13.40},"radius":2500}}'
```

### Using Postman

1. Import the [SwaggerHub API spec](https://app.swaggerhub.com/apis/Darjusch/KPZ_API_DOC/1.0.0)
2. Set base URL to production or local environment
3. Test each endpoint

### Using the Frontend

The frontend application makes all API calls automatically. Test by:
1. Running frontend locally
2. Filling out signup forms
3. Checking browser Network tab for API calls

## Versioning

Currently, the API is unversioned (v1 implied). Future versions may use URL versioning:
- `/v1/signup/kita-finder`
- `/v2/signup/kita-finder`

## Changelog

### Current Version
- Initial API implementation
- Signup endpoints
- Consent management
- Location search (Lambda)

### Future Enhancements
- API versioning
- Authentication/API keys
- Pagination improvements
- Filtering and sorting options
- GraphQL endpoint (optional)

---

For more details, see:
- [Development Guide](Development-Guide.md)
- [Architecture](Architecture.md)
- [SwaggerHub Documentation](https://app.swaggerhub.com/apis/Darjusch/KPZ_API_DOC/1.0.0)
