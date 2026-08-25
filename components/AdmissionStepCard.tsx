import type { AdmissionStep } from "@/types/admission-step";

interface AdmissionStepCardProps {
  admissionStep: AdmissionStep;
}

export default function AdmissionStepCard({
  admissionStep,
}: AdmissionStepCardProps) {
  const Icon = admissionStep.icon;

  return (
    <div className="relative rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
          <Icon className="h-6 w-6" />
        </div>

        <span className="text-4xl font-bold text-gray-200">
          {admissionStep.step}
        </span>
      </div>

      <h3 className="mt-6 text-xl font-bold text-gray-900">
        {admissionStep.title}
      </h3>

      <p className="mt-3 leading-7 text-gray-600">
        {admissionStep.description}
      </p>
    </div>
  );
}