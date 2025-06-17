import express from 'express'

import {
    getClients,
    createClients,
    editClient,
    deleteClient
} from '../controllers/clientControllers.js'

const router = express.Router();

router.get("/clients", getClients);
router.post("/clients", createClients);
router.put("/clients/:id" , editClient);
router.delete("/clients/:id", deleteClient);


export default router;






//NA ROUTER, COLOCAMOS NOSSAS ROTAS DA NOSSA PÁGINA PARA USAR NO APP