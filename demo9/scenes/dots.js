class Demo9DotsScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                showFrameTimeLeft: true,
                additional: [],
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(200, 200),
            init() {
                this.dotSize = new V2(20,30)
                //this.dotImage = createCanvas(this.dotSize, (ctx, size, hlp) => {})
                this.dots = [];
                let count = fast.r(this.size.x/this.dotSize.x)

                this.shuffleYClamps = [100,120]
                this.shuffleVClamps = [100,90]

                this.time = {
                    opacityChange: 30,
                    xChange: 20,
                    yChangeShuffle: 15,
                }
                
                for(let i = 0; i < count; i++){
                    this.dots[i] = {
                        p: new V2(),//new V2(i*this.dotSize.x,0),
                        opacity: 0,
                        v: 100,
                    }
                }

                this.timer = this.regTimerDefault(15, () => {
                    for(let i = 0; i < this.dots.length; i++){
                        this.processItem(this.dots[i]);
                    }

                    this.createImage();
                })

                //DEBUG
                //this.dots.forEach(d => d.opacity = 1);

                //this.fall();

                this.startSequence();
                
            },
            startSequence() {
                let shuffleCount = 5;
                this.script.items = [
                    function() {
                        this.resetY();
                        this.fadeIn(() => this.processScript());
                    },
                    ...new Array(shuffleCount).fill().map((_, i) => {
                        return function(){
                            this.shuffle(() => this.processScript(), i == shuffleCount-1, i);
                        }
                    }),
                    function() {
                        this.fall(() => this.processScript())
                    },
                    this.addProcessScriptDelay(150),
                    function() {
                        this.moveOut(() => this.processScript())
                    },
                    this.addProcessScriptDelay(250),
                    function() {
                        this.startSequence();
                    }
                ];

                this.processScript();
            },
            shuffle(callback, last = false, counter) {
                let lastItem = undefined;
                for(let i = 0; i < this.dots.length; i++){
                    if(last){
                        if(this.dots[i].p.y == this.shuffleYClamps[1]){
                            lastItem = this.dots[i]
                            this.dots[i].yChange = easing.createProps(18-counter, this.dots[i].p.y, this.shuffleYClamps[0], 'quad', 'inOut'); //this.time.yChangeShuffle + counter
                            this.dots[i].vChange = easing.createProps(18-counter, this.dots[i].v, this.shuffleVClamps[0], 'quad', 'inOut');

                            // if(i == this.dots.length-1){
                            //     this.dots[i].yChange.onComplete = callback;
                            // }
                        }
                    }
                    else {
                        lastItem = this.dots[i]
                        this.dots[i].yChange = easing.createProps(18-counter, this.dots[i].p.y, this.dots[i].p.y == this.shuffleYClamps[1] ? this.shuffleYClamps[0]: this.shuffleYClamps[1], 'quad', 'inOut');
                        this.dots[i].vChange = easing.createProps(18-counter, this.dots[i].v, this.dots[i].v == this.shuffleVClamps[1] ? this.shuffleVClamps[0]: this.shuffleVClamps[1], 'quad', 'inOut');

                        // if(i == this.dots.length-1){
                        //     this.dots[i].yChange.onComplete = callback;
                        // }
                    }
                }

                lastItem.yChange.onComplete = callback;
            },
            fadeIn(callback) {
                this.currentFadeInIndex = 0;
                this.fadeInTimer = this.regTimerDefault(15, () => {
                    this.dots[this.currentFadeInIndex].opacityChange = 
                        easing.createProps(this.time.opacityChange, 0, 1, 'quad', 'out');

                    // if(this.currentFadeInIndex == this.dots.length-1){
                    //     this.dots[this.currentFadeInIndex].opacityChange.onComplete = callback;
                    // }

                    this.currentFadeInIndex++;

                    if(this.currentFadeInIndex == this.dots.length){
                        this.unregTimer(this.fadeInTimer);
                        this.fadeInTimer = undefined;
                        callback();
                    }
                })
            },
            fall(callback) {
                this.currentFallIndex = 0;
                this.fallTimer = this.regTimerDefault(15, () => {
                    this.dots[this.currentFallIndex].yDelta = 0.3;
                    this.dots[this.currentFallIndex].ySpeed = 0;
                    this.dots[this.currentFallIndex].bounceCount = 2;

                    if(this.currentFallIndex == this.dots.length-1){
                        this.dots[this.currentFallIndex].yChangeOnComplete = callback;
                    }

                    this.currentFallIndex++;

                    if(this.currentFallIndex == this.dots.length){
                        this.unregTimer(this.fallTimer);
                        this.fallTimer = undefined;
                    }
                })
            },
            moveOut(callback) {
                this.dots[this.dots.length-1].xChange = easing.createProps(this.time.xChange, this.dots[this.dots.length-1].p.x, -1, 'quad', 'inOut', callback);
            },
            resetY() {
                for(let i = 0; i < this.dots.length; i++){
                    let dot = this.dots[i];
                    let y = this.shuffleYClamps[0]//getRandomInt(this.size.y*0, 20)
                    let v = this.shuffleVClamps[0];
                    if(i %2!=0){
                        y = this.shuffleYClamps[1]//getRandomInt(this.size.y*0.25, this.size.y*0.25-20)
                        v = this.shuffleVClamps[1];
                    }
                    dot.p = new V2(i*this.dotSize.x, y)
                    dot.v = v;
                }
            },
            processItem(dot){
                easing.commonProcess({context: dot, targetpropertyName: 'opacity', propsName: 'opacityChange', removePropsOnComplete: true});
                easing.commonProcess({context: dot, targetpropertyName: 'v', propsName: 'vChange', removePropsOnComplete: true, round: true});
                easing.commonProcess({context: dot, setter: (value) => { dot.p.y = value }, propsName: 'yChange', removePropsOnComplete: true});

                if(dot.yDelta){
                    dot.ySpeed+=dot.yDelta;
                    dot.p.y+=dot.ySpeed;

                    if(dot.ySpeed > 0 && dot.p.y+this.dotSize.y >= this.size.y){
                        dot.p.y = this.size.y - this.dotSize.y;
                        dot.bounceCount--;
                        
                        if(dot.bounceCount == 0){
                            dot.yDelta = 0;
                            dot.ySpeed = 0;

                            if(dot.yChangeOnComplete){
                                dot.yChangeOnComplete();
                                dot.yChangeOnComplete = undefined;
                            }
                        }
                        else {
                            dot.ySpeed = fast.r(dot.ySpeed/-2);
                            //console.log(dot.ySpeed)
                        }

                    }
                }

                if(dot.xChange){
                    dot.p.x = easing.process(dot.xChange);

                    this.dots.filter(d => d!=dot && d.p.x > dot.p.x).forEach(d => d.opacity = 0);

                    dot.xChange.time++;
                    if(dot.xChange.time > dot.xChange.duration){
                        dot.opacity = 0;
                        let onComplete = dot.xChange.onComplete;
                        dot.xChange = undefined;
                        onComplete();
                    }
                }
            },
            createImage(){
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    //hlp.setFillColor('white').strokeRect(0,0, size.x, size.y);

                    for(let i = 0; i < this.dots.length; i++){
                        let dot = this.dots[i];

                        if(dot.opacity < 1){
                            ctx.globalAlpha = dot.opacity;
                        }
                        let p = dot.p.toInt();
                        hlp.setFillColor(colors.hsvToHex([0,0,dot.v])).rect(p.x, p.y, this.dotSize.x, this.dotSize.y);
                        hlp.setFillColor('#CCC')
                            .rect(p.x+this.dotSize.x-1, p.y, 1, this.dotSize.y)
                            .setFillColor('#777').rect(p.x, p.y+this.dotSize.y-1, this.dotSize.x, 1)

                        if(dot.opacity < 1){
                            ctx.globalAlpha = 1;
                        }

                    }
                })
            }
        }))
    }
}