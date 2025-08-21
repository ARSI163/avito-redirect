import express from "express";
import fetch from "node-fetch";

const app = express();

const CID  = process.env.AVITO_CLIENT_ID;
const CSEC = process.env.AVITO_CLIENT_SECRET;
const REDI = process.env.AVITO_REDIRECT_URI; // https://avito-redirect.onrender.com/callback

app.get("/callback", async (req, res) => {
  const code = req.query.code || "";
  if (!code) {
    return res
      .status(400)
      .send("Нет параметра code. Авторизуйтесь через ссылку Avito.");
  }

  try {
    const resp = await fetch("https://api.avito.ru/token/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: CID,
        client_secret: CSEC,
        code,
        redirect_uri: REDI, // ДОЛЖЕН совпадать с тем, что в кабинете Avito
      }),
    });

    const data = await resp.json();

    if (data.access_token) {
      // В бою: сохраните в БД/хранилище и НЕ показывайте.
      res.type("text/plain").send(
        [
          "=== OAuth OK ===",
          `access_token: ${data.access_token}`,
          `refresh_token: ${data.refresh_token}`,
          `expires_in: ${data.expires_in} sec`,
        ].join("\n")
      );
    } else {
      res
        .status(400)
        .type("text/plain")
        .send(`Ошибка обмена кода: ${JSON.stringify(data)}`);
    }
  } catch (e) {
    res.status(500).send(`Ошибка запроса: ${e}`);
  }
});

app.get("/", (_req, res) => res.send("OK"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
