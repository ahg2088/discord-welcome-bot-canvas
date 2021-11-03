const Discord = require("discord.js");
const Canvas = require("canvas");
const fse = require("fs-extra");
const fs = require("fs");
const client = new Discord.Client({ws: { intents: new Discord.Intents(Discord.Intents.ALL)}});

client.once("ready", () => {
    console.log(`${client.user.tag} listo !!!`);
});

async function ExistWelcome(server){
    var path = `./welcome/${server}.json`;
    try {
        return fs.existsSync(path);
    } catch (e) {return false;}
}

async function CreateWelcome(server){
    fse.outputFile(`./welcome/${server}.json`, 
    `{"background": "https://cdn.discordapp.com/attachments/898769926884581472/905265066566352906/background.jpg", 
    "welcomeMessage": "Se bienvenido a (Tu servidor), no olvides leer las reglas para no ser sancionado y disfruta de la estadia en el server",
    "welcomeTitle": "Bienvenido a (Tu servidor)",
    "welcomeFooter": "Gracias por visitar nuestro server :D",
    "Channel": "false",
    "Color": "#ffffff"}`).then(() => {
        console.log(`Correcto`);
    }).catch(err => console.log(err));
}

async function PruebaDeResultado(server, message){
    const welcomeDB = require(`./welcome/${server}.json`);
    const canvas = Canvas.createCanvas(1024, 500);
    const context = canvas.getContext('2d');
    const background = await Canvas.loadImage(welcomeDB.background);
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    //Mensaje de bienvenida
    context.textAlign = "center";
    context.font = "72px sans-serif";
    context.fillStyle = welcomeDB.Color;
    context.fillText(welcomeDB.welcomeTitle,512,360);
    //Nombre del usuario
    context.font = "42px sans-serif";
    context.fillText(message.author.tag,512,420);
    //Mensaje de agradecimiento
    context.font = "32px sans-serif";
    context.fillText(welcomeDB.welcomeFooter,512,480);
    //Redondear imagen
    context.beginPath();
    context.arc(512, 166, 119, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();
    const avatar = await Canvas.loadImage(message.author.displayAvatarURL({ size: 1024, format: 'jpg'}));
    context.drawImage(avatar, 393, 47, 238, 238);
    //Enviar la imagen
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'profile-image.png');
    message.channel.send(welcomeDB.welcomeMessage, attachment);
}

client.on('guildMemberAdd', async function(member){
    var server = member.guild.id;
    var tiene = await ExistWelcome(server);
    if(tiene){
        try {
            const welcomeDB = require(`./welcome/${server}.json`);
        const canvas = Canvas.createCanvas(1024, 500);
        const context = canvas.getContext('2d');
        const background = await Canvas.loadImage(welcomeDB.background);
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        //Mensaje de bienvenida
        context.textAlign = "center";
        context.font = "72px sans-serif";
        context.fillStyle = welcomeDB.Color;
        context.fillText(welcomeDB.welcomeTitle,512,360);
        //Nombre del usuario
        context.font = "42px sans-serif";
        context.fillText(member.user.tag,512,420);
        //Mensaje de agradecimiento
        context.font = "32px sans-serif";
        context.fillText(welcomeDB.welcomeFooter,512,480);
        //Redondear imagen
        context.beginPath();
        context.arc(512, 166, 119, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();
        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ size: 1024, format: 'jpg'}));
        context.drawImage(avatar, 393, 47, 238, 238);
        //Enviar la imagen
        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'profile-image.png');
        member.guild.channels.cache.get(welcomeDB.Channel).send(welcomeDB.welcomeMessage, attachment); 
          } catch (error) {
            console.error(error);
          }
    }
})

