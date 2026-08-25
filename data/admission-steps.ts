import {
  CreditCard,
  FileText,
  Upload,
  UserPlus,
} from "lucide-react";

import type { AdmissionStep } from "@/types/admission-step";

export const admissionSteps: AdmissionStep[] = [
  {
    step: "01",
    title: "Create Account",
    description:
      "Register using your email address and create your student admission account.",
    icon: UserPlus,
  },
  {
    step: "02",
    title: "Fill Application",
    description:
      "Enter your personal, academic, contact, and program information.",
    icon: FileText,
  },
  {
    step: "03",
    title: "Upload Documents",
    description:
      "Upload the required certificates, photograph, identification, and supporting documents.",
    icon: Upload,
  },
  {
    step: "04",
    title: "Pay & Submit",
    description:
      "Pay the application fee securely and submit your completed application.",
    icon: CreditCard,
  },
];