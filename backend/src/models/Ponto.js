import mongoose from "mongoose";

const pontoSchema = new mongoose.Schema({
    id:{
        type: mongoose.Schema.Types.ObjectId,
    },
    titulo:{
        type: String,
        required: true,
    },
    descricao:{
        type:String,
    },
    tipo:{
        type:String,
        enum:['Furto', 'Roubo', 'Sequestro', 'Homicídio', 'Outros'],
        required: true,
    },
    data:{
        type:String,
    },
    hora: {
        type:String,
    },
    localizacao:{
        type: {
            type: String,
            enum:['Point'],
            required: true
        }, coordinates: {
            type: [Number],
            required: true,
        }
    }
})

const Ponto = mongoose.model('Ponto', pontoSchema);

export default Ponto;
