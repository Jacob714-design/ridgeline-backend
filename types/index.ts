export type UserRole = 'ADMIN' | 'CONTRACTOR' | 'ADJUSTER';

export type ClaimStatus = 
  | 'NEW'
  | 'IN_PROGRESS'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'DENIED'
  | 'CLOSED';

export type ProjectStatus = 
  | 'DRAFT'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELLED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  claims?: Claim[];
}

export interface Claim {
  id: string;
  clientId: string;
  insuranceCompany: string;
  claimNumber: string;
  status: ClaimStatus;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  client?: Client;
  user?: User;
  projects?: Project[];
  documents?: Document[];
}

export interface Project {
  id: string;
  claimId: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  claim?: Claim;
  user?: User;
  lineItems?: EstimateLineItem[];
  documents?: Document[];
}

export interface EstimateLineItem {
  id: string;
  projectId: string;
  description: string;
  unitPrice: number;
  quantity: number;
  total: number;
  codeRef?: string;
  manufacturerRef?: string;
  approvalProbability?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ManufacturerSpec {
  id: string;
  name: string;
  documentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CodeLookup {
  id: string;
  jurisdiction: string;
  codeText: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  entityType: 'PROJECT' | 'CLAIM' | 'CLIENT';
  entityId: string;
  fileUrl: string;
  downloadUrl?: string;
  ocrData?: any;
  createdAt: string;
  updatedAt: string;
}