# CeylonTrip Planner – Test Cases

**Module:** EC4206 – Software Testing and Quality Assurance  
**Environment:** Windows 11, Node.js v24, test MongoDB with seed data, Postman, base URL `http://localhost:5000`  
**Test accounts:** seeded admin and user accounts in `Server/seed/seeder.js`

> The Excel version (`Test_Cases.xlsx`) is used to record **Actual Result** and **Status** during execution.  
> Each test case has sub-checks a), b), c) … If any sub-check fails, the whole test case is marked **Fail**. Do not mark a case Pass without observing the result.

## Summary

| Module | Test cases |
|---|---|
| Auth | 5 |
| Destinations | 3 |
| Categories | 1 |
| Reviews | 5 |
| Trips | 4 |
| Users | 1 |
| Admin | 1 |
| **Total** | **20** |

**Execution split:**

| Member | Test cases |
|---|---|
| Malsha Nethnuwan | TC-AUTH-01, TC-AUTH-02, TC-AUTH-03, TC-AUTH-04, TC-AUTH-05 |
| Nimmitha Idirimana | TC-TRIP-01, TC-TRIP-02, TC-TRIP-03, TC-TRIP-04, TC-USR-01 |
| Oshadi Mindula | TC-DST-01, TC-DST-02, TC-DST-03, TC-CAT-01, TC-ADM-01 |
| Chethiya Kaushal | TC-REV-01, TC-REV-02, TC-REV-03, TC-REV-04, TC-REV-05 |

**By type:** BVA 1, Decision Table 1, EP / BVA 2, EP / Negative 1, Functional 6, Functional / Negative 3, Functional / Security 2, Negative 1, Security 3

## Auth

| ID | Type | Priority | Description | Preconditions | Steps | Test Data | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|---|---|---|
| TC-AUTH-01 | Functional | High | Register with valid data | Email not registered | 1. POST /api/auth/register with valid data | name=Kamal Perera<br>email=<unique>@test.com<br>password=Pass@123 | 201 Created, success=true, token returned, role=user |  | Not Run |
| TC-AUTH-02 | EP / Negative | High | Register with invalid input (EP invalid partitions) | - | POST /api/auth/register with:<br>a) empty name<br>b) email without '@'<br>c) email without domain<br>d) empty email<br>e) already registered email | a) name=""<br>b) kamaltest.com<br>c) kamal@<br>d) email=""<br>e) seeded user email | a–d) 400 with the matching validation error ('Full name is required' / 'A valid email address is required')<br>e) 400 'An account with this email address already exists' |  | Not Run |
| TC-AUTH-03 | BVA | High | Password length boundaries (minimum 6) | Emails not registered | POST /api/auth/register with password length:<br>a) 5<br>b) 6<br>c) 7 | a) 12345<br>b) 123456<br>c) 1234567 | a) 400 'Password must be at least 6 characters long'<br>b) 201<br>c) 201 |  | Not Run |
| TC-AUTH-04 | Decision Table | High | Login rules (decision table R1–R5) | Seeded user account (tourist – see Server/seed/seeder.js) | POST /api/auth/login with:<br>a) R1 invalid email format<br>b) R2 no password<br>c) R3 unknown email<br>d) R4 wrong password<br>e) R5 valid credentials | a) kamal@<br>b) seeded email, no password<br>c) nobody@test.com<br>d) seeded email + wrong123<br>e) seeded email + password | a) 400<br>b) 400 'Password is required'<br>c) 401<br>d) 401 (same message as c)<br>e) 200 + JWT token |  | Not Run |
| TC-AUTH-05 | Security | High | Protected route access without a valid token | - | GET /api/auth/me:<br>a) without Authorization header<br>b) with tampered token | b) Bearer abc.def.ghi | a) 401 'no bearer token provided'<br>b) 401 'token failed or expired' |  | Not Run |

## Destinations

| ID | Type | Priority | Description | Preconditions | Steps | Test Data | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|---|---|---|
| TC-DST-01 | Functional | High | List, search, filter and sort destinations | Database seeded | GET /api/destinations:<br>a) default<br>b) ?search=kandy<br>c) ?province=Central<br>d) ?sortBy=cost_asc | See steps | a) 200, at most 12 items, pagination<br>b) all results relate to 'kandy'<br>c) all province=Central<br>d) cost non-decreasing |  | Not Run |
| TC-DST-02 | Functional / Negative | High | Destination details | Database seeded | a) GET /api/destinations/{slug}<br>b) GET /api/destinations/000000000000000000000000 | a) seeded slug<br>b) unused valid ID | a) 200 with weather data<br>b) 404 'Destination not found' |  | Not Run |
| TC-DST-03 | Functional / Security | High | Admin destination management | Seeded admin account (see Server/seed/seeder.js); Seeded user account (tourist – see Server/seed/seeder.js) | POST /api/destinations:<br>a) as admin, valid body<br>b) as normal user<br>c) as admin, missing fields | Valid / incomplete destination JSON | a) 201, slug generated from name<br>b) 403<br>c) 400 with validation errors |  | Not Run |

