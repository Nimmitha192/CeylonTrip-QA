/**
 * TDD demo – TC-TRIP-02g
 * Bug: POST /api/trips/generate accepts a non-numeric duration ("abc") and returns 200.
 * Rule: duration must be a whole number of days between 1 and 30.
 */
const { validateTripGenerate } = require('../../validators/tripValidator');

// Calls the Express validator with a fake request/response and records what happened
const runValidator = (body) => {
  const result = { statusCode: null, body: null, nextCalled: false };
  const req = { body };
  const res = {
    status(code) {
      result.statusCode = code;
      return this;
    },
    json(data) {
      result.body = data;
      return this;
    },
  };
  validateTripGenerate(req, res, () => {
    result.nextCalled = true;
  });
  return result;
};

const COLOMBO = { name: 'Colombo' };

describe('TDD: validateTripGenerate() – trip duration rule', () => {
  test('valid duration 5 is accepted', () => {
    const r = runValidator({ duration: 5, startingLocation: COLOMBO });
    expect(r.nextCalled).toBe(true);
    expect(r.statusCode).toBeNull();
  });

  test('duration 0 is rejected with 400', () => {
    const r = runValidator({ duration: 0, startingLocation: COLOMBO });
    expect(r.statusCode).toBe(400);
    expect(r.nextCalled).toBe(false);
  });

  test('duration 31 is rejected with 400', () => {
    const r = runValidator({ duration: 31, startingLocation: COLOMBO });
    expect(r.statusCode).toBe(400);
    expect(r.nextCalled).toBe(false);
  });

  test('non-numeric duration "abc" is rejected with 400 (TC-TRIP-02g)', () => {
    const r = runValidator({ duration: 'abc', startingLocation: COLOMBO });
    expect(r.statusCode).toBe(400);
    expect(r.body.errors).toContain('Trip duration must be between 1 and 30 days');
    expect(r.nextCalled).toBe(false);
  });

  test('decimal duration 2.5 is rejected with 400', () => {
    const r = runValidator({ duration: 2.5, startingLocation: COLOMBO });
    expect(r.statusCode).toBe(400);
    expect(r.nextCalled).toBe(false);
  });
});
