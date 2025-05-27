class UserController {
  constructor(formId, tableId) {
    this.formEl = document.getElementById(formId);
    this.tableEl = document.getElementById(tableId);

    if (!this.formEl || !this.tableEl) {
      console.error("Formulário ou tabela não encontrados. Verifique os IDs.");
      return;
    }

    this.onSubmit();
    this.onEditCancel();
  }

  onEditCancel() {
    document
      .querySelector("#box-user-update .btn-cancel")
      .addEventListener("click", (e) => {
        this.showPainelCreate();
      });
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

    [...this.formEl.elements].forEach((field) => {
      if (field.parentElement?.classList.contains("has-error")) {
        field.parentElement.classList.remove("has-error");
      }

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
      } else if (field.name !== "photo") {
        user[field.name] = field.value;
      }
    });

    if (!isValid) return false;

    user.photo = "";

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
        <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
        <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
      </td>
    `;

    tr.querySelector(".btn-edit").addEventListener("click", () => {
      this.showPainelUpdate();

      let json = JSON.parse(tr.dataset.user);
      let form = document.querySelector("#box-user-update");

      for (let name in json) {
        let field = form.querySelector("name" + name.replace("_", "") + "]");

        if (field) {
          if (field.type == "file") continue;

          field.value = json[name];
        }
      }
    });

    this.tableEl.appendChild(tr);
    this.updateAcount();
  }

  showPainelCreate() {
    document.querySelector("#box-user-create").style.display = "block";
    document.querySelector("#box-user-update").style.display = "none";
  }

  showPainelUpdate() {
    document.querySelector("#box-user-create").style.display = "none";
    document.querySelector("#box-user-update").style.display = "block";
  }

  updateAcount() {
    let usersNumber = 0;
    let adminNumber = 0;

    [...this.tableEl.children].forEach((tr) => {
      usersNumber++;

      let user = JSON.parse(tr.dataset.user);

      if (user.admin) adminNumber++;
    });

    document.querySelector("#number-users").innerHTML = usersNumber;
    document.querySelector("#number-users-admins").innerHTML = adminNumber;
  }
}
