import { api } from './api';

export const vetApi = {
    getTodayAppointments: () => api.get('/vet/appointments/today'),
    updateAppointmentStatus: (id: string, status: string) =>
        api.put(`/vet/appointments/${id}/status`, { status }),
    createMedicalRecord: (data: any) => api.post('/vet/medical-records', data),
    createPrescription: (data: any) => api.post('/vet/prescriptions', data),
    createLabOrder: (data: any) => api.post('/vet/lab-orders', data),
    getSchedule: () => api.get('/vet/schedule'),
    createScheduleBlock: (data: any) => api.post('/vet/schedule/block', data),
    getPatientHistory: (petId: string) => api.get(`/vet/patients/${petId}/history`),
};
