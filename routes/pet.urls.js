module.exports = (app) => {
  const upload = require("../middlewares/uploadImage");
  const pets = require("../controllers/pet.services");

  app.get("/pet", pets.findAll);
  app.post("/pet", pets.create);
  app.get("/pet/:id", pets.findOne);
  app.delete("/pet/:id", pets.delete);
  app.get("/pet/byTag/:tag", pets.findByTag);
  app.get("/pet/byStatus/:status", pets.findByStatus);
  app.put("/pet/:id", upload.single("file"), pets.update);
  app.post("/pet/:id/uploadImage", upload.single("file"), pets.uploadImage);
};
