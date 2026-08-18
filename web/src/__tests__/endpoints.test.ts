import { login, fetchMe } from '@/lib/endpoints';

describe('API endpoints', () => {
  test('should export login function', () => {
    expect(typeof login).toBe('function');
  });

  test('should export fetchMe function', () => {
    expect(typeof fetchMe).toBe('function');
  });
});
