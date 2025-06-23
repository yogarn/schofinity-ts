export function generateTraceId(): string {
  const timestamp = Date.now().toString().slice(-6);
  const randomSuffix = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  const traceId = timestamp + randomSuffix;

  return traceId;
};
