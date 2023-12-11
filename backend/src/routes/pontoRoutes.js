import express from "express";
import PontoController from "../controllers/pontoController.js";

const routes = express.Router();

routes.get("/pontos", PontoController.listarPontos);
routes.get("/delegacias", PontoController.listarDelegaciasAtendePontos);
routes.post("/pontos", PontoController.cadastrarPonto);
routes.put("/pontos/:id", PontoController.atualizarPonto);
routes.delete("/pontos/:id", PontoController.deletarPonto);

export default routes;