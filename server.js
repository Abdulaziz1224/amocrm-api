const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const AmoCRM = require("amocrm-js");
const uuid = require("uuid");
require("dotenv").config();
const form_id = uuid.v4();

const crm = new AmoCRM({
  // логин пользователя в портале, где адрес портала domain.amocrm.ru
  domain: "abdukarimmirzayev.amocrm.ru", // может быть указан полный домен вида domain.amocrm.ru, domain.amocrm.com
  /* 
      Информация об интеграции (подробности подключения 
      описаны на https://www.amocrm.ru/developers/content/oauth/step-by-step)
    */
  auth: {
    login: "diyor.amirzayev@gmail.com",
    hash: "413b76f5e55d11ec5f95fdea7701caf0", // API-ключ доступа
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

setTimeout(() => {
  crm
    .connect()
    .then(() => {
      console.log(`Вход в портал осуществлён`);
    })
    .catch((e) => {
      console.log("Ошибка входа", e);
    });
}, 80400);

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
    .post("/api/v4/contacts", [
      {
        name: `${name}: ${tel}`,
      },
    ])
    .then((data) => {
      res.status(200).send("ok");
    })
    .catch((e) => {
      res.status(400).send("error");
    });
});

app.listen(process.env.PORT, () => {
  console.log(`app running on port ${process.env.PORT}`);
});
