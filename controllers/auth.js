const { response, request } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {
  const { name, email, password } = req.body;

  try {
    // Verificar si no existe un correo igual
    const usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El email ya esta registrado",
      });
    }

    // Crear usuario con el modelo
    const nuevoUsuario = new Usuario(req.body);

    // Hashear la contrasena
    const salt = bcrypt.genSaltSync();
    nuevoUsuario.password = bcrypt.hashSync(password, salt);

    // Generar el JWT
    const token = await generarJWT(nuevoUsuario.id, name);

    // Crear usuario de BD
    await nuevoUsuario.save();

    // Generar la respuesta exitosa
    return res.status(201).json({
      ok: true,
      uid: nuevoUsuario.id,
      name,
      email,
      msg: "Usuario registrado correctamente",
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Por favor, contacte con un administrador",
    });
  }
};

const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const bdUsuario = await Usuario.findOne({ email });
    if (!bdUsuario) {
      return res.status(400).json({
        ok: false,
        msg: "El correo no existe",
      });
    }

    // Confirmar si el password hace match

    const validPassword = bcrypt.compareSync(password, bdUsuario.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "El password es incorrecto",
      });
    }

    // Generar JWT
    const token = await generarJWT(bdUsuario.id, bdUsuario.name);

    // Respuesta del servicio
    return res.json({
      ok: true,
      uid: bdUsuario.id,
      name: bdUsuario.name,
      email,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Por favor, contacte con un administrador",
    });
  }
};

const renovarToken = async (req = request, res = response) => {
  const { uid } = req;

  const bdUsuario = await Usuario.findById(uid);

  const token = await generarJWT(uid, bdUsuario.name);

  return res.json({
    ok: true,
    msg: "Renew",
    uid,
    name: bdUsuario.name,
    email: bdUsuario.email,
    token,
  });
};

module.exports = {
  crearUsuario,
  loginUsuario,
  renovarToken,
};
