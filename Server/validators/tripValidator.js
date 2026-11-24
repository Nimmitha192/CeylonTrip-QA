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

  if (!startingLocation || !startingLocation.name) {
    errors.push('Starting location is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Trip planner input validation failed',
      errors,
    });
  }

  next();
};

module.exports = { validateTripGenerate, isValidDuration };
