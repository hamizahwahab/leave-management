# Leave Management System — API Reference

**Base URL**: `http://localhost:8000/api`

All endpoints return JSON responses. Protected routes require a Bearer token obtained from the login endpoint.

---

## Authentication

### Register

```http
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password",
  "password_confirmation": "password"
}
```

### Login

```http
POST /api/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password"
}
```

**Response**:

```json
{
  "token": "1|abc123...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

Include the token in subsequent requests via the `Authorization` header:

```
Authorization: Bearer 1|abc123...
```

### Logout

```http
POST /api/logout
Authorization: Bearer 1|abc123...
```

---

## Endpoints

### Auth

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register a new user | No |
| POST | `/login` | Login and receive token | No |
| POST | `/logout` | Revoke current token | Yes |
| GET | `/me` | Get authenticated user details | Yes |
| PUT | `/change-password` | Change password | Yes |

### Dashboard

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/dashboard/stats` | Get dashboard statistics | Yes |

### Leave Types

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/leave-types` | List all leave types | Yes |
| POST | `/leave-types` | Create a leave type (admin) | Yes |

### Leave Requests

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/leave-requests` | List leave requests (own or all with permission) | Yes |
| POST | `/leave-requests` | Apply for leave | Yes |
| GET | `/leave-requests/{id}` | View leave request details | Yes |
| PUT | `/leave-requests/{id}/status` | Approve or reject a request | Yes (`can:leaves.approve`) |

#### Apply for Leave

```http
POST /api/leave-requests
Authorization: Bearer 1|abc123...
Content-Type: multipart/form-data

{
  "leave_type_id": 1,
  "start_date": "2026-06-15",
  "end_date": "2026-06-17",
  "reason": "Family vacation",
  "attachment": (file — optional)
}
```

**Response**:

```json
{
  "id": 5,
  "leave_type_id": 1,
  "start_date": "2026-06-15",
  "end_date": "2026-06-17",
  "reason": "Family vacation",
  "status": "pending",
  "user": {
    "id": 3,
    "name": "Jane Employee"
  },
  "leave_type": {
    "id": 1,
    "name": "Annual Leave"
  }
}
```

Query parameters for listing:

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `status` | string | `pending,approved` | Comma-separated status filter |
| `date_from` | string | `2026-01-01` | Start of date range |
| `date_to` | string | `2026-12-31` | End of date range |
| `search` | string | `John` | Search by user name |

#### Approve / Reject Leave

```http
PUT /api/leave-requests/5/status
Authorization: Bearer 1|abc123...
Content-Type: application/json

{
  "status": "approved",
  "remarks": "Enjoy your vacation!"
}
```

**Response**:

```json
{
  "id": 5,
  "status": "approved",
  "remarks": "Enjoy your vacation!",
  "approved_by": 1,
  "approved_at": "2026-05-20T10:30:00.000000Z"
}
```

### Leave Balances

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/leave-balances` | List balances (own or all with permission) | Yes |
| PUT | `/leave-balances/{id}/adjust` | Adjust a user's balance | Yes (`can:balances.adjust`) |

### Employees

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/employees` | List all employees | Yes |
| POST | `/employees` | Create a new employee | Yes |
| GET | `/employees/{id}` | View employee details | Yes |
| PUT | `/employees/{id}` | Update employee | Yes |
| DELETE | `/employees/{id}` | Delete employee | Yes |

### Public Holidays

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/holidays` | List all public holidays | Yes |
| POST | `/holidays` | Create a public holiday | Yes (`can:manage-holidays`) |
| DELETE | `/holidays/{id}` | Delete a public holiday | Yes (`can:manage-holidays`) |

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK — Request succeeded |
| 201 | Created — Resource created successfully |
| 204 | No Content — Deletion succeeded |
| 400 | Bad Request — Validation error or invalid input |
| 401 | Unauthorized — Missing or invalid token |
| 403 | Forbidden — Insufficient permissions |
| 404 | Not Found — Resource does not exist |
| 422 | Unprocessable Entity — Validation failure |
| 500 | Internal Server Error — Something went wrong on the server |

## Error Response Format

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

For general errors:

```json
{
  "message": "Unauthenticated."
}
```
