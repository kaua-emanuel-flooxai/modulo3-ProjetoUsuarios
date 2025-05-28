class User {
  constructor(name, gender, birth, country, email, password, photo, admin) {
    this._id;
    this._name = name;
    this._gender = gender;
    this._birth = birth;
    this._country = country;
    this._email = email;
    this._password = password;
    this._photo = photo;
    this._admin = admin;
    this._register = new Date();
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }
  get gender() {
    return this._gender;
  }
  get birth() {
    return this._birth;
  }
  get country() {
    return this._country;
  }
  get email() {
    return this._email;
  }
  get password() {
    return this._password;
  }
  get photo() {
    return this._photo;
  }
  get admin() {
    return this._admin;
  }
  get register() {
    return this._register;
  }

  set name(value) {
    this._name = value;
  }
  set gender(value) {
    this._gender = value;
  }
  set birth(value) {
    this._birth = value;
  }
  set country(value) {
    this._country = value;
  }
  set email(value) {
    this._email = value;
  }
  set password(value) {
    this._password = value;
  }
  set photo(value) {
    this._photo = value;
  }
  set admin(value) {
    this._admin = value;
  }
  set register(value) {
    this._register = value;
  }

  loadFromJSON(json) {
    for (let key in json) {
      if (key.startsWith("_")) {
        this[key] = json[key];
      } else {
        this[`_${key}`] = json[key];
      }
    }
  }

  getNewId() {
    if (!window.id) window.id = 0;

    id++;

    return id;
  }

  static getUsersStorege() {
    let users = [];

    if (localStorage.getItem("users")) {
      users = JSON.parse(localStorage.getItem("users"));
    } else {
    }
    return users;
  }

  save() {
    let users = User.getUsersStorege();

    if (this.id > 0) {
      users.map((u) => {
        if (u._id == this.id) {
          Object.assign(u, this);
        }

        return u;
      });
    } else {
      this._id = this.getNewId();

      users.push(this);
    }
    localStorage.setItem("users", JSON.stringify(users));
  }

  remove() {
    let users = User.getUsersStorege();

    users = users.filter((userData) => userData._id !== this._id);

    localStorage.setItem("users", JSON.stringify(users));
  }
}
