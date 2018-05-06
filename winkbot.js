const Discord = require('discord.js')
const bot = new Discord.Client();

const config = require("./config.json");
var WolframLib = require('node-wolfram');
var Wolfram = new WolframLib(config.wolfram);
var resultOpts = ["Result", "Exact result", "Decimal approximation"];

var sys = require('util');
var exec = require('child_process').exec;

var request = require('request');
const superagent = require("superagent");

var MD5 = require("crypto-js/md5");
var SHA256 = require("crypto-js/sha256");

let price = require('crypto-price')

var YouTube = require('youtube-node');
var youTube = new YouTube();
youTube.setKey(config.youtube);


bot.on('ready', () => {
    bot.user.setActivity('Aide : ' + config.prefix + 'help')
    bot.user.setStatus('online');
})


bot.on("message", async message => {

    if (message.author.bot) return;
    if (message.content.indexOf(config.prefix) !== 0) return;
    var input = message.content.toLowerCase().split(" ");
    subject = input.join("+");
    let arguments = message.content.split(" ")
    let suffix = arguments.join(" ")
    let botRoleColor = 0x00AE86

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "say") {
        const sayMessage = args.join(" ");
        var say = message.content.substring(5);
        if (say == '') {
            if ((message.author.id == (config.owner)) || (message.member.hasPermission('KICK_MEMBERS'))) {
                message.reply('vous devez mettre une phrase.')
                message.delete()
            } else {
                message.reply("vous ne pouvez pas me faire parler. :frowning:")
                message.delete()
            }
        }
        if (say) {
            if ((message.author.id == (config.owner)) || (message.member.hasPermission('KICK_MEMBERS'))) {
                if (say.startsWith(' ./say')) {
                    message.reply('la commande ne peut pas se superposer.')
                    message.delete()
                } else {
                    message.delete().catch(O_o => {});
                    message.channel.send(say);
                }
            } else {
                message.reply("vous ne pouvez pas me faire parler. :frowning:")
                message.delete()
            }
        }
    }

    if (command === "ping") {
        const m = await message.channel.send("Chargement...");
        m.edit(`:ping_pong: Pong ! Votre latence est de ${m.createdTimestamp - message.createdTimestamp}ms. La latence de l'API est de ${Math.round(bot.ping)}ms.`);
    }

    if (command === "reverse") {
        var text = message.content.substring(9);
        if (text == '') {
            message.reply('vous devez entrer un mot ou une phrase. :wink:')
        } else {

            var reversed = '';
            var i = text.length;

            while (i > 0) {
                reversed += text.substring(i - 1, i);
                i--;
            }

            message.reply(reversed);
        }
    }

    if (command === "gif") {
        var gif = message.content.substring(5);

        if (gif == '') {
            message.reply("vous devez entrer un mot clef après " + config.prefix + "gif. :wink:");
        } else {
            var search = "http://api.giphy.com/v1/gifs/random?api_key=" + config.giphy + "&tag=" + args;
            request(search, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    body = body.split("\\").join("");
                    var obj = JSON.parse(body);
                    obj = obj["data"].url;
                    if (!obj) {
                        message.reply("je n'ai rien trouvé. :disappointed_relieved:")
                    } else {
                        message.reply("votre gif :\n" + obj);
                    }
                }
            });

        }
    }

    if (command === "dog") {
        request('https://random.dog/woof.json?filter=mp4,webm', (e, r, b) => {
            let pic = JSON.parse(b)
            const embed = new Discord.RichEmbed()
                .setTitle("Votre chien :dog: :")
                .setColor(config.color)
                .setFooter("WinkBOT " + config.version)
                .setImage(pic.url)
                .setTimestamp()
            message.channel.send({
                embed
            });
        })
    }
    if (command === "cat") {
        request('http://aws.random.cat/meow?filter=mp4,webm', (e, r, b) => {
            let pic = JSON.parse(b)
            const embed = new Discord.RichEmbed()
                .setTitle("Votre chat :cat: :")
                .setColor(config.color)
                .setFooter("WinkBOT " + config.version)
                .setImage(pic.file)
                .setTimestamp()
            message.channel.send({
                embed
            });
        })
    }

    if (command === "lmgtfy") {
        var lmgtfy = message.content.substring(8);

        if (lmgtfy == '') {
            message.reply("vous devez entrer un mot clef après " + config.prefix + "lmgtfy. :wink:");

        } else {
            message.reply("Votre lmgtfy :\nhttp://lmgtfy.com/?q=" + args);

        }

    }

    if (command === "avatar") {
        var avatar = message.content.substring(8);
        if (avatar == '') {
            const embed = new Discord.RichEmbed()
                .setColor(config.color)
                .setFooter("WinkBOT " + config.version)
                .setTimestamp()
                .setTitle("Avatar de " + message.author.username)
                .setImage(message.author.avatarURL)
            message.reply({
                embed
            });
        } else {
            if (message.mentions.users.size === 0) {
                return message.reply("merci de mentionner une personne. :wink:")
            }
            let mentionedUser = message.mentions.users.first()
            const embed = new Discord.RichEmbed()
                .setColor(config.color)
                .setFooter("WinkBOT " + config.version)
                .setTimestamp()
                .setTitle("Avatar de " + mentionedUser.username)
                .setImage(mentionedUser.avatarURL)
            message.reply({
                embed
            });
        }
    }


    if (command === "userinfo") {
        var userinfo = message.content.substring(10);


        if (userinfo == '') {

            var game = "Jeu"
            if (!message.author.presence.game) {
                game = "Rien pour le moment..."
            } else {
                game = message.author.presence.game.name
            }
            const embed = new Discord.RichEmbed()
            embed.setTitle('Informations sur l’utilisateur')
                .setColor(config.color)
                .setFooter("WinkBOT " + config.version)
                .setThumbnail(message.author.avatarURL)
                .setTimestamp()
                .addField('Pseudo :', `${message.author.username}` + '#' + `${message.author.discriminator}`, true)
                .addField('Joue à :', `${game}`, true)
                .addField('Est-ce un bot ?', `${message.author.bot}`, true)
                .addField('Date d’inscription :', `${message.author.createdAt}`, true);
            message.reply({
                embed
            });
        } else {
            if (message.mentions.users.size === 0) {
                return message.channel.send("Merci de mentionner une personne. :wink:")
            }
            let mentionedUser = message.mentions.users.first()
            var game = "Jeu"
            if (!mentionedUser.presence.game) {
                game = "Rien pour le moment..."
            } else {
                game = mentionedUser.presence.game.name
            }
            const embed = new Discord.RichEmbed()
            embed.setTitle('Informations sur l’utilisateur')
                .setColor(config.color)
                .setFooter("WinkBOT " + config.version)
                .setThumbnail(mentionedUser.avatarURL)
                .setTimestamp()
                .addField('Pseudo :', `${mentionedUser.username}` + '#' + `${mentionedUser.discriminator}`, true)
                .addField('Joue à :', `${game}`, true)
                .addField('Est-ce un bot ?', `${message.author.bot}`, true)
                .addField('Date d’inscription :', `${message.author.createdAt}`, true);
            message.reply({
                embed
            });
        }
    }

    if (command === "invite") {
        message.reply("vous avez envie de m'inviter sur un autre serveur ?\nCliquez sur ce lien ! :smiley:\nhttps://discordapp.com/oauth2/authorize?client_id=" + bot.user.id + "&scope=bot&permissions=248903")
    }

    if (command === "github") {
        message.reply("alors comme ça vous voulez voir mon repos Github pour me disséquer ?\nPas de soucis ! Je suis un Bot, je ne ressens pas la douleur ! :smiley:\nhttps://github.com/Atnode/WinkBOT")
    }

    if (command === "serverinfo") {
        const embed = new Discord.RichEmbed()
        embed.setTitle('Informations à propos de ce serveur')
            .setColor(config.color)
            .setFooter("WinkBOT " + config.version)
            .setThumbnail(message.guild.iconURL)
            .setTimestamp()
            .addField('Nom du serveur :', `${message.guild.name}`, true)
            .addField('Nombre de membres :', `${message.guild.memberCount - message.guild.members.filter(m=>m.user.bot).size} (${message.guild.members.filter(m=>m.user.bot).size} bots)`, true)
            .addField('Crée le :', message.guild.createdAt.toLocaleString(), true)
            .addField('Niveau de vérification du serveur :', message.guild.verificationLevel, true)
            .addField('Pseudo du propriétaire de ce serveur :', `${message.guild.owner.user.tag} (${message.guild.owner.id})`)
            .addField('Région du serveur :', message.guild.region, true)
            .addField('ID du serveur :', message.guild.id, true)
            .addField('Temps avant d’être AFK :', `${message.guild.afkTimeout / 60} minutes`, true)
            .addField('Nom du salon AFK:', `${message.guild.afkChannelID === null ? 'No AFK Channel' : bot.channels.get(message.guild.afkChannelID).name} (${message.guild.afkChannelID === null ? '' : message.guild.afkChannelID})`, true)
        message.reply({
            embed
        });
    }


    if (command === "youtube") {
        var yt = message.content.substring(4);

        if (yt == '') {
            message.reply("vous devez entrer un mot clef après " + config.prefix + "youtube. :wink:");
        } else {
            youTube.search(suffix, 1, function(error, result) {
                if (error) {
                    message.reply("une erreur est survenue :frowning:");
                } else {
                    console.log(JSON.stringify(result, null, 2));
                    let beforeid = "nothing"
                    let id = "nothing"

                    if (!result || !result.items || result.items.length < 1) {
                        message.reply("je n'ai rien trouvé. :disappointed_relieved:")
                    } else {
                        if (result.items[0].id.kind === "youtube#video") {
                            beforeid = "https://www.youtube.com/watch?v="
                            id = result.items[0].id.videoId
                        } else if (result.items[0].id.kind === "youtube#playlist") {
                            beforeid = "https://www.youtube.com/playlist?list="
                            id = result.items[0].id.playlistId
                        } else if (result.items[0].id.kind === "youtube#channel") {
                            beforeid = "https://www.youtube.com/channel/"
                            id = result.items[0].id.channelId
                        }
                        message.reply("résultat de votre recherche sur YouTube :\n" + beforeid + id)
                    }
                }

            });
        }
    }

    if (command === "joke") {
        var sayings = ["Pourquoi Bill Gates aurait mieux faire d’être agriculteur ?\nParce que Microsoft Windows plante sans arrêt.",
            "Un homme rentre dans un restaurant :\n– Garçon ! Servez-vous des nouilles ?\n– Bien-sûr monsieur, ici on sert tout le monde.",
            "Un motard va voir une blonde qui pousse sa voiture sur l’autoroute. Le motard lui demande :\n– Madame, votre voiture est en panne ?\n– Non non, elle est toute neuve !\n– Alors pourquoi êtes-vous en train de la pousser ?\n– Parce que le garagiste m’a dit d’aller à 50Km en ville et de la pousser un peu sur l’autoroute.",
            "Michel est en voyage dans un pays lointain. Il se retrouve dans une superbe rivière dans la jungle. Il demande alors au guide qui l’accompagne :\n– Crois-tu que je peux me baigner ici ?\n– Mais bien entendu !\n– Tu es sûr qu’il n’y a pas de piranhas ici ?\n– Absolument sûr ! Michel saute alors dans l’eau et il demande au guide :\n– Comment peux-tu en être aussi certain ?\n- C’est simple : il n’y a pas de piranhas ici parce qu’ils ont bien trop peur des crocodiles !",
            "Les hyperboles sa sert à manger des hypersoupes :3",
            "Le comble de Microsoft Windows, c’est que pour l’arrêter, il faut cliquer sur démarrer.",
            "Pourquoi est-ce que les girafes aiment magasiner à bas prix ?\nTout est une question de cou.",
            "Trois ingénieurs (1 chimiste, 1 électronicien, 1 Microsoft) dans un bus roulant dans un désert.\nLe bus « tombe en panne » sans raison apparente, et voila les 3 gars à discuter.\nL’électronicien : je pourrais regarder les circuits et voir si quelque chose cloche.\nLe chimiste : on devrait vérifier l'essence avant.\nL’ingé Microsoft : non, on remonte dans le bus, on ferme toutes les fenêtres, et logiquement ça devrait redémarrer.",
            "Combien de développeurs faut-il pour remplacer une ampoule grillée ? Aucun, c'est un problème Hardware.",
            "Chrome: On est le 8 avril 2016 13h02 \n Safari: On est le 8 avril 2016 13h02 \n Internet Explorer: On est le... **[Internet Explorer a cessé de fonctionner, veuillez redémarrer votre machine]**",
            "Le père en colère :\n– Non mais, tu as vu tes notes, Toto ! C’est lamentable. Je voudrais bien savoir si ton copain Ernest rentre chez lui avec de 0 et des 5 sur 20 sur son carnet…\nToto :\n- Non, mais lui c’est différent, ses parents sont intelligents…",
            "Drame sur un cargo Belge croisant en Méditerranée. La météo avait annoncé une mer d’huile. Trois tonnes de frites congelées ont été balancées à la mer !",
            "« Je trouve que la télévision à la maison est très favorable à la culture. Chaque fois que quelqu’un l’allume chez moi, je vais dans la pièce d’à côté et je lis. »\n– Groucho Marx",
            "Trois enfants jouent à un jeux de chevalier.\nVictor : « Je décide de m’appeler : VICTORUS »\nAntoine : « Et moi, ANTOINUS ! »\nAnne : « Et moi, je ne joue pas. :disappointed_relieved: »",
            "Ce sont toujours les cons qui l’emportent. Question de surnombre !\n– Frédéric Dard",
            "Celui qui a inventé le bateau a inventé le naufrage.\n- Lao Tseu",
            "Tous les ans y'a de plus en plus de cons...\nCette année j'ai l'impression qu'il y a déjà les cons de l'année prochaine.\n- Patrick Timsit",
        ];
        var result = Math.floor((Math.random() * sayings.length) + 0);
        message.reply("votre blague :laughing: :\n" + sayings[result]);
    }

    if (command === "random") {
        var result = Math.floor((Math.random() * 1000) + 1);
        message.reply("votre nombre aléatoire est " + result);
    }

    if (command === "flip") {
        var result = Math.floor((Math.random() * 2) + 1);
        if (result == 1) {
            message.reply("la pièce est tombée sur le côté pile.");
        } else if (result == 2) {
            message.reply("la pièce est tombée sur le côté face.");
        }
    }

    if (command === "question") {
        var question = message.content.substring(10);

        Wolfram.query(message.content.substring(10, message.content.length), function(err, result) {
            if (question == '') {
                message.reply('vous devez entrez une question. :wink:')
            } else {
                if (err)
                    message.reply("Désolé, je ne peux pas traiter la question pour le moment.");
                else if (result.queryresult.pod != undefined) {
                    var text = '';
                    for (var a = 0; a < result.queryresult.pod.length; a++) {
                        var pod = result.queryresult.pod[a];
                        if (resultOpts.indexOf(pod.$.title) > -1) {
                            for (var b = 0; b < pod.subpod.length; b++) {
                                var subpod = pod.subpod[b];
                                for (var c = 0; c < subpod.plaintext.length; c++) {
                                    text += "\n**" + resultOpts[resultOpts.indexOf(pod.$.title)] + "**: ```";
                                    text += resultOpts[resultOpts.indexOf(pod.$.title)] == 'Decimal approximation' ? subpod.plaintext[c].substring(0, 7) + "```" : subpod.plaintext[c] + "```";
                                }
                            }
                        }
                    }
                    message.reply(text);
                } else {
                    message.reply("je ne semble pas avoir de réponse à cette question.");
                }
            }
        });
    }

    if (command === "md5") {
        var md5 = message.content.substring(6);

        if (md5 == '') {
            message.reply("vous devez entrer un mot ou une phrase après " + config.prefix + "md5. :wink:");
        } else {
            var question = message.content.substring(5);
            message.reply("votre texte chiffré avec MD5 : " + MD5(md5));
        }
    }

    if (command === "sha256") {
        var sha256 = message.content.substring(9);

        if (sha256 == '') {
            message.reply("vous devez entrer un mot ou une phrase après " + config.prefix + "sha256. :wink:");
        } else {
            var question = message.content.substring(5);
            message.reply("votre texte chiffré avec SHA256 : " + SHA256(sha256));
        }
    }

    if (command === "eth") {
        price.getCryptoPrice("EUR", "ETH").then(obj => {
            message.reply("1 Ethereum vaut actuellement " + obj.price + "€.")
        })
        price.getCryptoPrice("USD", "ETH").then(obj => {
            message.reply("1 Ethereum vaut actuellement " + obj.price + "$.")
        })

    }

    if (command === "btc") {
        price.getCryptoPrice("EUR", "BTC").then(obj => {
            message.reply("1 Bitcoin vaut actuellement " + obj.price + "€.")
        })
        price.getCryptoPrice("USD", "BTC").then(obj => {
            message.reply("1 Bitcoin vaut actuellement " + obj.price + "$.")
        })
    }

    if (command === "xmr") {
        price.getCryptoPrice("EUR", "XMR").then(obj => {
            message.reply("1 Monero vaut actuellement " + obj.price + "€.")
        })
        price.getCryptoPrice("USD", "XMR").then(obj => {
            message.reply("1 Monero vaut actuellement " + obj.price + "$.")
        })
    }


    if (command === "about") {
        message.reply("les informations à propos de WinkBOT vous ont été envoyés par MP ! :wink:");
        const uptime = process.uptime();
        const up = [];

        const parsed = {
            days: Math.floor(uptime / 86400),
            hours: Math.floor(uptime / 3600) % 24,
            minutes: Math.floor(uptime / 60) % 60,
            seconds: Math.floor(uptime) % 60
        };

        const add = function(val, str) {
            if (val === 0) {
                return;
            }

            up.push(val + str);
        };

        add(parsed.days, 'd');
        add(parsed.hours, 'h');
        add(parsed.minutes, 'm');
        add(parsed.seconds, 's');


        const embed = new Discord.RichEmbed()
        embed.setTitle('À propos de ' + config.botname)
            .setColor(config.color)
            .setFooter("WinkBOT " + config.version + " | Par " + config.author)
            .setThumbnail(bot.user.avatarURL)
            .setTimestamp()
            .addField('Pseudo :', `${config.botname}`, true)
            .addField('Nombre de serveur où ce bot est présent : ', `${bot.guilds.size}`)
            .addField('Nombre de salons où ce bot est présent : ', `${bot.channels.size}`)
            .addField('Nombre de personnes que ce bot sert : ', `${bot.users.size}`)
            .addField('Allumé depuis : ', `${up.join(' ')}`)
            .addField('Version de Nodejs :', `${process.version}`, true)
            .addField('Version de Discord.js : ', `${Discord.version}`, true)
            .addField('Version de ' + config.botname + ' : ', config.version, true)
            .addField('Développé par : ', `${config.author}`, true);
        message.author.sendMessage({
            embed
        }).catch(err => {
            message.reply("je n'ai pas pu vous envoyer ce message... :disappointed_relieved:")
        })

    }

    if (command === "help") {
        message.reply("la liste des commandes vient de vous être envoyé par MP ! :wink:");

        if ((message.author.id == (config.owner)) || (message.member.hasPermission('KICK_MEMBERS'))) {
            const embed = new Discord.RichEmbed()
                .setAuthor("Aide de " + config.botname, bot.user.avatarURL)

                .setColor(config.color)
                .setDescription("Le préfixe des commandes de ce bot est : **" + config.prefix + "**\nSite internet : https://atnode.fr/projets/winkbot/\nCode source : https://github.com/Atnode/WinkBOT/")
                .setFooter("WinkBOT " + config.version)
                .setTimestamp()


                .addField("Commandes principales :",
                    "**youtube** : Recherche une vidéo, une playlist ou une chaîne sur YouTube avec un mot clef\n**cat** : Affiche un joli gif de chat\n**dog** : Affiche un joli gif de toutou\n**gif** : Recherche un gif à partir d'un mot clef de manière aléatoire\n**joke** : Vous affiche une blague\n**reverse** : Inverser un mot ou une phrase\n**flip** : Pile ou face ?\n**ping** : Voir votre latence et celle de l'API de Discord\n**random** : Affiche de manière aléatoire un nombre compris entre 1 et 1000\n**question** : Poser une question au bot. Celle-ci doit être en anglais ou être mathématique (Ex : What  is the capital of France? ; 1+1)", true)

                .addField("Commandes useless :",
                    "**avatar** : Affiche votre avatar ou celui d'une autre personne\n**userinfo** : Affiche des informations sur vous ou l'utilisateur de votre choix\n**serverinfo** : Affiche des informations sur le serveur où vous êtes actuellement\n**eth** : Affiche la valeur actuelle de l'Ethereum\n**btc** : Affiche la valeur actuelle du Bitcoin\n**xmr** : Affiche la valeur actuelle du Monero\n**md5** : Chiffre votre texte grâce à MD5\n**sha256** : Chiffre votre texte grâce à SHA256\n**invite** : Vous donne un lien pour inviter le bot\n**github** : Vous donne le lien du GitHub du bot", true)

                .addField("Autres commandes :",
                    "**help** : Aide du bot\n**about** : Affiche diverses informations sur le bot", true)

                .addField("Commandes d'administration :",
                    "**say** : Faire parler le bot", true)

            message.author.sendMessage({
                embed
            }).catch(err => {
                message.reply("je n'ai pas pu vous envoyer ce message... :disappointed_relieved:")
            })

        } else {
            const embed = new Discord.RichEmbed()
                .setAuthor("Aide de " + config.botname, bot.user.avatarURL)

                .setColor(config.color)
                .setDescription("Le préfixe des commandes de ce bot est : **" + config.prefix + "**\nSite internet : https://atnode.fr/projets/winkbot/\nCode source : https://github.com/Atnode/WinkBOT/")
                .setFooter("WinkBOT " + config.version)
                .setTimestamp()


                .addField("Commandes principales :",
                    "**youtube** : Recherche une vidéo, une playlist ou une chaîne sur YouTube avec un mot clef\n**cat** : Affiche un joli gif de chat\n**dog** : Affiche un joli gif de toutou\n**gif** : Recherche un gif à partir d'un mot clef de manière aléatoire\n**joke** : Vous affiche une blague\n**reverse** : Inverser un mot ou une phrase\n**flip** : Pile ou face ?\n**ping** : Voir votre latence et celle de l'API de Discord\n**random** : Affiche de manière aléatoire un nombre compris entre 1 et 1000\n**question** : Poser une question au bot. Celle-ci doit être en anglais ou être mathématique (Ex : What  is the capital of France? ; 1+1)", true)

                .addField("Commandes useless :",
                    "**avatar** : Affiche votre avatar ou celui d'une autre personne\n**userinfo** : Affiche des informations sur vous ou l'utilisateur de votre choix\n**serverinfo** : Affiche des informations sur le serveur où vous êtes actuellement\n**eth** : Affiche la valeur actuelle de l'Ethereum\n**btc** : Affiche la valeur actuelle du Bitcoin\n**xmr** : Affiche la valeur actuelle du Monero\n**md5** : Chiffre votre texte grâce à MD5\n**sha256** : Chiffre votre texte grâce à SHA256\n**invite** : Vous donne un lien pour inviter le bot\n**github** : Vous donne le lien du GitHub du bot", true)

                .addField("Autres commandes :",
                    "**help** : Aide du bot\n**about** : Affiche diverses informations sur le bot", true)

            message.author.sendMessage({
                embed
            }).catch(err => {
                message.reply("je n'ai pas pu vous envoyer ce message... :disappointed_relieved:")
            })

        }


    }

});

bot.login(config.token);