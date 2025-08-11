#!/bin/bash

echo "🚀 Setting up Environment Variables for HTTP Service..."

# Create frontend .env file
echo "📁 Creating frontend .env file..."
cd apps/frontend

if [ -f ".env" ]; then
    echo "⚠️  .env file already exists. Backing up to .env.backup"
    cp .env .env.backup
fi

cat > .env << EOF
# Frontend Environment Variables
VITE_BASE_URL=http://localhost:3000
VITE_FMP_API_KEY=sd0uxbcjuoaFhulC4OrGZs17vFu19ryl
EOF

echo "✅ Frontend .env created with VITE_BASE_URL=http://localhost:3000"

# Create backend .env file
echo "📁 Creating backend .env file..."
cd ../backend

if [ -f ".env" ]; then
    echo "⚠️  .env file already exists. Backing up to .env.backup"
    cp .env .env.backup
fi

cat > .env << EOF
# Backend Environment Variables
PORT=3000
MONGODB_URI=mongodb+srv://pavelsh00:pavelsh00@test.4bsjii7.mongodb.net/?retryWrites=true&w=majority&appName=Test
MONGODB_DB_NAME=stocks_management
CORS_ORIGINS=http://localhost:4200,http://localhost:4201,http://localhost:3000
NODE_ENV=development
EOF

echo "✅ Backend .env created"

cd ../..

echo ""
echo "🎉 Environment setup complete!"
echo ""
echo "📋 Frontend variables:"
echo "   VITE_BASE_URL=http://localhost:3000"
echo "   VITE_FMP_API_KEY=sd0uxbcjuoaFhulC4OrGZs17vFu19ryl"
echo ""
echo "📋 Backend variables:"
echo "   PORT=3000"
echo "   MONGODB_URI=configured"
echo "   CORS_ORIGINS=localhost:4200,4201,3000"
echo ""
echo "🚀 Next steps:"
echo "1. Restart your backend: npm run start:backend"
echo "2. Restart your frontend: npm run start:frontend"
echo "3. Test the portfolio functionality"
echo ""
echo "💡 All API requests now go through the HTTP service with interceptors!"
