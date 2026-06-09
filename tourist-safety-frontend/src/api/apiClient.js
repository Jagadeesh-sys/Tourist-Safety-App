import axios from 'axios';
import { handleMockRequest } from './mockHandlers';
import { STORAGE_KEYS } from '../utils/constants';

const useMockApi = import.meta.env.VITE_USE_MOCK_API !== 'false';
const baseURL = useMockApi
    ? '/api'
    : (import.meta.env.VITE_API_URL || 'http://localhost:9090/api');

export const apiClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

if (useMockApi) {
    apiClient.defaults.adapter = async (config) => {
        try {
            const result = await handleMockRequest(config);
            return {
                data: result?.data !== undefined ? result.data : result,
                status: 200,
                statusText: 'OK',
                headers: {},
                config,
            };
        } catch (err) {
            const status = err?.response?.status ?? 500;
            const axiosError = new axios.AxiosError(
                err?.response?.data?.message || 'Request failed',
                axios.AxiosError.ERR_BAD_RESPONSE,
                config,
                null,
                err?.response ? { status, data: err.response.data, headers: {}, config } : undefined,
            );
            return Promise.reject(axiosError);
        }
    };
}

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.email) {
                    config.headers['X-User-Email'] = user.email;
                }
            } catch (e) {
                // Ignore if parsing fails
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);

            if (!window.location.pathname.startsWith('/auth')) {
                window.location.href = '/auth/login';
            }
        }

        return Promise.reject(error);
    }
);