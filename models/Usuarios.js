import mongoose from "mongoose";
mongoose.Promise = global.Promise;
import bcrypt from "bcrypt";

const usuariosSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
    },
    nombre: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    token: String, 
    expira: Date,
});

// Metodo para hashear los passwords
usuariosSchema.pre("save", async function(next) {
    // Si el password ya esta hasheado
    if(!this.isModified("password")) {
        return next();
    }

    // Hashear el password
    const hash = await bcrypt.hash(this.password, 12);
    this.password = hash;
    next();
}); 

usuariosSchema.post("save", function(error, doc, next) {
    if(error.name === "MongoServerError" && error.code === 11000) {

        next("El correo ya esta registrado");
    } else {
        next(error);
    }
});

export default mongoose.model('Usuarios', usuariosSchema);