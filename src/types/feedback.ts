// Definir tipos para feedback
export interface IFeedback {
  _id: string;
  type: 'improvement' | 'bug' | 'suggestion' | 'question' | 'general_feedback';
  title?: string;
  description?: string;
  rating?: number;
  reason?: string;
  improvements?: string[];
  comments?: string;
  contact?: {
    email?: string;
    phone?: string;
    consent?: boolean;
  };
  user: {
    id?: string;
    email?: string;
    name?: string;
    phone?: string;
  };
  metadata: {
    url?: string;
    userAgent?: string;
    screenSize?: string;
    language?: string;
    trigger?: 'manual' | 'auto' | 'after_action';
    timestamp: Date;
  };
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  status: 'pending' | 'reviewing' | 'in-progress' | 'completed' | 'rejected';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  steps: string;
  expected?: string;
  actual?: string;
}
