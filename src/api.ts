export class ApiError extends Error {
  status: number;
  errors: Record<string, string>;

  constructor(
    status: number,
    message: string,
    errors: Record<string, string> = {},
  ) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

interface Options {
  method?: string;
  body?: unknown;
  token?: string | null;
}

// Small wrapper around fetch: sends JSON, adds the token, and throws ApiError on failure.
// Paths like /api/... are forwarded to Spring Boot by the proxy in vite.config.ts.
export async function api<T>(
  path: string,
  { method = "GET", body, token }: Options = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(path, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(
      0,
      "No se pudo establecer conexión con el servidor. ¿El backend está en ejecución?",
    );
  }

  const text = await res.text();
  if (!res.ok) {
    let message = `La petición falló (${res.status})`;
    let errors: Record<string, string> = {};
    if (text) {
      try {
        const data = JSON.parse(text) as {
          message?: string;
          errors?: Record<string, string>;
        };
        if (data.message) message = data.message;
        if (data.errors) errors = data.errors;
      } catch {
        message = text; // current backend responds with plain text messages
      }
    }
    throw new ApiError(res.status, message, errors);
  }
  return (text ? JSON.parse(text) : null) as T;
}
