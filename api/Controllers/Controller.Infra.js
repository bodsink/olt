const createError = require('http-errors');
const uuid = require('uuid');
const moment = require('moment-timezone');
moment.locale('id');


const { OLT, ODC, ODP } = require('../Models/Model.Infra');



exports.postOlt = async function (req, res, next) {
    try {
        if (!req.body.hostname) {
            return next(
                createError(400, 'Hostname olt tidak boleh kosong!'));
        }

        if (!req.body.merek) {
            return next(
                createError(400, 'Merek olt tidak  boleh kosong!'));
        }

        if (!req.body.model) {
            return next(
                createError(400, 'Model Olt tidak boleh kosong!'));
        }

        if (!req.body.ip) {
            return next(
                createError(400, 'Alamat IP olt tidak boleh kosong!'));
        }

        if (!req.body.pon) {
            return next(
                createError(400, 'Jumlah pon tidak boleh kosong!'));
        }
        if (!req.body.telnet_port) {
            return next(
                createError(400, 'Port telnet tidak boleh kosong!'));
        }
        if (!req.body.telnet_user) {
            return next(
                createError(400, 'User telnet tidak boleh kosong!'));
        }

        if (!req.body.telnet_pass) {
            return next(
                createError(400, 'Password telnet tidak boleh kosong!'));
        }


        let cekDupplicate = await OLT.findOne({
            root: req.user,
            ip: req.body.ip
        }).then(data => data);

        if (cekDupplicate) {
            return next(
                createError(400, 'OLT tidak bisa digunakan karena telah terdaftar!'));
        }

      
        let tambah = new OLT(req.body);
        tambah.root = req.user;
        tambah.uid = uuid.v4();
        tambah.status = false;

        let simpan = await tambah.save(tambah).then(data => data);
        if (simpan) {
            

            return res.status(200).send({
                data: simpan,
                pesan: 'ODC berhasil dibuat!'
            })
        }

        return res.status(200).send({
            data: simpan,
            pesan: 'Olt berhasil dibuat!'
        })


    } catch (error) {
        console.log(error)
        return next(
            createError(500, error));
    }
}