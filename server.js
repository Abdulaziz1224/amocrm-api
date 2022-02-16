const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const AmoCRM = require("amocrm-js");
const uuid = require("uuid");
require("dotenv").config();
const form_id = uuid.v4();

const crm = new AmoCRM({
  domain: "abdukarimmirzayev.amocrm.ru",
  auth: {
    login: "diyor.amirzayev@gmail.com",
    hash: "AaDqkjYIRAhgX3zuTfz8tCT3aOOuxW2YhRlxxFOTbKwvNudLf7nJk5YyyoAGdYJ5", // API-ключ доступа
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

  const lead = new crm.Lead();
  lead.name = name;
  lead.tel = tel;
  console.log(lead);

  lead.save();

  console.log(lead);

  crm.request
    .post("/api/v4/leads/unsorted/forms", {
      request_id: Date.now(),
      source_name: "node.js heroku",
      source_uid: "ede127c9-9da1-4e71-aeb1-a5c7ae925603",
      _embedded: {
        leads: [
          {
            name: "Client",
            visitor_uid: `${uuid.v4}`,
            price: 0,
            custom_fields_values: [
              {
                field_id: Date.now(),
                values: [
                  {
                    value: "Field",
                  },
                ],
              },
            ],
            _embedded: {
              tags: [
                {
                  name: "order",
                },
              ],
            },
          },
        ],
        contacts: [
          {
            name: name,
            first_name: name,
            last_name: name,
            custom_fields_values: [
              {
                field_code: "PHONE",
                values: [
                  {
                    value: tel,
                  },
                ],
              },
            ],
          },
        ],
        companies: [
          {
            name: "node.js heroku",
          },
        ],
      },
      metadata: {
        ip: "123.222.2.22",
        form_id: form_id,
        form_sent_at: Date.now(),
        form_name: "Application form",
        form_page: "https://example.com",
        referer: "https://www.google.com/search?&q=elon+musk",
      },
    })
    .then((data) => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch((e) => {
      res.status(401).send("Произошла ошибка создания контакта");
    });
});

app.listen(process.env.PORT, () => {
  console.log("app running on port 3000");
});
