export interface FinalSubmissionState {
  success: boolean;

  message: string;

  errors: {
    declaration?: string[];
  };
}