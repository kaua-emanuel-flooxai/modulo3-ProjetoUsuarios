var name = document.querySelector("#exempleInputName");
var gender = document.querySelectorAll(
  "#form-user-create [name=gender]:checked"
);
var birth = document.querySelector("#exempleInputName");
var country = document.querySelector("#exempleInputBirth");
var email = document.querySelector("#exempleInputEmail");
var password = document.querySelector("#exempleInputPassword");
var photo = document.querySelector("#exempleInputFile");
var admin = document.querySelector("#exempleInputaAdmin");

var fields = document.querySelectorAll("#form-user-create [name]");
var user = {};

fields.forEach(function (field, name) {
  if (field.name == "gender") {
    if ((field.name = checked)) {
      user[(field, name)] = field.value;
    }
  } else {
    user[(field, name)] = field.value;
  }
});
