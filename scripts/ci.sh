#!/usr/bin/env bash

# ==============================================================================
# CI/CD Quality Gate Pipeline Script
# Used for Local Verification, Jenkins Pipeline, and Docker Build Validations
# ==============================================================================

set -eo pipefail

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}====================================================${NC}"
echo -e "${BLUE}     Running CI/CD Pipeline Quality Gate Checks    ${NC}"
echo -e "${BLUE}====================================================${NC}"

# Step 1: Frontend Linting & Formatting Check
echo -e "\n${BLUE}[1/6] Checking Frontend Lint & Formatting (Biome)...${NC}"
npm run check
echo -e "${GREEN}✓ Frontend formatting & lint passed.${NC}"

# Step 2: Frontend TypeScript Verification
echo -e "\n${BLUE}[2/6] Checking Frontend TypeScript Types (tsc)...${NC}"
npm run types:check
echo -e "${GREEN}✓ TypeScript compilation check passed.${NC}"

# Step 3: Backend PHP Code Style Check
echo -e "\n${BLUE}[3/6] Checking PHP Code Styling (Pint)...${NC}"
./vendor/bin/pint --test
echo -e "${GREEN}✓ PHP code styling passed.${NC}"

# Step 4: Backend Static Analysis
echo -e "\n${BLUE}[4/6] Running PHPStan Static Analysis...${NC}"
./vendor/bin/phpstan analyse --memory-limit=512M
echo -e "${GREEN}✓ PHPStan static analysis passed.${NC}"

# Step 5: Automated Feature & Unit Test Suite
echo -e "\n${BLUE}[5/6] Running Automated Test Suite (Pest)...${NC}"
php artisan test
echo -e "${GREEN}✓ All automated tests passed.${NC}"

# Step 6: Production Asset Build Check
echo -e "\n${BLUE}[6/6] Verifying Production Frontend Build (Vite)...${NC}"
npm run build
echo -e "${GREEN}✓ Vite production bundle built successfully.${NC}"

echo -e "\n${GREEN}====================================================${NC}"
echo -e "${GREEN}  ✓ All CI Quality Gates Passed Successfully!       ${NC}"
echo -e "${GREEN}====================================================${NC}"
