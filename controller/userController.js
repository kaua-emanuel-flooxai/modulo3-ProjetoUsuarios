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

      let btn = this.formEl.querySelector("[type=submit]");

      btn.disabled = true;

      this.getPhoto().then(
        (content) => {
          values.photo = content;

          this.addLine(values);
          this.formEl.reset();
          btn.disabled = false;
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
    let isValed = true;

    [...this.formEl.elements].forEach(function (field) {
      if (
        ["name", "email", "password"].indexOf(field.name) > -1 &&
        !field.value
      ) {
        field.parentElement.classList.add("has-error");
        isValed = false;
      }
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

    if (!isValed) {
      return false;
    }

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
    <td>${Utils.dateFormat(dataUser.register)}</td>
    <td>
      <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
      <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
    </td>
  `;
    this.appendChild(tr);
  }
}
