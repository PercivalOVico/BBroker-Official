#!/bin/bash

# BBroker Initial Setup Script
# Run this script after cloning/downloading the project

echo "🚀 BBroker Initial Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Check Node.js version
echo -e "${BLUE}Step 1: Checking Node.js version...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 18 or higher from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version must be 18 or higher (current: $(node --version))${NC}"
    echo "Please upgrade Node.js from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version) detected${NC}"
echo ""

# Step 2: Install dependencies
echo -e "${BLUE}Step 2: Installing dependencies...${NC}"
echo "This may take a few minutes..."
echo ""

if npm install; then
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi
echo ""

# Step 3: Check for .env file
echo -e "${BLUE}Step 3: Checking environment configuration...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    if [ -f ".env.example" ]; then
        echo "Creating .env from .env.example..."
        cp .env.example .env
        echo -e "${GREEN}✅ .env file created${NC}"
        echo -e "${YELLOW}⚠️  IMPORTANT: Edit .env and add your DATABASE_URL${NC}"
        echo ""
        echo "Your Neon PostgreSQL connection string:"
        echo "DATABASE_URL=\"postgresql://neondb_owner:npg_ipzrL51dSefx@ep-quiet-glitter-ahng16tp-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require\""
    else
        echo -e "${RED}❌ .env.example not found${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ .env file exists${NC}"
    
    # Check if DATABASE_URL is set
    if grep -q "DATABASE_URL=" .env; then
        if grep -q "DATABASE_URL=\"postgresql://" .env; then
            echo -e "${GREEN}✅ DATABASE_URL is configured${NC}"
        else
            echo -e "${YELLOW}⚠️  DATABASE_URL might not be set correctly${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  DATABASE_URL not found in .env${NC}"
        echo "Please add your Neon PostgreSQL connection string to .env"
    fi
fi
echo ""

# Step 4: Validate imports
echo -e "${BLUE}Step 4: Validating imports...${NC}"
if bash scripts/validate-imports.sh; then
    echo ""
else
    echo -e "${YELLOW}⚠️  Import validation failed (non-critical)${NC}"
fi
echo ""

# Step 5: TypeScript check (optional, may fail if .env not configured)
echo -e "${BLUE}Step 5: Checking TypeScript...${NC}"
if npm run check 2>&1 | grep -q "error"; then
    echo -e "${YELLOW}⚠️  TypeScript has some errors (may be due to missing .env)${NC}"
    echo "You can ignore this for now"
else
    echo -e "${GREEN}✅ TypeScript check passed${NC}"
fi
echo ""

# Step 6: Instructions
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo ""
echo "1. Configure your database connection:"
echo "   Edit .env and ensure DATABASE_URL is set"
echo ""
echo "2. Push database schema to Neon:"
echo "   npm run db:push"
echo ""
echo "3. (Optional) Open Drizzle Studio to verify tables:"
echo "   npm run db:studio"
echo ""
echo "4. Start the development server:"
echo "   npm run dev"
echo ""
echo "5. Open your browser:"
echo "   http://localhost:5000"
echo ""
echo -e "${YELLOW}📚 Troubleshooting:${NC}"
echo "   See TROUBLESHOOTING.md for help with common issues"
echo ""
echo -e "${GREEN}🎉 Happy coding!${NC}"
