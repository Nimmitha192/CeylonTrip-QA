# CeylonTrip Planner – Black-Box Testing (Section 3.3)

Black-box test design for the CeylonTrip REST API. Every row is linked to a test case sub-check in `Test_Cases.xlsx` / `Test_Cases.md` (e.g. `TC-TRIP-02a` = sub-check a of TC-TRIP-02).

## 1. Equivalence Partitioning

Inputs are divided into classes that the system should treat the same way; one representative value is tested per class.

### EP-1: Register – email

| Partition | Class | Description | Test value | Expected | Test case |
|---|---|---|---|---|---|
| EP1-V1 | Valid | Correct email format | kamal@test.com | Accepted (201) | TC-AUTH-01 |
| EP1-I1 | Invalid | Missing '@' | kamaltest.com | Rejected (400) | TC-AUTH-02b |
| EP1-I2 | Invalid | Missing domain | kamal@ | Rejected (400) | TC-AUTH-02c |
| EP1-I3 | Invalid | Empty value | "" | Rejected (400) | TC-AUTH-02d |

### EP-2: Trip generation – duration (days)

| Partition | Class | Description | Test value | Expected | Test case |
|---|---|---|---|---|---|
| EP2-V1 | Valid | 1 to 30 | 5 | Itinerary generated (200) | TC-TRIP-01 |
| EP2-I1 | Invalid | Less than 1 | 0 | Rejected (400) | TC-TRIP-02a |
| EP2-I2 | Invalid | Greater than 30 | 31 | Rejected (400) | TC-TRIP-02f |
| EP2-I3 | Invalid | Not a number | "abc" | Rejected (400) | TC-TRIP-02g |

### EP-3: Review – rating

| Partition | Class | Description | Test value | Expected | Test case |
|---|---|---|---|---|---|
| EP3-V1 | Valid | 1 to 5 | 5 | Review posted (201) | TC-REV-01 |
| EP3-I1 | Invalid | Less than 1 | 0 | Rejected (400) | TC-REV-03a |
| EP3-I2 | Invalid | Greater than 5 | 6 | Rejected (400) | TC-REV-03c |
| EP3-I3 | Invalid | Missing | (none) | Rejected (400) | TC-REV-03d |

## 2. Boundary Value Analysis

Values are tested at, just below and just above each limit, where errors are most likely.

### Trip duration (1 ≤ d ≤ 30)

| Value | Position | Expected status | Test case |
|---|---|---|---|
| 0 | Min − 1 | 400 | TC-TRIP-02a |
| 1 | Min | 200 | TC-TRIP-02b |
| 2 | Min + 1 | 200 | TC-TRIP-02c |
| 29 | Max − 1 | 200 | TC-TRIP-02d |
| 30 | Max | 200 | TC-TRIP-02e |
| 31 | Max + 1 | 400 | TC-TRIP-02f |

### Password length (≥ 6 characters)

| Value | Position | Expected status | Test case |
|---|---|---|---|
| 5 | Min − 1 | 400 | TC-AUTH-03a |
| 6 | Min | 201 | TC-AUTH-03b |
| 7 | Min + 1 | 201 | TC-AUTH-03c |

### Review rating (1 ≤ r ≤ 5)

| Value | Position | Expected status | Test case |
|---|---|---|---|
| 0 | Min − 1 | 400 | TC-REV-03a |
| 1 | Min | 201 | TC-REV-03b |
| 5 | Max | 201 | TC-REV-01 |
| 6 | Max + 1 | 400 | TC-REV-03c |

### Review comment length (≤ 1000 characters)

| Value | Position | Expected status | Test case |
|---|---|---|---|
| 999 | Max − 1 | 201 | TC-REV-03e |
| 1000 | Max | 201 | TC-REV-03f |
| 1001 | Max + 1 | 400 | TC-REV-03g |

## 3. Decision Table – Login (`POST /api/auth/login`)

Login depends on four conditions. A dash (–) means the condition is not evaluated because an earlier rule already decides the result.

| Condition / Action | R1 | R2 | R3 | R4 | R5 |
|---|---|---|---|---|---|
| C1: Email format is valid | F | T | T | T | T |
| C2: Password is provided | – | F | T | T | T |
| C3: User exists | – | – | F | T | T |
| C4: Password matches | – | – | – | F | T |
| **A1: 400 Validation failed** | X | X |  |  |  |
| **A2: 401 Invalid credentials** |  |  | X | X |  |
| **A3: 200 Login successful + token** |  |  |  |  | X |
| Test case | TC-AUTH-04a | TC-AUTH-04b | TC-AUTH-04c | TC-AUTH-04d | TC-AUTH-04e |

Rules R3 and R4 return the same message, so an attacker cannot tell whether an email is registered.
