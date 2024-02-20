const WizardScene = require('telegraf/scenes/wizard')
const moment = require('moment');
moment.locale('id');


const API = require('../Class/Class.Api');

const State = new WizardScene(
    'State',
    async (ctx) => {
        try {
            if (ctx.message.text === '/batal' || ctx.message.text === '/batal@actcpdnbot') {
                ctx.reply('<i>Baik, Informasi status GPON ONU di batalkan</i>', {
                    parse_mode: "HTML"
                });
                return ctx.scene.leave();
            } else {
                ctx.wizard.state.data = {};
                ctx.reply('<i>Informasi status GPON ONU \nMengkalkulasi GPON silahkan tunggu ....</i>', {
                    parse_mode: "HTML"
                });
                let cek = await API.GponState().then(data=>data);
              
                if (cek.response) {
                    ctx.reply('<b>' + cek.response.data.pesan + '</b>', {
                        parse_mode: "HTML"
                    });
                    return ctx.scene.leave();
                } else {
                    ctx.reply('Total ONU: ' + cek.data.total + '\nOffline: ' + cek.data.offline, {
                        parse_mode: "HTML"
                    });
                    return ctx.scene.leave();
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

module.exports = State;