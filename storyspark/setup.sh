#!/bin/bash
set -e

echo ""
echo "⭐ StorySpark Deploy Setup"
echo "========================="
echo ""
echo "You'll need 3 things before starting:"
echo "  1. An OpenAI API key (platform.openai.com)"
echo "  2. A Supabase project (supabase.com)"
echo "  3. A Clerk app (clerk.com)"
echo ""

# Collect env vars interactively
read -p "OpenAI API Key: " OPENAI_API_KEY
read -p "Supabase Project URL (https://xxx.supabase.co): " SUPABASE_URL
read -p "Supabase Anon Key: " SUPABASE_ANON_KEY
read -p "Supabase Service Role Key: " SUPABASE_SERVICE_KEY
read -p "Clerk Publishable Key (pk_test_...): " CLERK_PUB_KEY
read -p "Clerk Secret Key (sk_test_...): " CLERK_SECRET_KEY

# Write .env.local
cat > .env.local << EOF
OPENAI_API_KEY=$OPENAI_API_KEY
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_KEY
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$CLERK_PUB_KEY
CLERK_SECRET_KEY=$CLERK_SECRET_KEY
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF

echo ""
echo "✅ .env.local written"
echo ""

# Print Supabase SQL
echo "📋 Run this SQL in your Supabase SQL Editor (supabase.com > SQL Editor > New Query):"
echo ""
cat << 'SQL'
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL,
  title TEXT,
  status TEXT DEFAULT 'draft',
  inputs JSONB,
  pages JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  clerk_user_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
SQL

echo ""
read -p "Press Enter after you've run the SQL... "

# Install and run
echo ""
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo ""
echo "🚀 Starting dev server..."
echo "   Open http://localhost:3000"
echo ""
npm run dev
