import { config } from '../config.js';

describe('Config', () => {
  test('should export config object', () => {
    expect(config).toBeDefined();
  });

  test('should have port property', () => {
    expect(config.port).toBeDefined();
    expect(typeof config.port).toBe('number');
  });

  test('should have jwtSecret property', () => {
    expect(config.jwtSecret).toBeDefined();
    expect(typeof config.jwtSecret).toBe('string');
  });

  test('should have jwtExpiresIn property', () => {
    expect(config.jwtExpiresIn).toBeDefined();
    expect(typeof config.jwtExpiresIn).toBe('string');
  });
});
