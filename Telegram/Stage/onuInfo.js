const WizardScene = require('telegraf/scenes/wizard')
const moment = require('moment');
moment.locale('id');

const API = require('../Class/Class.Api');

const onuInfo = new WizardScene(
    'onuInfo',
    async (ctx) => {
        try {
            if (ctx.message.text === '/batal' || ctx.message.text === '/batal@kejoranet_bot') {
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

            if (ctx.message.text === '/batal' || ctx.message.text === '/batal@kejoranet_bot') {
                ctx.reply('<i>Baik, info onu di batalkan</i>', {
                    parse_mode: "HTML"
                });
                return ctx.scene.leave();
            } else {
                ctx.wizard.state.data.sn = ctx.message.text.toUpperCase();

                ctx.reply('<i>Baik, melakukan pencarian onu ' + ctx.wizard.state.data.sn + ' silahkan tunggu .....</i>', {
                    parse_mode: "HTML"
                });

                let cekOnu = await API.SN(ctx.wizard.state.data.sn).then(data => data);
                console.log(cekOnu)

                if (cekOnu.response) {

                    ctx.reply('<b>' + cekOnu.response.data.pesan + '</b>', {
                        parse_mode: "HTML"
                    });
                    //return ctx.scene.leave();
                } else {

                    let onu;

                    if (cekOnu.data.state === 'Online') {
                        onu = '\n\nPengukuran ONU \nRX: ' + cekOnu.data.remote.rx + '\nTx: ' + cekOnu.data.remote.tx +
                            '\nJarak: ' + cekOnu.data.remote.distance / 1000 + 'Km' +
                            '\nBias: ' + cekOnu.data.remote.bias +
                            '\nVoltage: ' + cekOnu.data.remote.voltage +
                            '\nTemperatur: ' + cekOnu.data.remote.temperatur + 
                            '\n\nEquipment ONU' +
                            '\nVendor ID: ' + cekOnu.data.remote.vendor_id + 
                            '\nVersion: ' + cekOnu.data.remote.version +
                            '\nModel: ' + cekOnu.data.remote.model

                    } else {
                        onu = ''
                    }

                    ctx.reply('<b>onu ditemukan:</b> \n\nSN: ' + ctx.message.text.toUpperCase() +
                        '\nStatus: ' + cekOnu.data.state +
                        '\nPelanggan: ' + cekOnu.data.nama +
                        '\nDiskripsi: ' + cekOnu.data.alamat +
                        onu, {
                        parse_mode: "HTML"
                    });

                    return ctx.scene.leave();

                }
            }



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