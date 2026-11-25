# CeylonTrip Planner – BDD Scenarios (Section 3.5)

**Owner:** Nimmitha Idirimana
**Tool:** Cucumber.js (`@cucumber/cucumber`) with Gherkin feature files
**Module covered:** Trip planner – `POST /api/trips/generate`

---

## 1. Approach

Behaviour-Driven Development describes the system's behaviour in plain language using **Given / When / Then**. The scenarios can be read by non-developers (traveller, lecturer, product owner) and are executed automatically by Cucumber.

| Item | Location |
|---|---|
| Feature files | `Server/features/trip_planning.feature`, `Server/features/trip_duration.feature` |
| Step definitions | `Server/features/step_definitions/trip.steps.js` |
| Run command | `npm run test:bdd` (from `Server/`, with the API server running on `http://localhost:5000`) |

The step definitions send real HTTP requests to the running API using Node.js's built-in `fetch`, so the scenarios test the full stack (route → validator → controller → services → database) without changing `server.js`.

---

## 2. Feature 1 – Personalised Trip Planning

```gherkin
Feature: Personalised trip planning
  As a traveller
  I want to generate an itinerary from my preferences
  So that I can plan my Sri Lanka trip quickly

  Scenario: Generate a 5-day cultural trip from Colombo
    Given I start my trip from "Colombo"
    And my budget tier is "Moderate"
    And my interests are "Culture, Nature"
    When I request a trip plan for 5 days
    Then the response status should be 200
    And the plan should contain 4 destinations
    And the itinerary should have 5 days
    And the estimated total cost should be greater than 0
```

Linked test case: **TC-TRIP-01**

---

## 3. Feature 2 – Trip Duration Validation

```gherkin
Feature: Trip duration validation
  As the trip planner
  I want to accept only 1 to 30 whole days
  So that every generated itinerary is valid

  Scenario Outline: Only 1 to 30 whole days are accepted
    Given I start my trip from "Colombo"
    When I request a trip plan for <days> days
    Then the response status should be <status>

    Examples:
      | days  | status |
      | 0     | 400    |
      | 1     | 200    |
      | 30    | 200    |
      | 31    | 400    |
      | "abc" | 400    |
```

The examples are the **boundary values** (0, 1, 30, 31) and the **invalid equivalence class** ("abc") from the black-box design. Linked test cases: **TC-TRIP-02a, 02b, 02e, 02f, 02g**.

---

## 4. Step Definitions

| Gherkin step | What the code does |
|---|---|
| `Given I start my trip from {string}` | Creates the request body with the starting location |
| `And my budget tier is {string}` | Sets `budgetTier` |
| `And my interests are {string}` | Splits the text into an `interests` array |
| `When I request a trip plan for <n> days` | Sets `duration` (number, or text when quoted) and sends `POST /api/trips/generate` |
| `Then the response status should be {int}` | Checks the HTTP status code |
| `And the plan should contain {int} destinations` | Checks `data.destinations.length` |
| `And the itinerary should have {int} days` | Checks `data.itinerary.length` |
| `And the estimated total cost should be greater than {int}` | Checks `data.estimatedCost.total` |

---

## 5. Execution Result

**Executed by:** Nimmitha Idirimana | **Date:** 2026-11-24 | **Command:** `npm run test:bdd`

```
6 scenarios (6 passed)
23 steps (23 passed)
0m 1.027s
```

| Scenario | Result |
|---|---|
| Generate a 5-day cultural trip from Colombo | ✅ Passed |
| Duration 0 → 400 | ✅ Passed |
| Duration 1 → 200 | ✅ Passed |
| Duration 30 → 200 | ✅ Passed |
| Duration 31 → 400 | ✅ Passed |
| Duration "abc" → 400 | ✅ Passed |

**Note:** the `"abc"` example passes only because of the TDD fix to `tripValidator.js` (see `TDD_Demo.md`). Before the fix the API returned 200 for this input, so this scenario now acts as an automated regression test for that defect.

📸 *Screenshot: `BDD_Results.png`*
