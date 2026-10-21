const SENSITIVE_HEADERS = ['authorization', 'cookie', 'x-api-key'];

// Returns a copy of the headers that is safe to write to logs.
export function redactHeaders(
  headers: Record<string, string | string[] | undefined>,
): Record<string, string | string[] | undefined> {
  return Object.fromEntries(
    Object.entries(headers).map(([name, value]) => [
      name,
      SENSITIVE_HEADERS.includes(name.toLowerCase()) ? '[REDACTED]' : value,
    ]),
  );
}
