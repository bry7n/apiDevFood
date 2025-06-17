import { prisma } from "../prisma/client.js";

export const getProducts = async (req, res) => {
  try {
    const listProducts = await prisma.product.findMany();
    res.status(200).json(listProducts);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getProductByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const listProduct = await prisma.product.findUnique({
      where: { code: parseInt(code) },
    });
    if (!listProduct) {
      res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json(listProduct);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const createProducts = async (req, res) => {
  const { name, description, price, stock } = req.body;

  if (!name || !description || !price || !stock) {
    res.status(400).json({ message: "All information must be filled in." });
  }

  try {
    const lastProduct = await prisma.product.findFirst({
      orderBy: {
        code: "desc",
      },
      select: {
        code: true,
      },
    });

    let newCode;
    if (lastProduct) {
      newCode = lastProduct.code + 1;
    } else {
      newCode = 1;
    }

    const createProduct = await prisma.product.create({
      data: {
        code: newCode,
        name,
        description,
        price,
        stock: stock !== undefined ? parseInt(stock) : 0,
      },
    });
    res.status(201).json(createProduct);
  } catch (err) {
    if (err.code === "P2002") {
      return res
        .status(409)
        .json({ message: "Error: code conflict. Try again." });
    }
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

export const editProduct = async (req, res) => {
  const { id } = req.params;
  const { code: bodyCode, name, description, price, stock } = req.body;

  let whereCondition = {};

  if (id) {
    whereCondition = { id: id };
  } else if (bodyCode) {
    whereCondition = { code: parseInt(bodyCode) };
  } else {
    return res.status(400).json({
      message: "Please provide an ID or a Code to update the product.",
    });
  }

  try {
    const edit = await prisma.product.update({
      where: { id },
      data: {
        code,
        name,
        description,
        price,
        stock: stock !== undefined ? parseInt(stock) : undefined,
      },
    });
    res.status(200).json(edit);
  } catch (err) {
    if (err === "P2025") {
      res.status(404).json({ message: "Product not found for update." });
    }
    res.status(500).json(err);
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const { code } = req.body;

  let whereCondition = {};

  if (id) {
    whereCondition = { id: id };
  } else if (bodyCode) {
    whereCondition = { code: parseInt(bodyCode) };
  } else {
    return res.status(404).json({
      message: "Please provide an ID or a Code to delete the product.",
    });
  }

  try {
    const deleteProduct = await prisma.product.delete({
      where: whereCondition,
    });

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (err) {
    if (err === "P2025") {
      res.status(404).json({ message: "Product not found for deletion.s" });
    }
    res.status(500).json(err);
  }
};
