const createError = require('http-errors');
const uuid = require('uuid');
const moment = require('moment-timezone');
const { setPPPoE } = require('../Class/Class.Acs');
moment.locale('id');

const Acs = require(process.cwd() + '/Class/Class.Acs');


function Karakter(id) {
    return id.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
}

exports.CekSN = async function (req, res, next) {
    try {

        let querySN = '"_deviceId._SerialNumber":"' + req.params.id.toUpperCase() + '"'

        let cekOnt = await Acs.CekOnt(querySN).then(data => data);
        console.log(cekOnt)

        if (cekOnt.response) {
            return next(
                createError(cekOnt.response.status, cekOnt.response.data));
        }

        if (cekOnt == 0) {
            return next(
                createError(404, 'Onu tidak ditemukan!'));
        }

        return res.status(200).send({
            data: cekOnt
        })





    } catch (error) {
        console.log(error)
        return next(
            createError(500, error));
    }

}

exports.CekOnt = async function (req, res, next) {
    try {

        let querySN = '"_deviceId._SerialNumber":"' + req.params.id.toUpperCase() + '"'

        let cekOnt = await Acs.CekOnt(querySN).then(data => data);

        if (cekOnt.response) {
            return next(
                createError(cekOnt.response.status, cekOnt.response.data));
        }

        if (cekOnt == 0) {
            return next(
                createError(404, 'Ont tidak ditemukan!'));
        }


        let pelanggan;
        if (cekOnt[0]._tags.length == 0) {
            pelanggan = ''
        } else {
            pelanggan = cekOnt[0]._tags[0]
        }

        let tampilan = {
            "pelanggan": pelanggan,
            "id": cekOnt[0]._id,
            "sn": cekOnt[0].InternetGatewayDevice.DeviceInfo.SerialNumber._value,
            "brand": cekOnt[0].InternetGatewayDevice.DeviceInfo.Manufacturer._value,
            "model": cekOnt[0].InternetGatewayDevice.DeviceInfo.ModelName._value,
            "hardware": cekOnt[0].InternetGatewayDevice.DeviceInfo.HardwareVersion._value,
            "software": cekOnt[0].InternetGatewayDevice.DeviceInfo.SoftwareVersion._value,
            "uptime": cekOnt[0].VirtualParameters.OnuUptime._value,
            "optical": {
                "rx": cekOnt[0].InternetGatewayDevice.WANDevice["1"].X_FH_GponInterfaceConfig.RXPower._value,
                "tx": cekOnt[0].InternetGatewayDevice.WANDevice["1"].X_FH_GponInterfaceConfig.TXPower._value,
                "bias": cekOnt[0].InternetGatewayDevice.WANDevice["1"].X_FH_GponInterfaceConfig.BiasCurrent._value,
                "temp": cekOnt[0].InternetGatewayDevice.WANDevice["1"].X_FH_GponInterfaceConfig.TransceiverTemperature._value,
                "volatege": cekOnt[0].InternetGatewayDevice.WANDevice["1"].X_FH_GponInterfaceConfig.SupplyVoltage._value,
            },
            "managament": {
                "mac": cekOnt[0].InternetGatewayDevice.WANDevice["1"].WANConnectionDevice["1"].WANIPConnection["1"].MACAddress._value,
                "ipv4": cekOnt[0].InternetGatewayDevice.WANDevice["1"].WANConnectionDevice["1"].WANIPConnection["1"].ExternalIPAddress._value,
                "vlanid": cekOnt[0].InternetGatewayDevice.WANDevice["1"].WANConnectionDevice["1"].WANIPConnection["1"].VLANID._value,
            },
            "bras": {
                "access": cekOnt[0].InternetGatewayDevice.WANDevice["1"].WANConnectionDevice["2"].WANPPPConnection["1"].Username._value,
                "mac": cekOnt[0].InternetGatewayDevice.WANDevice["1"].WANConnectionDevice["2"].WANPPPConnection["1"].MACAddress._value,
                "ipv4": cekOnt[0].InternetGatewayDevice.WANDevice["1"].WANConnectionDevice["2"].WANPPPConnection["1"].RemoteIPAddress._value,
                "vlanid": cekOnt[0].InternetGatewayDevice.WANDevice["1"].WANConnectionDevice["2"].WANPPPConnection["1"].VLANID._value,

            }


        }
        // console.log(tampilan)

        return res.status(200).send({
            data: tampilan
        })


    } catch (error) {
        console.log(error)
        return next(
            createError(500, error));
    }

}

