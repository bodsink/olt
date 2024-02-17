const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PelangganSchema = new Schema({
    root: String,
    uid: String,
    id: String,
    cid: String,
    nama: String,
    ponsel: String,
    tikor:String,
    alamat: String,
    grup: String,
    status: Boolean,

}, {
    collection: 'Pelanggan',
    versionKey: false,
    timestamps: true
});




const Pelanggan = mongoose.model('Pelanggan', PelangganSchema);
module.exports = {
    Pelanggan
}
