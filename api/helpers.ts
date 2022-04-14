export function timeoutPromise(timeInMs: number): Promise<null> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(null), timeInMs);
  });
}
