// Onboarding Type Definitions - Aligned with Backend API

// ============================================
// Request Payload Types
// ============================================

export interface StartOnboardingRequest {
  userId: number;
}

export interface SaveProjectRequest {
  title: string;
  description: string;
  category: string;
  deadline: string; // ISO date format
  userId?: number; // For cache invalidation
}

export interface SaveRequirementsRequest {
  notes: string;
  // files handled via FormData
}

export interface SaveMilestonesRequest {
  milestones: MilestoneInput[];
}

export interface MilestoneInput {
  title: string;
  deliverable: string;
  deadline: string; // ISO date format
  amount: number; // Must be number, not string
  status?: string;
}

export interface SaveClientRequest {
  client: ClientInput;
}

export interface ClientInput {
  name: string;
  email: string;
  company?: string; // Optional - send undefined, not empty string
  country: string;
  phone?: string; // Optional
  contactPerson?: string; // Optional
}

export interface ReviewRequest {
  projectId: number;
}

export interface CompleteRequest {
  projectId: number;
  userId: number; // Required!
}

export interface UpdateStepRequest {
  userId: number;
  projectId: number;
  step: number;
}

// ============================================
// Response Data Types
// ============================================

export interface ProjectData {
  id: number;
  title: string;
  description: string;
  category: string;
  deadline: string;
  status: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface FileData {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface RequirementsData {
  id: number;
  projectId: number;
  notes: string;
  files: FileData[];
  createdAt: string;
  updatedAt: string;
}

export interface MilestoneData {
  id: number;
  projectId: number;
  title: string;
  deliverable: string;
  deadline: string;
  amount: string | number;
  status: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClientData {
  id: number;
  projectId: number;
  name: string;
  email: string;
  company?: string;
  country: string;
  phone?: string;
  contactPerson?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressData {
  currentStep: number;
  isCompleted: boolean;
  completedSteps: number[];
  lastUpdated: string;
  projectId: number;
}

// ============================================
// API Response Types
// ============================================

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface StartOnboardingResponse {
  projectId: number | null;
  currentStep: number;
  message: string;
}

export interface SaveProjectResponse {
  project: ProjectData;
  nextStep: number;
}

export interface SaveRequirementsResponse {
  requirements: RequirementsData;
  nextStep: number;
}

export interface SaveMilestonesResponse {
  milestones: MilestoneData[];
  nextStep: number;
}

export interface SaveClientResponse {
  client: ClientData;
  nextStep: number;
}

export interface ReviewResponse {
  project: ProjectData;
  requirements: RequirementsData;
  milestones: MilestoneData[];
  client: ClientData;
  nextStep: number;
}

export interface CompleteResponse {
  message: string;
  project: {
    id: number;
    status: string;
  };
}

export interface UpdateStepResponse {
  message: string;
  currentStep: number;
}

export interface OnboardingDataResponse {
  project: ProjectData;
  requirements: RequirementsData;
  milestones: MilestoneData[];
  client: ClientData;
  progress: {
    currentStep: number;
    isCompleted: boolean;
  };
}

// ============================================
// Frontend State Types
// ============================================

export interface OnboardingFormData {
  project: {
    title: string;
    description: string;
    category: string;
    deadline: string; // YYYY-MM-DD format for input fields
  };
  requirements: {
    notes: string;
    files: File[];
  };
  milestones: {
    title: string;
    deliverable: string;
    deadline: string; // YYYY-MM-DD format for input fields
    amount: string; // String for form input, converted to number before API call
  }[];
  client: {
    name: string;
    email: string;
    company: string;
    country: string;
    phone?: string;
    contactPerson?: string;
  };
}

export const INITIAL_ONBOARDING_DATA: OnboardingFormData = {
  project: {
    title: "",
    description: "",
    category: "",
    deadline: "",
  },
  requirements: {
    notes: "",
    files: [],
  },
  milestones: [],
  client: {
    name: "",
    email: "",
    company: "",
    country: "",
    phone: "",
    contactPerson: "",
  },
};

// ============================================
// Validation Types
// ============================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// ============================================
// Utility Functions
// ============================================

/**
 * Convert YYYY-MM-DD to ISO date string
 */
export function toISODate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString();
}

/**
 * Convert ISO date string to YYYY-MM-DD
 */
export function fromISODate(isoString: string): string {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toISOString().split('T')[0];
}

/**
 * Sanitize client data - remove empty optional fields
 */
export function sanitizeClientData(client: OnboardingFormData['client']): ClientInput {
  return {
    name: client.name.trim(),
    email: client.email.trim(),
    country: client.country.trim(),
    company: client.company?.trim() || undefined,
    phone: client.phone?.trim() || undefined,
    contactPerson: client.contactPerson?.trim() || undefined,
  };
}

/**
 * Convert milestone form data to API format
 */
export function sanitizeMilestoneData(milestones: OnboardingFormData['milestones']): MilestoneInput[] {
  return milestones.map(m => ({
    title: m.title.trim(),
    deliverable: m.deliverable.trim(),
    deadline: toISODate(m.deadline),
    amount: parseFloat(m.amount) || 0,
    status: 'pending',
  }));
}

/**
 * Convert project form data to API format
 */
export function sanitizeProjectData(project: OnboardingFormData['project']): Omit<SaveProjectRequest, 'userId'> {
  return {
    title: project.title.trim(),
    description: project.description.trim(),
    category: project.category,
    deadline: toISODate(project.deadline),
  };
}
