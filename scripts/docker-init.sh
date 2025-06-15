#!/bin/bash

set -e

echo "Starting PagePilot Backend initialization..."

# Wait for the application to be ready
echo "Waiting for application to start..."
sleep 5

# Check if database exists, if not create and seed it
if [ ! -f "/app/data/prod.db" ]; then
    echo "Database not found, creating and seeding..."
    
    # Push the schema to create the database
    npx prisma db push --accept-data-loss
    
    # Seed the database
    npm run db:seed
    
    echo "Database created and seeded successfully!"
else
    echo "Database already exists, skipping initialization"
fi

echo "🚀 Starting PagePilot Backend server..."
exec "$@" 