import express from "express";
import cors from "cors";

const routes = (app) => {
    app.route("/").get((req, res)=>res.status(200).send("Teste de conexão."));
    app.use(express.json(), cors());
}

export default routes;