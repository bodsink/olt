const createError = require('http-errors');
const uuid = require('uuid');
const moment = require('moment-timezone');
moment.locale('id');



const { Pelanggan } = require('../Models/Model.Pelanggan');


function Karakter(id) {
    return id.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
}


exports.postPelanggan = async function (req, res, next) {
    try {
        if (!req.body.nama) {
            return next(
                createError(400, 'Nama lengkap tidak boleh kosong!'));
        }

        if (!req.body.ponsel) {
            return next(
                createError(400, 'Nomor ponsel tidak boleh kosong!'));
        }

        if (!req.body.alamat) {
            return next(
                createError(400, 'Alamat tidak boleh kosong!'));
        }


       

        const cekNomor = req.body.ponsel;
        let NomorWhatsapp;


        if (cekNomor.substring(0, 1) == 0) {
            NomorWhatsapp = '62' + cekNomor.substring(1);
        }

        if (cekNomor.substring(0, 1) == 6) {
            NomorWhatsapp = cekNomor
        }

        if (cekNomor.substring(0, 1) == '+') {
            NomorWhatsapp = cekNomor.substring(1);
        }

        //hapus spaci
        if (/\s/.test(cekNomor)) {
            if (cekNomor.substring(0, 1) == 0) {
                let a = cekNomor.substring(1);
                NomorWhatsapp = '62' + a.replace(/\s/g, '');
            }
        }

        //hapus dash -
        if (/-/.test(cekNomor)) {
            if (cekNomor.substring(0, 1) == 0) {
                let a = cekNomor.substring(1);
                NomorWhatsapp = '62' + a.replace(/-/g, '');
            }

            //62 895-2244-0228
            if (cekNomor.substring(0, 1) == 6) {
                NomorWhatsapp = cekNomor.replace(/\s/g, '');
                NomorWhatsapp = NomorWhatsapp.replace(/-/g, '');
            }
        }

        let pelanggan;

        let cekDuplikatNama = await Pelanggan.findOne({
            root: req.user,
            nama: Karakter(req.body.nama)
        }).then(data => data);

        let cekDuplikatPonsel = await Pelanggan.findOne({
            root: req.user,
            ponsel: NomorWhatsapp
        }).then(data => data);

        if (cekDuplikatPonsel) {
            return next(
                createError(409, 'Nomor ponsel ' + req.body.ponsel + ' telah terdaftar!'));
        }

        if (cekDuplikatNama) {
            pelanggan = Karakter(req.body.nama) + ' ' + Karakter(req.body.nama)

        }

        let tambah = new Pelanggan(req.body);
        tambah.root = req.user;
        tambah.uid = uuid.v4();
        tambah.cid = '1' + Math.floor(Math.random() * 99999 * 999999);
        tambah.nama = req.body.nama;
        tambah.ponsel = NomorWhatsapp;
        tambah.alamat = req.body.alamat;
        tambah.status = true;

        let simpan = await tambah.save(tambah).then(data => data)


        return res.status(200).send({
            data: {
                "cid": simpan.cid,
                "nama": simpan.nama
            },
            pesan: "Pelanggan berhsail di simpan"
        })





    } catch (error) {
        console.log(error)
        return next(
            createError(500, error));
    }
}


exports.getProfil = async function (req, res, next) {
    try {
      
        let NomorWhatsapp;

        if (req.params.id.substring(0, 1) == 0) {
            NomorWhatsapp = '62' + req.params.id.substring(1);
        }

        if (NomorWhatsapp) {
            const cek = await Pelanggan.aggregate([{
                $match: {
                    ponsel: NomorWhatsapp
                }
            }, {
                $lookup: {
                    from: 'Layanan',
                    localField: 'uid',
                    foreignField: 'pelanggan',
                    as: 'layanan'
                }
            },{
                $unwind: {
                    path: "$layanan"
                }
            },{
                $lookup: {
                    from: 'Layanan.Produk',
                    localField: 'layanan.paket',
                    foreignField: 'uid',
                    as: 'layanan.paket'
                }
            },{
                $lookup: {
                    from: 'Layanan.Bras',
                    localField: 'uid',
                    foreignField: 'pelanggan',
                    as: 'bras'
                }
            }]).then(data => data);


            if (cek.length <= 0) {
                return next(
                    createError(404, 'Pelanggan tidak ditemukan!'));
            } else {

                if (cek[0].layanan.length <= 0) {
                    return next(
                        createError(404, 'Layanan pelanggan an.'+ cek[0].nama  + ' tidak ditemukan, kemungkinan masih dalam antrian, pelanggan dari Mitra atau Lokasi di Pariangan!'));
                }

                
                return res.status(200).send({
                    data: cek
                })
            }

        } else {
            return next(
                createError(500, 'Format nomor ponsel tidak benar!'));
        }






    } catch (error) {
        console.log(error)
        return next(
            createError(500, error));
    }
}

