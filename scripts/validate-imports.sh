#!/bin/bash

# BBroker Import Path Validation Script
# Checks for common import errors

echo "🔍 Checking for import path issues..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0

# Check 1: middleware files should use ../db not ./db
echo "1. Checking middleware imports..."
if grep -r "from './db'" server/middleware/ 2>/dev/null; then
    echo -e "${RED}❌ ERROR: middleware files using './db' instead of '../db'${NC}"
    ((errors++))
else
    echo -e "${GREEN}✅ Middleware imports correct${NC}"
fi

# Check 2: controllers should use ../db not ./db
echo "2. Checking controller imports..."
if grep -r "from './db'" server/controllers/ 2>/dev/null; then
    echo -e "${RED}❌ ERROR: controller files using './db' instead of '../db'${NC}"
    ((errors++))
else
    echo -e "${GREEN}✅ Controller imports correct${NC}"
fi

# Check 3: Check for missing @shared/schema imports
echo "3. Checking @shared/schema usage..."
count=$(grep -r "@shared/schema" server/ --include="*.ts" | wc -l)
if [ "$count" -gt 0 ]; then
    echo -e "${GREEN}✅ Found $count @shared/schema imports${NC}"
else
    echo -e "${YELLOW}⚠️  No @shared/schema imports found (might be okay)${NC}"
fi

# Check 4: Verify db.ts exists
echo "4. Checking db.ts exists..."
if [ -f "server/db.ts" ]; then
    echo -e "${GREEN}✅ server/db.ts found${NC}"
else
    echo -e "${RED}❌ ERROR: server/db.ts not found${NC}"
    ((errors++))
fi

# Check 5: Verify schema.ts exists
echo "5. Checking schema.ts exists..."
if [ -f "shared/schema.ts" ]; then
    echo -e "${GREEN}✅ shared/schema.ts found${NC}"
else
    echo -e "${RED}❌ ERROR: shared/schema.ts not found${NC}"
    ((errors++))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $errors -eq 0 ]; then
    echo -e "${GREEN}✅ All import checks passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Found $errors error(s)${NC}"
    echo ""
    echo "Run 'npm run check' to verify TypeScript compilation"
    exit 1
fi
