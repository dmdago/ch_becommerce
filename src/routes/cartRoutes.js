const express = require("express");
const cartRouter = express.Router();
const Container = require("../contenedores/contenedor");
const oCart = new Container("cart.json", ["timestamp", "products"]);

cartRouter.get("/:id/products", async (req, res) => {
  const { id } = req.params;
  const cart = await oCart.getById(id);

  cart
    ? res.status(200).json(cart.products)
    : res.status(404).json({ error: "Cart not found." });
});

cartRouter.post("/", async (req, res) => {
  const { body } = req;

  body.timestamp = Date.now();

  const newCartId = await oCart.save(body);

  newCartId
    ? res.status(200).json({ success: "Cart Id: " + newCartId })
    : res.status(400).json({ error: "Invalid request." });
});

cartRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deleted = await oCart.deleteById(id);

  deleted
    ? res.status(200).json({ success: "Card deleted." })
    : res.status(404).json({ error: "Cart not found." });
});

cartRouter.post("/:id/products", async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  const product = await oProducts.getById(body["id"]);

  if (product) {
    const cartExist = await oCart.addToCart(id, { products: product });
    cartExist
      ? res.status(200).json({ success: "Product added." })
      : res.status(404).json({ error: "Cart not found." });
  } else {
    res.status(404).json({
      error: "Product not found.",
    });
  }
});

cartRouter.delete("/:id/products/:id_prod", async (req, res) => {
  const { id, id_prod } = req.params;
  const prdExists = await oProducts.getById(id_prod);
  if (prdExists) {
    const cartExists = await oCart.removeFromCart(id, id_prod, "products");
    cartExists
      ? res.status(200).json({ success: "Product deleted." })
      : res.status(404).json({ error: "Cart not found." });
  } else {
    res.status(404).json({ error: "Product not found." });
  }
});

module.exports = cartRouter;
