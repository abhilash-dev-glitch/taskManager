# MERN Task Manager

A full-stack task management application built with the MERN stack (MongoDB, Express.js, React, Node.js). This application allows users to create, read, update, and delete tasks with user authentication.

## Features

- User authentication (Register/Login/Logout)
- Create, read, update, and delete tasks
- Task filtering and sorting
- Responsive design
- Secure API endpoints
- JWT authentication
- Protected routes
- Form validation
- Error handling

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Containerization**: Docker

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- Docker (optional, for containerization)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/mern-task-manager.git
cd mern-task-manager
```

### 2. Set up environment variables

Create a `.env` file in the root directory based on the `.env.example` file:

```bash
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB Connection
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### 3. Install dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 4. Start the development server

#### Option 1: Run without Docker

```bash
# Start backend server
cd server
npm run server

# In a new terminal, start the frontend
cd client
npm run dev
```

#### Option 2: Run with Docker

```bash
# Build and start containers
docker-compose up --build

# For development with hot-reload
docker-compose -f docker-compose.dev.yml up --build
```

## Available Scripts

### Server (from /server directory)

- `npm start` - Start the production server
- `npm run server` - Start the development server with nodemon
- `npm run dev` - Start both client and server in development mode (using concurrently)

### Client (from /client directory)

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
mern-task-manager/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   └── src/                # React source code
├── server/                 # Backend Express application
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   ├── app.js              # Express app setup
│   └── server.js           # Server entry point
├── .dockerignore           # Files to ignore in Docker builds
├── .env.example            # Example environment variables
├── docker-compose.yml      # Docker Compose configuration
└── Dockerfile              # Docker configuration for production
```

## Environment Variables

See `.env.example` for all available environment variables.

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - Logout user

### Tasks

- `GET /api/v1/tasks` - Get all tasks for the logged-in user
- `POST /api/v1/tasks` - Create a new task
- `GET /api/v1/tasks/:id` - Get a single task
- `PUT /api/v1/tasks/:id` - Update a task
- `DELETE /api/v1/tasks/:id` - Delete a task

## Deployment

### Prerequisites

- Render account
- MongoDB Atlas database or self-hosted MongoDB

### Steps

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Create a new Web Service on Render
3. Connect your repository
4. Configure build and start commands:
   - Build Command: `cd client && npm install && npm run build`
   - Start Command: `NODE_ENV=production node server/server.js`
5. Set up environment variables
6. Deploy!

### Environment Variables for Production

Make sure to set these in your production environment:

- `NODE_ENV=production`
- `MONGO_URI` - Your production MongoDB connection string
- `JWT_SECRET` - A strong secret for JWT
- `FRONTEND_URL` - Your production frontend URL

## Docker Support

### Development

```bash
docker-compose -f docker-compose.dev.yml up --build
```

### Production

```bash
docker-compose up -d --build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [MongoDB](https://www.mongodb.com/)
- [Express](https://expressjs.com/)
- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## Support

For support, please open an issue in the GitHub repository.