exports.Reboot = async function (req, res, next) {
    try {
        if (!req.body.sn) {
            return next(
                createError(400, 'SN ONT tidak boleh kosong!'));
        }


        let querySN = '"_deviceId._SerialNumber":"' + req.body.sn.toUpperCase() + '"'


        let cekOnt = await Acs.CekOnt(querySN).then(data => data);


        if (cekOnt.response) {
            return next(
                createError(cekOnt.response.status, cekOnt.response.data));
        }

        if (cekOnt == 0) {
            return next(
                createError(404, 'Ont tidak ditemukan!'));
        }

        let reboot = await Acs.RebootOnt(cekOnt[0]._id).then(data => data);

        if (reboot.device == cekOnt[0]._id) {
            let re = await Acs.Summon(cekOnt[0]._id).then(data => data);
            return res.status(200).send({
                pesan: 'Ont ' + req.body.sn.toUpperCase() + ' akan reboot dalam berapa detik kedepan!'
            })

        }


    } catch (error) {
        console.log(error)
        return next(
            createError(500, error));
    }

}

exports.WanPPPoE = async function (req, res, next) {
    try {

        if (!req.body.sn) {
            return next(
                createError(400, 'SN CPE tidak boleh kosong!'));
        }

        if (!req.body.username) {
            return next(
                createError(400, 'Username tidak boleh kosong!'));
        }

        if (!req.body.password) {
            return next(
                createError(400, 'Paswword tidak boleh kosong!'));
        }

        if (!req.body.vlan) {
            return next(
                createError(400, 'Vlan PPPoE tidak boleh kosong!'));
        }


        let querySN = '"_deviceId._SerialNumber":"' + req.body.sn.toUpperCase() + '"'
        let cekOnu = await Acs.CekOnt(querySN).then(data => data);


        if (cekOnu.response) {
            return next(
                createError(cekOnu.response.status, cekOnu.response.data));
        }

        if (cekOnu == 0) {
            return next(
                createError(404, 'Onu tidak ditemukan!'));
        }

        if (cekOnu[0].InternetGatewayDevice.WANDevice['1'].WANConnectionDevice['2']) {

            let form = {
                "name": "setParameterValues",
                "parameterValues": [
                    [
                        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.2.WANPPPConnection.1.Enable",
                        true
                    ],
                    [
                        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.2.WANPPPConnection.1.NATEnabled",
                        true
                    ],
                    [
                        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.2.WANPPPConnection.1.VLANID",
                        req.body.vlan
                    ],
                    [
                        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.2.WANPPPConnection.1.Username",
                        req.body.username
                    ],
                    [
                        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.2.WANPPPConnection.1.Password",
                        req.body.password
                    ],
                    [
                        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.2.WANPPPConnection.1.ConnectionType",
                        "PPPoE_Routed"
                    ],
                    [
                        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.2.WANPPPConnection.1.X_FH_LanInterface",
                        "InternetGatewayDevice.LANDevice.1.WLANConfiguration.1,InternetGatewayDevice.LANDevice.1.WLANConfiguration.5"
                    ],
                    [
                        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.2.WANPPPConnection.1.X_FH_ServiceList",
                        "INTERNET"
                    ],
                    [
                        "InternetGatewayDevice.DeviceInfo.X_FH_Account.X_FH_WebUserInfo.WebSuperUsername",
                        "kejora"
                    ],
                    [
                        "InternetGatewayDevice.DeviceInfo.X_FH_Account.X_FH_WebUserInfo.WebSuperPassword",
                        "Nathan#2024"
                    ]
                ]
            }

            let SetPPPoE = await Acs.setParamater(cekOnu[0]._id, form).then(data => data);

            if (SetPPPoE) {
                await Acs.Summon(cekOnu[0]._id).then(data => data);
                return res.status(200).send({
                    pesan: 'Provisioning Service Internet Onu selesai, silahkan set SSID, restart onu jika menemukan kendala',
                    data: {
                        onu: req.body.sn,
                        username: req.body.username,
                        password: req.body.password,
                        vlan: req.body.vlan
                    }
                })
            }

        } else {

            let BuatWan = await Acs.AddObject(cekOnu[0]._id, 'InternetGatewayDevice.WANDevice.1.WANConnectionDevice').then(data => data);

            if (BuatWan.response) {
                return next(
                    createError(BuatWan.response.status, BuatWan.response.data));
            }

            if (BuatWan == 0) {
                return next(
                    createError(404, 'Onu tidak ditemukan!'));
            }

            await Acs.Summon(cekOnu[0]._id).then(data => data);


            let BuatPPPoE = await Acs.AddObject(cekOnu[0]._id, 'InternetGatewayDevice.WANDevice.1.WANConnectionDevice.2.WANPPPConnection').then(data => data);

            await Acs.Summon(cekOnu[0]._id).then(data => data);


            let form = {
                "name": "setParameterValues",
                "parameterValues": [
                    [
                        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.2.WANPPPConnection.1.Enable",
                        true
                    ],
                    [
                        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.2.WANPPPConnection.1.NATEnabled",
                        true
                    ],
                    [
                        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.2.WANPPPConnection.1.VLANID",
                        req.body.vlan
                    ],
                    [
                        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.2.WANPPPConnection.1.Username",
                        req.body.username
                    ],
                    [
                        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.2.WANPPPConnection.1.Password",
                        req.body.password
                    ],
                    [
                        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.2.WANPPPConnection.1.ConnectionType",
                        "PPPoE_Routed"
                    ],
                    [
                        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.2.WANPPPConnection.1.X_FH_LanInterface",
                        "InternetGatewayDevice.LANDevice.1.WLANConfiguration.1,InternetGatewayDevice.LANDevice.1.WLANConfiguration.5"
                    ],
                    [
                        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.2.WANPPPConnection.1.X_FH_ServiceList",
                        "INTERNET"
                    ],
                    [
                        "InternetGatewayDevice.DeviceInfo.X_FH_Account.X_FH_WebUserInfo.WebSuperUsername",
                        "kejora"
                    ],
                    [
                        "InternetGatewayDevice.DeviceInfo.X_FH_Account.X_FH_WebUserInfo.WebSuperPassword",
                        "Nathan#2024"
                    ]
                ]
            }


            let SetPPPoE = await Acs.setParamater(cekOnu[0]._id, form).then(data => data);

            if (SetPPPoE) {
                await Acs.Summon(cekOnu[0]._id).then(data => data);
                return res.status(200).send({
                    pesan: 'Provisioning PPPoE selesai, silahkan set SSID ONU, restart onu jika masih menemukan kendala',
                    data: {
                        onu: req.body.sn,
                        username: req.body.username,
                        password: req.body.password,
                        vlan: req.body.vlan
                    }
                })
            }

        }


    } catch (error) {
        console.log(error)
        return next(
            createError(500, error));
    }
}


