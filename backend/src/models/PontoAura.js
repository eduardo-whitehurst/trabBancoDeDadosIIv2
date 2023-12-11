import driver from "../config/auraConnect.js";

export async function criarPonto(titulo, idMongo, coordinates) {
    const session = driver.session();

    try {
        const idString = idMongo.toString();
        const [long, lat] = coordinates;

        const query = `
            CREATE (ponto:Ponto {
                titulo: $titulo,
                IdMongo: $idString,
                latitude: $lat,
                longitude: $long
            })

            WITH ponto
            MATCH (delegacia:Delegacia)
            WITH ponto, delegacia, 
                 point({longitude: ponto.longitude, latitude: ponto.latitude}) AS pontoLocal,
                 point({longitude: delegacia.longitude, latitude: delegacia.latitude}) AS delegaciaLocal

            WITH ponto, delegacia, point.distance(pontoLocal, delegaciaLocal) AS distancia
            ORDER BY distancia ASC
            LIMIT 1

            CREATE (delegacia)-[:ATENDE]->(ponto)
        `;

        const result = await session.run(query, { titulo, idString, lat, long });
        console.log('Ponto criado com sucesso no AuraDB.');
    } catch (error) {
        console.error('Erro ao criar ponto no AuraDB:', error);
    } finally {
        await session.close();
    }
}
