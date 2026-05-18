import express from "express";
import cors from "cors";
import authRouter from "./src/routes/auth.ts";
import onboardingRouter from "./src/routes/onboarding.ts";

const PORT = Number(process.env.PORT) || 3000;

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRouter);
app.use("/onboarding", onboardingRouter);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
