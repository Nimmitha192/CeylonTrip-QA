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
