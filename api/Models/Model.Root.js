const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RootSchema = new Schema({
    root:String,
    email: String,
    uid: String,
    ponsel: String,
    sandi: String,
    status: Boolean,
    private_key: String,
    public_key:String
}, {
    collection: 'Root',
    versionKey: false,
    timestamps: true
});


const SettingSchema = new Schema({
    root: String,
    uid:String,
    perusahaan:{
        nama:String,
        npwp:String,
        alamat:String,
        phone:String,
        email:String,
        logo:String,
        tag:String
    },
    Xendit: {
        mode: Number,
        test: {
            Xendit_API_Key: String,
            Xendit_X_Callback_Token: String,
            Version: String,
            redirectUrl: String
        },
        live: {
            Xendit_API_Key: String,
            Xendit_X_Callback_Token: String,
            Version: String,
            redirectUrl: String
        }
    },
    Meta: {
        APP_ID: String,
        APP_TOKEN: String,
        VERSION: String,
        PHONE_NUMBER_ID: String,
        Refresh_TOKEN: String
    },
    Google:{
        GOOGLE_DRIVE_CLIENT_ID:String,
        GOOGLE_DRIVE_CLIENT_SECRET:String,
        GOOGLE_DRIVE_REDIRECT_URI:String,
        GOOGLE_DRIVE_REFRESH_TOKEN:String
    },
    Telegram:{
        bot:String,
        grup:String,
        topic:{
            cs:String,
            billing:String,
            pb:String,
            kp:String,
        }
    },
    Jurnal:{
        token:String
    },
    Radius:{
        hostname:String,
        user:String
    },
    Acs:{
        url: String,
        ClientId: String,
        ClientSecret: String
    },
    Umum: {
        token: String,
        Prefix_PPPOE: String
    }

}, {
    collection: 'Root.Setting',
    versionKey: false,
    timestamps: true
});

const ApiSchema = new Schema({
    uid: String,
    user: String,
    key: String
}, {
    collection: 'Root.Api',
    versionKey: false,
    timestamps: true
});

const Root = mongoose.model('Root', RootSchema);
const Settings = mongoose.model('Setting', SettingSchema);
const API = mongoose.model('Root.Api', ApiSchema);

module.exports = {
    Root,Settings, API
}
