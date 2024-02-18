const createError = require('http-errors');
const uuid = require('uuid');
const { Telnet } = require('telnet-client');

const moment = require('moment-timezone');
moment.locale('id');

const Olt = require(process.cwd() + '/Class/Class.Olt');

const { Pelanggan, Bras } = require('../Models/Model.Pelanggan');
const { Layanan } = require('../Models/Model.Layanan');



exports.Uncfg = async function (req, res, next) {
    try {

        let onuUncfg = await Olt.Conn(req.params.hostname, 'show pon onu uncfg sn').then(data => data);
        const cariSN = onuUncfg.search(req.params.id.toUpperCase());

        if (cariSN < 0) {
            return next(
                createError(404, 'Onu ' + req.body.onu.toUpperCase() + ' tidak ditemukan, periksa sumber listrik atau redaman onu!'));
        }





    } catch (error) {
        console.log(error)
        return next(
            createError(500, error));
    }


}



exports.cariSN = async function (req, res, next) {
    try {

        let cekOlt = await Olt.Conn(req.params.hostname, 'show gpon onu by sn ' + req.params.id.toUpperCase()).then(data => data);


        const cariSN = cekOlt.search('gpon-onu_1');

        if (cariSN < 0) {
            return next(
                createError(404, 'Onu ' + req.params.id.toUpperCase() + ' tidak ditemukan!'));
        }

        const pon = cekOlt.slice(cariSN).replace(/(\r\n|\n|\r)/gm, '').replace('ZXAN#', '')


        let cekOnu = await Olt.Conn(req.params.hostname, 'show gpon onu detail-info ' + pon + '\n show running-config interface ' + pon).then(data => data);
        console.log(cekOnu)


        const cariPhaseState = cekOnu.search('Phase state: ');
        const cariConfigState = cekOnu.search('Config state: ');
        const cariAdminStat = cekOnu.search('Admin state: ');
        const cariNama = cekOnu.search('Name: ');
        const cariType = cekOnu.search('Type: ');
        const cariDesc = cekOnu.search('Description: ');
        const cariVport = cekOnu.search('Vport mode: ');

        const parseAdminStatus = cekOnu.slice(cariAdminStat + 14, cariAdminStat + 30).replace(/\s/g, '').trimStart();
        const parseNama = cekOnu.slice(cariNama + 14, cariType).trimStart().replace(/(\r\n|\n|\r)/gm, '').trimStart().replace(/\s+$/, '');
        const parseDesc = cekOnu.slice(cariDesc + 14, cariVport).trimStart().replace(/(\r\n|\n|\r)/gm, '').trimStart().replace(/\s+$/, '');
        const parseState = cekOnu.slice(cariPhaseState + 14, cariConfigState).trimStart().replace(/(\r\n|\n|\r)/gm, '').trimStart().replace(/\s+$/, '');


        const Adminstatus = parseAdminStatus
        const nama = parseNama
        const Description = parseDesc
        const State = parseState

        let stat;
        let remote;

        switch (State) {
            case 'DyingGasp':
                stat = 'Power Off';
                break;
            case 'working':
                stat = 'Online';
                break;
            case 'OffLine':
                stat = 'Offline';
                break;
            case 'LOS':
                stat = 'Los';
                break;
        }

        if(stat === 'Online'){
            let cekDistance =  await Olt.Conn(req.params.hostname, 'show gpon onu distance ' + pon).then(data => data);
            const cari= cekOnu.search('Distance(m)');
            const parse = cekDistance.slice(cari + 130).replace(/(\r\n|\n|\r)/gm, '').replace('ZXAN#', '').replace(/\s/g, '').trimStart();
            const Distance = parse / 1

            let cekRemoteOnu =  await Olt.Conn(req.params.hostname, 'show gpon remote-onu interface pon ' + pon).then(data => data);
            const cariAwal = cekRemoteOnu.search('show gpon remote-onu interface pon');
            const cariAkhir = cekRemoteOnu.search('ZXAN#');
            const parseRedaman = cekRemoteOnu.slice(cariAwal + 51, cariAkhir -4).replace(/(\r\n|\n|\r)/gm, ':')
            const toJson = parseRedaman.split(':', 200)

            let cekEquip=  await Olt.Conn(req.params.hostname, 'show gpon remote-onu equip ' + pon).then(data => data);
            const cariAwalkEquip = cekEquip.search('show gpon remote-onu interface pon');
            const cariAkhirEquip = cekEquip.search('ZXAN#');
            const parseEquip = cekEquip.slice(cariAwalkEquip + 46, cariAkhirEquip -3).replace(/(\r\n|\n|\r)/gm, ':')
            const toJsonEquip = parseEquip.split(':', 200)

            remote = {
                'distance':Distance,
                'temperatur': toJson[38].replace(/\s/g, ''),
                'bias': toJson[36].replace(/\s/g, ''),
                'voltage': toJson[34].replace(/\s/g, ''),
                'rx': toJson[20].replace(/\s/g, ''),
                'tx': toJson[26].replace(/\s/g, ''),
                'vendor_id':  toJsonEquip[1].replace(/\s/g, ''),
                'version':  toJsonEquip[3].replace(/\s/g, ''),
                'sn':  toJsonEquip[5].replace(/\s/g, ''),
                'id':  toJsonEquip[23].replace(/\s/g, ''),
                'model':  toJsonEquip[29].replace(/\s/g, ''),
               
            }


        }

        if(stat === 'Power Off'){
            remote = null;
        }

        if(stat === 'Los'){
            remote = null;
        }

        if(stat === 'Offline'){
            remote = null;
        }



        let data = {
            'pon': pon,
            'admin': Adminstatus,
            'nama': nama,
            'alamat': Description,
            'state': stat,
            remote
        }

        return res.status(200).send({
            data: data
        })

      console.log(data)







    } catch (error) {
        console.log(error)
        return next(
            createError(500, error));
    }


}

