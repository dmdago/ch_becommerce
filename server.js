const express = require("express");
const app = express();
const prodsRouter = require("./src/routes/prodRoutes");
const cartRouter = require("./src/routes/cartRoutes");

require("dotenv").config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/products", prodsRouter);
app.use("/api/cart", cartRouter);

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log(`Server listening on port: ${PORT}`);
});
