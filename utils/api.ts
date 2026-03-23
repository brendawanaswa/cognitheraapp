const BASE_URL = "http://192.168.1.101:5000/api";

export const api = {
  // Auth
  signup: async (data: any) => {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  login: async (data: any) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Chat
  sendMessage: async (messages: any[], userName: string, token: string) => {
    const res = await fetch(`${BASE_URL}/chat/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ messages, userName }),
    });
    return res.json();
  },

  // Payments
  initializePayment: async (data: any, token: string) => {
    const res = await fetch(`${BASE_URL}/payments/initialize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  initializeMpesa: async (data: any, token: string) => {
    const res = await fetch(`${BASE_URL}/payments/mpesa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Sessions
  bookSession: async (data: any, token: string) => {
    const res = await fetch(`${BASE_URL}/sessions/book`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  getSessions: async (token: string) => {
    const res = await fetch(`${BASE_URL}/sessions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  // Therapist
  therapistSignup: async (data: any) => {
    const res = await fetch(`${BASE_URL}/therapist/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  therapistLogin: async (data: any) => {
    const res = await fetch(`${BASE_URL}/therapist/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};
