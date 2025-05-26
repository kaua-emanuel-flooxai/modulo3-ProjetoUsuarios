var name = document.querySelector("#exempleInputName");
var gender = document.querySelector("#form-user-create [name=gender]:checked");
var birth = document.querySelector("#exempleInputBirth");
var country = document.querySelector("#exempleInputCountry");
var email = document.querySelector("#exempleInputEmail");
var password = document.querySelector("#exempleInputPassword");
var photo = document.querySelector("#exempleInputFile");
var admin = document.querySelector("#exempleInputAdmin");

var fields = document.querySelectorAll("#form-user-create [name]");
var user = {};

fields.forEach(function (field) {
  if (field.name === "gender") {
    if (field.checked) {
      user["gender"] = field.value;
    }
  } else if (field.type === "checkbox") {
    user[field.name] = field.checked;
  } else {
    user[field.name] = field.value;
  }
});

function addLine(dataUser) {
  document.getElementById("table-users").innerHTML = `
    <td>
      <img
        src="dist/img/user1-128x128.jpg"
        alt="User Image"
        class="img-circle img-sm"
      />
    </td>
    <td>${dataUser.name}</td>
    <td>${dataUser.email}</td>
    <td>${dataUser.admin ? "Sim" : "Não"}</td>
    <td>${dataUser.birth}</td>
    <td>
      <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
      <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
    </td>
  `;
}

document
  .getElementById("form-user-create")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var formData = {};
    fields.forEach(function (field) {
      if (field.name === "gender") {
        if (field.checked) {
          formData["gender"] = field.value;
        }
      } else if (field.type === "checkbox") {
        formData[field.name] = field.checked;
      } else {
        formData[field.name] = field.value;
      }
    });

    var objectUser = new User(
      user.name,
      user.gender,
      user.birth,
      user.country,
      user.email,
      user.password,
      user.photo,
      user.admin
    );

    addLine(objectUser);
  });
