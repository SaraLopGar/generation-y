class Player {
    constructor() {
        this.width = 327;
        this.height = 254;
        this.sprite = new Sprite("player", this.width, this.height, 3, 2);
        this.spriteH = 0;
        this.spriteV = 0;

        this.state = "idle";
        this.facing = 1;
        this.spd = 2;
        this.health = 3;
        this.attackable = true;

        this.initialWalkTime = 0.5; //In seconds
        this.walkTime = this.initialWalkTime;

        this.initialRecoverTime = 0.5; //In seconds
        this.recoverTime = this.initialRecoverTime;

        this.walkOffset = 150;
        this.combatOffset = 250;
        this.positions = {
            walk: canvasWidth / 2 - this.walkOffset - this.width / 2,
            leftCombat: canvasWidth / 2 - this.combatOffset - this.width / 2,
            rightCombat: canvasWidth / 2 + this.combatOffset - this.width / 2
        }
        this.side = -1;

        this.dashSound = audioResources["dash"];
 
        this.x = this.positions["walk"];
        this.y = canvasHeight - this.height - 25;
    }
    update(deltaTime) {
        switch (this.state) {
            case "idle":
                break;
            case "walk":
                break;
            case "attack":
                let nextFramePos = this.x + this.facing * this.spd * deltaTime;
                //Detects when the player cross the middle of the canvas
                if(Math.sign(canvasWidth / 2 - this.x - this.width / 2) !=
                    Math.sign(canvasWidth / 2 - nextFramePos - this.width / 2)){
                        if(game.map.enemy.attackable){                        
                            this.side *= -1;
                            game.map.enemy.damaged();
                        }else{
                            game.map.enemy.toProtect();
                            this.toStun();
                            break;
                        }
                }
                //Positioning the player
                if (nextFramePos < this.positions["leftCombat"] ||
                    nextFramePos > this.positions["rightCombat"]){
                    this.relocate();
                    this.facing *= -1;
                    this.toIdle();
                }else this.x = nextFramePos;

                break;
            case "stun":           
                this.recoverTime -= deltaTime / 1000;
                //Positioning the player
                if (this.x - this.facing * this.spd * deltaTime * 0.5 < this.positions["leftCombat"] || 
                    this.x - this.facing * this.spd * deltaTime * 0.5 > this.positions["rightCombat"]) 
                        this.relocate();
                else this.x -= this.facing * this.spd * deltaTime * 0.5;
                if(this.recoverTime <= 0){
                    this.recoverTime = this.initialRecoverTime;
                    //Make sure that the player is well positioned (not transitioning)
                    this.relocate();
                    this.toIdle();   
                }
                break;
            case "hurt":
                this.recoverTime -= deltaTime / 1000;
                //Positioning the player
                if (this.x - this.facing * this.spd * deltaTime * 0.5 < this.positions["leftCombat"] || 
                    this.x - this.facing * this.spd * deltaTime * 0.5 > this.positions["rightCombat"]) 
                        this.relocate();
                else this.x -= this.facing * this.spd * deltaTime * 0.5;

                if(this.recoverTime <= 0){
                    this.recoverTime = this.initialRecoverTime;
                    //Make sure that the player is well positioned (not transitioning)
                    this.relocate();
                    this.toIdle();   
                }
                break;
        }
    }
    draw() {
        this.sprite.actualFrameH = this.spriteH;      
        this.sprite.actualFrameV = this.spriteV + (-0.5 * this.facing + 0.5);
        this.sprite.draw(this.x, this.y);
        
        context.beginPath();
        context.rect(this.x,this.y,this.width,this.height);
        context.stroke();
    }
    relocate(){
        switch(game.gameState){
            case "walk":
                this.x = this.positions["walk"];
                break;
            case "fightTransition":
                this.x = this.positions["leftCombat"];
                break;
            case "fight":
                if(this.side == -1) this.x = this.positions["leftCombat"];
                else this.x = this.positions["rightCombat"];
        }
    }
    toIdle() {
        this.state = "idle";
        this.spriteH = 0;
        this.attackable = true;
        this.dashSound.stop();
    }
    toWalk(){
        this.state = "walk";
        this.spriteH = 1;
        this.facing = 1;
        this.side = -1;
        this.x = this.positions["walk"];
        this.dashSound.play();
    }
    toAttack() {
        this.state = "attack";
        this.spriteH = 1;
        this.attackable = false;    
        this.dashSound.play();
    }
    toStun(){
        this.state = "stun";
        this.spriteH = 2;
        this.x = canvasWidth / 2 - this.width / 2;
        this.attackable = true;
        this.dashSound.stop();
    }
    toHurt(){      
        this.state = "hurt";
        this.health--;
        this.spriteH = 2;
        this.attackable = false;
        this.dashSound.stop();
    }
}