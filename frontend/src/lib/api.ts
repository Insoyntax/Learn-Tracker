import { getClientToken } from "@/lib/auth-helpers";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const api = {
  async fetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    let url = `${BASE_URL}${endpoint}`;

    if (options.params) {
      const searchParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    // Auto-attach the Auth.js JWT as a Bearer token for the Go backend.
    // The token is read from the authjs.session-token cookie.
    const token = getClientToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      let errorMessage = "An error occurred while fetching the data.";
      try {
        const errorData = await response.json();
        // Support new standardized format: {success, error: {code, message, details}}
        if (errorData?.error?.message) {
          errorMessage = errorData.error.message;
        } else if (errorData?.detail) {
          errorMessage =
            typeof errorData.detail === "string"
              ? errorData.detail
              : JSON.stringify(errorData.detail);
        }
      } catch (e) {
        // If it's not JSON, we'll just use the default message
      }
      throw new ApiError(response.status, errorMessage);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    const json = await response.json();
    // Unwrap standardized envelope: {success: true, data: ...}
    if (
      json &&
      typeof json === "object" &&
      "success" in json &&
      "data" in json
    ) {
      return json.data as T;
    }
    return json;
  },

  get<T>(endpoint: string, options?: Omit<FetchOptions, "method">) {
    return this.fetch<T>(endpoint, { ...options, method: "GET" });
  },

  post<T>(
    endpoint: string,
    data?: any,
    options?: Omit<FetchOptions, "method" | "body">,
  ) {
    return this.fetch<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  put<T>(
    endpoint: string,
    data?: any,
    options?: Omit<FetchOptions, "method" | "body">,
  ) {
    return this.fetch<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  patch<T>(
    endpoint: string,
    data?: any,
    options?: Omit<FetchOptions, "method" | "body">,
  ) {
    return this.fetch<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  delete<T>(endpoint: string, options?: Omit<FetchOptions, "method">) {
    return this.fetch<T>(endpoint, { ...options, method: "DELETE" });
  },
};
