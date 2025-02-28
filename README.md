# Akademi Backend

This is the backend service for the Akademi Scholarship Management System. It handles user authentication, scholarship data management, reviews, and payment integration. The backend is built using Node.js, Express.js, MongoDB, and integrates with Stripe for payment processing.

## Features

- **User Management:**
  - Create, retrieve, update, and delete user data.
  - Role-based access control (admin, moderator, user).

- **Scholarship Management:**
  - Add, update, retrieve, and delete scholarship information.
  - Retrieve scholarships based on specific criteria (e.g., lowest application fees).

- **Review Management:**
  - Add, retrieve, update, and delete reviews for scholarships.

- **Payment Processing:**
  - Stripe integration for creating payment intents.

## Tech Stack

- **Node.js:** Backend runtime environment.
- **Express.js:** Web framework for API development.
- **MongoDB:** Database for storing application data.
- **Stripe:** Payment gateway for handling transactions.

## Middleware

- **CORS:** Enabled for cross-origin requests.
- **Authentication:**
  - Admin routes require `verifyAdmin` middleware.
  - Authorized routes require `verifyAuthorization` middleware.

## Project Structure

```
backend/
├── .env               # Environment variables
├── node_modules/      # Dependencies
├── package.json       # Project metadata and dependencies
├── index.js           # Entry point for the server
├── vercel.json        # Vercel configuration for hosting
└── README.md          # Project documentation
```

## Deployment

To deploy the backend, follow these steps:

1. Set up a cloud database (e.g., MongoDB Atlas).
2. Configure your `.env` file with production credentials.
3. Deploy the application to a cloud provider (e.g., Vercel).
