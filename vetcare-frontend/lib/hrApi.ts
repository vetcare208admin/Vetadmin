import { api } from './api';

export const hrApi = {
    getStaff: () => api.get('/hr/staff'),
    getStaffDetails: (id: string) => api.get(`/hr/staff/${id}`),
    addStaff: (data: any) => api.post('/hr/staff', data),
    updateStaff: (id: string, data: any) => api.put(`/hr/staff/${id}`, data),
    getAttendance: (params: any) => api.get('/hr/attendance', { params }),
    getPayslips: () => api.get('/hr/payroll'),
    updateLeaveRequest: (id: string, status: string) => api.put(`/hr/leave/${id}`, { status }),
    getLeaveRequests: () => api.get('/hr/leave')
};
