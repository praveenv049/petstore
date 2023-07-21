module.exports = (app) => {
    const users = require("../controllers/user.services");
  
    app.post("/user",users.create)
    app.get("/user/login", users.login);
    app.get("/user/logout", users.logout);
    app.put("/user/:username",users.update)
    app.get("/user/:username", users.getUser);
    app.delete("/user/:username", users.delete);
    app.post("/user/createWithArray", users.bulkCreate);
  };
  