import express from "express";
import morgan from "morgan";
import cookies from "cookie-parser";
import routerAuth from "./router/auth.routes.js";
import postRouter from "./router/post.routes.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const adminDistPath = path.join(__dirname, "../../admin/dist");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookies());
app.use(morgan("dev"));
app.use("/api/auth", routerAuth);
app.use("/api/post", postRouter);

app.use(express.static(adminDistPath));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(adminDistPath, "index.html"));
});

export default app;
