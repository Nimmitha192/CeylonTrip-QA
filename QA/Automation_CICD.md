# 3.6 Test Automation and CI/CD

## Local API testing

I ran the Destinations, Categories, and Admin folder in Postman using
the CeylonTrip QA – Local environment. Of 35 assertions, 32 passed and
3 failed. At the test-case level, 3 cases passed and 2 failed.

## Newman automation

I added Newman as a development dependency and configured `npm run test:api`
in the Server folder to run the team's Postman collection. The local run
executed 76 requests and 122 assertions in 35.6 seconds. Of those
assertions, 116 passed and 6 failed.

## GitHub Actions

The workflow and CI run evidence are pending. The full workflow depends
on the Jest and Cucumber BDD setup being merged into develop.
GitHub Actions ran the Newman API tests for commit 991c069. Dependencies installed and the QA database seed step completed. The Newman step failed and exited with code 1. The CI log showed a JSON parsing failure in TC-DST-03a, an unexpected HTTP 500 in TC-CAT-01c, and a review count mismatch in TC-REV-05.
