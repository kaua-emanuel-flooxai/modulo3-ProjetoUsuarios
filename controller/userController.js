class UserController {
  constructor(formId, formUpdate, tableId) {
    this.formEl = document.getElementById(formId);
    this.formUpdateEl = document.getElementById(formUpdate);
    this.tableEl = document.getElementById(tableId);

    if (!this.formEl || !this.formUpdateEl || !this.tableEl) {
      console.error(
        "Formulário(s) ou tabela não encontrados. Verifique os IDs."
      );
      return;
    }

    this.onSubmit();
    this.onEditCancel();
  }

  onEditCancel() {
    document
      .querySelector("#box-user-update .btn-cancel")
      .addEventListener("click", () => {
        this.showPainelCreate();
      });

    this.formUpdateEl.addEventListener("submit", (event) => {
      event.preventDefault();

      let btn = this.formUpdateEl.querySelector("[type=submit]");
      btn.disabled = true;

      let values = this.getValues(this.formUpdateEl);
      if (!values) {
        console.warn("Formulário de edição inválido");
        btn.disabled = false;
        return;
      }

      let index = this.formUpdateEl.dataset.trIndex;
      if (typeof index === "undefined") {
        console.error("Índice da linha não definido.");
        btn.disabled = false;
        return;
      }

      let tr = this.tableEl.rows[index];

      values.register = new Date();

      tr.dataset.user = JSON.stringify(values);

      tr.innerHTML = `
        <td>
          <img
            src="${values.photo || "dist/img/user1-128x128.jpg"}"
            alt="User Image"
            class="img-circle img-sm"
          />
        </td>
        <td>${values.name || ""}</td>
        <td>${values.email || ""}</td>
        <td>${values.admin ? "Sim" : "Não"}</td>
        <td>${values.register.toLocaleDateString()}</td>
        <td>
          <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
          <button type="button" class="btn btn-danger btn-xs btn-flat btn-delete">Excluir</button>
        </td>
      `;

      this.addEventsTR(tr);
      this.updateAcount();
      this.showPainelCreate();
      btn.disabled = false;
    });
  }

  onSubmit() {
    this.formEl.addEventListener("submit", (event) => {
      event.preventDefault();

      let values = this.getValues(this.formEl);
      if (!values) {
        console.warn("Formulário de criação inválido");
        return;
      }

      let btn = this.formEl.querySelector("[type=submit]");
      btn.disabled = true;

      this.getPhoto().then(
        (content) => {
          values.photo = content || "";
          values.register = new Date();

          this.addLine(values);
          this.resetForm();
          btn.disabled = false;
        },
        (e) => {
          console.error("Erro ao carregar a foto:", e);
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
        resolve(null);
      }
    });
  }

  getValues(formEl) {
    let user = {};
    let isValid = true;

    [...formEl.elements].forEach((field) => {
      if (["name", "email", "password"].includes(field.name) && !field.value) {
        field.parentElement.classList.add("has-error");
        isValid = false;
      }

      if (field.name === "gender" && field.checked) {
        user.gender = field.value;
      } else if (field.name === "admin") {
        user.admin = field.checked;
      } else if (field.name !== "photo" && field.name !== "gender") {
        user[field.name] = field.value;
      }
    });

    return isValid ? user : false;
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
      <td>${dataUser.name || ""}</td>
      <td>${dataUser.email || ""}</td>
      <td>${dataUser.admin ? "Sim" : "Não"}</td>
      <td>${dataUser.register.toLocaleDateString()}</td>
      <td>
        <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
        <button type="button" class="btn btn-danger btn-xs btn-flat btn-delete">Excluir</button>
      </td>
    `;

    this.addEventsTR(tr);

    tr.querySelector(".btn-delete").addEventListener("click", () => {
      tr.remove();
      this.updateAcount();
    });

    this.tableEl.appendChild(tr);
    this.updateAcount();
  }

  addEventsTR(tr) {
    tr.querySelector(".btn-edit").addEventListener("click", () => {
      this.showPainelUpdate();

      let json = JSON.parse(tr.dataset.user);
      let form = this.formUpdateEl;

      form.dataset.trIndex = tr.sectionRowIndex;

      for (let name in json) {
        let field = form.querySelector(`[name="${name}"]`);

        if (field) {
          if (field.type === "file") continue;

          switch (field.type) {
            case "radio":
              let radioField = form.querySelector(
                `[name="${name}"][value="${json[name]}"]`
              );
              if (radioField) radioField.checked = true;
              break;
            case "checkbox":
              field.checked = json[name];
              break;
            default:
              field.value = json[name];
          }
        }
      }
    });
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

    document.querySelector("#number-users").textContent = usersNumber;
    document.querySelector("#number-users-admins").textContent = adminNumber;
  }
}
