const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const AmoCRM = require("amocrm-js");
const uuid = require("uuid");
require("dotenv").config();
const http = require("http");

const form_id = uuid.v4();

const crm = new AmoCRM({
  // логин пользователя в портале, где адрес портала domain.amocrm.ru
  domain: process.env.CRM_DOMAIN, // может быть указан полный домен вида domain.amocrm.ru, domain.amocrm.com
  /* 
      Информация об интеграции (подробности подключения 
      описаны на https://www.amocrm.ru/developers/content/oauth/step-by-step)
    */
  auth: {
    client_id: process.env.CLIENT_ID, // ID интеграции
    client_secret: process.env.CLIENT_SECRET, // Секретный ключ
    redirect_uri: process.env.REDIRECT_URI, // Ссылка для перенаправления
    code: process.env.CRM_SECRET_CODE, // Код авторизации
  },
});

crm
  .connect()
  .then(() => {
    console.log(`Вход в портал осуществлён`);
  })
  .catch((e) => {
    console.log("Ошибка входа", e);
  });

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("I am working");
});

app.post("/send", (req, res) => {
  var name = req.body.name;
  var tel = req.body.tel;
  const response = crm.request
    .post("/api/v4/leads", [
      {
        name: `${name}: ${tel}`,
      },
    ])
    .then((data) => {
      console.log(data.data);
      res.status(200).send("ok");
    })
    .catch((e) => {
      console.log(e);
      res.status(400).send("error");
    });
});

app.listen(process.env.PORT, () => {
  console.log(`app running on port ${process.env.PORT}`);
});
