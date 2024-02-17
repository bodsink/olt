const WizardScene = require('telegraf/scenes/wizard')
const moment = require('moment');
moment.locale('id');

const onuInfo = new WizardScene(
    'onuInfo',
    async (ctx) => {
        try {
            if (ctx.message.text === '/batal' || ctx.message.text === '/batal@kejoranet_bot' ) {
                ctx.reply('<i>Baik, info onu di batalkan</i>', {
                    parse_mode: "HTML"
                });
                return ctx.scene.leave();
            } else {
                ctx.wizard.state.data = {};
                ctx.reply('<i>Informasi Realtime ONU</i>\nSilahkan isi SN ONU', {
                    parse_mode: "HTML"
                });
                return ctx.wizard.next();
            };

        } catch (error) {
            console.log(error)
            ctx.reply('error dari serper', {
                parse_mode: "HTML"
            });
            return ctx.scene.leave()
        }
    },

    async (ctx) => {
        try {
            ctx.wizard.state.data.sn = ctx.message.text.toUpperCase();
            if (ctx.message.text === '/batal' || ctx.message.text === '/batal@kejoranet_bot' ) {
                ctx.reply('<i>Baik, info onu di batalkan</i>', {
                    parse_mode: "HTML"
                });
                return ctx.scene.leave();
            } else {

                ctx.reply('<i>Baik, melakukan pencarian onu ' + ctx.wizard.state.data.sn + ' silahkan tunggu .....</i>', {
                    parse_mode: "HTML"
                });

                let cekOnu = await Olt.SN(ctx.wizard.state.data.sn).then(data => data);
                console.log(cekOnu)

                if (cekOnu.response) {
                    ctx.reply('<b>' + cekOnu.response.data.pesan + '</b>', {
                        parse_mode: "HTML"
                    });
                    //return ctx.scene.leave();
                } else {
                    if (cekOnu.data.pelanggan === null) {
                        ctx.reply('<b>Onu tidak ditemukan!</b>', {
                            parse_mode: "HTML"
                        });
                    } else {



                        let isolir;
                        let bras;
                        let alamat;
                        let onu;
                        let mnc;


                        if (cekOnu.data.alamat === null) {
                            alamat = 'tidak ditemukan'
                        } else {
                            alamat = cekOnu.data.alamat
                        }

                        if (cekOnu.data.isolir === false) {
                            isolir = 'Tidak'
                        } else {

                            ctx.reply('<b>onu ditemukan:</b> \n\nSN: ' + ctx.message.text.toUpperCase() +
                                '\nStatus: ' + '<b>Non Aktif</b>' +
                                '\nPelanggan: ' + cekOnu.data.pelanggan +
                                '\nCID: ' + cekOnu.data.CID +
                                '\nAlamat: ' + alamat +

                                '\n\n<b>Onu ini dalam status Non Aktif, silahkan hubungi billing!</b>\n\n<i>Terakhir dilihat: ' + moment(cekOnu.data.update).format('DD MMMM YYYY HH:mm') + '</i>', {
                                parse_mode: "HTML"
                            });
                            return ctx.scene.leave();
                        };

                        if (cekOnu.data.status === 'Los') {
                            ctx.reply('<b>onu ditemukan:</b> \n\nSN: ' + ctx.message.text.toUpperCase() +
                                '\nStatus: <b>' + cekOnu.data.status + '</b>' +
                                '\nPelanggan: ' + cekOnu.data.pelanggan +
                                '\nCID: ' + cekOnu.data.CID +
                                '\nAlamat: ' + alamat +

                                '\n\n<b>Onu ini dalam status Los, lakukan pengecekan segera mungkin!</b>\n\n<i>Terakhir dilihat: ' + moment(cekOnu.data.update).format('DD MMMM YYYY HH:mm') + '</i>', {
                                parse_mode: "HTML"
                            });
                            return ctx.scene.leave();
                        }

                        if (cekOnu.data.status === 'Power Off') {
                            ctx.reply('<b>onu ditemukan:</b> \n\nSN: ' + ctx.message.text.toUpperCase() +
                                '\nStatus: <b>' + cekOnu.data.status + '</b>' +
                                '\nPelanggan: ' + cekOnu.data.pelanggan +
                                '\nCID: ' + cekOnu.data.CID +
                                '\nAlamat: ' + alamat +

                                '\n\n<i>Terakhir dilihat: ' + moment(cekOnu.data.update).format('DD MMMM YYYY HH:mm') + '</i>', {
                                parse_mode: "HTML"
                            });
                            return ctx.scene.leave();
                        }

                        if (cekOnu.data.status === 'Offline') {
                            ctx.reply('<b>onu ditemukan:</b> \n\nSN: ' + ctx.message.text.toUpperCase() +
                                '\nStatus: <b>' + cekOnu.data.status + '</b>' +
                                '\nPelanggan: ' + cekOnu.data.pelanggan +
                                '\nCID: ' + cekOnu.data.CID +
                                '\nAlamat: ' + alamat +

                                '\n\n<i>Terakhir dilihat: ' + moment(cekOnu.data.update).format('DD MMMM YYYY HH:mm') + '</i>', {
                                parse_mode: "HTML"
                            });
                            return ctx.scene.leave();
                        }



                        if (cekOnu.data.bras) {
                            bras = '\n\nBroadband Access Services (BRAS):' +
                                '\nAccess User: ' + cekOnu.data.bras.user +
                                '\nService Vlan: ' + cekOnu.data.bras.vlan +
                                '\nIPv4: ' + cekOnu.data.bras.ipv4 +
                                '\nUptime: ' + cekOnu.data.bras.uptime
                        } else {
                            bras = '\n\nBroadband Access Services (BRAS):\nBelum aktif'
                        }

                        //disini error 
                        if (cekOnu.data.onu === null) {
                            onu = cekOnu.data.status
                        } else {
                            if (cekOnu.data.onu.mnc === false) {
                                mnc = '✖️'
                            } else {
                                mnc = '✔️'
                            }

                            let merekOnu;

                            switch (cekOnu.data.onu.vendor) {
                                case 'FHTT':
                                    merekOnu = 'Fiberhome';
                                    break;
                                case 'CIOT':
                                    merekOnu = 'No Brand/Xpon';
                                    break;
                                case 'ZTEG':
                                    merekOnu = 'ZTE';
                                    break;
                                case 'ELWG':
                                    merekOnu = 'ZTE';
                                    break;
                                case 'BTPT':
                                    merekOnu = 'BTPON';
                                    break;
                                default:
                                    merekOnu = 'Tidak diketahui';


                            }

                            onu = '\n\nDetail Onu:' +
                                '\nPort: ' + cekOnu.data.onu.interfaces +
                                '\nUpload: ' + cekOnu.data.onu.upload.replace('UP_', '') +
                                '\nDownload: ' + cekOnu.data.onu.download.replace('DW_', '') +
                                '\nMNC Play: ' + mnc +
                                '\nVendor ID: ' + cekOnu.data.onu.vendor +
                                '\nBrand: ' + merekOnu +
                                '\nVersion: ' + cekOnu.data.onu.version +
                                '\nModel: ' + cekOnu.data.onu.model +
                                '\n\nPengukuran Onu:' +
                                '\nUptime: ' + cekOnu.data.onu.optical.uptime +
                                '\nJarak: ' + cekOnu.data.onu.optical.distance / 1000 + 'Km' +
                                '\nRx: ' + cekOnu.data.onu.optical.rx +
                                '\nTx: ' + cekOnu.data.onu.optical.tx +
                                '\nVoltase: ' + cekOnu.data.onu.optical.voltage +
                                '\nBias Current: ' + cekOnu.data.onu.optical.bias +
                                '\nTemperatur: ' + cekOnu.data.onu.optical.temperature
                        }

                        ctx.reply('<b>onu ditemukan:</b> \n\nSN: ' + ctx.message.text.toUpperCase() +
                            '\nStatus: ' + cekOnu.data.status +
                            '\nPelanggan: ' + cekOnu.data.pelanggan +
                            '\nCID: ' + cekOnu.data.CID +
                            '\nAlamat: ' + alamat +
                            onu + bras +
                            '\n\n<i>Terakhir dilihat: ' + moment(cekOnu.data.onu.update).format('DD MMMM YYYY HH:mm') + '</i>', {
                            parse_mode: "HTML"
                        });

                        return ctx.scene.leave();
                    }
                }

            };

        } catch (error) {
            console.log(error)
            ctx.reply('error dari serper', {
                parse_mode: "HTML"
            });
            return ctx.scene.leave()
        }
    }
)



module.exports = onuInfo;