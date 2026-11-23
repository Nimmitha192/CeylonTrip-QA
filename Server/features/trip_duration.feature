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
