import { Router } from "express";

export const userRoutes = Router();

userRoutes.post('/login', ( req, res )=>{
    try {
        
    } catch (error) {
        res.status(500).send(error.error)
    }
})

userRoutes.get("/test",(req,res)=>{
    res.send({"msg":"esto es un test"})
})