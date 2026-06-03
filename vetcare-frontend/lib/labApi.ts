import { api } from './api';

export const labApi = {
    getOrders: () => api.get('/lab/orders'),
    getOrderDetails: (id: string) => api.get(`/lab/orders/${id}`),
    acceptOrder: (id: string) => api.put(`/lab/orders/${id}/accept`),
    registerSample: (data: any) => api.post('/lab/samples', data),
    enterResults: (data: any) => api.post('/lab/results', data),
    verifyResults: (id: string) => api.put(`/lab/results/${id}/verify`),
    getInventory: () => api.get('/lab/inventory'),
};
