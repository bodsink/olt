const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const ProdukSchema = new Schema({
    root: String,
    uid: String,
    kode: String,
    nama: String,
    upload: Number,
    download:Number,
    harga: Number

}, {
    collection: 'Layanan.Produk',
    versionKey: false,
    timestamps: true
});

const LayananSchema = new Schema({
    root: String,
    uid: String,
    cid: String,
    tv: Boolean,
    paket: String,
    stb:String,
    onu: String,
    onuIndex:Number,
    pon:Number,
    gpon:String,
    olt:String,
    fp: String,
    pelanggan: String,
    status: Boolean,

}, {
    collection: 'Layanan',
    versionKey: false,
    timestamps: true
});


const BrasSchema = new Schema({
    root: String,
    uid: String,
    pelanggan: String,
    username: String,
    password: String,
    grup: String,
    status: Boolean

}, {
    collection: 'Layanan.Bras',
    versionKey: false,
    timestamps: true
});


const Produk = mongoose.model('Layanan.Produk', ProdukSchema);
const Layanan = mongoose.model('Layanan', LayananSchema);
const Bras = mongoose.model('Layanan.Bras', BrasSchema);

module.exports = {
    Produk, Layanan, Bras
}
