export async function apiRequest(path, { method = "GET", body, headers = {} } = {}) {
    const response = await fetch(path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined
    });
  
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
  
    if (!response.ok) {
      throw new Error(data?.message || `HTTP ${response.status}`);
    }
  
    return data;
  }
  