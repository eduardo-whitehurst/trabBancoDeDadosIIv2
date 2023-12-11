import { AutoEncryptionLoggerLevel } from "mongodb";
import ponto from "../models/Ponto.js";
import { criarPonto } from "../models/PontoAura.js";
import driver from "../config/auraConnect.js";

class PontoController {

    static async listarPontos(req, res){
        try {
            const listaPontos = await ponto.find({});
            res.status(200).json(listaPontos);
        } catch(error) {
            res.status(500).json({message: `${error.message} - Falha na requisição de Leitura.`})
        }
    }

    static async listarDelegaciasAtendePontos(req, res){
        let session; 

        try {
            session = driver.session();

            const query = `
                MATCH (delegacia:Delegacia)-[:ATENDE]->(ponto:Ponto)
                RETURN delegacia.name AS nomeDelegacia, COLLECT(ponto) AS pontos
            `;

            const result = await session.run(query);

            const listaDelegacias = result.records.map(record => {
                return {
                    nomeDelegacia: record.get('nomeDelegacia'),
                    pontos: record.get('pontos').map(ponto => ponto.properties.titulo)
                };
            });

            res.status(200).json(listaDelegacias);
        } catch (error) {
            console.error('Erro ao listar delegacias e pontos:', error);
            res.status(500).json({ message: 'Erro interno do servidor' });
        } finally {
            if (session) {  // Certifique-se de que a session está definida antes de tentar fechá-la
                await session.close();
            }
        }
    }

    static async cadastrarPonto(req, res) {
        try {
            const novoPonto = await ponto.create(req.body);
    
            await criarPonto(
                novoPonto.titulo,
                novoPonto._id,
                novoPonto.localizacao.coordinates
            );
    
            res.status(201).json({ message: "Criado com sucesso!", ponto: novoPonto });
        } catch (error) {
            console.error('Erro ao cadastrar ponto:', error);
            res.status(500).json({ message: `${error.message} - Falha na criação do ponto.` });
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