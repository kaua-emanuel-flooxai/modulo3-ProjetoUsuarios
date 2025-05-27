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
      .addEventListener("click", () => this.showPainelCreate());

    this.formUpdateEl.addEventListener("submit", (event) => {
      event.preventDefault();

      const btn = this.formUpdateEl.querySelector("[type=submit]");
      btn.disabled = true;

      const values = this.getValues(this.formUpdateEl);
      if (!values) {
        console.warn("Formulário de edição inválido");
        btn.disabled = false;
        return;
      }

      const index = this.formUpdateEl.dataset.trIndex;
      if (typeof index === "undefined") {
        console.error("Índice da linha não definido.");
        btn.disabled = false;
        return;
      }

      const tr = this.tableEl.rows[index];
      const userOld = JSON.parse(tr.dataset.user);

      const result = Object.assign({}, userOld, values);
      result.register = new Date();

      this.getPhoto(this.formUpdateEl).then(
        (content) => {
          result._photo = content || userOld._photo;

          tr.dataset.user = JSON.stringify(result);

          tr.innerHTML = `
            <td><img src="${
              result._photo || "dist/img/user1-128x128.jpg"
            }" class="img-circle img-sm" /></td>
            <td>${result.name}</td>
            <td>${result.email}</td>
            <td>${result.admin ? "Sim" : "Não"}</td>
            <td>${new Date(result.register).toLocaleDateString()}</td>
            <td>
              <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
              <button type="button" class="btn btn-danger btn-xs btn-flat btn-delete">Excluir</button>
            </td>
          `;

          this.addEventsTR(tr);
          this.updateAcount();
          this.formUpdateEl.reset();
          this.showPainelCreate();
          btn.disabled = false;
        },
        (e) => {
          console.error("Erro ao carregar a foto:", e);
          btn.disabled = false;
        }
      );
    });
  }

  onSubmit() {
    this.formEl.addEventListener("submit", (event) => {
      event.preventDefault();

      const values = this.getValues(this.formEl);
      if (!values) {
        console.warn("Formulário de criação inválido");
        return;
      }

      const btn = this.formEl.querySelector("[type=submit]");
      btn.disabled = true;

      this.getPhoto(this.formEl).then(
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
      field.parentElement?.classList.remove("has-error");
      if (["checkbox", "radio"].includes(field.type)) field.checked = false;
      if (field.type === "file") field.value = "";
    });
  }

  getPhoto(formEl) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      const file = formEl.querySelector('[name="photo"]')?.files[0];

      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (e) => reject(e);

      file ? fileReader.readAsDataURL(file) : resolve(null);
    });
  }

  getValues(formEl) {
    const user = {};
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
    const tr = document.createElement("tr");
    dataUser._photo = dataUser.photo;
    tr.dataset.user = JSON.stringify(dataUser);

    tr.innerHTML = `
      <td><img src="${
        dataUser.photo || "dist/img/user1-128x128.jpg"
      }" class="img-circle img-sm" /></td>
      <td>${dataUser.name}</td>
      <td>${dataUser.email}</td>
      <td>${dataUser.admin ? "Sim" : "Não"}</td>
      <td>${new Date(dataUser.register).toLocaleDateString()}</td>
      <td>
        <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
        <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat btn-delete">Excluir</button>
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
    tr.querySelector(".btn-delete").addEventListener("click", () => {
      if (confirm("Deseja realmente excluir?")) {
        tr.remove();
      }
    });

    tr.querySelector(".btn-edit").addEventListener("click", () => {
      this.showPainelUpdate();

      const json = JSON.parse(tr.dataset.user);
      this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;

      for (let name in json) {
        const field = this.formUpdateEl.querySelector(`[name="${name}"]`);
        if (!field || field.type === "file") continue;

        switch (field.type) {
          case "radio":
            const radio = this.formUpdateEl.querySelector(
              `[name="${name}"][value="${json[name]}"]`
            );
            if (radio) radio.checked = true;
            break;
          case "checkbox":
            field.checked = json[name];
            break;
          default:
            field.value = json[name];
        }
      }

      const imgEl = this.formUpdateEl.querySelector(".photo");
      if (imgEl && json._photo) imgEl.src = json._photo;
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
      const user = JSON.parse(tr.dataset.user);
      usersNumber++;
      if (user.admin) adminNumber++;
    });

    document.querySelector("#number-users").textContent = usersNumber;
    document.querySelector("#number-users-admins").textContent = adminNumber;
  }
}
