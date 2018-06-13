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


    if (command === "rocket") {
        var rocket_1 = new Array(
            "**Jessie** : *Nous sommes de retour,*\n**James** : *Pour vous jouer un mauvais tour.*",
            "**Jessie** : *Nous sommes de retour,*\n**James** : *Pour vous jouer un mauvais tour.*",
            "**Jessie** : *Nous sommes de retour,*\n**James** : *Pour vous jouer un mauvais tour.*",
            "**Jessie** : *Nous sommes de retour,*\n**James** : *Pour vous jouer un mauvais tour.*",
            "**Jessie** : *La boutique rocket est heureuse,*\n**James** : *de vous présenter sa nouvelle collection.*",
            "**Jessie** : *Nous n'avons pas de rendez vous, mais ce n'est pas de notre faute,*\n**James** : *Prenez vite notre pouls, docteur, et que ça saute.*",
            "**Jessie** : *Nous sommes de retour pour notre ami,*\n**James** : *Nous ne te ferons pas de mauvais tours, on t'apprécie aussi.*",
            "**Jessie** : *Nous sommes de retour,*\n**James** : *Mais cette fois ce n'est pas pour vous jouer de mauvais tours.*",
            "**Jessie** : *Nous sommes de retour,*\n**James** : *Qu'ils soient très longs ou même trop courts.*",
            "**Jessie** : *Nous sommes de retour vous n'avez pas de veine,*\n**James** : *Grâce aux joyaux de la couronne, Jessie est notre reine.*",
            "**Jessie** : *Nous sommes de retour pour tout manger,*\n**James** : *Et vous jouer de mauvais tours si vous nous en empêchez.*",
            "**Jessie** : *Ouvrez grands les yeux, nous sommes de retour,*\n**James** : N*ous avons le trophée pour vous jouer un mauvais tour.*",
            "**Jessie** : *Nous sommes de retour par la Voie des airs,*\n**James** : *Pour vous jouer de mauvais tours et voler vos chaumières.*",
            "**Jessie** : *Nous sommes de retour pour gagner la course,*\n**James** : *Avec comme pilote notre cher Miaouss.*",
            "**Jessie** : *Nous sommes de retour pour rendre les morveux complètement fous,*\n**James** : *Et aussi et surtout pour capturer Pikachu.*",
            "**Jessie** : *Nous espérons que vous les trouverez beaux,*\n**James** : *Car nous leur avons fait un look tout nouveau.*"
        );

        var rocket_2 = new Array(
            "**Jessie** : *Afin de préserver le monde de la dévastation,*\n**James** : *Afin de rallier tous les peuples à notre nation.*",
            "**Jessie** : *Afin de protéger l'univers de la mode ringarde,*\n**James** : *Afin d'habiller tous les peuples dans l'avant-garde.*",
            "**Jessie** : *Les fourberies ont l'âge de la galaxie,*\n**James** : *C'est pour accomplir notre destin qu'on est ici.*",
            "**Jessie** : *Tu nous as préservés de la consternation,*\n**James** : *Tu nous as ralliés dans la jubilation.*",
            "**Jessie** : *Et prescrivez nous un onguent contre les démangeaisons,*\n**James** : *Afin que soit déclarée notre guérison.*",
            "**Jessie** : *Afin de protéger le monde de la dévastation,*\n**James** : *Afin de sauver les peuples de toutes les nations.*",
            "**Jessie** : *Afin de protéger ma tête de l'humiliation,*\n**James** : *Parce qu'elle ne peut plus se crêper le chignon.*",
            "**Jessie** : *Grâce à mon immense pouvoir, je règne sur l'univers,*\n**James** : *Et elle capture des pokémon, sans en avoir l'air.*",
            "**Jessie** : *Afin de manger et boire tout à volonté,*\n**James** : *Sans jamais avoir un sou à débourser.*",
            "**Jessie** : *Afin de protéger le monde de sa cupidité,*\n**James** : *Afin de voler les trésors dont il n'a pas l'utilité.*",
            "**Jessie** : *Afin de protéger le monde de la dévastation,*\n**James** : *Afin de rallier tous les peuples à notre nation.*",
            "**Jessie** : *Afin de protéger le monde de la dévastation,*\n**James** : *Afin de rallier tous les peuples à notre nation.*",
            "**Jessie** : *Nous créons la tendance dans le monde de la coiffure,*\n**James** : *Une belle chevelure ça vous change une allure.*"
        );

        var rocket_3 = new Array(
            "**Jessie** : *Afin d'écraser l'amour et la vérité,*\n**James** : *Afin d'étendre notre pouvoir jusqu'a la Voie Lactée.*",
            "**Jessie** : *Afin que tous les pokémons soient mignons à croquer,*\n**James** : *Afin d'étendre notre art jusqu'à la Voie Lactée.*",
            "**Jessie** : *Tu as écrasé l'ennui et notre solitude,*\n**James** : *Tu as répandu ta maladresse sous toutes les latitudes.*",
            "**Jessie** : *Adieu les souffrances dues aux pieds d'athlètes,*\n**James** : *Sans qu'on soit obligé de suivre une diète.*",
            "**Jessie** : *Afin d'éviter les catastrophes climatiques,*\n**James** : *Afin de venir en aide à ce morveux antipathique.*",
            "**Jessie** : *Mes cheveux étaient mon seul trésor,*\n**James** : *Ceux qui les ont coupés ont certainement eu tort.*",
            "**Jessie** : *Tous les sujets de la reine doivent s'agenouiller, c'est une question de respect,*\n**James** : *Moi j'ai les genoux fragiles, je suis dispensé.*",
            "**Jessie** : *Afin de dénoncer l'énormité de toutes les additions,*\n**James** : *Nous allons manger tous les échantillons.*",
            "**Jessie** : *Afin de commettre tous les casses dignes d'Arsène Lupin,*\n**James** : *Afin de nous partager le butin qui est entre nos mains.*",
            "**Jessie** : *Afin de dénoncer l'amour et la vérité,*\n**James** : *Afin d'étendre notre pouvoir jusqu'à la Voie Lactée.*",
            "**Jessie** : *Nous sommes des stylistes,*\n**James** : *Et pas des arrivistes."
        );




        var rocket_4 = new Array(
            "**Jessie** : *Jessie*\n**James** : *James.*",
            "**Jessie** : *Jessie*\n**James** : *James.*",
            "**Jessie** : *Jessie*\n**James** : *James.*",
            "**Jessie** : *Jessie*\n**James** : *James.*",
            "**Jessie** : *Jessie*\n**James** : *James.*",
            "**Jessie** : *Jessie*\n**James** : *James.*",
            "**Jessie** : *Jessie*\n**James** : *James.*",
            "**Jessie** : *Jessie*\n**James** : *James.*",
            "**Jessie** : *Majesté la reine, Jessie*\n**James** : *James, son humble serviteur.*"
        );

        var rocket_5 = new Array(
            "**Jessie** : *La Team Rocket plus rapide que la lumière,*\n**James** : *Rendez-vous tous ou ce sera la guerre.*",
            "**Jessie** : *La Team rocket se gratte à la vitesse de la lumière,*\n**James** : *Alors donnez nous une pommade afin qu'on se modère.*",
            "**Jessie** : *Partout où règne la paix dans l'univers,*\n**James** : *La Team Rocket sera là afin que le chaos prospère.*",
            "**Jessie** : *La Boutique Rocket, du chic est la dépositaire,*\n**James** : *Adoptez notre style, ou ce sera la guerre.*",
            "**Jessie** : *La Team Rocket, amie jusqu'à la mort,*\n**James** : *Rendez-vous compte, c'est notre sort.*",
            "**Jessie** : *La Team Rocket plus rapide que la lumière, vient à la rescousse,*\n**James** : *Et pour une fois on est dans le camp des gentils même si on a la frousse.*",
            "**Jessie** : *La Team Rocket, humiliée mais toujours plus rapide que la lumière,*\n**James** : *Ce qui n'empêchera pas Jessie de vous faire la guerre !.*",
            "**Jessie** : *On coiffe à la vitesse de la lumière,*\n**James** : *Ils seront des stars si vous nous laissez faire.*",
            "**Jessie** : *La Team Rocket adore se remplir le ventre à la vitesse de la lumière,*\n**James** : *Il est vrai que nous aimons encore plus manger que faire la guerre.*",
            "**Jessie** : *Les voleurs sont de retour la nuit et à couvert,*\n**James** : *Rendez vous tous ou ce sera la guerre.*",
            "**Jessie** : *La Team Rocket couverte de bijoux plus rapide que la lumière,*\n**James** : *Rendez vous tous faute de goût ou ce sera la guerre.*",
            "**Jessie** : *La reine Jessie a le pouvoir absolu,*\n**James** : *Alors rendez vous sinon je sens qu'avec son histoire de pouvoir elle ne nous lâchera plus..*",
            "**Jessie** : *La Team Rocket plus rapide que la lumière s’envole dans une montgolfière,*\n**James** : *Rendez vous tous car de toute façon vous perdrez la guerre.*"

        );

        var rocket_6 = new Array(
            "**Miaouss** : *Miaouss, oui la guerre !*",
            "**Miaouss** : *Miaouss, oui la gueguerre !*",
            "**Miaouss** : *Oui la guerre !*",
            "**Miaouss** : *On est tous dans la même galère !*",
            "**Miaouss** : *C'est vrai, y a pas d'issue !*",
            "**Miaouss** : *Par ici la bonne bouffe !*",
            "**Miaouss** : *C’est vrai et c’est moi qui vais vous faire perdre!*",
            "**Miaouss** : *Miaouss oui la frousse !*"
        );

        choose = function(tableau) {
            var len = tableau.length;
            var i = Math.floor(Math.random() * len);
            return tableau[i];



        }

        message.reply("oh non, vous venez d'invoquer la Team Rocket ! :worried:\n" + choose(rocket_1) + "\n" + choose(rocket_2) + "\n" + choose(rocket_3) + "\n" + choose(rocket_4) + "\n" + choose(rocket_5) + "\n" + choose(rocket_6))

    }

    if (command === "malou") {
        var malou1 = new Array("Chapitre abstrait 3 du conpendium :", "C’est à dire ici, c’est le contraire, au lieu de panacée,", "Au nom de toute la communauté des savants,", "Lorsqu’on parle de tous ces points de vues,", "C’est à dire quand on parle de ces rollers,", "Quand on parle de relaxation,", "Nous n’allons pas seulement danser ou jouer au football,", "D'une manière ou d'une autre,", "Quand on prend les triangles rectangles,", "Se consolidant dans le système de insiding et outsiding,", "Lorsque l'on parle des végétaliens, du végétalisme,", "Contre la morosité du peuple,", "Tandis que la politique est encadrée par des scientifiques issus de Sciences Po et Administratives,", "On ne peut pas parler de politique administrative scientifique,", "Pour emphysiquer l'animalculisme,", "Comme la coumbacérie ou le script de Aze,", "Vous avez le système de check-up vers les anti-valeurs, vous avez le curuna, or", "La convergence n’est pas la divergence,", "L’émergence ici c’est l’émulsion, c’est pas l’immersion donc", "Imbiber, porter", "Une semaine passée sans parler du peuple c’est errer sans abri, autrement dit", "Actuellement,", "Parallèlement,", "Mesdames et messieurs fidèles,");

        var malou2 = new Array("la cosmogonisation", "l'activisme", "le système", "le rédynamisme", "l'ensemble des 5 sens", "la société civile", "la politique", "la compétence", "le colloque", "la contextualisation", "la congolexicomatisation", "la congolexicomatisation", "la congolexicomatisation", "la congolexicomatisation", "la prédestination", "la force", "la systématique", "l'ittérativisme", "le savoir", "l'imbroglio", "la concertation politique", "la délégation", "la pédagogie", "la réflexologie");

        var malou3 = new Array("vers la compromettance pour des saint-bioules", "vers ce qu’on appelle la dynamique des sports", "de la technicité informatisée", "de la Théorie Générale des Organisations", "autour de la Géo Physique Spatiale", "purement technique", "des lois du marché", "de l'orthodoxisation", "inter-continentaliste", "à l'égard de la complexité", "éventualiste sous cet angle là", "de toute la République Démocratique du Congo", "à l'incognito", "autour de l'ergonométrie", "indispensable(s) en science et culture", "autour de phylogomènes généralisés", "à forciori,", "par rapport aux diplomaties");

        var malou4 = new Array("tend à ", "nous pousse à ", "fait allusion à ", "va ", "doit ", "consiste à ", "nous incite à", "vise à", "semble", "est censé(e)", "paraît", "peut", "s'applique à", "consent à", "continue à", "invite à", "oblige à", "parvient à", "pousse à", "se résume à", "suffit à", "se résoud à", "sert à", "tarde à");

        var malou5 = new Array("incristaliser", "imposer", "intentionner", "mettre un accent sur", "tourner", "informatiser", "aider", "défendre", "gérer", "prévaloir", "vanter", "rabibocher", "booster", "porter d'avis sur ce qu'on appelle", "cadrer", "se baser sur", "effaceter", "réglementer", "régler", "faceter", "partager", "uniformiser", "défendre", "soutenir", "propulser", "catapulter", "établir");

        var malou6 = new Array("les interchanges", "mes frères propres", "les revenus", "cette climatologie", "une discipline", "la nucléarité", "l'upensmie", "les sens dynamitiels", "la renaissance africaine", "l'estime du savoir", "une kermesse", "une certaine compétitivité", "cet environnement de 2 345 410 km²", "le kilométrage", "le conpemdium", "la quatripartie", "les encadrés", "le point adjacent", "la bijectivité", "le panafricanisme", "ce système phénoménal", "le système de Guipoti : 1/B+1/B’=1/D", "une position axisienne", "les grabuses lastiques", "le chicouangue", "le trabajo, le travail, la machinale, la robotisation", "les quatre carrés fous du fromage");

        var malou7 = new Array("autour des dialogues intercommunautaires", "provenant d'une dynamique syncronique", "vers le monde entier", "propre(s) aux congolais", "vers Lovanium", "vers l'humanisme", "comparé(e)(s) la rénaque", "autour des gens qui connaissent beaucoup de choses", "possédant la francophonie", "dans ces prestances", "off-shore", "dans Kinshasa", "dans la sous-régionalité", "dans le prémice", "belvédère", "avec la formule 1+(2x5)", "axé(e)(s) sur la réalité du terrain", "dans les camps militaires non-voyants", "avéré(e)(s)", "comme pour le lancement de Troposphère V");

        var malou8 = new Array(", tu sais ça.", ", c’est clair.", ", je vous en prie.", ", merci.", ", mais oui.", ", bonne année.", ", bonnes fêtes.");

        choose = function(tableau) {
            var len = tableau.length;
            var i = Math.floor(Math.random() * len);
            return tableau[i];
        }

        message.reply("voici le seul, l'unique... E double D Y trait d'union M A L O U ! :grin:\n" + choose(malou1) + " " + choose(malou2) + " " + choose(malou3) + " " + choose(malou4) + " " + choose(malou5) + " " + choose(malou6) + " " + choose(malou7) + choose(malou8))

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

    if (command === "git") {
        message.reply("alors comme ça vous voulez voir mon repos Git pour me disséquer ?\nPas de soucis ! Je suis un robot, je ne ressens pas la douleur ! :smiley:\nhttps://framagit.com/Atnode/WinkBOT")
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
            .addField('Nom du salon AFK:', `${message.guild.afkChannelID === null ? 'Aucun salon AFK' : bot.channels.get(message.guild.afkChannelID).name} (${message.guild.afkChannelID === null ? '' : message.guild.afkChannelID})`, true)
        message.reply({
            embed
        });
    }

    if (command === "membercount") {
        const embed = new Discord.RichEmbed()
        embed.setColor(config.color)
            .setFooter("WinkBOT " + config.version)
            .setThumbnail(message.guild.iconURL)
            .setTimestamp()
            .addField('Nombre de membre(s) :', `${message.guild.memberCount - message.guild.members.filter(m=>m.user.bot).size} (${message.guild.members.filter(m=>m.user.bot).size} bots)`, true)
        message.reply({
            embed
        })
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
            .setFooter("WinkBOT " + config.version)
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
                    "**youtube** : Recherche une vidéo, une playlist ou une chaîne sur YouTube avec un mot clef\n**cat** : Affiche un joli gif de chat\n**dog** : Affiche un joli gif de toutou\n**gif** : Recherche un gif à partir d'un mot clef de manière aléatoire\n**reverse** : Inverser un mot ou une phrase\n**flip** : Pile ou face ?\n**ping** : Voir votre latence et celle de l'API de Discord\n**random** : Affiche de manière aléatoire un nombre compris entre 1 et 1000\n**question** : Poser une question au bot. Celle-ci doit être en anglais ou être mathématique (Ex : What  is the capital of France? ; 1+1)", true)

                .addField("Commandes useless :",
                    "**avatar** : Affiche votre avatar ou celui d'une autre personne\n**userinfo** : Affiche des informations sur vous ou l'utilisateur de votre choix\n**serverinfo** : Affiche des informations sur le serveur où vous êtes actuellement\n**membercount** : Affiche le nombre de membres dsur le serveur (dont les robots)\n**rocket** : Oh, non ! La Team Rocket prend possesion de ce robot\n**malou** : La congolexicomatisation des lois du marché vous branche ?\n**eth** : Affiche la valeur actuelle de l'Ethereum\n**btc** : Affiche la valeur actuelle du Bitcoin\n**xmr** : Affiche la valeur actuelle du Monero\n**md5** : Chiffre votre texte grâce à MD5\n**sha256** : Chiffre votre texte grâce à SHA256", true)

                .addField("Autres commandes :",
                    "**help** : Aide du bot\n**about** : Affiche diverses informations sur le bot\n**invite** : Vous donne un lien pour inviter le robot\n**github** : Vous donne le lien du repo Git du robot", true)

                .addField("Commandes d'administration :",
                    "**say** : Faire parler le robot", true)

            message.author.sendMessage({
                embed
            }).catch(err => {
                message.reply("je n'ai pas pu vous envoyer ce message... :disappointed_relieved:")
            })

        } else {
            const embed = new Discord.RichEmbed()
                .setAuthor("Aide de " + config.botname, bot.user.avatarURL)

                .setColor(config.color)
                .setDescription("Le préfixe des commandes de ce bot est : **" + config.prefix + "**\nSite internet : https://atnode.fr/projets/winkbot/\nCode source : https://framagit.com/Atnode/WinkBOT/")
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

    if (command === "reboot") {
        if (message.author.id == (config.owner)) {
            message.reply("Redémarrage en cours... :arrows_counterclockwise:")
            exec("forever restartall");
        } else {
            message.reply("vous ne pouvez pas me faire redémarer. :frowning:")
        }
    }

    if (command === "kill") {
        if (message.author.id == (config.owner)) {
            message.reply("Ô malheur, ô souffrance...\nPourquoi m'avez-vous tué ? :disappointed_relieved:")
            exec("forever stopall");
        } else {
            message.reply("vous ne pouvez pas me tuer. :grinning:")
        }
    }


});

bot.login(config.token);