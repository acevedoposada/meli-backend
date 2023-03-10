import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

export const apiServer = axios.create({
  baseURL: process.env.API_URL,
});
