//Dependencies
const Discord = require("discord.js")
const Axios = require("axios")
const Is2 = require("is2")
const Fs = require("fs")

//Variables
const Bot = new Discord.Client()

var Self = {
    prefix: "CD!",
    bot_token: ""
}

//Main
Bot.on("ready", ()=>{
    Bot.user.setActivity("CD!help | CDisPwned")
    console.log("CDisPwned is running.")
})

Bot.on("message", async(message)=>{
    if(!message.guild){
        return
    }

    var message_args = message.content.split(" ")

    if(message.content === `${Self.prefix}help`){
        const embed = new Discord.MessageEmbed()
        .setTitle("CDisPwned | Help")
        .addField("CD!help", "Show DisPwned help menu.")
        .addField("CD!ispwned <email/phone number>", "Checks if the email/phone number is pwned.")
        .setColor("#0B1521")

        message.reply(embed)
    }else if(message_args[0] === `${Self.prefix}ispwned`){
        const files = Fs.readdirSync("./database", "utf8")
        const urls = require("./online_links.json")

        var pwned = false

        if(Is2.emailAddress(message_args[1])){
            message.reply("Checking if the email is pwned, please wait.")
            for( i in files ){
                let file_data = Fs.readFileSync(`./database/${files[i]}`, "utf8")

                if(file_data.indexOf(`${message_args[1]}:`) !== -1){
                    pwned = true
                }
            }

            for( i in urls ){
                try{
                    let response = await Axios(urls[i], {
                        method: "GET"
                    })

                    if(response.data.indexOf(`${message_args[1]}:`) !== -1){
                        pwned = true
                    }
                }catch{}
            }

            if(pwned){
                message.reply("The email is pwned.")
            }else{
                message.reply("The email is not pwned.")
            }
        }else if(Is2.phoneNumber(message_args[1])){
            message.reply("Checking if the phone number is pwned, please wait.")

            for( i in files ){
                let file_data = Fs.readFileSync(`./database/${files[i]}`, "utf8")

                if(file_data.indexOf(message_args[1]) !== -1){
                    pwned = true
                }
            }

            for( i in urls ){
                try{
                    let response = await Axios(urls[i], {
                        method: "GET"
                    })

                    if(response.data.indexOf(message_args[1]) !== -1){
                        pwned = true
                    }
                }catch{}
            }

            if(pwned){
                message.reply("The phone number is pwned.")
            }else{
                message.reply("The phone number is not pwned.")
            }
        }else{
            message.reply("Invalid email/phone number.")
            return
        }
    }
})

Bot.login(Self.bot_token)
