// API utility functions for admin endpoints
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getAlumniList = async () => {
  return axios.get(`${API_BASE}/admin/alumni`);
};

export const approveAlumni = async (alumniId) => {
  return axios.post(`${API_BASE}/admin/alumni/${alumniId}/approve`);
};

export const blockAlumni = async (alumniId) => {
  return axios.post(`${API_BASE}/admin/alumni/${alumniId}/block`);
};

export const unblockAlumni = async (alumniId) => {
  return axios.post(`${API_BASE}/admin/alumni/${alumniId}/unblock`);
};

export const getEventList = async () => {
  return axios.get(`${API_BASE}/admin/events`);
};

export const approveEvent = async (eventId) => {
  return axios.post(`${API_BASE}/admin/events/${eventId}/approve`);
};

export const rejectEvent = async (eventId) => {
  return axios.post(`${API_BASE}/admin/events/${eventId}/reject`);
};

export const getAdminStats = async () => {
  return axios.get(`${API_BASE}/admin/stats`);
};
