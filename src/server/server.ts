import bodyParser from "body-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import { diagnoseSignIn } from "./diagnoseSignIn";
import { getEcomWebConfig } from "./getEcomWebConfig";

const port = 8080;
const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:5173" }));
app.get("/ecom-config", async (req, res) => {
  const ecomUrl = req.query.ecomUrl as string;
  // const input = encodeURIComponent(query);
  const requestContext = await getEcomWebConfig(ecomUrl);
  res.send(requestContext);
});

app.post("/sign-in-diagnose", async (req: Request, res: Response) => {
  const signInUrl = req.body?.signInUrl;
  const email = req.body?.email;
  const pwd = req.body?.pwd;

  if (!signInUrl || !email || !pwd) {
    res.status(400).send("missing inputs");
  }

  const diagnoseResult = await diagnoseSignIn(signInUrl, email, pwd);

  res.send(diagnoseResult);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
