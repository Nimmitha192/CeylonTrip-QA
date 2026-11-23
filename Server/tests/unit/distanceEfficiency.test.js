const {
  calculateDistanceEfficiency,
} = require('../../services/recommendationService');

// Coordinates of real Sri Lankan locations
const COLOMBO = { name: 'Colombo', latitude: 6.9271, longitude: 79.8612 };
const GALLE = { name: 'Galle', latitude: 6.0328, longitude: 80.217 };
const NEGOMBO = { latitude: 7.2083, longitude: 79.8358 };
const KANDY = { latitude: 7.2906, longitude: 80.6337 };
const ELLA = { latitude: 6.8667, longitude: 81.0466 };
const TRINCOMALEE = { latitude: 8.5874, longitude: 81.2152 };
const JAFFNA = { latitude: 9.6615, longitude: 80.0255 };

describe('White-box: calculateDistanceEfficiency() – V(G) = 7', () => {
  describe('D1 – missing location data (condition coverage)', () => {
    test('P1: start location is null → 70', () => {
      expect(calculateDistanceEfficiency(null, KANDY)).toBe(70);
    });
    test('P1a: start location has no latitude → 70', () => {
      expect(calculateDistanceEfficiency({ name: 'Colombo' }, KANDY)).toBe(70);
    });
    test('P1b: destination location is undefined → 70', () => {
      expect(calculateDistanceEfficiency(COLOMBO, undefined)).toBe(70);
    });
  });

  describe('D2–D6 – distance bands', () => {
    test('P2: Colombo → Negombo (31 km, ≤ 60) → 100', () => {
      expect(calculateDistanceEfficiency(COLOMBO, NEGOMBO)).toBe(100);
    });
    test('P3: Colombo → Kandy (94 km, ≤ 120) → 90', () => {
      expect(calculateDistanceEfficiency(COLOMBO, KANDY)).toBe(90);
    });
    test('P4: Colombo → Ella (131 km, ≤ 180) → 80', () => {
      expect(calculateDistanceEfficiency(COLOMBO, ELLA)).toBe(80);
    });
    test('P5: Colombo → Trincomalee (237 km, ≤ 260) → 65', () => {
      expect(calculateDistanceEfficiency(COLOMBO, TRINCOMALEE)).toBe(65);
    });
    test('P6: Colombo → Jaffna (305 km, ≤ 350) → 50', () => {
      expect(calculateDistanceEfficiency(COLOMBO, JAFFNA)).toBe(50);
    });
    test('P7: Galle → Jaffna (404 km, > 350) → 35', () => {
      expect(calculateDistanceEfficiency(GALLE, JAFFNA)).toBe(35);
    });
  });
});
