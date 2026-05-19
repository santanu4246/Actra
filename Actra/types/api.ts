export type User = {
  id: string;
  email: string;
  name: string | null;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type LoginResponse = AuthResponse & {
  onboardingCompleted: boolean;
};

export type MeResponse = {
  user: User & { onboardingCompletedAt: string | null };
  onboardingCompleted: boolean;
};

export type OnboardingTask = {
  title: string;
  source: "generated" | "manual";
};

export type OnboardingPayload = {
  ageRange: string;
  topic: string;
  focus: string;
  difficulty: string;
  dailyMinutes: number;
  frequency: string;
  planStartDate: string;
  planEndDate: string;
  tasks: OnboardingTask[];
};

export type PlanTask = {
  id: string;
  title: string;
  source: string;
};

export type PlanResponse = {
  profile: {
    topic: string;
    ageRange: string;
    focus: string;
    difficulty: string;
    dailyMinutes: number;
    frequency: string;
    planStartDate: string;
    planEndDate: string;
  };
  tasks: PlanTask[];
};
