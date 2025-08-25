class ApiService {
  constructor() {}

  async request(endpoint, options = {}) {
    const defaultHeaders = {
      "Content-Type": "application/json",
    };

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {}),
      },
    };

    const response = await fetch(endpoint, config);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} ${error}`);
    }

    return await response.json();
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  }
}

export const apiService = new ApiService();
