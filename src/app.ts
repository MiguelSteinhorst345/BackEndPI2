//app.ts é o que faz funcionar

//import profileRoutes from "./routes/profile.routes";


import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import subjectRoutes from "./routes/subject.routes";
import taskRoutes from "./routes/task.routes"
import examRoutes from "./routes/exam.routes";
import goalRoutes from "./routes/goal.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import historyRoutes from "./routes/history.routes";
import rankingRoutes from "./routes/ranking.routes";
import notificationRoutes from "./routes/notification.routes";
import progressRoutes from "./routes/progress.routes";
import productivityRoutes from "./routes/productivity.routes";

const app = express();

app.use(cors());
app.use(express.json());
// faz o express entender o JSON

// esse comando faz tudo que comece com "auth" ir para "auth.routes" (o mesmo vale para as outras requisições)
app.use("/auth",authRoutes);
app.use("/users",userRoutes);
app.use("/subjects",subjectRoutes);
app.use("/tasks",taskRoutes);
app.use("/exams",examRoutes);
app.use("/goals", goalRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/history", historyRoutes);
app.use("/ranking", rankingRoutes);
app.use("/notifications", notificationRoutes);
app.use("/progress", progressRoutes);
app.use("/productivity", productivityRoutes);

// app.use("/profile", profileRoutes);
export default app;
