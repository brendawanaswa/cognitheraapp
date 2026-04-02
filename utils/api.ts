const BASE_URL = "https://theracare-backend-production.up.railway.app/api";

const API_KEY = process.env.API_KEY || process.env.api_key || "";

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
        ...(API_KEY ? { "x-api-key": API_KEY } : {}),
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

  getTherapists: async () => {
    const res = await fetch(`${BASE_URL}/therapists`);
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
