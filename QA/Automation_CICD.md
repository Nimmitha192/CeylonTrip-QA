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

After integrating the Jest and Cucumber BDD checks, the Jest step passed and all 6 Cucumber scenarios and 23 steps passed. Newman executed 76 requests and 122 assertions, with 117 passed and 5 failed. The overall GitHub Actions job failed because of the Newman assertion failures.

Jest passed, and Cucumber passed all 6 scenarios and 23 steps. Newman executed 76 requests and 122 assertions. Of those assertions, 117 passed and 5 failed across four test cases: TC-TRIP-04c, TC-DST-03a, TC-CAT-01c, and TC-REV-05. The overall CI job failed with exit code 1.

After the backend fixes, the GitHub Actions QA job passed in 40 seconds. Jest, Cucumber BDD, and Newman all passed.
