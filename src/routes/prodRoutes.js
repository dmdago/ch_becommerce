const express = require("express");
const prodsRouter = express.Router();
const Container = require("../contenedores/contenedor");
const oProducts = new Container("products.json", [
  "title",
  "description",
  "code",
  "price",
  "stock",
  "thumbnail",
  "timestamp",
]);

function isAdmin(req, res, next) {
  const role = req.header("role");
  if (role == "admin") {
    next();
  } else {
    res.status(401).send({ error: "You do not have rights." });
  }
}

prodsRouter.get("/", async (req, res) => {
  const products = await oProducts.getAll();
  res.status(200).json(products);
});

prodsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const product = await oProducts.getById(id);

  product
    ? res.status(200).json(product)
    : res.status(400).json({ error: "Product not found." });
});

prodsRouter.post("/", isAdmin, async (req, res, next) => {
  const { body } = req;

  body.timestamp = Date.now();

  const newProductId = await oProducts.save(body);

  newProductId
    ? res.status(200).json({ success: "Product Id: " + newProductId })
    : res.status(400).json({ error: "Invalid request." });
});

prodsRouter.put("/:id", isAdmin, async (req, res, next) => {
  console.log(1);
  const { id } = req.params;
  const { body } = req;
  const wasUpdated = await oProducts.updateById(id, body);

  wasUpdated
    ? res.status(200).json({ success: "Product updated." })
    : res.status(404).json({ error: "Product not found" });
});

prodsRouter.delete("/:id", isAdmin, async (req, res, next) => {
  const { id } = req.params;
  const wasDeleted = await oProducts.deleteById(id);

  wasDeleted
    ? res.status(200).json({ success: "Product removed." })
    : res.status(404).json({ error: "Product not found." });
});

module.exports = prodsRouter;
