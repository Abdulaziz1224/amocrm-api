const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const AmoCRM = require("amocrm-js");
const uuid = require("uuid");
require("dotenv").config();
const http = require("http");

setInterval(() => {
  http.get("https://speachcourse.herokuapp.com/");
}, 300000);

const form_id = uuid.v4();

const crm = new AmoCRM({
  // логин пользователя в портале, где адрес портала domain.amocrm.ru
  domain: "abdukarimmirzayev.amocrm.ru", // может быть указан полный домен вида domain.amocrm.ru, domain.amocrm.com
  /* 
      Информация об интеграции (подробности подключения 
      описаны на https://www.amocrm.ru/developers/content/oauth/step-by-step)
    */
  auth: {
    client_id: "601050b7-4746-4873-a4d6-d5ccedeaf052", // ID интеграции
    client_secret:
      "bLrA5DmXNOhLlMHsidbkkwfZ14Siam5VLiG7sKXavKhOqBt1gXkfgYlM9AdFRkjV", // Секретный ключ
    redirect_uri: "https://speachcourse.herokuapp.com/", // Ссылка для перенаправления
    code: "def502008ba30838e016d223d64266e5279614e78e8c750b030adb7eb9debad17f42223f2ce6ccd4ee7519a37563c31d2a37f3469aaa363e49cc0378e9228695cc922a44e50642ecf940f97d99aa3573d8901984b3708273337ca6e935a3ca919677e75df04e8053e7d4feabe1480d617013505de3eb1d811ed86707cffbe891cd2d9d4b79e046fb3d92ae905af5263e7b26adba0368bd7a529ef34e9d8e7f8ef9774f1926c21765048676d839985cdef6af910cc960a438e56cced05b4e224a80d68de16195e8eb74f604e6746d7d726d41e40b0096e981ac14a6810e786b64e8f9645b60846c2c7e77aba631ab29f2785c858a5a974e827cd50e17b5c266a0ac4241c228512d7ffde32e37dc63636a0775bf45a4c3196f380e310175a0406bb65b0d5bb2ed71dc41e654564a0737ea5af2e0a14cb87e86b56748688f0acba4edc964aa2e16aef60b31620b8c6f852dccc19520a831873da2e3a83e3db05ca720818deb371a5983d7c9bd4f1adb4a6f10d3ca59b5489012ed2f7ebd1300c8b9519c78d159c1d5da6396d5b92017230580b73c989fbc6ad611811fb9c9d3d2a6674bd0192da2405667845a13dfe79252c34eb182ce66d6c37c5137c764a740cf8d926e86005f25539ba428688b73", // Код авторизации
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
