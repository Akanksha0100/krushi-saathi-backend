# Krushi Saathi Backend

A Node.js Express backend for the Krushi Saathi agricultural support platform.

## Features

- User authentication with JWT
- Weather forecast integration
- Crop recommendation based on soil analysis
- Disease detection using LLM
- Marketplace for agricultural products
- Government schemes database
- Admin panel for content management

## Installation

```bash
npm install
```

## Environment Setup

1. Create a `.env` file based on `.env` template
2. Get APIs:
   - OpenWeatherMap (free): https://openweathermap.org/api
   - Groq LLM (free): https://console.groq.com
3. Setup MongoDB locally or use MongoDB Atlas

## Running the Server

Development:
```bash
npm run dev
```

Production:
```bash
npm run build
npm start
```

## API Documentation

See `api-docs.yaml` in the root directory for complete API specification.

## Technologies

- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Groq LLM API
- OpenWeatherMap API
- TypeScript
