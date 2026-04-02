export async function sanityFetch<T>(value: T): Promise<T> {
  return Promise.resolve(value);
}
