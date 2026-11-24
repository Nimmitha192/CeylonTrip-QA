const assert = require('assert');
const { Given, When, Then, setDefaultTimeout } = require('@cucumber/cucumber');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
setDefaultTimeout(20 * 1000);

// ---------- Given ----------
Given('I start my trip from {string}', function (city) {
  this.trip = { startingLocation: { name: city } };
});

Given('my budget tier is {string}', function (tier) {
  this.trip.budgetTier = tier;
});

Given('my interests are {string}', function (interests) {
  this.trip.interests = interests.split(',').map((s) => s.trim());
});

// ---------- When ----------
// Accepts a number (5) or a quoted text value ("abc")
When(/^I request a trip plan for (.+) days$/, async function (days) {
  const quoted = days.match(/^"(.*)"$/);
  this.trip.duration = quoted ? quoted[1] : Number(days);

  const res = await fetch(`${BASE_URL}/api/trips/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(this.trip),
  });
  this.status = res.status;
  this.body = await res.json();
});

// ---------- Then ----------
Then('the response status should be {int}', function (status) {
  assert.strictEqual(this.status, status);
});

Then('the plan should contain {int} destinations', function (count) {
  assert.strictEqual(this.body.data.destinations.length, count);
});

Then('the itinerary should have {int} days', function (count) {
  assert.strictEqual(this.body.data.itinerary.length, count);
});

Then('the estimated total cost should be greater than {int}', function (min) {
  assert.ok(this.body.data.estimatedCost.total > min);
});
