class User {
  static createFrom(userData) {
    let users = new Array();

    if (Array.isArray(userData)) {
      for(let i = 0; i < userData.length; i++) {
        const newUser = new User(userData[i].id, userData[i].name);
        users.push(newUser);
      }
    }
    
    return users;
  }
  constructor(id, name) {
    // TODO: add validation
    this.id = id;
    this.name = name;
  }
}

module.exports = User;