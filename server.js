const express = require("express");
const app = express();

app.get("/callback", (req, res) => {
  const query = req.query;
  console.log("Получен callback:", query);

  res.send(`
    <h2>✅ Успешная авторизация Avito</h2>
    <p><b>code:</b> ${query.code || "нет"}</p>
    <p><b>state:</b> ${query.state || "нет"}</p>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
