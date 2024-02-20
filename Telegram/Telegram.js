const fs = require('fs');
const Telegraf = require('telegraf')
const Composer = require('telegraf/composer')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Markup = require('telegraf/markup')
const Extra = require('telegraf/extra')
const WizardScene = require('telegraf/scenes/wizard')
const axios = require('axios');

require('dotenv').config()




const Stages = {};
const stages_path = process.cwd() + '/Stage';


fs.readdirSync(stages_path).forEach(function (file) {
    if (file.indexOf('.js') !== -1) {
        Stages[file.split('.')[0]] = require(stages_path + '/' + file);
    }
});


const stage = new Stage([Stages.onuInfo, Stages.addPaket, Stages.pelangganReg, Stages.State]);
const bot = new Telegraf(process.env.bot);
bot.use(session());
bot.use(stage.middleware());




bot.command('/addpaket', async (ctx) => {
    try {
        if (ctx.chat.id == process.env.group || ctx.chat.id == '493223080' || ctx.chat.id == '351111110') {
            ctx.scene.enter('addPaket')
        } else {
            ctx.reply('<b>Hanya Bisa diakses Dari Group!</b>', {
                parse_mode: "HTML"
            });
        }

    } catch (err) {
        console.log(err)
    }

});


bot.command('/pelreg', async (ctx) => {
    try {
        if (ctx.chat.id == process.env.group || ctx.chat.id == '493223080' || ctx.chat.id == '351111110') {
            ctx.scene.enter('pelangganReg')
        } else {
            ctx.reply('<b>Hanya Bisa diakses Dari Group!</b>', {
                parse_mode: "HTML"
            });
        }

    } catch (err) {
        console.log(err)
    }

});


bot.command('/gponstate', async (ctx) => {
    try {
        if (ctx.chat.id == process.env.group || ctx.chat.id == '493223080' || ctx.chat.id == '351111110') {
            ctx.scene.enter('State')
        } else {
            ctx.reply('<b>Hanya Bisa diakses Dari Group!</b>', {
                parse_mode: "HTML"
            });
        }

    } catch (err) {
        console.log(err)
    }

});


//test
bot.hears('test', async (ctx) => {
    try {
        console.log(ctx.chat)
        ctx.reply(ctx.chat, {
            parse_mode: "HTML"
        });
        

    } catch (err) {
        console.log(err)
    }

});
bot.command('/onuinfo', async (ctx) => {
    try {

        if (ctx.chat.id == process.env.group || ctx.chat.id == '493223080' || ctx.chat.id == '351111110') {
           ctx.scene.enter('onuInfo')
        } else {
            ctx.reply('<b>Hanya Bisa diakses Dari Group!</b>', {
                parse_mode: "HTML"
            });
        }

    } catch (err) {
        console.log(err)
    }

});



bot.launch();

