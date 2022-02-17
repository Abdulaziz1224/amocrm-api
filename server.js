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
      "r5NxL9r8anKFAACkj1ukDfPY7FNswEmdnecSz4sQygWRWCKz0UdDUkh1OpzvW0gM", // Секретный ключ
    redirect_uri: "https://speachcourse.herokuapp.com/", // Ссылка для перенаправления
    code: "def5020031cf40dd8d548dceeacd32efd56b53c2b76e2d37de44f3affc0dd778648087d57b83716768c06c873d2cfcf3dbf4221f56d90b8e17d8790dbcda24097b0156b4b5700f99532abee4e29f4f13f9c431366ef611e2540de97a300eefffbf9fba38ffd55f0bbed20281c3c0c7ddd376016d3a74a9e44abb118f2de52d34b050f9f0132e46597a556056d68f3df440f081bd33e5a68ed7a4828b7ca88e96d153db5386a6335f332cc1487eadb5203cc98919a5bdf1bdfbb186115ea8a8de6052effe5c35dec79186446ffd0bfe80692ec3dcefd3fde3f42e27b17ba43ae94544fba8650a43542bcf664b8b2c48fd9285d2b2b151e92e2713b1f90da8622de9ee1b670bf681beb2dff93001a1eaa4058db242adad973a4356cf98f6673a05b0c2c62b7e1c0a2c91d6aaa39b5c2f95fd74c60ded23d36ca355342cabcea5e2fecad279954e8afb64437050cea63318aff5f0a6486c13f5330d2179238cd81333118a39973a362ddc94fa9358b43f3e383d10efc28801b35caaa37e416639e8c4fba85f1453a355239a7173588f4fad0682cbd3de84fd0af2620c1d3c1de0722c614a389b210efd47329a02e771d86866591c2d5a6de9e519b41e2338a60952a190db888a6d7c90423725872024", // Код авторизации
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
  console.log("app running on port 3000");
});
