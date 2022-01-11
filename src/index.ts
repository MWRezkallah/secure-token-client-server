import express, { Request, Response, Application } from "express";
import { tokenAuth } from "./middleware/tokenAuth";

const app: Application = express();

app.use(express.json());

app.post("/api/test-middleware", tokenAuth, (req: Request, res: Response) => {
  try {
    res.status(200).send({ status: "Success", body: req.body });
  } catch (error: any) {
    res.status(500).send({ status: "Error", message: error.message });
  }
});

app.listen(5050, () => console.log("app is running on localhost:5050"));