## Categories

| ID | Type | Priority | Description | Preconditions | Steps | Test Data | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|---|---|---|
| TC-CAT-01 | Functional / Negative | Medium | Category management | Seeded admin account (see Server/seed/seeder.js) | a) GET /api/categories<br>b) POST /api/categories as admin<br>c) POST the same name again | b) name=Waterfalls <runId> | a) 200, sorted by name<br>b) 201, slug generated<br>c) 400 duplicate value |  | Not Run |

## Reviews

| ID | Type | Priority | Description | Preconditions | Steps | Test Data | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|---|---|---|
| TC-REV-01 | Functional | High | Post a valid review | Fresh test user; destination not reviewed | 1. POST /api/destinations/{id}/reviews<br>2. GET the destination | rating=5<br>comment=Amazing view | 201 Created; destination reviewCount increases by 1 |  | Not Run |
| TC-REV-02 | Negative | High | Post a second review on the same destination | TC-REV-01 executed | 1. POST the same endpoint again | rating=4 | 400 'already submitted a review' |  | Not Run |
| TC-REV-03 | EP / BVA | High | Review input boundaries (rating 1–5, comment ≤ 1000) | Fresh test user | POST /api/destinations/{id}/reviews with:<br>a) rating 0<br>b) rating 1<br>c) rating 6<br>d) no rating<br>e) comment 999 chars<br>f) comment 1000 chars<br>g) comment 1001 chars | Rating 5 (maximum) is covered by TC-REV-01 | a) 400<br>b) 201<br>c) 400<br>d) 400<br>e) 201<br>f) 201<br>g) 400 'cannot exceed 1000 characters' |  | Not Run |
| TC-REV-04 | Security | High | Edit another user's review | Review created by user A | 1. Login as user B<br>2. PUT /api/reviews/{id} | rating=1 | 403 'Not authorized to update this review' |  | Not Run |
| TC-REV-05 | Functional | High | Delete own review and check rating update | Own review exists | 1. DELETE /api/reviews/{id}<br>2. GET the destination | - | 200; destination reviewCount decreases by 1 |  | Not Run |

## Trips

| ID | Type | Priority | Description | Preconditions | Steps | Test Data | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|---|---|---|
| TC-TRIP-01 | Functional | High | Generate a 5-day trip | Database seeded | 1. POST /api/trips/generate | duration=5<br>startingLocation={name:Colombo}<br>budgetTier=Moderate<br>interests=[Culture,Nature] | 200, 4 destinations, 5 itinerary days, total cost > 0 |  | Not Run |
| TC-TRIP-02 | EP / BVA | High | Trip duration and input rules (1–30 days) | Database seeded | POST /api/trips/generate with duration:<br>a) 0<br>b) 1<br>c) 2<br>d) 29<br>e) 30<br>f) 31<br>g) "abc"<br>h) 3 without startingLocation | startingLocation={name:Colombo} unless stated | a) 400<br>b) 200, 1 day<br>c) 200, 2 days<br>d) 200, 29 days<br>e) 200, 30 days<br>f) 400<br>g) 400<br>h) 400 'Starting location is required' |  | Not Run |
| TC-TRIP-03 | Functional | High | Save, view and delete own trip | Fresh test user; TC-TRIP-01 response | a) POST /api/trips with generated trip<br>b) GET /api/trips/{id}<br>c) DELETE /api/trips/{id}, then GET again | Generated trip JSON | a) 201, status=saved, owner=user<br>b) 200<br>c) 200, then 404 |  | Not Run |
| TC-TRIP-04 | Security | High | Access control on trips | Users A and B | a) Save a trip as user A<br>b) GET the trip as user B<br>c) PUT the trip as A with {user: B's id} | Generated trip JSON | a) 201<br>b) 403 'Not authorized to view this trip'<br>c) owner must NOT change |  | Not Run |

## Users

| ID | Type | Priority | Description | Preconditions | Steps | Test Data | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|---|---|---|
| TC-USR-01 | Functional / Negative | Medium | Profile and favorites | Fresh test user | a) PUT /api/users/profile<br>b) POST /api/users/favorites/{destId}<br>c) POST /api/users/favorites/000000000000000000000000 | a) name=Nimal, travelType=Family | a) 200, values updated<br>b) 200, destination in favorites<br>c) 404 |  | Not Run |

## Admin

| ID | Type | Priority | Description | Preconditions | Steps | Test Data | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|---|---|---|
| TC-ADM-01 | Functional / Security | High | Admin functions and protection | Seeded admin account (see Server/seed/seeder.js); Seeded user account (tourist – see Server/seed/seeder.js) | a) GET /api/admin/stats as admin<br>b) GET /api/admin/stats as user<br>c) DELETE /api/admin/users/{own id}<br>d) PUT /api/admin/users/{id}/role | d) role=superuser | a) 200 with summary counts<br>b) 403<br>c) 400 'cannot delete your own'<br>d) 400 'Invalid role specified' |  | Not Run |
