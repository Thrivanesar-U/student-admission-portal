export interface ApplicationState {
  success: boolean;

  message: string;

  errors: {
    fullName?: string[];
    email?: string[];
    phone?: string[];
    dateOfBirth?: string[];
    gender?: string[];
    address?: string[];
    program?: string[];
  };
}