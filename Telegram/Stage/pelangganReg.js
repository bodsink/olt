const WizardScene = require('telegraf/scenes/wizard')
const moment = require('moment');
moment.locale('id');

const API = require('../Class/Class.Api');


function Karakter(id) {
    return id.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
}


const pelangganReg = new WizardScene(
    'pelangganReg',
    async (ctx) => {
        try {
            if (ctx.message.text === '/batal' || ctx.message.text === '/batal@kejoranet_bot') {
                ctx.reply('<i>Baik, Pendaftaran Pelanggan di batalkan</i>', {
                    parse_mode: "HTML"
                });
                return ctx.scene.leave();
            } else {
                ctx.wizard.state.data = {};
                ctx.reply('<i>Pendaftaran pelanggan</i>\nSilahkan isi Nama Lengkap', {
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
                ctx.reply('<i>Baik, Pendaftaran Pelanggan di batalkan</i>', {
                    parse_mode: "HTML"
                });
                return ctx.scene.leave();
            } else {
                ctx.wizard.state.data.nama = Karakter(ctx.message.text);
                ctx.reply('Nama: '+ ctx.wizard.state.data.nama + ' \nSilahkan isi Nomor Whatsapp', {
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
                ctx.reply('<i>Baik, Pendaftaran Pelanggan di batalkan</i>', {
                    parse_mode: "HTML"
                });
                return ctx.scene.leave();
            } else {
                ctx.wizard.state.data.nama = Karakter(ctx.message.text);
                ctx.reply('<i>Pendaftaran pelanggan</i>\nSilahkan isi Nama Lengkap', {
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
)

module.exports = pelangganReg;