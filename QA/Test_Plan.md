# CeylonTrip Planner – Test Plan

**Module:** EC4206 – Software Testing and Quality Assurance
**Software Under Test:** CeylonTrip Planner (Option A – existing group project)
**Version:** 1.0 | **Date:** 2026-11-24

---

## 1. Introduction

CeylonTrip Planner is a full-stack web application for exploring Sri Lankan destinations and generating personalised travel itineraries.

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, Axios |
| Backend | Node.js, Express 5, JWT authentication |
| Database | MongoDB (Mongoose) |
| Size | Backend ≈ 3.3 KLOC, Frontend ≈ 8.2 KLOC |

## 2. Objectives

1. Verify that all REST API endpoints return correct responses, status codes and validation errors.
2. Verify core algorithms (recommendation scoring, route optimisation, budget calculation).
3. Validate the main user flows: register/login, plan and save a trip, review a destination.
4. Assess performance and security (OWASP Top 10).
5. Track defects and measure code quality with SonarQube.

## 3. Scope

**In scope**

| Module | Features |
|---|---|
| Authentication | Register, login, get current user |
| Destinations | List, search, filter, sort, paginate, view details, admin CRUD |
| Categories | List, admin CRUD |
| Reviews | Add, edit, delete, list own reviews, one review per destination |
| Trip Planner | Generate itinerary, save, view, edit, delete own trips |
| User Profile | View/update profile, add/remove favorites |
| Admin | Dashboard stats, manage users, reviews, hotels, activities |

**Out of scope**
- Third-party services (map tiles, images, weather data accuracy)
- Hosting / MongoDB Atlas infrastructure
- Mobile devices and browsers other than Chrome and Edge
- Selenium UI automation and usability testing (SUS) – optional, excluded due to the time limit

## 4. Quality Attributes (ISO/IEC 25010)

| Characteristic | How it is tested |
|---|---|
| Functional suitability | API test cases, unit tests, BDD scenarios |
| Reliability | Invalid input and error-handling tests |
| Performance efficiency | JMeter load test |
| Security | Authorisation tests, OWASP checks |
| Maintainability | SonarQube (code smells, technical debt, coverage) |
| Usability | Out of scope for this cycle (time limit) |

## 5. Verification vs Validation

| Verification (building the product right) | Validation (building the right product) |
|---|---|
| Code review of controllers and validators | Functional API testing against requirements |
| SonarQube static analysis | BDD scenarios from the user's point of view |
| White-box testing and coverage | Postman tests of complete user flows |
| Cyclomatic complexity analysis | Review of generated itineraries against user needs |

## 6. Test Approach

| Assignment section | Technique | Tool |
|---|---|---|
| 3.3 Black-box | Equivalence Partitioning, Boundary Value Analysis, Decision Tables | Postman, Jest |
| 3.4 White-box | Cyclomatic complexity, statement and branch coverage | Jest `--coverage` |
| 3.5 TDD / BDD | Unit tests, Gherkin scenarios | Jest, Cucumber.js |
| 3.6 Automation & CI/CD | API automation, pipeline on push | Postman/Newman, GitHub Actions |
| 3.7 Performance / Security | Load test, OWASP checks | JMeter, Postman |
| 3.8 Defect tracking | Bug logging, RCA, bug lifecycle | GitHub Issues + Projects |
| 3.9 Quality metrics | Coverage, defect density, code smells, debt | SonarQube / SonarCloud |

### 6.1 Black-box test design (summary)

- **Equivalence Partitioning:** register email (valid / invalid format / empty), trip duration (≤0 / 1–30 / >30), review rating (1–5 / <1 / >5).
- **Boundary Value Analysis:** duration 0, 1, 30, 31; password length 5, 6; review comment 1000, 1001 chars; rating 0, 1, 5, 6.
- **Decision table:** login rules (valid email format, password provided, user exists, password matches).

### 6.2 White-box test design (summary)

- **Function:** `calculateDistanceEfficiency()` in `Server/services/recommendationService.js`
- **Cyclomatic complexity:** 6 decision points → V(G) = 6 + 1 = **7**
- **Test paths:** no start location → 70; ≤60 km → 100; ≤120 km → 90; ≤180 km → 80; ≤260 km → 65; ≤350 km → 50; >350 km → 35
- **Target coverage:** 100 % branch coverage for this function; ≥ 80 % statements for `services/` and `validators/`.

### 6.3 BDD scenarios

1. Generate a 5-day trip from Colombo with a Moderate budget.
2. A logged-in user can review a destination only once.

## 7. Test Environment

