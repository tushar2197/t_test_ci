import { signToken, requireAuth } from '../middleware/auth.js';

describe('Auth middleware', () => {
  test('should export signToken function', () => {
    expect(typeof signToken).toBe('function');
  });

  test('should export requireAuth function', () => {
    expect(typeof requireAuth).toBe('function');
  });

  test('signToken should create a token', () => {
    const user = { id: 1, email: 'test@example.com', role: 'user' };
    const token = signToken(user);
    
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3); // JWT has 3 parts
  });
});
