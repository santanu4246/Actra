import { Router } from "express";
import { z } from "zod";
import { db } from "../db.ts";
import { hashPassword, verifyPassword, signToken } from "../jwt.ts";
import { requireAuth } from "../middleware/auth.ts";
import type { AuthRequest } from "../types/index.ts";

const router = Router();

const SignupSchema = z.object({
  name: z.string().trim().min(1, "Display name is required"),
  email: z.email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

router.post("/signup", async (req, res) => {
  const result = SignupSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error?.issues[0]?.message ?? "Invalid request" });
    return;
  }

  const { name, email, password } = result.data;
  const normalizedEmail = email.toLowerCase();

  const existing = await db.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    res.status(409).json({ error: "An account with this email already exists" });
    return;
  }

  const passwordHash = await hashPassword(password);
  const user = await db.user.create({
    data: { name, email: normalizedEmail, passwordHash },
  });

  const token = signToken({ userId: user.id, email: user.email });
  res.status(201).json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
});

router.post("/login", async (req, res) => {
  const result = LoginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error?.issues[0]?.message ?? "Invalid request" });
    return;
  }

  const { email, password } = result.data;
  const normalizedEmail = email.toLowerCase();

  const user = await db.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const valid = await verifyPassword(user.passwordHash, password);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = signToken({ userId: user.id, email: user.email });
  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
    onboardingCompleted: !!user.onboardingCompletedAt,
  });
});

router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  const { userId } = req.user;
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      onboardingCompletedAt: true,
    },
  });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({
    user,
    onboardingCompleted: !!user.onboardingCompletedAt,
  });
});

export default router;
