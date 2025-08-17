type Bucket = { count: number; resetAt: number };

const store: Map<string, Bucket> = new Map();

function getKey(ip: string, windowMs: number): string {
  const now = Date.now();
  const bucket = Math.floor(now / windowMs);
  return `${ip}:${windowMs}:${bucket}`;
}

export function rateLimit(ip: string, limit: number, windowMs: number) {
  const key = getKey(ip, windowMs);
  const now = Date.now();
  const resetAt = (Math.floor(now / windowMs) + 1) * windowMs;

  const bucket = store.get(key) || { count: 0, resetAt };
  bucket.count += 1;
  store.set(key, bucket);

  const remaining = Math.max(0, limit - bucket.count);
  const ok = bucket.count <= limit;

  // Best-effort cleanup of expired buckets
  for (const [k, v] of store) {
    if (v.resetAt < now) store.delete(k);
  }

  return { ok, remaining, resetAt } as const;
}


