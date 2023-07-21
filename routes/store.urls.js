module.exports = (app) => {
    const orders = require("../controllers/store.services");
  
    app.post("/store/order", orders.place);
    app.get("/store/order/:id", orders.find);
    app.delete("/store/order/:id", orders.delete);
    app.get("/store/inventory/:status", orders.list);
  };
  