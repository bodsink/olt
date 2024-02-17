const createError = require('http-errors');
const uuid = require('uuid');
const moment = require('moment-timezone');
const { Settings } = require('../Models/Model.Root');
moment.locale('id');


const { Layanan, Bras, Produk } = require('../Models/Model.Layanan');
const { Pelanggan } = require('../Models/Model.Pelanggan');


function Karakter(id) {
    return id.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
}



exports.postProduk= async function (req, res, next) {
    try {

        if (!req.body.nama) {
            return next(
                createError(400, 'Nama Paket tidak boleh kosong!'));
        }

        if (!req.body.upload) {
            return next(
                createError(400, 'Upload tidak boleh kosong!'));
        }

        if (!req.body.download) {
            return next(
                createError(400, 'Download tidak boleh kosong!'));
        }

        if (!req.body.harga) {
            return next(
                createError(400, 'Harga tidak boleh kosong!'));
        }

        let cekDuplicate = await Produk.findOne({
            root : req.user,
            nama: req.body.nama
        }).then(data => data);


        if (cekDuplicate) {
            return next(
                createError(409, 'Nama Paket telah terdaftar!'));
        }


        let tambah = new Produk(req.body);
        tambah.root = req.user
        tambah.uid = uuid.v4();
        tambah.status = true;

        let simpan = await tambah.save(tambah).then(data => data)

        if (simpan) {
            return res.status(200).send({
                data: simpan,
                pesan: 'Layanan berhasil ditambahkan!'
            })
        }


    } catch (error) {
        console.log(error)
        return next(
            createError(500, error));
    }
}


exports.postLayanan = async function (req, res, next) {
    try {

        if (!req.body.ponsel) {
            return next(
                createError(400, 'Nomor ponsel pelanggan tidak boleh kosong!'));
        }

        if (!req.body.onu) {
            return next(
                createError(400, 'SN Onu tidak boleh kosong!'));
        }

        if (!req.body.paket) {
            return next(
                createError(400, 'Nama Paket tidak boleh kosong!'));
        }


        let NomorWhatsapp;

        if (req.body.ponsel.substring(0, 1) == 0) {
            NomorWhatsapp = '62' + req.body.ponsel.substring(1);
        }


        let cekPaket = await Produk.findOne({
            nama: Karakter(req.body.paket)
        }).then(data=>data);

        console.log(cekPaket)

     

        if(!cekPaket){
            return next(
                createError(400, 'Paket '+req.body.paket.toLowerCase() + ' tidak ditemukan!'));
        }


        let cekPelanggan = await Pelanggan.findOne({
            root : req.user,
            ponsel: NomorWhatsapp
        }).then(data => data);


        if (!cekPelanggan) {
            return next(
                createError(400, 'Pelanggan tidak ditemukan!'));
        }

        //cek layanan yang belum aktif
        let cekDuplicateOnu = await Layanan.findOne({
            root: req.user,
            onu: req.body.onu.toUpperCase()
        }).then(data => data);

        if (cekDuplicateOnu) {
            return next(
                createError(400, 'Onu telah digunakan!'));
        }

        let tambah = new Layanan(req.body);
        tambah.root = req.user
        tambah.uid = uuid.v4();
        tambah.paket = cekPaket.uid;
        tambah.cid = cekPelanggan.cid;
        tambah.onu = req.body.onu.toUpperCase();
        tambah.pelanggan = cekPelanggan.uid;
        tambah.status = true;

        let simpan = await tambah.save(tambah).then(data => data)

        if (simpan) {
            return res.status(200).send({
                data: simpan,
                pesan: 'Layanan berhasil ditambahkan!'
            })
        }


    } catch (error) {
        console.log(error)
        return next(
            createError(500, error));
    }
}