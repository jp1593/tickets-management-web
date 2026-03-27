import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Endpoints
// Get Tickets Information
export const getTickets = (page = 1, limit = 10) =>
  api.get(`/tickets?page=${page}&limit=${limit}`);

// Get Individual Ticket Information
export const getTicketById = (id) => api.get(`/tickets/${id}`);

// Get PaymentSummary Information
export const getWeeklySummary = (year, week) =>
  api.get(`/payments/summary?year=${year}&week=${week}`);

// Create Ticket
export const createTicket = (data) => api.post("/tickets", data);

// Get Data For Dashboard
export const getDashboardStats = (year, week) => {
  return api.get(`/payments/dashboard-stats`, { params: { year, week } });
};

// Get Information From Bussiness - Catalogs
export const getSuppliers = () => api.get("/suppliers");

export const getLands = () => api.get("/lands");

export const getProducts = () => api.get("/products");
