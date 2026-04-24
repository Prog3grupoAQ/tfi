import { Router } from "express";

export const userRoutes = Router();

userRoutes.get('/', ( req, res )=>{
    res.send({"msg":"ok"})
})

userRoutes.get("/test",(req,res)=>{
    res.send({"msg":"esto es un test"})
})