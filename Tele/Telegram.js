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


const stage = new Stage([]);
const bot = new Telegraf(process.env.bot);
bot.use(session());
bot.use(stage.middleware());




// bot.command('/onuinfo', async (ctx) => {
//     try {
//         if (ctx.chat.id == process.env.group || ctx.chat.id == '493223080') {
//             ctx.scene.enter('onuInfo')
//         } else {
//             ctx.reply('<b>Hanya Bisa diakses Dari Group!</b>', {
//                 parse_mode: "HTML"
//             });
//         }

//     } catch (err) {
//         console.log(err)
//     }

// });

// bot.command('/onuwan', async (ctx) => {
//     try {
//         if (ctx.chat.id == process.env.group || ctx.chat.id == '493223080') {
//             ctx.scene.enter('onuWan')
//         } else {
//             ctx.reply('<b>Hanya Bisa diakses Dari Group!</b>', {
//                 parse_mode: "HTML"
//             });
//         }

//     } catch (err) {
//         console.log(err)
//     }

// });

// bot.command('/stbreg', async (ctx) => {
//     try {
//         if (ctx.chat.id == process.env.group || ctx.chat.id == '493223080') {
//             ctx.scene.enter('stbReg')
//         } else {
//             ctx.reply('<b>Hanya Bisa diakses Dari Group!</b>', {
//                 parse_mode: "HTML"
//             });
//         }

//     } catch (err) {
//         console.log(err)
//     }

// });


//test
bot.command('/a', async (ctx) => {
    try {
       console.log(ctx.update.message.from)

    } catch (err) {
        console.log(err)
    }

});



bot.launch();

