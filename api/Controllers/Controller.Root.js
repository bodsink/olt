const argon2 = require('argon2');
const createError = require('http-errors');
const uuid = require('uuid');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');
moment.locale('id');


const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    }
});

const { Root } = require('../Models/Model.Root');



exports.Index = async function (req, res, next) {
    try {
        return res.status(200).send('KejoraNet | Internet Masuk Nagari');
        
    }catch (error) {
        console.log(error)
        return next(
            createError(500, error));
    }
}


exports.postRoot = async function (req, res, next) {
    try {

        if (!req.body.email) {
            return next(
                createError(400, 'Email tidak boleh kosong!'));
        }

        if (!req.body.ponsel) {
            return next(
                createError(400, 'Nomor ponseltidak boleh kosong!'));
        }

        if (!req.body.sandi) {
            return next(
                createError(400, 'Sandi tidak boleh kosong!'));
        }

        let cekDuplicate = await Root.findOne({
            email: req.body.email,
            ponsel: req.body.ponsel
        }).then(data=>data);

        if(cekDuplicate){
            return next(
                createError(400, 'Email/ponsel telah terdaftar!'));
        }

        const hash = await argon2.hash(req.body.sandi);


        let tambah = new Root(req.body);
        tambah.root = req.user;
        tambah.sandi = hash;
        tambah.uid = uuid.v4();
        tambah.private_key = privateKey;
        tambah.public_key = publicKey;
        tambah.status = true;

        let simpan = await tambah.save(tambah).then(data => data)

        return res.status(200).send({
            data: simpan,
            pesan: 'Root Berhasil dibuat'
        })


    } catch (error) {
        console.log(error)
        return next(
            createError(500, error));
    }
}

exports.Login = async function (req, res, next) {
    try {
        if (!req.body.email) {
            return next(
                createError(400, 'Email tidak boleh kosong!'));
        }
        if (!req.body.sandi) {
            return next(
                createError(400, 'Sandi tidak boleh kosong!'));
        }

        let cekRoot = await Root.findOne({
            email:req.body.email
        });
        
        if(!cekRoot){
            return next(
                createError(404, 'Email tidak ditemukan!'));
        }

        if (cekRoot.status == false) {
            return next(
                createError(401, 'Email ' + cekRoot.email + ' tidak aktif!'));
        }

        const cekSandi = await argon2.verify(cekRoot.sandi, req.body.sandi);
        
        if (cekSandi == false) { 
            return next(
                createError(401, 'Sandi tidak cocok!'));
        }

        const payload = {
            uid: cekRoot.uid
        };

        const key = Buffer.from(cekRoot.private_key);
        const token = jwt.sign(payload, key, {
            // jwtid: crypto.randomBytes(Math.ceil(64)).toString('base64'),
            algorithm: 'RS256',
            expiresIn: '5y',
            subject: 'KejoraNet Fiber Masuak Nagari',
            issuer: 'PT. Bintang Kejora Teknologi',
            audience: "https://app.bkt.net.id"
        });

        return res.status(200).send({
            token: token,
            pesan: 'Login Berhasil!'
        })

    } catch (error) {
        console.log(error)
        return next(
            createError(500, error));
    }
}

exports.CekToken = async function (req, res, next) {
    try {
        
        let authHeader = req.headers['authorization']
        
        if (!authHeader) {
            return next(
                createError(401, 'Token tidak boleh kosong 🤭!'));
        }

        let token = authHeader && authHeader.split(' ')[1];
        const decodedToken = jwt.decode(token);
      
        if (decodedToken === null) {
            return next(
                createError(401, 'Invalid Token!'));
        }

        let cekRoot = await Root.findOne({
            uid: decodedToken.uid
        }).then(data=>data);

        if (!cekRoot) {
            return next(
                createError(401, 'Root tidak ditemukan!'));
        }

        const PublicKey = Buffer.from(cekRoot.public_key);

        const verifyToken = jwt.verify(token, PublicKey)

        req.user = verifyToken.uid;

        return next();

    } catch (error) {
        console.log(error)
        return next(
            createError(500, error));
    }
}



