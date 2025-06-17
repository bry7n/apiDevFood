import express from 'express'

import{
    getProducts,
    createProducts,
    editProduct,
    deleteProduct
} from "../controllers/productControllers.js"


const router = express.Router()


router.get("/products", getProducts)
router.post("/products", createProducts)
router.put("/products/:id", editProduct)
router.delete("/products/:id", deleteProduct)

export default router;