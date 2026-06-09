export enum UserRole {
    CUSTOMER = 'CUSTOMER',
    VET_DOCTOR = 'VET_DOCTOR',
    LAB_TECH = 'LAB_TECH',
    ACCOUNTANT = 'ACCOUNTANT',
    HR_MANAGER = 'HR_MANAGER',
    BRANCH_ADMIN = 'BRANCH_ADMIN',
    SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum AppointmentStatus {
    pending = 'pending',
    confirmed = 'confirmed',
    in_progress = 'in_progress',
    done = 'done',
    cancelled = 'cancelled',
    no_show = 'no_show',
}

export enum InvoiceStatus {
    draft = 'draft',
    sent = 'sent',
    paid = 'paid',
    overdue = 'overdue',
    cancelled = 'cancelled',
}

export enum PaymentMethod {
    stripe = 'stripe',
    cash = 'cash',
    insurance = 'insurance',
    bank_transfer = 'bank_transfer',
}

export enum PaymentStatus {
    pending = 'pending',
    completed = 'completed',
    failed = 'failed',
    refunded = 'refunded',
}

export enum LabOrderStatus {
    pending = 'pending',
    in_progress = 'in_progress',
    completed = 'completed',
    dispatched = 'dispatched',
}

export enum LabResultFlag {
    normal = 'normal',
    low = 'low',
    high = 'high',
    critical = 'critical',
}

export enum LeaveStatus {
    pending = 'pending',
    approved = 'approved',
    rejected = 'rejected',
}

export enum LeaveType {
    annual = 'annual',
    sick = 'sick',
    personal = 'personal',
    unpaid = 'unpaid',
    maternity = 'maternity',
    paternity = 'paternity',
}

export enum ContractType {
    full_time = 'full_time',
    part_time = 'part_time',
    contract = 'contract',
    temporary = 'temporary',
}

export enum InsuranceClaimStatus {
    draft = 'draft',
    submitted = 'submitted',
    approved = 'approved',
    rejected = 'rejected',
    pending_review = 'pending_review',
}

export enum JobPostingStatus {
    draft = 'draft',
    published = 'published',
    closed = 'closed',
}

export enum ApplicantStatus {
    applied = 'applied',
    screening = 'screening',
    interview = 'interview',
    offer = 'offer',
    hired = 'hired',
    rejected = 'rejected',
}

export enum NotificationChannel {
    email = 'email',
    sms = 'sms',
    push = 'push',
    in_app = 'in_app',
}

export enum NotificationType {
    appointment_confirmed = 'appointment_confirmed',
    appointment_reminder = 'appointment_reminder',
    lab_result_ready = 'lab_result_ready',
    invoice_sent = 'invoice_sent',
    payment_received = 'payment_received',
    leave_decision = 'leave_decision',
    payslip_issued = 'payslip_issued',
    cert_expiry_warning = 'cert_expiry_warning',
    system_broadcast = 'system_broadcast',
}
