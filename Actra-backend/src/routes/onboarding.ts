import { Router } from "express";
import { z } from "zod";
import { db } from "../db.ts";
import { requireAuth } from "../middleware/auth.ts";
import type { AuthRequest } from "../types/index.ts";

const router = Router();

const TaskSchema = z.object({
  title: z.string().trim().min(1, "Task title cannot be empty"),
  source: z.enum(["generated", "manual"]),
});

const OnboardingSchema = z.object({
  ageRange: z.string().trim().min(1, "Age range is required"),
  topic: z.string().trim().min(1, "Topic is required"),
  focus: z.enum(["quick_wins", "deep_focus", "mixed"]),
  difficulty: z.enum(["slow", "balanced", "challenge"]),
  dailyMinutes: z.number().int().positive("Daily minutes must be positive"),
  frequency: z.enum(["daily", "three_days", "weekend"]),
  tasks: z.array(TaskSchema).min(1, "At least one task is required"),
});

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const { userId } = req.user;

  const profile = await db.onboardingProfile.findUnique({
    where: { userId },
    include: {
      tasks: { orderBy: { order: "asc" } },
    },
  });

  if (!profile) {
    res.status(404).json({ error: "No plan found" });
    return;
  }

  res.json({
    profile: {
      topic: profile.topic,
      ageRange: profile.ageRange,
      focus: profile.focus,
      difficulty: profile.difficulty,
      dailyMinutes: profile.dailyMinutes,
      frequency: profile.frequency,
    },
    tasks: profile.tasks.map((t) => ({
      id: t.id,
      title: t.title,
      source: t.source,
    })),
  });
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const { userId } = req.user;

  const result = OnboardingSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error?.issues[0]?.message ?? "Invalid request" });
    return;
  }

  const { ageRange, topic, focus, difficulty, dailyMinutes, frequency, tasks } =
    result.data;

  await db.$transaction(async (tx) => {
    const existing = await tx.onboardingProfile.findUnique({
      where: { userId },
    });

    let profile;
    if (existing) {
      await tx.onboardingTask.deleteMany({ where: { profileId: existing.id } });
      profile = await tx.onboardingProfile.update({
        where: { userId },
        data: { ageRange, topic, focus, difficulty, dailyMinutes, frequency },
      });
    } else {
      profile = await tx.onboardingProfile.create({
        data: { userId, ageRange, topic, focus, difficulty, dailyMinutes, frequency },
      });
    }

    await tx.onboardingTask.createMany({
      data: tasks.map((t, i) => ({
        profileId: profile.id,
        title: t.title,
        source: t.source,
        order: i,
      })),
    });

    await tx.user.update({
      where: { id: userId },
      data: { onboardingCompletedAt: new Date() },
    });
  });

  res.status(201).json({ success: true });
});

export default router;
