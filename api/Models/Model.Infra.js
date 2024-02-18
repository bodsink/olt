const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const OltSchema = new Schema({
    root:String,
    uid: String,
    hostname:String,
    merek:String,
    model:String,
    ip:String,
    pon:Number,
    status:Boolean,
    telnet_user:String,
    telnet_port:String,
    telnet_pass:String

}, {
    collection: 'Infra.Olt',
    versionKey: false,
    timestamps: true
});

const OdcSchema = new Schema({
    root:String,
    uid: String,
    olt:String,
    tgl:Date,
    pon:Number,
    kapasitas:Number,
    label:String,
    noted:String,
    alamat_rw:String,
    alamat_lokasi:String,
    alamat_kordinat:String,
    status:Boolean

}, {
    collection: 'Infra.Odc',
    versionKey: false,
    timestamps: true
});


const OdpSchema = new Schema({
    root:String,
    kapasitas:Number,
    uid: String,
    olt:String,
    tgl:Date,
    odc:String,
    odc_port:Number,
    label:String,
    alamat_rw:String,
    alamat_lokasi:String,
    alamat_kordinat:String,
    status:Boolean

}, {
    collection: 'Infra.Odp',
    versionKey: false,
    timestamps: true
});

const OLT = mongoose.model('Infra.Olt', OltSchema);
const ODC = mongoose.model('Infra.Odc', OdcSchema);
const ODP = mongoose.model('Infra.Odp', OdpSchema);

module.exports = {
    OLT,ODC,ODP
}
