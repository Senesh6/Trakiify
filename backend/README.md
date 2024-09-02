# Transport App Backend

## Dev Environment Setup

1. Clone the repository
2. Run `npm install` to install necessary dependencies
3. Create a file named `.env` in the root directory and update it.
4. Run `npm run dev` to run the app

## Building Docker Image

``
docker build -t transport-backend
``

## Running Docker Image

``
docker run -p 3500:3500 transport-backend
``
