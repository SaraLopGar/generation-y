class Enemy {
    constructor() {        
        this.state = "walk";

        this.width = 610;
        this.height = 411;
        this.sprite = new Sprite("enemy", this.width, this.height, 3, 1);
        this.spriteH = 0;
        this.spriteV = 0;

        this.x = 3 * canvasWidth / 2 - this.width / 2;
        this.y = canvasHeight - this.height - 25;

        this.attackable = false;
        this.facing = -1;
        this.spd = 5;
        this.health = 3;

        this.depth = 2;

        this.chofSound = audioResources["hit"];

        this.setTimes();
    }
    setTimes(){
        this.initialAttackTime = 1; //In seconds
        this.attackTime = this.initialAttackTime;
        this.initialAnticipationTime = 1; //In seconds
        this.anticipationTime = this.initialAnticipationTime;
        this.initialRecoverTime = 1; //In seconds
        this.recoverTime = this.initialRecoverTime;
        this.initialProtectTime = 0.2; //In seconds
        this.protectTime = this.initialProtectTime;
    }
    update(deltaTime) {
        switch (this.state) {
            case "walk":
                if(this.x < canvasWidth / 2 - this.width / 2) this.x = canvasWidth / 2 - this.width / 2;
                break;
            case "idle":
                this.idleBehaviour(deltaTime);
                break;
            case "protect":
                this.protectBehaviour(deltaTime);
                break;
            case "anticipate":
                this.anticipateBehaviour(deltaTime);
                break;
            case "attack":
                this.attackBehaviour(deltaTime);
                break;
        }
    }
    draw() {
        this.sprite.actualFrameH = this.spriteH;      
        this.sprite.actualFrameV = this.spriteV + (-0.5 * this.facing + 0.5);
        this.sprite.draw(this.x, this.y);
    }
    idleBehaviour(deltaTime){
        console.log("papu idle");
    }
    protectBehaviour(deltaTime){
        console.log("papu protect");
    }
    anticipateBehaviour(deltaTime){
        console.log("papu anticipate");
    }
    attackBehaviour(deltaTime){
        console.log("papu attack");
    }
    toIdle() {
        this.state = "idle";
        this.spriteH = 0;
        this.attackable = false;
        this.setTimes();
    }
    toProtect(){
        this.state = "protect";
        this.spriteH = 1;
        this.setTimes();
    }
    toAnticipate() {
        this.state = "anticipate";
        this.spriteH = 2;
        this.attackable = true;
        this.setTimes();
    }
    toAttack() {
        this.state = "attack";
        this.spriteH = 3;
        this.setTimes();
    }
    damaged(){
        console.log("papu damaged");
    }
}