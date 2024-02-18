const createError = require('http-errors');
const uuid = require('uuid');
const moment = require('moment-timezone');
const { Settings } = require('../Models/Model.Root');
moment.locale('id');


const { Layanan, Bras, Produk } = require('../Models/Model.Layanan');
const { Pelanggan } = require('../Models/Model.Pelanggan');

const Mikrotik = require('../Class/Class.Mikrotik');
const { set } = require('mongoose');
const Olt = require(process.cwd() + '/Class/Class.Olt');


function Karakter(id) {
    return id.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
}

exports.postProduk = async function (req, res, next) {
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

        if (!req.body.olt) {
            return next(
                createError(400, 'olt tidak boleh kosong!'));
        }

        let cekDuplicate = await Produk.findOne({
            root: req.user,
            nama: req.body.nama
        }).then(data => data);


        if (cekDuplicate) {
            return next(
                createError(409, 'Nama Paket telah terdaftar!'));
        }

        let formradius = {
            "name": Karakter(req.body.nama),
            "outer-auths": "pap,chap,mschap1,mschap2,eap-tls,eap-ttls,eap-peap,eap-mschap2",
            "inner-auths": "ttls-pap,ttls-chap,ttls-mschap1,ttls-mschap2,peap-mschap2",
            "attributes": "Mikrotik-Rate-Limit:5M/5M " + req.body.upload + "M/" + req.body.download + "M 5M/5M 60/60,Mikrotik-Group:" + Karakter(req.body.nama)

        }

        const tcont = 'UP_' + Karakter(req.body.nama);
        const type = 5;
        const upload = req.body.upload * 1024;
        const fixed = upload / 4;
        const assured = upload / 2;
        const maximum = upload / 1;

        const traffic = 'DW_' + Karakter(req.body.nama);
        const download = req.body.download * 1024;
        const sir = download / 2
        const pir = download

        let setProfil = 'configure terminal  \n gpon \n profile tcont ' + tcont + ' type 5 fixed ' + fixed + ' assured ' + assured + ' maximum ' + maximum +
            '\n ! \ngpon \n profile traffic ' + traffic + ' sir ' + sir + ' pir ' + pir + '\n !';


        let keOlt = await Olt.Conn(req.body.olt, setProfil).then(data => data);
        let keRadius = await Mikrotik.addGroup(formradius).then(data => data);

        if (keRadius.response) {
            return next(
                createError(keRadius.response.status, keRadius.response.data.detail));
        }

        let tambah = new Produk(req.body);
        tambah.nama = Karakter(req.body.nama);
        tambah.ret = keRadius.ret
        tambah.root = req.user
        tambah.uid = uuid.v4();
        tambah.status = true;

        let simpan = await tambah.save(tambah).then(data => data)

        if (simpan) {
            return res.status(200).send({
                data: simpan,
                pesan: 'Paket berhasil disimpan!'
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

        let tikor;
        let cid;

        if (!req.body.ponsel) {
            return next(
                createError(400, 'Nomor ponsel pelanggan tidak boleh kosong!'));
        }

        if (!req.body.paket) {
            return next(
                createError(400, 'Nama Paket tidak boleh kosong!'));
        }

        if (!req.body.alamat) {
            return next(
                createError(400, 'Alamat Pemasangan tidak boleh kosong!'));
        }

        if (!req.body.tikor) {
            tikor = null;
        }


        let NomorWhatsapp;

        if (req.body.ponsel.substring(0, 1) == 0) {
            NomorWhatsapp = '62' + req.body.ponsel.substring(1);
        }


        let cekPaket = await Produk.findOne({
            nama: Karakter(req.body.paket)
        }).then(data => data);

        if (!cekPaket) {
            return next(
                createError(400, 'Paket ' + req.body.paket.toLowerCase() + ' tidak ditemukan!'));
        }


        let cekPelanggan = await Pelanggan.findOne({
            root: req.user,
            ponsel: NomorWhatsapp
        }).then(data => data);


        if (!cekPelanggan) {
            return next(
                createError(400, 'Pelanggan tidak ditemukan!'));
        }



        let cekDuplicate = await Layanan.find({
            root: req.user,
            pelanggan: cekPelanggan.uid,
            status: false
        }).then(data => data);

        if (cekDuplicate.length > 0) {
            let paket = await Produk.findOne({
                uid: cekDuplicate[0].paket
            }).then(data => data);


            return res.status(409).send({
                data: {
                    uid: cekDuplicate[0].uid,
                    pelanggan: cekPelanggan.nama,
                    paket: paket.nama,
                    cid: cekDuplicate[0].cid,
                    createdAt: cekDuplicate[0].createdAt,
                    updatedAt: cekDuplicate[0].updatedAt
                },
                pesan: 'Tidak bisa tambah layanan, masih ada layanan yang belum aktif untuk pelanggan ini!'
            })
        }


        let cekDuplicateCid = await Layanan.findOne({
            root: req.user,
            cid: cekPelanggan.cid
        }).then(data => data);


        if (cekDuplicateCid) {
            cid = cekPelanggan.cid / 1 + 1
        } else {
            cid = cekPelanggan.cid
        }

        let tambah = new Layanan(req.body);
        tambah.root = req.user
        tambah.uid = uuid.v4();
        tambah.paket = cekPaket.uid;
        tambah.cid = cid;
        tambah.tikor = tikor;
        tambah.alamat = Karakter(req.body.alamat);
        tambah.pelanggan = cekPelanggan.uid;
        tambah.status = false;

        let simpan = await tambah.save(tambah).then(data => data);

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

exports.postBras = async function (req, res, next) {
    try {

        if (!req.body.ponsel) {
            return next(
                createError(400, 'Ponsel tidak boleh kosong!'));
        }

        let NomorWhatsapp;

        if (req.body.ponsel.substring(0, 1) == 0) {
            NomorWhatsapp = '62' + req.body.ponsel.substring(1);
        }

        if (NomorWhatsapp) {
            let cekPelanggan = await Pelanggan.findOne({
                ponsel: NomorWhatsapp
            }).then(data => data);


            if (!cekPelanggan) {
                return next(
                    createError(404, 'Pelanggan tidak ditemukan!'));
            }


            const cekLayanan = await Layanan.aggregate([{
                $match: {
                    root: req.user,
                    pelanggan: cekPelanggan.uid,
                    status: false
                }
            }, {
                $lookup: {
                    from: 'Layanan.Produk',
                    localField: 'paket',
                    foreignField: 'uid',
                    as: 'produk'
                }
            }]).then(data => data);

            if (cekLayanan.length < 1) {
                return res.status(404).send({
                    data: {
                        uid: cekPelanggan.uid,
                        pelanggan: cekPelanggan.nama,
                    },
                    pesan: 'Layanan tidak ditemukan!'
                })
            }

            let Radius = {
                'name': cekLayanan[0].cid + '@solusifiber.id',
                'password': Math.floor((Math.random() * 1000000000000000) + 1),
                'comment': cekPelanggan.nama,
                'group': cekLayanan[0].produk[0].nama,
                'shared-users': 1,
                "caller-id": 'bind',
                'disabled': false
            }

            let cekRadius = await Mikrotik.findBras(Radius.name).then(data => data);


            if (cekRadius.response) {

                return next(
                    createError(cekRadius.response.status, 'Error dari Radius ' + cekRadius.response.data.message));
            }

            if (cekRadius.length < 1) {

                let keRadius = await Mikrotik.addBras(Radius).then(data => data);

                if (keRadius.response) {
                    return next(
                        createError(keRadius.response.status, 'Error dari Radius ' + keRadius.response.data.message));
                }

                let bras = new Bras();
                bras.root = req.user
                bras.uid = uuid.v4();
                bras.ret = keRadius.ret;
                bras.pelanggan = cekPelanggan.uid;
                bras.group = Radius.group;
                bras.name = Radius.name;
                bras.layanan = cekLayanan[0].uid;
                bras.password = Radius.password;
                bras.disabled = Radius.disabled;

                let simpanBras = await bras.save(bras).then(data => data);

                return res.status(200).send({
                    data: simpanBras,
                    pesan: 'Bras berhasil ditambahkan!'
                })

            } else {

                let cekBras = await Bras.findOne({
                    name: Radius.name
                }).then(data => data);

                if (!cekBras) {
                    let bras = new Bras();
                    bras.root = req.user
                    bras.uid = uuid.v4();
                    bras.ret = cekRadius[0]['.id'];
                    bras.pelanggan = cekPelanggan.uid;
                    bras.group = Radius.group;
                    bras.name = Radius.name;
                    bras.layanan = cekLayanan[0].uid;
                    bras.password = Radius.password;
                    bras.disabled = Radius.disabled;

                    let simpanBras = await bras.save(bras).then(data => data);

                    return res.status(200).send({
                        data: simpanBras,
                        pesan: 'Bras berhasil ditambahkan!'
                    })

                } else {

                    return res.status(200).send({
                        data: cekBras,
                        pesan: 'Bras berhasil ditambahkan!'
                    })
                }

            }

        }

    } catch (error) {
        console.log(error)
        return next(
            createError(500, error));
    }
}




