import type { Feature } from "@/types/feature";

interface FeatureCardProps {
  feature: Feature;
}

export default function FeatureCard({ feature }: FeatureCardProps) {
  const Icon = feature.icon;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="mt-5 text-xl font-bold text-gray-900">
        {feature.title}
      </h3>

      <p className="mt-3 leading-7 text-gray-600">
        {feature.description}
      </p>
    </div>
  );
}