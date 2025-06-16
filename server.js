import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();

app.use(express.json());

app.get("/clients", async (req, res) => {
  const listClients = await prisma.user.findMany();
  res.status(200).json(listClients);
});

app.post("/clients", async (req, res) => {
  const { name, age, email, address } = req.body;

  if (!name || !age || !email || !address) {
    res.status(500).json({ message: "All information must be filled in." });
  }

  const createClient = await prisma.user.create({
    data: {
      name,
      age,
      email,
      address,
    },
  });
  res.status(200).json(createClient);
});

app.put("/clients/:id", async (req, res) => {
  try {
    const editClient = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        name: req.body.name,
        age: req.body.age,
        email: req.body.email,
        address: req.body.address,
      },
    });

    res.status(200).json(editClient);
  } catch (err) {
    res.status(404).json({ message: `Client not found\n ${err}` });
  }
});

app.delete("/clients/:id", async (req, res) => {
  try {
    await prisma.user.delete({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: "Client deleted" });
  } catch (err) {
    res.status(404).json({ message: `Client not found. \n ${err}` });
  }
});

app.listen(3000);