client.on("message", async message => {
    //message.mentions.channels.first().id;
    const PREFIX = "!";
    if(message.content.toLowerCase().startsWith(`${PREFIX}setchannel`)) {
        var server = message.guild.id;
        var tiene = await ExistWelcome(server);
        if(!tiene){
            CreateWelcome(server);
            message.reply("Se ha creado el la base de datos de bienvenida, vuelva a ejecutar el comando");
        } else {
            const welcomeDB = require(`./welcome/${server}.json`);
            if(message.mentions.channels.first()){
                welcomeDB.Channel = message.mentions.channels.first().id;
                fse.outputFile(`./welcome/${server}.json`, JSON.stringify(welcomeDB)).then(() => {
                    console.log(`Correcto`);
            }).catch(err => console.log(err));
                message.reply("Se ha cambiado el canal de bienvenida");
            } else {
                message.reply("No se ha podido cambiar el canal de bienvenida");
            }
            
        }
    }
    if(message.content.toLowerCase().startsWith(`${PREFIX}setmessage`)) {
        var server = message.guild.id;
        var tiene = await ExistWelcome(server);
        if(!tiene){
            CreateWelcome(server);
            message.reply("Se ha creado el la base de datos de bienvenida, vuelva a ejecutar el comando");
        } else {
            const welcomeDB = require(`./welcome/${server}.json`);
            welcomeDB.welcomeMessage = message.content.substring(12);
            fse.outputFile(`./welcome/${server}.json`, JSON.stringify(welcomeDB)).then(() => {
                console.log(`Correcto`);
            }).catch(err => console.log(err));
            message.reply("Se ha cambiado el mensaje de bienvenida");
            PruebaDeResultado(server, message);
        }
    }
    if(message.content.toLowerCase().startsWith(`${PREFIX}setbackground`)) {
        var server = message.guild.id;
        var tiene = await ExistWelcome(server);
        if(!tiene){
            CreateWelcome(server);
            message.reply("Se ha creado el la base de datos de bienvenida, vuelva a ejecutar el comando");
        } else {
            const welcomeDB = require(`./welcome/${server}.json`);
            welcomeDB.background = message.attachments.first().url;
            fse.outputFile(`./welcome/${server}.json`, JSON.stringify(welcomeDB)).then(() => {
                console.log(`Correcto`);
            }).catch(err => console.log(err));
            message.reply("Se ha cambiado el background de bienvenida");
            PruebaDeResultado(server, message);
        }
    }
    if(message.content.toLowerCase().startsWith(`${PREFIX}setcolor`)) {
        var server = message.guild.id;
        var tiene = await ExistWelcome(server);
        if(!tiene){
            CreateWelcome(server);
            message.reply("Se ha creado el la base de datos de bienvenida, vuelva a ejecutar el comando");
        } else {
            const welcomeDB = require(`./welcome/${server}.json`);
            welcomeDB.Color = message.content.substring(10);
            fse.outputFile(`./welcome/${server}.json`, JSON.stringify(welcomeDB)).then(() => {
                console.log(`Correcto`);
            }).catch(err => console.log(err));
            message.reply("Se ha cambiado el color de bienvenida");
            PruebaDeResultado(server, message);
        }
    }
    if(message.content.toLowerCase().startsWith(`${PREFIX}setwelcometitle`)) {
        var server = message.guild.id;
        var tiene = await ExistWelcome(server);
        if(!tiene){
            CreateWelcome(server);
            message.reply("Se ha creado el la base de datos de bienvenida, vuelva a ejecutar el comando");
        } else {
            const welcomeDB = require(`./welcome/${server}.json`);
            welcomeDB.welcomeTitle = message.content.substring(17);
            fse.outputFile(`./welcome/${server}.json`, JSON.stringify(welcomeDB)).then(() => {
                console.log(`Correcto`);
            }).catch(err => console.log(err));
            message.reply("Se ha cambiado el titulo de bienvenida");
            PruebaDeResultado(server, message);
        }
    }
    if(message.content.toLowerCase().startsWith(`${PREFIX}setwelcomefooter`)) {
        var server = message.guild.id;
        var tiene = await ExistWelcome(server);
        if(!tiene){
            CreateWelcome(server);
            message.reply("Se ha creado el la base de datos de bienvenida, vuelva a ejecutar el comando");
        } else {
            const welcomeDB = require(`./welcome/${server}.json`);
            welcomeDB.welcomeFooter = message.content.substring(18);
            fse.outputFile(`./welcome/${server}.json`, JSON.stringify(welcomeDB)).then(() => {
                console.log(`Correcto`);
            }).catch(err => console.log(err));
            message.reply("Se ha cambiado el footer de bienvenida");
            PruebaDeResultado(server, message);
        }
    }
    if(message.content.toLowerCase().startsWith(`${PREFIX}welcometest`)) {
        var server = message.guild.id;
        var tiene = await ExistWelcome(server);
        if(!tiene){
            CreateWelcome(server);
            message.reply("Se ha creado el la base de datos de bienvenida, vuelva a ejecutar el comando");
        } else {
            PruebaDeResultado(server, message);
        }
    }
    if(message.content.toLowerCase().startsWith(`${PREFIX}welcomereset`)) {
        var server = message.guild.id;
        var tiene = await ExistWelcome(server);
        if(!tiene){
            CreateWelcome(server);
            message.reply("Se ha creado el la base de datos de bienvenida, vuelva a ejecutar el comando");
        } else {
            const welcomeDB = require(`./welcome/${server}.json`);
            welcomeDB.Channel = "false";
            welcomeDB.welcomeMessage = "Se bienvenido a (Tu servidor), no olvides leer las reglas para no ser sancionado y disfruta de la estadia en el server";
            welcomeDB.background = "https://cdn.discordapp.com/attachments/898769926884581472/905265066566352906/background.jpg";
            welcomeDB.Color = "#ffffff";
            welcomeDB.welcomeTitle = "Bienvenido a (Tu servidor)";
            welcomeDB.welcomeFooter = "Gracias por visitar nuestro server :D";
            fse.outputFile(`./welcome/${server}.json`, JSON.stringify(welcomeDB)).then(() => {
                console.log(`Correcto`);
            }).catch(err => console.log(err));
            message.reply("Se ha reseteado el mensaje de bienvenida");
            PruebaDeResultado(server, message);
        }
    }
});

client.login("Your token");
