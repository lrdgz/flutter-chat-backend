const { response } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { genJWT } = require("../helpers/jwt");

const createUser = async (req, res = response) => {

    const { email, password, name } = req.body;
    try {
        const emailExists = await User.findOne({ email });
        if (emailExists) {

            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado!'
            });

        }

        const user = new User({ email, password, name });

        //Encript Password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        const token = await genJWT(user.id);

        res.json({
            ok: true,
            user,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}



const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        const userDB = await User.findOne({ email });
        if (!userDB) {

            return res.status(400).json({
                ok: false,
                msg: 'Email no encontrado!'
            });

        }

        const validPassword = bcrypt.compareSync(password, userDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password no valido!'
            });
        }

        const token = await genJWT(userDB.id);

        res.json({
            ok: true,
            user: userDB,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}


const renewToken = async (req, res = response) => {

    const uid = req.uid;
    const token = await genJWT(uid);
    const user = await User.findById(uid);

    res.json({
        ok: true,
        user,
        token
    });
};


module.exports = {
    createUser,
    login,
    renewToken
};