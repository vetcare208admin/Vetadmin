import api from './api';

export const adminApi = {
    getBranches: () => api.get('/admin/branches'),
    createBranch: (data: any) => api.post('/admin/branches', data),
    getUsers: (role?: string, branchId?: string) =>
        api.get('/admin/users', { params: { role, branchId } }),
    updateUserRole: (id: string, role: string) =>
        api.put(`/admin/users/${id}/role`, { role }),
    deactivateUser: (id: string) =>
        api.put(`/admin/users/${id}/deactivate`),
    getAuditLogs: (params?: any) =>
        api.get('/admin/audit-logs', { params }),
    getAnalyticsOverview: () =>
        api.get('/admin/analytics/overview'),
    getBranchAnalytics: (id: string) =>
        api.get(`/admin/analytics/branch/${id}`),
    broadcastNotification: (data: any) =>
        api.post('/admin/notifications/broadcast', data),
};
