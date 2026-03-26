import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', 
});

// Endpoints
export const getTickets = (page = 1, limit = 10) => 
  api.get(`/tickets?page=${page}&limit=${limit}`);

export const getTicketById = (id) => 
  api.get(`/tickets/${id}`);

export const getWeeklySummary = (year, week) => 
  api.get(`/payments/summary?year=${year}&week=${week}`);

export const createTicket = (data) => 
  api.post('/tickets', data);