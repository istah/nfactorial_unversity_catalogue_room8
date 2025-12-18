# QA Guide for Frontend-Backend Integration

**Purpose**: Guide for QA and Documentation agents to validate the integration.

---

## Pre-Testing Setup

### 1. Start Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
python app/seed.py
python -m uvicorn app.main:app --reload
```

**Expected**: Backend running on http://localhost:8000

### 2. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

**Expected**: Frontend running on http://localhost:3000

### 3. Verify Health

```bash
curl http://localhost:8000/api/health
# Expected: {"status": "ok"}
```

---

## API Endpoint Testing

### Endpoint 1: GET /api/health

**Purpose**: Verify backend is running

**Test**:
```bash
curl http://localhost:8000/api/health
```

**Expected Response**:
```json
{"status": "ok"}
```

**Frontend Usage**: Health check in `services/api.ts`

---

### Endpoint 2: GET /api/meta

**Purpose**: Load filter metadata (countries, programs, exams)

**Test**:
```bash
curl http://localhost:8000/api/meta
```

**Expected Response Structure**:
```json
{
  "countries": [
    {"id": "1", "name": "USA", "code": "US"},
    {"id": "2", "name": "UK", "code": "GB"}
  ],
  "programs": [
    {"id": "1", "name": "Computer Science"},
    {"id": "2", "name": "Engineering"}
  ],
  "exams": [
    {"id": "1", "name": "SAT"},
    {"id": "2", "name": "ACT"}
  ]
}
```

**Validation**:
- [ ] Response contains `countries` array
- [ ] Response contains `programs` array
- [ ] Response contains `exams` array
- [ ] Each country has `id`, `name`, `code`
- [ ] Each program has `id`, `name`
- [ ] Each exam has `id`, `name`

**Frontend Usage**: `UniversityFilters` component loads this on mount

---

### Endpoint 3: GET /api/universities

**Purpose**: List universities with filters and pagination

**Test - No Filters**:
```bash
curl "http://localhost:8000/api/universities?page=1&page_size=10"
```

**Test - With Filters**:
```bash
curl "http://localhost:8000/api/universities?country_id=1&page=1&page_size=10"
curl "http://localhost:8000/api/universities?program_id=1&page=1&page_size=10"
curl "http://localhost:8000/api/universities?exam_id=1&page=1&page_size=10"
curl "http://localhost:8000/api/universities?min_score=1400&page=1&page_size=10"
curl "http://localhost:8000/api/universities?search=Stanford&page=1&page_size=10"
```

**Expected Response Structure**:
```json
{
  "items": [
    {
      "id": "1",
      "name": "Stanford University",
      "country_id": "1",
      "country": {"id": "1", "name": "USA", "code": "US"},
      "description": "...",
      "programs": [
        {"id": "1", "name": "Computer Science"}
      ]
    }
  ],
  "total": 100,
  "page": 1,
  "page_size": 10
}
```

**Validation**:
- [ ] Response contains `items` array
- [ ] Response contains `total` count
- [ ] Response contains `page` number
- [ ] Response contains `page_size`
- [ ] Each item has `id`, `name`, `country_id`, `country`, `description`, `programs`
- [ ] Filters work correctly
- [ ] Pagination works correctly

**Frontend Usage**: `app/universities/page.tsx` displays this data

---

### Endpoint 4: GET /api/universities/{id}

**Purpose**: Get detailed information about a university

**Test**:
```bash
curl http://localhost:8000/api/universities/1
```

**Expected Response Structure**:
```json
{
  "id": "1",
  "name": "Stanford University",
  "country_id": "1",
  "country": {"id": "1", "name": "USA", "code": "US"},
  "description": "...",
  "programs": [
    {"id": "1", "name": "Computer Science"},
    {"id": "2", "name": "Engineering"}
  ],
  "requirements": [
    {
      "id": "1",
      "exam_id": "1",
      "exam": {"id": "1", "name": "SAT"},
      "min_score": 1470,
      "max_score": 1570
    }
  ]
}
```

**Validation**:
- [ ] Response contains all university fields
- [ ] Response contains `programs` array
- [ ] Response contains `requirements` array
- [ ] Each requirement has `id`, `exam_id`, `exam`, `min_score`, `max_score`
- [ ] Exam object is populated

**Frontend Usage**: `app/universities/[id]/page.tsx` displays this data

---

## Frontend Component Testing

### Component 1: UniversityFilters

**Location**: `frontend/components/university/UniversityFilters.tsx`

**Tests**:
- [ ] Component mounts without errors
- [ ] Fetches `/api/meta` on mount
- [ ] Displays countries dropdown
- [ ] Displays programs dropdown
- [ ] Displays exams dropdown
- [ ] Displays min_score input
- [ ] Displays search input
- [ ] "Apply" button works
- [ ] "Reset" button clears filters
- [ ] Calls parent callback with selected filters

**Expected Behavior**:
1. Component mounts
2. Shows loading state
3. Fetches `/api/meta`
4. Populates dropdowns
5. User selects filters
6. User clicks "Apply"
7. Parent callback called with filters

---

### Component 2: UniversityCard

**Location**: `frontend/components/university/UniversityCard.tsx`

**Tests**:
- [ ] Displays university name
- [ ] Displays country name
- [ ] Displays description
- [ ] Displays programs list
- [ ] Links to detail page
- [ ] Hover effect works

**Expected Behavior**:
1. Receives university object
2. Displays all fields
3. Links to `/universities/{id}`
4. Shows hover effect

---

### Page 1: Universities List

**Location**: `frontend/app/universities/page.tsx`

**Tests**:
- [ ] Page loads without errors
- [ ] Fetches `/api/universities` on mount
- [ ] Displays universities grid
- [ ] Shows loading state during fetch
- [ ] Shows error state if fetch fails
- [ ] Shows empty state if no results
- [ ] Filters work correctly
- [ ] Pagination works
- [ ] Displays total count

**Expected Behavior**:
1. Page mounts
2. Shows loading spinner
3. Fetches `/api/universities`
4. Displays results in grid
5. User applies filters
6. Fetches `/api/universities` with filters
7. Updates display

---

### Page 2: University Detail

**Location**: `frontend/app/universities/[id]/page.tsx`

**Tests**:
- [ ] Page loads without errors
- [ ] Fetches `/api/universities/{id}` on mount
- [ ] Displays university name
- [ ] Displays country
- [ ] Displays description
- [ ] Displays programs list
- [ ] Displays requirements with exam names and scores
- [ ] Shows loading state during fetch
- [ ] Shows error state if fetch fails
- [ ] Back button works

**Expected Behavior**:
1. Page mounts with ID from URL
2. Shows loading spinner
3. Fetches `/api/universities/{id}`
4. Displays all details
5. Shows programs and requirements

---

## Integration Testing

### Test 1: Filter Flow

**Steps**:
1. Open http://localhost:3000/universities
2. Wait for universities to load
3. Select country filter
4. Click "Apply"
5. Verify results filtered

**Expected**:
- [ ] Universities list updates
- [ ] Only selected country shown
- [ ] Total count updates

---

### Test 2: Detail Page Flow

**Steps**:
1. Open http://localhost:3000/universities
2. Click on a university
3. Wait for details to load
4. Verify all information displayed

**Expected**:
- [ ] Detail page loads
- [ ] All fields displayed
- [ ] Programs shown
- [ ] Requirements shown

---

### Test 3: Error Handling

**Steps**:
1. Stop backend
2. Open http://localhost:3000/universities
3. Verify error message shown
4. Click retry button
5. Start backend
6. Verify data loads

**Expected**:
- [ ] Error message displayed
- [ ] Retry button shown
- [ ] Data loads after retry

---

### Test 4: Loading States

**Steps**:
1. Open http://localhost:3000/universities
2. Observe loading spinner
3. Wait for data to load
4. Verify spinner disappears

**Expected**:
- [ ] Spinner shown during load
- [ ] Spinner disappears when done
- [ ] Data displayed

---

## Data Validation

### University Data

**Check**:
- [ ] All universities have `id`
- [ ] All universities have `name`
- [ ] All universities have `country_id`
- [ ] All universities have `country` object
- [ ] All universities have `description`
- [ ] All universities have `programs` array
- [ ] All universities have `requirements` array

### Program Data

**Check**:
- [ ] All programs have `id`
- [ ] All programs have `name`
- [ ] Programs displayed correctly in UI

### Exam Data

**Check**:
- [ ] All exams have `id`
- [ ] All exams have `name`
- [ ] Exams displayed correctly in filters

### Requirement Data

**Check**:
- [ ] All requirements have `id`
- [ ] All requirements have `exam_id`
- [ ] All requirements have `exam` object
- [ ] All requirements have `min_score`
- [ ] Requirements displayed correctly in UI

---

## Performance Testing

### Load Time

**Test**:
1. Open http://localhost:3000/universities
2. Measure time to display results

**Expected**: < 2 seconds

### Filter Response

**Test**:
1. Apply filter
2. Measure time to update results

**Expected**: < 500ms

### Detail Page Load

**Test**:
1. Click on university
2. Measure time to display details

**Expected**: < 1 second

---

## Browser Compatibility

**Test on**:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Expected**: All features work on all browsers

---

## Mobile Testing

**Test on**:
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] Tablet (iPad)

**Expected**: Responsive design works

---

## Accessibility Testing

**Test**:
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast sufficient
- [ ] Form labels present

**Expected**: All accessibility standards met

---

## Security Testing

**Test**:
- [ ] No sensitive data in console
- [ ] No API keys exposed
- [ ] HTTPS ready
- [ ] Input validation works

**Expected**: No security issues

---

## Regression Testing

**Test**:
- [ ] Home page still works
- [ ] Chat page still works
- [ ] Navigation still works
- [ ] Styling still correct

**Expected**: No regressions

---

## Test Report Template

```markdown
# QA Test Report - [Date]

