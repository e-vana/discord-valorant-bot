const Discord = require('discord.js');
const client = new Discord.Client();
const botToken = process.env.BOT_TOKEN;
const { Pool } = require('./classes/Pool')

var generalChannel = '';
var generalChannelId = '';
var poolReadyId = '';

//@@ Bot setup
client.once("ready", () => {
  console.log("Connection ready...")

  generalChannel = client.channels.get('701277704837922830');
  generalChannelId = client.channels.get('701277704837922830').id;
  // poolReadyId = client.guilds.channels

  console.log(client.guilds.region)
  // console.log(typeof(client.guilds))
})
client.login(botToken);

const activePools = [];


function checkPoolReady(){
  // console.log("working...")
  for(j=0; j < activePools.length; j++){
    //@@ when the pool is full and ready, send mentions to each player in player array, generate new voice channel, move users to voice channel.

    if(activePools[j].players.length == 1){
      if(activePools[j].isReady == false){
        activePools[j].isReady = true;
        generalChannel.send("Pool ready, generating resources...")


        generalChannel.guild.createChannel("test", {
          type: 'voice',
          permissionOverwrites: [
            {
              id: '12345',
              deny: ['VIEW_CHANNEL'],
           },
         ]
        
      })

        
      }
    }
  }

}

setInterval(checkPoolReady, 1000);

//@@ Bot Listeners
client.on("message", function(message){

  // message.guild.createChannel("test", {
  //   type: 'voice',
  //   permissionOverwrites: [
  //     {
  //       id: message.author.id,
  //       deny: ['VIEW_CHANNEL'],
  //    },
  //  ]
  // });
  
  console.log(message.guild.members)

  var messageStr = message.content;
  var splitStr = messageStr.split(" ");
  var command = splitStr[0];

  // @@ LFG Command, add people to pools.
  if(command == "!lfg"){
    //@@ If there are no active pools, create one and join it
    if(activePools.length == 0){
      var newPool = new Pool();
      newPool.addPlayer(message.author.id);
      activePools.push(newPool);
      message.channel.send(`Creating a new pool and adding you to it.`)

    }

    //@@ If there are active pools, 
    else if(activePools.length > 0){
      var isInPool = false;

      //@@ check all active pools if they are full, if they aren't full, try to add the player to the pool.
      for(i=0; i < activePools.length; i++){
        if(activePools[i].isFull()){
          //if the pool in active pool is full, break to check next pool
          continue;
        }else {
          var addPlayer = activePools[i].addPlayer(message.author.id)
          if(addPlayer){
            //@@ Succesfully added to a pool
            isInPool = true;
            message.channel.send(`Added you to an existing pool ${activePools[i].name}`)
            console.log(activePools)

          } else {
            //@@ Player is already in the pool
            isInPool = true;
            var currentPlayers = activePools[i].players.length;
            console.log(currentPlayers);
            message.channel.send(`You are already in an active pool ${i+1} with ${currentPlayers} / 5 players ready.`)
          }
        }
      }
      if(isInPool == false){
        var newPool = new Pool();
        newPool.addPlayer(message.author.id);
        activePools.push(newPool);
        message.channel.send(`Creating a new pool and adding you to it.`)
      }


    }
  }
})


