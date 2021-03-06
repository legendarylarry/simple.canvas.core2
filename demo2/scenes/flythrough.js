class FlytroughScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {
        }, options);

        super(options);

        this.initialized = false;
        this.deltas = {
            speedDelta: 0.05,
            opacityDelta: 0.025,
            sizeDelta: 0.005
        }

        this.deltaChangeDirection = 1;

        this.deltaChangeTimer = createTimer(500, this.deltaChangeProcesser, this, false);
    }

    deltaChangeProcesser() {
        // if(this.deltas.speedDelta !=1)
        //     {
        //         this.deltas.speedDelta =1;
        //         this.deltas.opacityDelta =0.15;
        //     }
        // else 
        //     {
        //         this.deltas.speedDelta =0.05;
        //         this.deltas.opacityDelta =0.025;
        //     }
        if(this.deltas.speedDelta >=0.1)
            this.deltaChangeDirection = -1;
        else if(this.deltas.speedDelta <= 0.025)
            this.deltaChangeDirection = 1;

        this.deltas.speedDelta+=this.deltaChangeDirection*0.0005;
        // this.deltas.opacityDelta+=this.deltaChangeDirection*0.0005;
        // this.deltas.sizeDelta+=this.deltaChangeDirection*0.0005;

        //this.deltas.speedDelta = 0;
    }

    preMainWork(now){
        if(!this.initialized)
        {
            for(let i = 0; i < 3000; i++){
                let _r = getRandom(0.1, 0.5);
                let go = this.addGo(new FlythroughStar({
                    position: new V2(getRandomInt(10, this.viewport.x-10), getRandomInt(10, this.viewport.y-10)),
                    defaultOpacity: 0,
                    defaultSpeed: 0.01,
                    defaultSize: new V2(1,1),
                    opacity: _r > 1 ? 1 : _r,
                    speed: _r,
                    // speedDelta: 0.05,
                    // opacityDelta: 0.025,
                    // sizeDelta: 0.005
                }), 1);

                go.deltas = this.deltas;
            }
            

            this.initialized = true;
        }
        else {
            doWorkByTimer(this.deltaChangeTimer, now);
        }
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = 'black';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }
}