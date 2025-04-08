// EXPRESS SERVER
import express from "express";
import morgan from "morgan";
import config from "./configs/config";
import { handleError } from "./lib/handleError";
import { pageHtml } from "./lib/page";
import { main } from "./transfer/transfer";
import { unlink } from "fs/promises";

const port = config.PORT;

const app = express();
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms"),
);
app.use(express.json({ limit: "50mb" }));

app.get("/", (_, res) => {
  res.send(pageHtml);
});
app.post("/api/submit", async (req, res) => {
  const body = req.body;
  const { domain, accountId } = body;
  try {
    await main(domain, accountId);
  } catch (error) {
    console.log(error);
    const msg = error instanceof Error ? error.message : String(error);
    res.send({ message: "Ошибка при переносе данных\n" + msg });
  }

  res.send({ message: "Успешно!" });
});
app.post("/api/purge", async (_, res) => {
  try {
    await unlink("domains.json");
    await unlink("targets.json");
  } catch (error) {
    console.log(error);
  }

  res.send({ message: "Кэш сброшен" });
});

app.get("*splat", (_, res) => {
  res.status(404).send("Not found ");
});
app.use(handleError);

app.listen(port, () => {
  console.log(new Date().toLocaleString("ru"));
  console.log(`Transfer server started on http://localhost:${port}`);
});