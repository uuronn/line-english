import express, { Application, Request, Response } from "express";

const app: Application = express();
const PORT = process.env.PORT_NUMBER || 3000;

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("hello world!");
});

app.get("/sample", (req: Request, res: Response) => {
  res.send("sample");
});

app.listen(PORT, () => {
  console.log(`dev server running at: http://localhost:${PORT}/`);
});
