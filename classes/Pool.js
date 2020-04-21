const uuid = require('../util/uuid');

class Pool {
  constructor(){
    this.name = uuid.uuidv4();
    this.players = [];
    this.timeStarted = Date.now();
    this.isReady = false;
  }
  playerCount(){
    return this.players.length;
  }
  isFull(){
    if(this.players.length >= 5){
      return true
    } else {
      return false
    }
  }
  addPlayer(id){
    //Check to see if player is already in this pool
    var isInPool = false;
    this.players.forEach(element => {
      if(element == id){
        isInPool = true;
        return false;
      }
    });
    if(isInPool == false){
      this.players.push(id);
      return true;
    }


  }
  removePlayer(id){
    var idIndex = this.players.indexOf(id);
    if(!idIndex == -1){
      this.players.splice(idIndex, 1);
    } else {
      console.log("This player is not in this pool.")
    }
  }
}

module.exports = {
  Pool
};