// API utility functions for feedback and complaints
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const submitFeedback = async (mentor, student, rating, comment) => {
  return axios.post(`${API_BASE}/feedback`, { mentor, student, rating, comment });
};

export const getTopMentors = async () => {
  return axios.get(`${API_BASE}/mentors/top`);
};

export const submitComplaint = async (message) => {
  return axios.post(`${API_BASE}/complaint`, { message });
};

export const getComplaints = async () => {
  return axios.get(`${API_BASE}/complaints`);
};