exports.BridgeMNC = async function (req, res, next) {
    try {

        if (!req.body.sn) {
            return next(
                createError(400, 'SN ONT tidak boleh kosong!'));
        }


        let querySN = '"_deviceId._SerialNumber":"' + req.body.sn.toUpperCase() + '"'
        let cekOnu = await Acs.CekOnt(querySN).then(data => data);


        if (cekOnu.response) {
            return next(
                createError(cekOnu.response.status, cekOnu.response.data));
        }

        if (cekOnu == 0) {
            return next(
                createError(404, 'Onu tidak ditemukan!'));
        }

        if (cekOnu[0].InternetGatewayDevice.WANDevice['1'].WANConnectionDevice['3']) {

            let form = {
                "name": "setParameterValues",
                "parameterValues": [
                    [
                        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.3.WANPPPConnection.1.Enable",
                        true
                    ],
                    [
                        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.3.WANPPPConnection.1.AddressingType",
                        ''
                    ],
                    [
                        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.3.WANPPPConnection.1.NATEnabled",
                        false
                    ],
                    [
                        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.3.WANPPPConnection.1.VLANID",
                        "101"
                    ],
                    
                    [
                        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.3.WANPPPConnection.1.ConnectionType",
                        "PPPoE_Bridged"
                    ],
                    [
                        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.3.WANPPPConnection.1.X_FH_LanInterface",
                        "InternetGatewayDevice.LANDevice.1.LANEthernetInterfaceConfig.1,InternetGatewayDevice.LANDevice.1.LANEthernetInterfaceConfig.4"
                    ],
                    [
                        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.3.WANPPPConnection.1.X_FH_ServiceList",
                        "OTHER"
                    ]
                ]
            }

            let SetPPPoE = await Acs.setParamater(cekOnu[0]._id, form).then(data => data);

            if (SetPPPoE) {
                await Acs.Summon(cekOnu[0]._id).then(data => data);
                return res.status(200).send({
                    pesan: 'Provisioning Service MNC selesai, gunakan LAN 1 dan 4 untuk ke STB',
                    data: {
                        onu: req.body.sn
                    }
                })
            }

        } else {

            let BuatWan = await Acs.AddObject(cekOnu[0]._id, 'InternetGatewayDevice.WANDevice.1.WANConnectionDevice').then(data => data);

            if (BuatWan.response) {
                return next(
                    createError(BuatWan.response.status, BuatWan.response.data));
            }

            if (BuatWan == 0) {
                return next(
                    createError(404, 'Onu tidak ditemukan!'));
            }

            await Acs.Summon(cekOnu[0]._id).then(data => data);


            let BuatPPPoE = await Acs.AddObject(cekOnu[0]._id, 'InternetGatewayDevice.WANDevice.1.WANConnectionDevice.3.WANPPPConnection').then(data => data);

            await Acs.Summon(cekOnu[0]._id).then(data => data);


            let form = {
                "name": "setParameterValues",
                "parameterValues": [
                    [
                        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.3.WANPPPConnection.1.Enable",
                        true
                    ],
                    [
                        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.3.WANPPPConnection.1.AddressingType",
                        ''
                    ],
                    [
                        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.3.WANPPPConnection.1.NATEnabled",
                        false
                    ],
                    [
                        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.3.WANPPPConnection.1.VLANID",
                        "101"
                    ],
                    
                    [
                        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.3.WANPPPConnection.1.ConnectionType",
                        "PPPoE_Bridged"
                    ],
                    [
                        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.3.WANPPPConnection.1.X_FH_LanInterface",
                        "InternetGatewayDevice.LANDevice.1.LANEthernetInterfaceConfig.1,InternetGatewayDevice.LANDevice.1.LANEthernetInterfaceConfig.4"
                    ],
                    [
                        "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.3.WANPPPConnection.1.X_FH_ServiceList",
                        "OTHER"
                    ]
                ]
            }


            let SetPPPoE = await Acs.setParamater(cekOnu[0]._id, form).then(data => data);

            if (SetPPPoE) {
                await Acs.Summon(cekOnu[0]._id).then(data => data);
                return res.status(200).send({
                    pesan: 'Provisioning Service MNC selesai, gunakan LAN 1 dan 4 untuk ke STB',
                    data: {
                        onu: req.body.sn
                    }
                })
            }

        }


    } catch (error) {
        console.log(error)
        return next(
            createError(500, error));
    }
}

