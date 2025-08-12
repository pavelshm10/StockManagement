# 📈 Stock Management Application

A full-stack web application for managing personal stock portfolios with real-time stock data, built with React, NestJS, and MongoDB.

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd StockManagement
```

### Install dependencies

```bash
npm install
```

### Set up environment variables

- `apps/backend/.env` - Backend configuration
- `apps/frontend/.env` - Frontend configuration

## 🚀 Features

- **User Authentication**: Simple username-based login system
- **Portfolio Management**: Add, remove, and view stocks in your portfolio
- **Real-time Stock Data**: Search and view detailed stock information
- **Responsive Design**: Modern Material-UI interface that works on all devices
- **Automatic Portfolio Creation**: New users get portfolios created automatically
- **Stock Details**: Click on stock names to view comprehensive information

## 🏗️ Architecture

- **Frontend**: React with TypeScript, Material-UI, Vite
- **Backend**: NestJS with TypeScript
- **Database**: MongoDB with Mongoose
- **State Management**: React hooks and local state
- **API Integration**: Financial Modeling Prep API for stock data

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB database (local or cloud)
- Financial Modeling Prep API key

## 📱 Usage

### 1. Login

- Navigate to the application
- Enter your username (new users will be created automatically)
- Click "Login"

### 2. View Portfolio

- After login, you'll be redirected to your portfolio
- New users will see an empty portfolio
- Existing users will see their current stocks

### 3. Add Stocks

- Use the search bar to find stocks by symbol or company name
- Click "View Stock Details" to see comprehensive information
- Enter the quantity and click "Add to Portfolio"

### 4. Manage Portfolio

- View all your stocks in the portfolio table
- Click on stock names to view detailed information
- Use the delete button (🗑️) to remove stocks from your portfolio

### 5. Stock Details

- Click on any stock name in your portfolio to view details
- See real-time price, change, volume, and other market data
- View company information and financial metrics

## 🗄️ Database Schema

### User Collection

```typescript
{
  username: string (unique),
  email: string,
  password: string,
  created_at: Date,
  updated_at: Date
}
```

### Portfolio Collection

```typescript
{
  user: string,
  stocks: [
    {
      stock: {
        name: string,
        symbol: string
      },
      quantity: number
    }
  ]
}
```

## 🔧 API Endpoints

### Authentication

- `POST /login` - User login

### Portfolio

- `GET /portfolio/:user` - Get user's portfolio
- `POST /portfolio` - Create new portfolio
- `PUT /portfolio/:user` - Update portfolio

## 🎨 UI Components

- **Login**: User authentication interface
- **Portfolio**: Main portfolio view with stock table
- **SearchStock**: Stock search and selection
- **Stock**: Detailed stock information modal
- **SearchStock**: Stock search functionality

## 🔒 Security Features

- CORS configuration for frontend-backend communication
- Environment variable management for sensitive data
- Input validation and error handling
- Secure MongoDB connections

## 🚧 Development

### Project Structure

```
StockManagement/
├── apps/
│   ├── backend/          # NestJS backend
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── controllers/
│   │   │   │   ├── services/
│   │   │   │   └── schemas/
│   │   │   └── database/
│   │   └── tsconfig.json
│   └── frontend/         # React frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── components/
│       │   │   └── services/
│       │   └── main.tsx
│       └── tsconfig.json
├── libs/                 # Shared types and utilities
└── package.json
```

## 🙏 Acknowledgments

- [Financial Modeling Prep](https://financialmodelingprep.com/) for stock data API
- [Material-UI](https://mui.com/) for the beautiful UI components
- [NestJS](https://nestjs.com/) for the robust backend framework
- [React](https://reactjs.org/) for the frontend framework

**Happy Trading! 📈💰**
