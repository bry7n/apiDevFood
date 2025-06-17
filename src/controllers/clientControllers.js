import { prisma } from "../prisma/client.js";

export const getClients = async (req, res) => {
  const clients = await prisma.user.findMany();
  res.status(200).json(clients);
};

export const createClients = async (req, res) => {
  const { name, age, email, address } = req.body;

  if (!name || !age || !email || !address) {
    res.status(400).json({ message: "All information must be filled in." });
  }

  const client = await prisma.user.create({
    data: {
      name,
      age,
      email,
      address,
    },
  });
  res.status(201).json(client);
};

export const editClient = async (req, res) => {
  const { id } = req.params;
  const { name, age, email, address } = req.body;
  try {
    const editClient = await prisma.user.update({
      where: { id },
      data: { name, age, email, address,}
    });

    res.status(200).json(editClient);
  } catch (err) {
    res.status(404).json({ message: `Client not found.\n ${err}` });
  }
};

export const deleteClient = async (req, res) => {
    const { id } = req.params
  try {
    await prisma.user.delete({
      where: { id },
    });
    res.status(200).json({ message: "Client deleted" });
  } catch (err) {
    res.status(404).json({ message: `Client not found. \n ${err}` });
  }
};



//NA CONTROLLERS VAMOS COLOCAR TODOS OS NOSSOS POST,PUT,GET E DELETE
//LEMBRANDO SEMPRE DE EXPORTAR PARA USAR NO ROUTES