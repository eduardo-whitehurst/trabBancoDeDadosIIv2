import { AutoEncryptionLoggerLevel } from "mongodb";
import ponto from "../models/Ponto.js";

class PontoController {

    static async listarPontos(req, res){
        try {
            const listaPontos = await ponto.find({});
            res.status(200).json(listaPontos);
        } catch(error) {
            res.status(500).json({message: `${error.message} - Falha na requisição de Leitura.`})
        }
    }

    static async cadastrarPonto(req, res){
        try{
            const novoPonto = await ponto.create(req.body);
            res.status(201).json({message: "Criado com sucesso!", ponto: novoPonto})
        }catch(error){
            res.status(500).json({message: `${error.message} - Falha na criação do ponto.`})
        }
    }

    static async atualizarPonto(req, res){
        try {
            const id = req.params.id;
            await ponto.findByIdAndUpdate(id, req.body);
            res.status(200).json({message: "Ponto atualizado!"});
        } catch(error){
            res.status(500).json({message: `${error.message} - Falha ao atualizar o ponto.`})
        }
    }

    static async deletarPonto(req, res){
        try{
            const id = req.params.id;
            await ponto.findByIdAndDelete(id);
            res.status(200).json({message: "Ponto excluído com sucesso."})
        }catch(error){
            res.status(500).json({message: `${error.message} - Falha na deleção do ponto.`})
        }
    }

}

export default PontoController;