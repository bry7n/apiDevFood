import express from 'express'

import{
    getProducts,
    getProductByCode,
    createProducts,
    editProduct,
    deleteProduct
} from "../controllers/productControllers.js"


const router = express.Router()


router.get("/products", getProducts)
router.get("/products/code/:code", getProductByCode)
router.post("/products", createProducts)
router.put("/products/code/:code", editProduct)
router.put("/products/:id", editProduct)
router.delete("/products/:id", deleteProduct)
router.delete("/products", deleteProduct)


export default router;