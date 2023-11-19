import "dotenv/config";
import app from "./src/app.js";

const PORT = process.env.API_PORT;

app.listen(PORT, ()=>{
    console.log(`Servidor rodando na porta ${PORT}!`);
})