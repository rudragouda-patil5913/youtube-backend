import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middlewares.js";

const app = express();

//common middlerwares

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" })); // we can extend the limit
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // static files like images css
app.use(cookieParser());

//import routes
import healthCheckRouter from "./routes/healthcheck.routes.js";
import userRouter from "./routes/user.routes.js";

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/users", userRouter);

app.use("*", (req, res) => {
  res.json({
    msg: "Something went Wrong",
  });
});

app.use(errorHandler);
export { app };
