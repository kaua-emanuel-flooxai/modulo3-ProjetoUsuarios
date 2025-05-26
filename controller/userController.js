class UserController {
  constructor(formId) {
    this.formEl = document.getElementById(formId);
    this.tableEl = document.getElementById(tableId);

    this.onSubmit();
  }

  onSubmit() {
    this.formEl.addEventListener("submit", (event) => {
      event.preventDefault();

      let values = this.getValues();

      this.getPhoto().then(
        (content) => {
          values.photo = content;

          this.addLine(values);
        },
        (e) => {
          console.error(e);
        }
      );
    });
  }

  getPhoto() {
    return new Promise((revolve, reject) => {
      let fileReader = new fileReader();

      let elements = [...this.formEl.elements].filter((item) => {
        if (item.name === "photo") {
          return item;
        }
      });

      let file = elements[0].files[0];

      fileReader.onload = () => {
        revolve(fileReader.result);
      };

      fileReader.onerror = (e) => {
        reject(e);
      };

      if (file) {
        fileReader.readAsDataURL(file);
      } else {
        revolve();
      }
    });
  }

  getValues() {
    let user = {};

    [...this.formEl.elements].forEach(function (field) {
      if (field.name === "gender") {
        if (field.checked) {
          user["gender"] = field.value;
        }
      } else if (field.type === "admin") {
        user[field.name] = field.checked;
      } else {
        user[field.name] = field.value;
      }
    });

    return new User(
      user.name,
      user.gender,
      user.birth,
      user.country,
      user.email,
      user.password,
      user.photo,
      user.admin
    );
  }

  addLine(dataUser) {
    let tr = document.createElement("tr");

    tr.innerHTML = `
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
    this.appendChild(tr);
  }
}
