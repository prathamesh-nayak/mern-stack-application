# MERN Stack Application

This is a full-stack web application built using the MERN stack (MongoDB, Express, React, Node.js).

## Prerequisites

Ensure you have the following installed on your local machine:
*   [Node.js](https://nodejs.org/) (v14 or higher)
*   [MongoDB](https://www.mongodb.com/) (Local installation or Atlas URI)

## Getting Started

### 1. Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Create a `.env` file in the `backend` directory with the following variables:
    ```env
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/your_database_name
    JWT_SECRET=your_jwt_secret_key
    ```
    *Replace `your_database_name` and `your_jwt_secret_key` with your actual values.*

4.  Start the backend server:
    *   For development (with Nodemon):
        ```bash
        npm run dev
        ```
    *   For production:
        ```bash
        npm start
        ```

    The server will start on `http://localhost:5000` (or the port specified in `.env`).

### 2. Frontend Setup

1.  Open a new terminal and navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

    The application will typically run at `http://localhost:5173` (check the terminal output for the exact URL).