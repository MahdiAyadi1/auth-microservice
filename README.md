# Authentication Microservice

## Introduction

This is an authentication microservice built using Node.js, Express, and MongoDB. It provides user registration, login, token validation, and token refresh functionalities.

## Features

- User registration
- User login
- JWT-based authentication
- Token validation
- Token refresh

## Architecture

This microservice follows a typical microservices architecture with a clear separation of concerns. The main components include:

- `controllers/`: Contains the logic for handling HTTP requests and responses.
- `models/`: Contains Mongoose schemas and models for interacting with the MongoDB database.
- `middlewares/`: Contains middleware functions for token validation.
- `routes/`: Defines the API endpoints and maps them to controller functions.
- `tests/`: Contains test cases for the microservice.

## Setup

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js (v14 or higher)
- npm (v6 or higher)
- Docker (for running MongoDB in a container)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/MahdiAyadi1/auth-microservice.git
   cd auth-microservice
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file in the root directory and add the following environment variables:

   ```env
   DATABASE_URL=mongodb://localhost:27017/auth-service
   JWT_TOKEN=your_jwt_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ```

4. Start the MongoDB container using Docker:

```bash
docker run --name mongodb -p 27017:27017 -d mongo
```

5. Run the authentication microservice

```bash
    npm run dev
```

The service will be running on http://localhost:8000.

API Endpoints
POST /auth/register: Register a new user \
 POST /auth/login: Login an existing user \
 GET /auth/validate-token: Validate a JWT token \
 POST /auth/refresh-token: Refresh an access token \

### Testing

1. Set up .env.test file following the same .env file structure

2. To run the tests, use the following command:

```bash
    npm test
```
