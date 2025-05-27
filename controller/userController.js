class UserController {
  constructor(formId, tableId) {
    this.formEl = document.getElementById(formId);
    this.tableEl = document.getElementById(tableId);

    this.onSubmit();
  }

  onSubmit() {
    this.formEl.addEventListener("submit", (event) => {
      event.preventDefault();

      let values = this.getValues();

      if (!values) return;

      let btn = this.formEl.querySelector("[type=submit]");
      btn.disabled = true;

      this.getPhoto().then(
        (content) => {
          values.photo = content || "";
          this.addLine(values);
          this.resetForm();
          btn.disabled = false;
        },
        (e) => {
          console.error(e);
          btn.disabled = false;
        }
      );
    });
  }

  resetForm() {
    this.formEl.reset();

    // Remove classe de erro
    [...this.formEl.elements].forEach((field) => {
      field.parentElement?.classList.remove("has-error");

      // Resetar campos específicos se necessário
      if (field.type === "checkbox" || field.type === "radio") {
        field.checked = false;
      }

      if (field.type === "file") {
        field.value = "";
      }
    });
  }

  getPhoto() {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();

      let elements = [...this.formEl.elements].filter(
        (item) => item.name === "photo"
      );

      let file = elements[0]?.files[0];

      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (e) => reject(e);

      if (file) {
        fileReader.readAsDataURL(file);
      } else {
        resolve();
      }
    });
  }

  getValues() {
    let user = {};
    let isValid = true;

    [...this.formEl.elements].forEach((field) => {
      if (["name", "email", "password"].includes(field.name) && !field.value) {
        field.parentElement.classList.add("has-error");
        isValid = false;
      }

      if (field.name === "gender" && field.checked) {
        user.gender = field.value;
      } else if (field.name === "admin") {
        user.admin = field.checked;
      } else {
        user[field.name] = field.value;
      }
    });

    if (!isValid) return false;

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

    tr.dataset.user = JSON.stringify(dataUser);

    tr.innerHTML = `
      <td>
        <img
          src="${dataUser.photo || "dist/img/user1-128x128.jpg"}"
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

    this.tableEl.appendChild(tr);

    this.updateAcount();
  }

  updateAcount() {
    let usersNumber = 0;
    let adminNumber = 0;

    [...this.tableEl.children].forEach((tr) => {
      usersNumber++;

      let user = JSON.parse(tr.dataset.user);

      if (user._admin) adminNumber++;
    });

    document.querySelector("#number-users").innerHTML = usersNumber;
    document.querySelector("#number-users-admins").innerHTML = adminNumber;
  }
}
