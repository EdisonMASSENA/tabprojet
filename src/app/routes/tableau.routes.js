module.exports = app => {
    const tableau = require("../controllers/tableau.controller.js");
  
    app.post("/tableau", tableau.create);
  
    app.get("/tableau", tableau.findAll);
  
    app.put("/tableau/:id", tableau.update);
  
    app.delete("/tableau/:id", tableau.delete);
  };