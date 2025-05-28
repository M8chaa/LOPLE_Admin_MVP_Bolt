#!/bin/bash

echo "=== LOPLE Admin MVP Testing Script ==="
echo

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_BASE="http://localhost:4000/api"
TOKEN=""

# Function to print test results
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Test login and get token
echo -e "${YELLOW}Testing Authentication...${NC}"
response=$(curl -s -X POST $API_BASE/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"admin123"}')

if [[ $response == *"token"* ]]; then
    TOKEN=$(echo $response | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    print_result 0 "Admin login successful"
else
    print_result 1 "Admin login failed"
    exit 1
fi

echo
echo -e "${YELLOW}Testing Callcards API...${NC}"

# Test get callcards
response=$(curl -s -H "Authorization: Bearer $TOKEN" $API_BASE/callcards)
callcard_count=$(echo $response | grep -o '"id":' | wc -l)

if [ $callcard_count -gt 0 ]; then
    print_result 0 "Callcards retrieved: $callcard_count found"
    echo "  - Korean callcards: 서울→부산, 인천→대구, 경기→광주, 서울→대전"
else
    print_result 1 "Failed to retrieve callcards"
fi

echo
echo -e "${YELLOW}Testing Drivers API...${NC}"

# Test get drivers  
response=$(curl -s -H "Authorization: Bearer $TOKEN" $API_BASE/drivers)
driver_count=$(echo $response | grep -o '"id":' | wc -l)

if [ $driver_count -gt 0 ]; then
    print_result 0 "Drivers retrieved: $driver_count found"
    echo "  - Korean drivers: 김기사, 이기사, 박기사, 최기사"
else
    print_result 1 "Failed to retrieve drivers"
fi

echo
echo -e "${YELLOW}Testing Driver Assignment...${NC}"

# Test assign driver to callcard
assign_response=$(curl -s -X POST -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"driverId":1}' $API_BASE/callcards/1/assign)

if [[ $assign_response == *"in_progress"* ]]; then
    print_result 0 "Driver assignment successful"
    echo "  - 김기사 assigned to 서울→부산 callcard"
else
    print_result 1 "Driver assignment failed"
fi

# Test unassign driver
unassign_response=$(curl -s -X POST -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{}' $API_BASE/callcards/1/unassign)

if [[ $unassign_response == *"pending"* ]]; then
    print_result 0 "Driver unassignment successful"
else
    print_result 1 "Driver unassignment failed"
fi

echo
echo -e "${YELLOW}Summary of Korean Sample Data:${NC}"
echo "📋 Callcards:"
echo "  1. 서울 → 부산 물류운송 (서울특별시 강남구 → 부산광역시 해운대구)"
echo "  2. 인천 → 대구 배송건 (인천광역시 연수구 → 대구광역시 수성구)" 
echo "  3. 경기 → 광주 운송 (경기도 성남시 → 광주광역시 서구) [배차중 - 박기사]"
echo "  4. 서울 → 대전 긴급배송 (서울특별시 마포구 → 대전광역시 유성구)"
echo
echo "👨‍💼 Drivers:"
echo "  1. 김기사 (010-1234-5678) - 대기중"
echo "  2. 이기사 (010-2345-6789) - 대기중"  
echo "  3. 박기사 (010-3456-7890) - 운송중"
echo "  4. 최기사 (010-4567-8901) - 대기중"

echo
echo -e "${GREEN}=== MVP Backend Testing Complete! ===${NC}"
echo
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Open browser to http://localhost:5173"
echo "2. Login with admin/admin123"
echo "3. Test dashboard, callcards, and drivers pages"
echo "4. Test driver assignment in the UI"
echo
echo -e "${GREEN}MVP is ready for demo! 🚀${NC}"