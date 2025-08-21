import express from "express";
import fetch from "node-fetch";

const app = express();

const CID  = process.env.AVITO_CLIENT_ID;
const CSEC = process.env.AVITO_CLIENT_SECRET;
const REDI = process.env.AVITO_REDIRECT_URI;   // должен совпадать с Redirect URL в Avito
const STORE_URL = process.env.TIMEWEB_STORE_URL;
const SHARED_SECRET = process.env.SHARED_SECRET;

app.get("/callback", async (req, res) => {
  const code = req.query.code || "";
  if (!code) return res.status(400).send("Нет параметра code");

  try {
    // 1) Обмен кода на токены
    const tokResp = await fetch("https://api.avito.ru/token/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: CID,
        client_secret: CSEC,
        code,
        redirect_uri: REDI
      })
    });
    const data = await tokResp.json();

    // 2) Отправляем токены на Timeweb
    if (data.access_token && STORE_URL) {
      await fetch(STORE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-AVITO-SECRET": SHARED_SECRET
        },
        body: JSON.stringify({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          expires_in: data.expires_in
        })
      });
    }

    // 3) Короткий ответ в браузере
    if (data.access_token) {
      return res.type("text/plain").send("Токены получены и переданы на Timeweb. Можно закрыть окно.");
    } else {
      return res.status(400).type("text/plain").send("Ошибка обмена кода: " + JSON.stringify(data));
    }
  } catch (e) {
    return res.status(500).type("text/plain").send("Ошибка: " + e);
  }
});

app.get("/", (_req, res) => res.send("OK"));
app.listen(process.env.PORT || 10000);
