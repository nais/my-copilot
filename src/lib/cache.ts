type CacheEntry<T> = {
  value: T;
  expiry: number;
};

class InMemoryCache {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private cache: Map<string, CacheEntry<any>> = new Map();

  async get<T>(key: string, fn: () => Promise<T>, ttl: number): Promise<T> {
    const now = Date.now();
    const cached = this.cache.get(key);

    if (cached && cached.expiry > now) {
      return cached.value;
    }

    const value = await fn();
    this.cache.set(key, { value, expiry: now + ttl });
    return value;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

export default InMemoryCache;