| Item | Configuration |
|---|---|
| OS | Windows 11 (local), Ubuntu (GitHub Actions) |
| Runtime | Node.js v24, npm 11 |
| Database | Separate test MongoDB / in-memory MongoDB (never the real database) |
| Test data | Seeded destinations and categories; test admin and test user accounts |
| Backend / Frontend URL | `http://localhost:5000` / `http://localhost:5173` |
| Browsers | Google Chrome, Microsoft Edge (latest) |
| Tools | Postman, Newman, Jest, Cucumber.js, JMeter, SonarCloud |

## 8. STLC Phases

| Phase | Activities | Deliverable |
|---|---|---|
| Requirement analysis | Study features, routes, models, validators | Requirement list |
| Test planning | Scope, approach, roles, schedule | This Test Plan |
| Test case design | Write test cases (EP, BVA, decision tables, white-box, BDD) | Test case sheet, `.feature` files |
| Environment setup | Test DB, seed data, tools | Working environment |
| Test execution | Run manual and automated tests, log defects | Results, GitHub Issues |
| Test closure | Metrics, SonarQube report, lessons learned | Test Summary Report |

**Test case format:** ID | Description | Preconditions | Steps | Test Data | Expected Result | Actual Result | Status

## 9. Security Checks (OWASP Top 10)

| OWASP item | Check |
|---|---|
| A01 Broken Access Control | User accessing another user's trip; normal user calling admin endpoints |
| A03 Injection | NoSQL injection on login (`{"$ne": null}`); special characters in search |
| A07 Authentication Failures | Repeated wrong logins (no rate limiting), token expiry |

## 10. Performance Test

| Test | Endpoint | Load | Pass criteria |
|---|---|---|---|
| LT-01 | `GET /api/destinations` | 50 → 100 concurrent users | Avg < 500 ms, error < 1 % |
| LT-02 | `POST /api/trips/generate` | 50 concurrent users | Avg < 1.5 s, error < 1 % |

## 11. Defect Management

- Tool: **GitHub Issues** with a Projects board.
- Lifecycle: **New → Assigned → Fixed → Verified → Closed** (Reopened if re-test fails).
- Labels: `bug`, severity (`critical`, `major`, `minor`), module (`auth`, `trips`, …).
- Root Cause Analysis (5 Whys) for 2 significant bugs.

## 12. Roles and Responsibilities

| Role | Member | Sections | Responsibility |
|---|---|---|---|
| Test Lead & Black-box Tester | Malsha Nethnuwan | 3.1, 3.2, 3.3, 3.10 | Test plan, test case sheet, EP, BVA, decision table, reflection, final report |
| White-box & TDD/BDD Engineer | Nimmitha Idirimana | 3.4, 3.5 | Cyclomatic complexity, coverage, Jest unit tests, Cucumber BDD |
| Automation & CI/CD Engineer | Oshadi Mindula | 3.6 | Postman/Newman API tests, GitHub Actions pipeline, screenshots |
| Performance, Security & Quality Engineer | Chethiya Kaushal | 3.7, 3.8, 3.9 | JMeter, OWASP checks, GitHub Issues, RCA, SonarCloud |

## 13. Schedule

**Deadline:** 2026-11-25

| Member | Day 1 – 2026-11-24 | Day 2 – 2026-11-25 (deadline) |
|---|---|---|
| Malsha Nethnuwan | Finalise test plan, test case sheet, EP / BVA / decision table | Fill test results, reflection, final report |
| Nimmitha Idirimana | Export `app` from `server.js`, Jest setup, white-box unit tests | Coverage report, 2 BDD scenarios |
| Oshadi Mindula | Postman collection, GitHub Actions workflow | Passing pipeline screenshots |
| Chethiya Kaushal | 2 OWASP checks, 1 JMeter load test | Log bugs in GitHub Issues, 1 RCA, SonarCloud scan |

## 14. Entry and Exit Criteria

**Entry:** code builds and runs; test data is seeded; test cases are reviewed.
**Exit:** all planned test cases executed; all critical and major defects fixed and re-tested; CI pipeline passing; coverage targets met.

## 15. Risks

| Risk | Mitigation |
|---|---|
| Tests change real data | Use a separate test database only |
| External services make tests unstable | Mock weather service in automated tests |
| Tight deadline (2 days) | Focus on the minimum required evidence for each section |
| Team member unavailable | Members review each other's work (Malsha ↔ Nimmitha, Oshadi ↔ Chethiya) |

## 16. Deliverables

1. Test Plan (this document)
2. Test case sheet with results
3. Automated test code (Jest, Cucumber, Postman)
4. GitHub Actions pipeline and screenshots
5. JMeter report and OWASP findings
6. GitHub Issues with RCA and bug lifecycle
7. SonarQube metrics report
8. Test Summary Report and Agile/DevOps reflection
