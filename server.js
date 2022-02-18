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
    client_id: "601050b7-4746-4873-a4d6-d5ccedeaf052", // ID интеграции
    client_secret:
      "3uhm09G7CTgM3UIGOvm3ML5RfZITx53oIilF6uoxmRTOrolfoB3z0B3K3pUbbx4P", // Секретный ключ
    redirect_uri: "https://speachcourse.herokuapp.com/", // Ссылка для перенаправления
    code: "def502006dd21b6c348f54292388318291ede17f20e752e23e4ec4ba814ffa473ec8fbd4442127aaab4bf5e2d6603ca8fdf48a0285b46a58eaf42e5e6bcfe509ced295ebcd94fae4e9fa99a7a0f66c835002e8d40baa536c82d687432088fa6847fe005d2f6c66455a5ffd018d4033588f20537d7328dd7b90aa3c6de6dde5b4ef5d562792ba484380e82ca27a6031646a3d5ecec81cd2ad53c012097edfe4330d3c4f10ea86e7fc8216bc60679bc76c82f3a7e49fa32f7885c11e66929339478c620fed73aa582cd0cc57c74f1a6acc3642ffe5972e0924fb3654090f8bb9c17defca247156f0cdc253251e48f078499a7ca8111be3e25dc8e40abcabf02bf345ba77a354a8d00832bd092b6ebfc3210536d5defd21ae7d829ac1ff51c836f5b413fba82abaf3830e2e405cde8a06bc03bef615d006a51bbf04eac7c293940647d14153ddfcfa43e0e862a704f4cc940be6215ea44720e68c92208231b2ecb5516fb160aec02cb5d06d78c8a4688fbf142daf952259b0a5ba2b7e0ad81d8b10a3d5f6e0c346965a0cbcace98ff1d0d697fc21628cd09f476f4a1be1fca9d030d30e7eaa906df3d2a7dd638fe86acd2663d7a05ebedc27d9e764d36f1c9d3e7b1af9b845a94dcb96e2822eff7e07", // Код авторизации
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
