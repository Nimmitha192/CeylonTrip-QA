# CeylonTrip Planner – TDD Demonstration (Section 3.5)

**Owner:** Nimmitha Idirimana
**Framework:** Jest (JavaScript equivalent of JUnit / PyTest)
**Unit under test:** `validateTripGenerate()` – `Server/validators/tripValidator.js`
**Test file:** `Server/tests/unit/tripValidator.test.js`

---

## 1. The Defect

During API test execution (Postman, 2026-11-24), sub-check **TC-TRIP-02g** failed:

| Request | Expected | Actual |
|---|---|---|
| `POST /api/trips/generate` with `duration: "abc"` | 400 – validation error | **200 OK** – an empty itinerary was generated |

**Cause:** the original validation rule

```js
if (!duration || duration < 1 || duration > 30) {
```

does not reject non-numeric values. For `"abc"`: `!"abc"` is `false`, and `"abc" < 1` / `"abc" > 30` are both `false` (comparison with `NaN`), so the request passes validation. Decimal values such as `2.5` are also accepted.

**Rule to enforce:** duration must be a **whole number of days from 1 to 30**.

---

## 2. Red – Write a Failing Test First

Five unit tests were written before changing any application code. The validator is called with a fake Express `req`/`res`/`next`.

| # | Input | Expected |
|---|---|---|
| 1 | `5` | accepted (`next()` called) |
| 2 | `0` | 400 |
| 3 | `31` | 400 |
| 4 | `"abc"` (TC-TRIP-02g) | 400 + duration error message |
| 5 | `2.5` | 400 |

```js
test('non-numeric duration "abc" is rejected with 400 (TC-TRIP-02g)', () => {
  const r = runValidator({ duration: 'abc', startingLocation: COLOMBO });
  expect(r.statusCode).toBe(400);
  expect(r.body.errors).toContain('Trip duration must be between 1 and 30 days');
  expect(r.nextCalled).toBe(false);
});
```

**Result (`npm test`):**

```
FAIL  tests/unit/tripValidator.test.js
  ● non-numeric duration "abc" is rejected with 400 (TC-TRIP-02g)
    Expected: 400
    Received: null
  ● decimal duration 2.5 is rejected with 400
    Expected: 400
    Received: null

Tests:       2 failed, 12 passed, 14 total
```

The two failing tests prove the defect. The three existing rules (5, 0, 31) already pass.

📸 *Screenshot: `TDD_1_Red.png`*

---

## 3. Green – Make the Tests Pass with the Smallest Change

Only the duration condition was changed:

```diff
-  if (!duration || duration < 1 || duration > 30) {
+  const days = Number(duration);
+  if (!Number.isInteger(days) || days < 1 || days > 30) {
```

| Input | `Number(duration)` | `Number.isInteger` | Result |
|---|---|---|---|
| `"abc"` | `NaN` | false | 400 ✅ |
| `2.5` | 2.5 | false | 400 ✅ |
| `5` | 5 | true, in range | accepted ✅ |
| `0` / `31` | 0 / 31 | true, out of range | 400 ✅ |
| missing | `NaN` | false | 400 ✅ |

**Result (`npm test`):**

```
PASS  tests/unit/tripValidator.test.js
PASS  tests/unit/distanceEfficiency.test.js
Tests:       14 passed, 14 total
```

📸 *Screenshot: `TDD_2_Green.png`*

---

## 4. Refactor – Improve the Code, Keep Tests Green

The rule was moved into a named helper and the limits into constants (removing "magic numbers"):

```js
const MIN_TRIP_DAYS = 1;
const MAX_TRIP_DAYS = 30;

const isValidDuration = (duration) => {
  const days = Number(duration);
  return Number.isInteger(days) && days >= MIN_TRIP_DAYS && days <= MAX_TRIP_DAYS;
};

const validateTripGenerate = (req, res, next) => {
  const { duration, startingLocation } = req.body;
  const errors = [];

  if (!isValidDuration(duration)) {
    errors.push(`Trip duration must be between ${MIN_TRIP_DAYS} and ${MAX_TRIP_DAYS} days`);
  }
  ...
};

module.exports = { validateTripGenerate, isValidDuration };
```

**Benefits:** easier to read, limits changed in one place, `isValidDuration()` can be reused (e.g. when updating a trip), and the error message text is unchanged so no existing test breaks.

**Result (`npm test`):**

```
PASS  tests/unit/tripValidator.test.js
PASS  tests/unit/distanceEfficiency.test.js
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
```

All tests still pass, so the refactor did not change behaviour.

📸 *Screenshot: `TDD_3_Refactor.png`*

---

## 5. Verification Through the API

After restarting the server, Nimmitha's Postman folder (Trips & Users) was re-run on 2026-11-24.

| | Before fix | After fix |
|---|---|---|
| TC-TRIP-02g status code | 200 OK | **400 Bad Request** |
| Postman test "Status code is 400" | FAIL | **PASS** |
| Folder result (39 assertions) | 37 passed, 2 failed | **38 passed, 1 failed** |

Sub-checks 02a–02f and 02h still pass, so the fix did not break any existing rule. The one remaining failure (TC-TRIP-04c, trip owner can be changed) is a separate defect not covered by this fix.

The BDD scenario `| "abc" | 400 |` in `trip_duration.feature` also passes against the running server (Section 3.5 BDD).

📸 *Screenshots: `TC-TRIP-02g_Before_Fix.png`, `TC-TRIP-02g_After_Fix.png`*

This verification also completes the **Fixed → Verified** stages of the defect's lifecycle in GitHub Issues (Section 3.8).

---

## 6. Summary

| Step | Action | Tests |
|---|---|---|
| 🔴 Red | Wrote 5 tests for the duration rule | 2 failed, 12 passed |
| 🟢 Green | Minimal fix with `Number.isInteger` | 14 passed |
| 🔵 Refactor | Constants + `isValidDuration()` helper | 14 passed |
| ✅ Verify | Postman TC-TRIP-02g | 200 FAIL → 400 PASS |

**Lesson:** the test was written from the requirement ("whole number of days, 1–30") before the fix, so the defect is now protected by an automated regression test that runs on every push (Section 3.6 CI pipeline).
