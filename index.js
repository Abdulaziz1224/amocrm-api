const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const uuid = require("uuid");
require("dotenv").config();
const form_id = uuid.v4();

var AmoCRM = require("amocrm-api");
var amo = new AmoCRM("https://abdukarimmirzayev.amocrm.ru");

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

  amo
    .auth({
      USER_LOGIN: "diyor.amirzayev@gmail.com",
      USER_HASH:
        "def502009d6c3391dd41b6afe3698e6e8622d2646ee5940a1af2912ccad8e699708563711097e9c7c94951f362f7e197f5c4748f8fc30cfb494ba197188b11030bebe54d5c3a8a3c4b5982d6a135275284fbf5e986e12a21878b27d01bce6d130bc1797af1895ecc4322344537ecbf89d677b2d1765b7ee84768167cb61c9adb8b4523dbe27e98026d66f1ca307e8bebad6b64cd1b0cfd8e0b56c25498acacc38227ea5b473ed7e444d76b860e6ba24506d2d071f0b71aabb36885605f79efe0eec3fc3b40b3164904d66ed05a381b9b1308284b3da8b536163c0d14f8b4810e9c5ca50b1baae3a39074642a83b6aaa59f307853a28ebc539a8c39dd17419116200dcaade3e13dce511e1ff9477abd54ce84549125f3a3a591d207efcb1e77988244244f03b7287c483bae5d6acf1411c9af381e86b4550604643f290d8106947422d88844dba0212015d7ded0f0ee7ccf1e321585073a3613b31352d93400792a51d13af39d6ea0b409ff48cd62be082d81591934f4c2ab7dc3d8774d073a005b97b45b46a6b554bb517b27685e9264b6b71abdd97d65d0f7f3947887d0a1f33a958e17aff6932c3b3f26b3eba038c78ebf629d28739b22f1f0338ad3ecf410175b326113fb595dbdcada3aec0c",
    })
    .then(function createSomeTasks() {
      amo
        .createContact({
          name: "Вася Пупкин",
          responsible_user_id: 540759,
        })
        .then(function afterContactCreated(res) {
          console.log(res.id); // created contact id
        });
    });
});

app.listen(process.env.PORT, () => {
  console.log("app running on port 3000");
});