## Summary
- Total Tests: X
- Passed: X
- Failed: X
- Skipped: X

## API Endpoints
- [ ] GET /api/health - PASS/FAIL
- [ ] GET /api/meta - PASS/FAIL
- [ ] GET /api/universities - PASS/FAIL
- [ ] GET /api/universities/{id} - PASS/FAIL

## Components
- [ ] UniversityFilters - PASS/FAIL
- [ ] UniversityCard - PASS/FAIL

## Pages
- [ ] Universities List - PASS/FAIL
- [ ] University Detail - PASS/FAIL

## Integration
- [ ] Filter Flow - PASS/FAIL
- [ ] Detail Page Flow - PASS/FAIL
- [ ] Error Handling - PASS/FAIL
- [ ] Loading States - PASS/FAIL

## Issues Found
1. [Issue 1]
2. [Issue 2]

## Recommendations
1. [Recommendation 1]
2. [Recommendation 2]

## Sign-Off
- Tester: [Name]
- Date: [Date]
- Status: APPROVED/REJECTED
```

---

## Checklist for QA Agent

- [ ] Read AGENTS.md
- [ ] Read FRONTEND_INTEGRATION.md
- [ ] Start backend
- [ ] Start frontend
- [ ] Test all 4 endpoints
- [ ] Test all components
- [ ] Test all pages
- [ ] Test integration flows
- [ ] Test error handling
- [ ] Test loading states
- [ ] Test data validation
- [ ] Test performance
- [ ] Test browser compatibility
- [ ] Test mobile
- [ ] Test accessibility
- [ ] Test security
- [ ] Test regression
- [ ] Generate QA report
- [ ] Save report in `qa-reports/`
- [ ] Update AGENTS.md with findings

---

## Resources

- **AGENTS.md** - Project specification
- **FRONTEND_INTEGRATION.md** - Integration details
- **RUN_LOCALLY.md** - Setup instructions
- **QUICK_START.md** - Quick start guide
- **qa-reports/** - Previous QA reports

---

## Support

For questions or issues:
1. Check AGENTS.md
2. Check FRONTEND_INTEGRATION.md
3. Review backend logs
4. Check browser console
5. Verify environment variables

---

**QA Guide Version**: 1.0  
**Last Updated**: 2024-12-18  
**Status**: READY FOR TESTING
