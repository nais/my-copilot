import InMemoryCache from './cache';

describe('InMemoryCache', () => {
  let cache: InMemoryCache;

  beforeEach(() => {
    cache = new InMemoryCache();
  });

  it('should return cached value if not expired', async () => {
    const key = 'testKey';
    const value = 'testValue';
    const ttl = 1000; // 1 second

    const fn = jest.fn().mockResolvedValue(value);

    const result1 = await cache.get(key, fn, ttl);
    expect(result1).toBe(value);
    expect(fn).toHaveBeenCalledTimes(1);

    const result2 = await cache.get(key, fn, ttl);
    expect(result2).toBe(value);
    expect(fn).toHaveBeenCalledTimes(1); // fn should not be called again
  });

  it('should call function again if cache is expired', async () => {
    const key = 'testKey';
    const value = 'testValue';
    const ttl = 100; // 100 milliseconds

    const fn = jest.fn().mockResolvedValue(value);

    const result1 = await cache.get(key, fn, ttl);
    expect(result1).toBe(value);
    expect(fn).toHaveBeenCalledTimes(1);

    // Wait for cache to expire
    await new Promise((resolve) => setTimeout(resolve, ttl + 10));

    const result2 = await cache.get(key, fn, ttl);
    expect(result2).toBe(value);
    expect(fn).toHaveBeenCalledTimes(2); // fn should be called again
  });

  it('should cache different keys separately', async () => {
    const key1 = 'testKey1';
    const value1 = 'testValue1';
    const key2 = 'testKey2';
    const value2 = 'testValue2';
    const ttl = 1000; // 1 second

    const fn1 = jest.fn().mockResolvedValue(value1);
    const fn2 = jest.fn().mockResolvedValue(value2);

    const result1 = await cache.get(key1, fn1, ttl);
    expect(result1).toBe(value1);
    expect(fn1).toHaveBeenCalledTimes(1);

    const result2 = await cache.get(key2, fn2, ttl);
    expect(result2).toBe(value2);
    expect(fn2).toHaveBeenCalledTimes(1);

    // Ensure separate caching
    const result3 = await cache.get(key1, fn1, ttl);
    expect(result3).toBe(value1);
    expect(fn1).toHaveBeenCalledTimes(1);

    const result4 = await cache.get(key2, fn2, ttl);
    expect(result4).toBe(value2);
    expect(fn2).toHaveBeenCalledTimes(1);
  });
});
