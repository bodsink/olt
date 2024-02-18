const WizardScene = require('telegraf/scenes/wizard')
const moment = require('moment');
moment.locale('id');


function Karakter(id) {
    return id.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
}

const API = require('../Class/Class.Api');


const addPaket = new WizardScene(
    'addPaket',
    async (ctx) => {
        try {
            if (ctx.message.text === '/batal' || ctx.message.text === '/batal@actcpdnbot') {
                ctx.reply('<i>Baik, Penambahan Paket di batalkan</i>', {
                    parse_mode: "HTML"
                });
                return ctx.scene.leave();
            } else {
                ctx.wizard.state.data = {};
                ctx.reply('<i>Penambahan Paket </i>\nSilahkan isi Nama Paket', {
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
            if (ctx.message.text === '/batal' || ctx.message.text === '/batal@actcpdnbot') {
                ctx.reply('<i>Baik, Penambahan Paket di batalkan</i>', {
                    parse_mode: "HTML"
                });
                return ctx.scene.leave();
            } else {
                ctx.wizard.state.data.nama = Karakter(ctx.message.text)
                ctx.reply('\nNama Paket: ' + ctx.wizard.state.data.nama + '\n\nSilahkan isi Besar Upload(Mbps)\n<i>isi dengan angka</i>', {
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
            if (ctx.message.text === '/batal' || ctx.message.text === '/batal@actcpdnbot') {
                ctx.reply('<i>Baik, Penambahan Paket di batalkan</i>', {
                    parse_mode: "HTML"
                });
                return ctx.scene.leave();
            } else {
                ctx.wizard.state.data.upload = ctx.message.text / 1;
                ctx.reply('\nNama Paket: ' + ctx.wizard.state.data.nama + '\nUpload: ' + ctx.wizard.state.data.upload + 'Mbps \n\nSilahkan isi Besar Download(Mbps)\n<i>isi dengan angka</i>', {
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
            if (ctx.message.text === '/batal' || ctx.message.text === '/batal@actcpdnbot') {
                ctx.reply('<i>Baik, Penambahan Paket di batalkan</i>', {
                    parse_mode: "HTML"
                });
                return ctx.scene.leave();
            } else {
                ctx.wizard.state.data.download = ctx.message.text / 1;
                ctx.reply('\nNama Paket: ' + ctx.wizard.state.data.nama + '\nUpload: ' + ctx.wizard.state.data.upload + 'Mbps\nDownload: ' + ctx.wizard.state.data.download + 'Mbps \n\nSilahkan isi Harga untuk paket ini(Rp.)\n<i>isi dengan angka</i>', {
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
            if (ctx.message.text === '/batal' || ctx.message.text === '/batal@actcpdnbot') {
                ctx.reply('<i>Baik, Penambahan Paket di batalkan</i>', {
                    parse_mode: "HTML"
                });
                return ctx.scene.leave();
            } else {
                ctx.wizard.state.data.harga = ctx.message.text / 1;

                ctx.wizard.state.data.iya = Math.floor(Math.random() * 90 + 10)
                ctx.wizard.state.data.tidak = Math.floor(Math.random() * 90 + 10)

                ctx.reply('\nNama Paket: ' + ctx.wizard.state.data.nama + '\nUpload: ' +
                    ctx.wizard.state.data.upload + 'Mbps\nDownload: ' +
                    ctx.wizard.state.data.download +
                    'Mbps \nHarga: Rp. ' + Intl.NumberFormat().format(ctx.wizard.state.data.harga) +
                    '\n\nUntuk melanjutkan Jawab dengan <b>' + ctx.wizard.state.data.iya + '</b> atau <b>' + ctx.wizard.state.data.tidak + '</b> untuk membatalkan', {
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
        ctx.wizard.state.data.konfirmasi = ctx.message.text;
        try {
            if (ctx.message.text === '/batal' || ctx.message.text === '/batal@actcpdnbot') {
                ctx.reply('<i>Baik, Penambahan Paket di batalkan</i>', {
                    parse_mode: "HTML"
                });
                return ctx.scene.leave();
            } else {
                if (ctx.wizard.state.data.konfirmasi == ctx.wizard.state.data.iya || ctx.wizard.state.data.konfirmasi == ctx.wizard.state.data.tidak) {
                    if (ctx.wizard.state.data.konfirmasi == ctx.wizard.state.data.iya) {

                        let form = {
                            'nama': ctx.wizard.state.data.nama,
                            'upload': ctx.wizard.state.data.upload,
                            'download': ctx.wizard.state.data.download,
                            'harga': ctx.wizard.state.data.harga
                        }

                        let simpan = await API.Paket(form).then(data => data);
                        

                        if (simpan.response) {
                            ctx.reply('<b>' + simpan.response.data.pesan + '</b>', {
                                parse_mode: "HTML"
                            });
                            return ctx.scene.leave();
                        } else {
                            ctx.reply('<i>' + simpan.pesan + '</i>', {
                                parse_mode: "HTML"
                            });
                            return ctx.scene.leave();
                        }


                    }
                    if (ctx.wizard.state.data.konfirmasi == ctx.wizard.state.data.tidak) {

                        ctx.reply('<i>Baik, Penambahan Paket dibatalkan</i>', {
                            parse_mode: "HTML"
                        });
                        return ctx.scene.leave()
                    }
                } else {
                    ctx.reply('\n\nUntuk melanjutkan Jawab dengan <b>' + ctx.wizard.state.data.iya + '</b> atau <b>' + ctx.wizard.state.data.tidak + '</b> untuk membatalkan', {
                        parse_mode: "HTML"
                    });
                }







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

module.exports = addPaket;