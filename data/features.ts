import {
  BookOpen,
  Briefcase,
  GraduationCap,
  Handshake,
  Monitor,
  Users,
} from "lucide-react";

import type { Feature } from "@/types/feature";

export const features: Feature[] = [
  {
    title: "Quality Education",
    description:
      "Learn through structured academic programs designed to build strong foundations and valuable skills.",
    icon: GraduationCap,
  },
  {
    title: "Career-Focused Learning",
    description:
      "Develop practical and industry-relevant skills that prepare you for future career opportunities.",
    icon: Briefcase,
  },
  {
    title: "Experienced Faculty",
    description:
      "Learn with guidance from dedicated faculty focused on helping students understand and succeed.",
    icon: Users,
  },
  {
    title: "Modern Learning",
    description:
      "Use modern tools and learning resources to make education more engaging, accessible, and effective.",
    icon: Monitor,
  },
  {
    title: "Student Support",
    description:
      "Get academic guidance and support throughout your learning journey at 3vSkool.",
    icon: Handshake,
  },
  {
    title: "Practical Learning",
    description:
      "Strengthen your knowledge through projects, exercises, and hands-on learning experiences.",
    icon: BookOpen,
  },
];
