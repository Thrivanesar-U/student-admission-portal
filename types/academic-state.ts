export interface AcademicState {
  success: boolean;

  message: string;

  errors: {
    qualificationType?: string[];
    institutionName?: string[];
    boardOrUniversity?: string[];
    yearOfPassing?: string[];
    scoreType?: string[];
    scoreValue?: string[];
  };
}