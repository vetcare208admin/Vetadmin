import { api } from './api';

export const financeApi = {
    getInvoices: () => api.get('/finance/invoices'),
    getInvoiceDetails: (id: string) => api.get(`/finance/invoices/${id}`),
    createInvoice: (data: any) => api.post('/finance/invoices', data),
    sendInvoice: (id: string) => api.post(`/finance/invoices/${id}/send`),
    getPayments: () => api.get('/finance/payments'),
    getExpenses: () => api.get('/finance/expenses'),
    createExpense: (data: any) => api.post('/finance/expenses', data),
    getRevenueReport: (params: any) => api.get('/finance/reports/revenue', { params }),
    getOverview: (branchId?: string) => api.get('/finance/overview', { params: { branchId } }),
};