exports.GantiPassWifi = async function (req, res, next) {
    try {

        if (!req.body.sn) {
            return next(
                createError(400, 'SN ONT tidak boleh kosong!'));
        }

        if (!req.body.password) {
            return next(
                createError(400, 'Password Wifi baru tidak boleh kosong!'));
        }


        let querySN = '"_deviceId._SerialNumber":"' + req.body.sn.toUpperCase() + '"'
        let cekOnt = await Acs.CekOnt(querySN).then(data => data);


        if (cekOnt.response) {
            return next(
                createError(cekOnt.response.status, cekOnt.response.data));
        }

        if (req.body.password == '12345678' || req.body.password.toLowerCase() == 'abcdefgh' || req.body.password.toLowerCase() == 'qwertyui') {
            return res.status(400).send({
                pesan: 'Tidak bisa menggunakan password ini!'
            })
        }


        if (req.body.password.length < 8) {
            return res.status(400).send({
                pesan: 'Password tidak boleh kurang dari 8 karakter!'
            })
        }

        if (cekOnt == 0) {
            return next(
                createError(404, 'Ont tidak ditemukan!'));
        }

        let cekPassword = cekOnt[0].InternetGatewayDevice.LANDevice["1"].WLANConfiguration["1"].KeyPassphrase._value == req.body.password;



        if (cekPassword == true) {
            return res.status(409).send({
                pesan: 'Password baru dengan password lama sama!'
            })
        }

        let GantiPassword = await Acs.GantiPassWifi(cekOnt[0]._id, req.body.password).then(data => data);

        if (GantiPassword.device == cekOnt[0]._id) {
            let re = await Acs.Summon(cekOnt[0]._id).then(data => data);
            return res.status(200).send({
                pesan: 'Password Wifi berhasil diganti dari password lama <b>' + cekOnt[0].InternetGatewayDevice.LANDevice["1"].WLANConfiguration["1"].KeyPassphrase._value + '</b> menjadi password baru: <b>' + req.body.password + '</b>'
            })

        }


    } catch (error) {
        console.log(error)
        return next(
            createError(500, error));
    }
}

exports.setTags = async function (req, res, next) {
    try {

        if (!req.body.sn) {
            return next(
                createError(400, 'SN Onu tidak boleh kosong!'));
        }
        if (!req.body.tags) {
            return next(
                createError(400, 'Nama Tags tidak boleh kosong!'));
        }


        let querySN = '"_deviceId._SerialNumber":"' + req.body.sn.toUpperCase() + '"'
        let cekOnt = await Acs.CekOnt(querySN).then(data => data);
      

        if (cekOnt.response) {
            return next(
                createError(cekOnt.response.status, cekOnt.response.data));
        }


        if (cekOnt == 0) {
            return next(
                createError(404, 'Ont tidak ditemukan!'));
        }

        let setTags = await Acs.SetTags(cekOnt[0]._id,req.body.tags).then(data => data);
        console.log(setTags.response)

        if (setTags.response) {
            return next(
                createError(setTags.response.status, setTags.response.statusText));
        }
       
       
        return res.status(200).send({
            pesan: 'Tags Onu telah ditambahkan ' + req.params.id + ' tags: ' + req.body.tags
        })


    } catch (error) {
        console.log(error)
        return next(
            createError(500, error));
    }
}