exports.AddOnu = async function (req, res, next) {
    try {

        let iptv;
        let iptvGemport;
        let iptvService;


        if (!req.body.onu) {
            return next(
                createError(400, 'SN onu tidak boleh kosong!'));
        }

        if (!req.body.ponsel) {
            return next(
                createError(400, 'Ponsel pelanggan tidak boleh kosong!'));
        }

        if (!req.body.paket) {
            return next(
                createError(400, 'Nama Paket tidak boleh kosong!'));
        }



        if (!req.body.iptv) {
            iptv = false;
            iptvGemport = ''
            iptvService = ''
        }

        if (req.body.iptv == true) {
            iptv = true;
            mncGemport = '\n gemport 3 tcont 1 ' + '\n gemport 3 traffic-limit downstream DW_IPTV' + '\n service-port 3 vport 3 user-vlan 405 vlan 405'
            mncService = '\n service 3 gemport 3 vlan 405'

        } else {
            iptv = false
            mncGemport = ''
            mncService = ''
        }

        let NomorWhatsapp;

        if (req.body.ponsel.substring(0, 1) == 0) {
            NomorWhatsapp = '62' + req.body.ponsel.substring(1);
        }

        if (!NomorWhatsapp) {
            return next(
                createError(400, 'Format nomor ponsel tidak cucok!'));
        }

        let cekPelanggan = await Pelanggan.findOne({ ponsel: NomorWhatsapp });

        if (!cekPelanggan) {
            return next(
                createError(404, 'Pelanggan tidak ditemukan!'));
        }

        let onuUncfg = await Olt.Conn(req.params.hostname, 'show pon onu uncfg sn').then(data => data);
        const cariSN = onuUncfg.search(req.body.onu.toUpperCase());

        if (cariSN < 0) {
            return next(
                createError(404, 'Onu ' + req.body.onu.toUpperCase() + ' tidak ditemukan, periksa sumber listrik atau redaman onu!'));
        }

        const cekSN = onuUncfg.slice(cariSN)
        const SN = cekSN.split(' ')[0]

        const a = onuUncfg.slice(cariSN - 20, cariSN + 20);
        const b = a.replace(req.body.onu.toUpperCase(), '').replace(/\s/g, '').trimStart();
        const c = b.split('/', 5);
        const pon = c[0] + '/' + c[1] + '/' + c[2];


        const ConfigPort = await Olt.Conn(req.params.hostname, 'show interface ' + pon);

        const cariJumlahOnu = ConfigPort.search('registered onus is');
        const cariChannel = ConfigPort.search('Current channel num :');
        const NomorUrutOnu = ConfigPort.slice(cariJumlahOnu + 18, cariChannel - 1) / 1 + 1;

        const ONU = 'gpon-onu_1/' + c[1] + '/' + c[2] + ':' + NomorUrutOnu



        let configOnu = '\n conf t \n interface ' + pon +
            '\n onu ' + NomorUrutOnu + ' type HG6145F sn ' + SN + '\n !' +
            '\n interface ' + ONU +
            '\n name ' + cekPelanggan.nama +
            '\n description ' + cekPelanggan.alamat +
            '\n tcont 1 profile UP_' + req.body.paket +
            '\n gemport 1 tcont 1' +
            '\n gemport 1 traffic-limit downstream TR069' +
            '\n gemport 2 tcont 1' +
            '\n gemport 2 traffic-limit downstream DW_' + req.body.paket +
            mncGemport +
            '\n service-port 1 vport 1 user-vlan 100 vlan 100' +
            '\n service-port 2 vport 2 user-vlan 505 vlan 505 \n !' +
            '\n pon-onu-mng ' + ONU +
            '\n service 1 gemport 1 vlan 100' +
            '\n service 2 gemport 2 vlan 505' +
            mncService +
            '\n vlan port veip_1 mode trunk' +
            '\n tr069-mgmt 1 state unlock' +
            '\n tr069-mgmt 1 acs http://10..212.212.213:7547 validate basic username sumix password sumix \n ! \n'


        //console.log(configOnu)
        const addOnu = await Olt.Conn(req.params.hostname, configOnu);


        return res.status(200).send({
            pesan: 'Pendaftaran ONU berhasil',
            data: {
                onu: SN,
                pelanggan: cekPelanggan.nama,
                ponsel: cekPelanggan.ponsel,
                paket: req.body.paket,
                iptv: iptv,
                pon: pon,
                gpon: ONU,
                onuIndex: NomorUrutOnu

            }
        })







    } catch (error) {
        console.log(error)
        return next(
            createError(500, error));
    }
}





