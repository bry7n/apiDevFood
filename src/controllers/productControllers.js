import { prisma } from "../prisma/client.js";

export const getProducts = async (req, res) => {
  try {
    const listProducts = await prisma.product.findMany();
    res.status(200).json(listProducts);
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
    res
      .status(500)
      .json({ message: "Erro interno do servidor.", error: err.message });
  }
};

export const getProductsByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name || name.trim() === "") {
      return res
        .status(400)
        .json({ message: "O nome do produto para busca deve ser informado." });
    }

    const listProductsName = await prisma.product.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
    });

    if (listProductsName.length === 0) {
      const allProducts = await prisma.product.findMany();
      return res.status(200).json(allProducts);
    }

    res.status(200).json(listProductsName);
  } catch (err) {
    console.error("Erro ao buscar produtos por nome:", err);
    res
      .status(500)
      .json({ message: "Erro interno do servidor, tente novamente." });
  }
};

export const createProducts = async (req, res) => {
  const { name, description, price, stock } = req.body;

  if (!name || !description || price === undefined) {
    return res
      .status(400)
      .json({ message: "Nome, descrição e preço devem ser preenchidos." });
  }
  if (isNaN(parseFloat(price))) {
    return res
      .status(400)
      .json({ message: "O preço deve ser um número válido." });
  }
  if (stock !== undefined && isNaN(parseInt(stock))) {
    return res
      .status(400)
      .json({
        message: "O estoque deve ser um número inteiro válido, se fornecido.",
      });
  }

  try {
    const createProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: stock !== undefined ? parseInt(stock) : 0,
      },
    });
    res.status(201).json(createProduct);
  } catch (err) {
    console.error("Erro ao criar produto:", err);
    res
      .status(500)
      .json({
        message: "Erro interno do servidor ao criar o produto.",
        error: err.message,
      });
  }
};

export const editProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock } = req.body;

  if (!id) {
    return res
      .status(400)
      .json({
        message: "Por favor, forneça o ID do produto na URL para atualização.",
      });
  }

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (price !== undefined) {
    if (isNaN(parseFloat(price))) {
      return res
        .status(400)
        .json({ message: "O preço deve ser um número válido." });
    }
    updateData.price = parseFloat(price);
  }
  if (stock !== undefined) {
    if (isNaN(parseInt(stock))) {
      return res
        .status(400)
        .json({ message: "O estoque deve ser um número inteiro válido." });
    }
    updateData.stock = parseInt(stock);
  }

  if (Object.keys(updateData).length === 0) {
    return res
      .status(400)
      .json({ message: "Nenhum dado válido para atualização fornecido." });
  }

  try {
    const edit = await prisma.product.update({
      where: { id: id },
      data: updateData,
    });
    res.status(200).json(edit);
  } catch (err) {
    console.error("Erro ao editar produto:", err);
    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ message: "Produto não encontrado para atualização." });
    }
    res
      .status(500)
      .json({
        message: "Erro interno do servidor ao editar o produto.",
        error: err.message,
      });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({
        message: "Por favor, forneça o ID do produto na URL para exclusão.",
      });
  }

  try {
    const deletedProduct = await prisma.product.delete({
      where: { id: id },
    });

    res
      .status(200)
      .json({ message: "Produto deletado com sucesso!", deletedProduct });
  } catch (err) {
    console.error("Erro ao deletar produto:", err);
    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ message: "Produto não encontrado para exclusão." });
    }
    if (err.code === "P2003") {
      return res
        .status(409)
        .json({
          message:
            "Não é possível excluir este produto pois ele está associado a uma ou mais vendas.",
        });
    }
    res
      .status(500)
      .json({
        message: "Erro interno do servidor ao deletar o produto.",
        error: err.message,
      });
  }
};
