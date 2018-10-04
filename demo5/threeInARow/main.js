class ThreeInARowScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {
            addZombieDefender: true
        }, options);

        super(options);

        this.board = new Board({
            size: new V2(300,300),
            position: this.addZombieDefender ? new V2(this.space.x - 300/2, this.space.y/2) : new V2(this.space.x/2, this.space.y/2),
            preventNonResultingSwaps: false,
        })

        this.points = {
            
            pistol: 0, 
            submachinegun: 0, 
            rifle: 0, 
            sniper: 0, 
            machinegun: 0,
            rpg: 0,
            addPoint(type) {
                console.log(`ThreeInARowScene.points.addPoint. Type: ${type}`);
                this[type]++;
                //trigger render UI
                //trigger soldier add if score completed
            }
        }

        this.addGo(this.board);

        if(this.addZombieDefender){
            this.zombieDefender = new ZombieDefender({
                position: new V2(200/2, this.space.y/2),
                size: new V2(200, 300),
            });

            this.addGo(this.zombieDefender);
        }

        window.board = this.board;
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = 'black';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }
}