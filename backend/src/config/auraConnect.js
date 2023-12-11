import Config from 'dotenv';
import neo4j from 'neo4j-driver';
let driver;

async function conectar() {
  try {
    driver = neo4j.driver(process.env.NEO4J_URI, neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD));
    const serverInfo = await driver.getServerInfo();
    console.log('Conexão estabelecida com o AuraDB Neo4j!');
  } catch (err) {
    console.log(`Erro de conexão\n${err}\nCausa: ${err.cause}`);
    await driver.close();
  }
}

conectar();

export default driver;