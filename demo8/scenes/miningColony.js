class MiningColonyScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                
            },
            asteroidBaseColor: '#D7D7D7'
        }, options)

        super(options);
    }

    start() {
        this.layeredStars = []
        this.layersCount = 5;
        this.itemsCountPerLayer = 3;

        this.stars = this.addGo(new Stars({
            size: this.viewport.clone(),
            position: this.sceneCenter.clone()
        }), 0)

        let defaultAsteroidProps = {
        
        }

        let that = this;

        let asteroidsProps = [
            {asteroids: []}, // 0
            {
                default: {
                    noise: {
                        min: -5, max: 0
                    },
                    baseColor: colors.changeHSV({initialValue: this.asteroidBaseColor, parameter: 'v', amount: -55}),
                    vDelta: -8
                },
                asteroids: Array(600).fill().map((p, i) => {
                    return { 
                        baseColor: colors.changeHSV({initialValue: that.asteroidBaseColor, parameter: 'v', amount: getRandomInt(-50, -60)}),
                        position: new V2(getRandomInt(0, this.viewport.x), getRandomGaussian(this.sceneCenter.y - 60, this.sceneCenter.y + 60)), //new V2(10 + 2*i + getRandomInt(-1, 1) , this.sceneCenter.y+ getRandomInt(-6,6)), 
                        size: new V2(2 + getRandomInt(0,1)*2,3 + getRandomInt(0,1)*2), 
                        stepSize: new V2(1,1), 
                        levitation: {
                            enabled: getRandomInt(0,3) == 3, max: getRandomInt(2,5), duration: getRandomInt(100, 200), direction: getRandomBool() ? 1: -1
                        }
                     }
                })
            }, // 1
            {
                default: {
                    noise: {
                        min: -5, max: 0
                    },
                    baseColor: colors.changeHSV({initialValue: this.asteroidBaseColor, parameter: 'v', amount: -50}),
                    vDelta: -15
                },
                asteroids: Array(100).fill().map((p, i) => {
                    return { 
                        baseColor: colors.changeHSV({initialValue: that.asteroidBaseColor, parameter: 'v', amount: getRandomInt(-40, -50)}),
                        position: new V2(50 + getRandomInt(0, this.viewport.x - 50), getRandomGaussian(this.sceneCenter.y - 40, this.sceneCenter.y + 40)),//new V2(50 + 4*i + getRandomInt(-1, 1) , this.sceneCenter.y+ getRandomInt(-6,6)), 
                        size: new V2(4 + getRandomInt(0,2)*2,6 + getRandomInt(0,2)*2), 
                        stepSize: new V2(2,2), 
                        levitation: {
                            enabled: getRandomBool(), max: getRandomInt(2,5), duration: getRandomInt(90, 180), direction: getRandomBool() ? 1: -1
                        }
                     }
                })
            }, // 2
            {
                default: {
                    noise: {
                        min: -5, max: 0
                    },
                    baseColor: colors.changeHSV({initialValue: this.asteroidBaseColor, parameter: 'v', amount: -40}),
                    vDelta: -25
                },
                asteroids: Array(50).fill().map((p, i) => {
                    return { 
                        baseColor: colors.changeHSV({initialValue: this.asteroidBaseColor, parameter: 'v', amount: getRandomInt(-30, -40)}),
                        position: new V2(100 + 15*i + getRandomInt(-2, 2) , this.sceneCenter.y+ getRandomInt(-5,5)), 
                        size: new V2(8 + getRandomInt(0,2)*2,12 + getRandomInt(0,2)*2), 
                        stepSize: new V2(2,2),
                        levitation: {
                            enabled: true, max: getRandomInt(2,4), duration: getRandomInt(80, 160), direction: getRandomBool() ? 1: -1
                        } 
                     }
                })
            }, // 3
            {
                default: {
                    noise: {
                        min: -7, max: -2
                    },
                    baseColor: colors.changeHSV({initialValue: this.asteroidBaseColor, parameter: 'v', amount: -30}),
                    vDelta: -30
                },
                asteroids: Array(20).fill().map((p, i) => {
                    return { 
                        position: new V2(150 + 25*i + getRandomInt(-7, 7), this.sceneCenter.y+ getRandomInt(-10,10)), 
                        size: new V2(15,21), 
                        stepSize: new V2(3,3),
                        rotation: getRandomInt(-5,5),
                        levitation: {
                            enabled: true, max: getRandomInt(2,5), duration: getRandomInt(70, 140), direction: getRandomBool() ? 1: -1
                        }
                     }
                })
            }, // 4
            {
                default: {
                    noise: {
                        min: -10, max: -5
                    },
                    baseColor: colors.changeHSV({initialValue: this.asteroidBaseColor, parameter: 'v', amount: -15}), //this.asteroidBaseColor,
                    vDelta: -40
                },
                asteroids: Array(10).fill().map((p, i) => {
                    return { 
                        position: new V2(200 + 40*i + getRandomInt(-10, 10), this.sceneCenter.y + getRandomInt(-10,10)), 
                        size: new V2(20, 30), stepSize: new V2(5,5), 
                        rotation: getRandomInt(-5,5),
                        fusingFactor: 2,
                        levitation: {
                            enabled: true, max: getRandomInt(3,6), duration: getRandomInt(60, 120), direction: getRandomBool() ? 1: -1
                        }
                    }
                } ) 
            }, // 5
            {
                default: {
                    noise: {
                        min: -10, max: -5
                    },
                    baseColor: colors.changeHSV({initialValue: this.asteroidBaseColor, parameter: 'v', amount: -10}), //this.asteroidBaseColor,
                    vDelta: -35
                },
                asteroids: Array(25).fill().map((p, i) => {
                    return { 
                        position: new V2(150 + getRandomInt(0, this.viewport.x - 150), getRandomGaussian(this.sceneCenter.y - 20, this.sceneCenter.y + 20)), 
                        size: new V2(6+ getRandomInt(0,2)*2, 8+ getRandomInt(0,2)*2), stepSize: new V2(2,2), 
                        rotation: 0,
                        levitation: {
                            enabled: true, max: getRandomInt(2,3), duration: getRandomInt(50, 100), direction: getRandomBool() ? 1: -1
                        }
                    }
                } ) 
            } // 6
        ]

        for(let l = 0; l < asteroidsProps.length; l++){
            for(let i = 0; i < asteroidsProps[l].asteroids.length; i++){
                this.addGo(new AsteroidModel(
                    assignDeep({}, defaultAsteroidProps, asteroidsProps[l].default, asteroidsProps[l].asteroids[i])
                ), l);
            } 
        }

        this.addGo(new GO({
            position: this.sceneCenter,
            size: new V2(this.viewport.x, 70),
            img: createCanvas(new V2(this.viewport.x, 70), (ctx, size) => {
                ctx.fillStyle = colors.changeHSV({initialValue: that.asteroidBaseColor, parameter: 'v', amount: -20})
                for(let i = 0; i < 4000; i++){
                    ctx.fillRect(getRandomInt(0, size.x), fastRoundWithPrecision(getRandomGaussian(0, size.y)), 1, 1)
                }

                // ctx.fillStyle = colors.changeHSV({initialValue: that.asteroidBaseColor, parameter: 'v', amount: -10})
                // for(let i = 0; i < 300; i++){
                //     ctx.fillRect(getRandomInt(0, size.x), fastRoundWithPrecision(getRandomGaussian(0, size.y)), 2, 2)
                // }
            })
        }))

        this.baseSize = new V2(60,80);
        let bs = this.baseSize;
        this.base = this.addGo(new AsteroidModel({
            position: new V2(this.sceneCenter.x + 50, this.sceneCenter.y - 5),
            size: this.baseSize,
            baseColor: colors.changeHSV({initialValue: this.asteroidBaseColor, parameter: 'v', amount: -15}),
            vDelta: -55,
            cornerPoints: [
                //new V2(0, this.baseSize.y/2), new V2(this.baseSize.x/2, 0), new V2(this.baseSize.x-1, this.baseSize.y/2), new V2(this.baseSize.x/2, this.baseSize.y-1)
                new V2(bs.x/10, bs.y/2),new V2(bs.x/15, bs.y/3), new V2(bs.x*2/10, bs.y/5), new V2(bs.x*3/10, bs.y/10),new V2(bs.x*4/10, bs.y/12), new V2(bs.x*5/10, bs.y/15)
                , new V2(bs.x*6/10, 0), new V2(bs.x*7/10, bs.y/20), new V2(bs.x*8/10, bs.y/10), new V2(bs.x*8.5/10, bs.y/5), new V2(bs.x-1, bs.y/3),
                new V2(bs.x*9.5/10, bs.y/2), new V2(bs.x*9/10, bs.y*12/20),new V2(bs.x*9/10, bs.y*14/20),new V2(bs.x*8.5/10, bs.y*15/20),new V2(bs.x*8/10, bs.y*15.5/20),new V2(bs.x*7.5/10, bs.y*16/20), new V2(bs.x*7/10, bs.y*17/20),new V2(bs.x*6.5/10, bs.y*19/20),new V2(bs.x*6/10, bs.y-1),
                new V2(bs.x*4.5/10, bs.y*19/20),new V2(bs.x*4/10, bs.y*17/20),new V2(bs.x*3.5/10, bs.y*15/20), new V2(bs.x*3/10, bs.y*14/20), new V2(bs.x*2.5/10, bs.y*13.5/20),new V2(bs.x*2/10, bs.y*12/20)
            ],
            holes: {
                enabled: true,
                count: 100,
                initSpreadX: [-20, 20],
                initSpreadY: [-30, 30],
                dotsCount: [60, 200],
                dotsSpread: [-10, 10]
            }, 
            fillStyleEasing: 'cubic',
            initCompleted() {
                this.entrance = this.addChild(new GO({
                    renderValuesRound: true,
                    position: new V2(-12,-17),
                    size: new V2(10,10),
                    img: PP.createImage(miningColonyImages.entranceImg1)
                }));

                this.upperBuilding = this.addChild(new GO({
                    renderValuesRound: true,
                    position: new V2(5,-20),
                    size: new V2(40, 30),
                    img: PP.createImage(miningColonyImages.otherStructures)
                }))

                this.upperBuilding = this.addChild(new GO({
                    renderValuesRound: true,
                    position: new V2(2,-30),
                    size: new V2(40, 20),
                    img: PP.createImage(miningColonyImages.upperBuildings1)
                }))

                this.upperHemiSphere = this.addChild(new GO({
                    renderValuesRound: true,
                    position: new V2(15,-25),
                    size: new V2(10, 10),
                    img: PP.createImage(miningColonyImages.upperHemiSphere)
                }))


                let navPointsPos = [new V2(-45, -45), new V2(-18, -17)];
                let distance = navPointsPos[0].distance(navPointsPos[1]);
                let direction = navPointsPos[0].direction(navPointsPos[1]);
                

                this.navPoints =  new Array(8).fill().map((p, i, arr) => {
                    return navPointsPos[0].add(direction.mul(distance*i/(arr.length-1)))
                }).map((p, i) => 
                new Array(2).fill().map((_p, _i) => {
                    return this.addChild(new GO({
                        renderValuesRound: true,
                        position: new V2(p.x +_i*6, p.y - _i*6),
                        size: new V2(1,1),
                        img: createCanvas(new V2(1,1), ctx => { ctx.fillStyle = '#91230D'; ctx.fillRect(0,0,1,1)}),//'#E2DC22'
                        init() {
                            this.alterColor = this.addChild(new GO({
                                isVisible: false,
                                renderValuesRound: true,
                                position: new V2(0,0),
                                size: new V2(1,1),
                                img: createCanvas(new V2(1,1), ctx => { ctx.fillStyle = '#E2DC22'; ctx.fillRect(0,0,1,1)}),//'#'
                                // init() {
                                //     this.addEffect(new FadeInOutEffect({ effectTime: 250, updateDelay: 40, loop: true, initOnAdd: true, startDelay: (i%2 == 0 ? 0 : 1500) }))
                                // }
                            }))
                        }
                    }))
                })
                
                );

                this.minersEntrance = this.addChild(new GO({
                    position: new V2(25, -15),
                    size: new V2(10,8),
                    img: PP.createImage(miningColonyImages.minirsEntrance),
                    init() {
                        [new V2(2.5,-1.5), new V2(2.5,2.5)].map((p,i) => {
                            return this.addChild(new GO({
                                size: new V2(1,1),
                                position: p,
                                img: createCanvas(new V2(1,1), ctx => { ctx.fillStyle = '#E2DC22'; ctx.fillRect(0,0,1,1)}),
                                init() {
                                    this.addEffect(new FadeInOutEffect({ effectTime: 1000, updateDelay: 40, loop: true, initOnAdd: true }))
                                }
                            }));
                        })
                    }
                }))

                this.sideLightTop = this.addChild(new GO({
                    position: new V2(7, -42),
                    size: new V2(5,10),
                    renderValuesRound: true,
                    img: PP.createImage(miningColonyImages.sideLightTopImg),
                    init() {
                        this.alterColor = this.addChild(new GO({
                            //isVisible: false,
                            renderValuesRound: true,
                            position: new V2(0,1.5),
                            size: new V2(1,1),
                            img: createCanvas(new V2(1,1), ctx => { ctx.fillStyle = '#aa3828'; ctx.fillRect(0,0,1,1)}),
                            init() {
                                this.addBlink();
                            },
                            addBlink() {
                                this.addEffect(new FadeInOutEffect({ effectTime: 80, updateDelay: 40, worksCount: 4, initOnAdd: true, startDelay: 2000, removeEffectOnComplete: true,
                                    completeCallback: () => this.addBlink() }))
                            }
                        }))
                    }
                }))

                this.currentNavPointIndex = 0;

                this.navPointsBlinkTimer = createTimer(300, () => {
                    this.navPoints[this.currentNavPointIndex].forEach(p => {p.alterColor.isVisible = true})
                    this.navPoints[this.currentNavPointIndex == 0 ? this.navPoints.length-1 : this.currentNavPointIndex-1].forEach(p => {p.alterColor.isVisible = false;})
                    this.currentNavPointIndex++;
                    if( this.currentNavPointIndex == this.navPoints.length)
                        this.currentNavPointIndex = 0;

                }, this, true);
                this.registerTimer(this.navPointsBlinkTimer);
            }
        }), 4)
        
        this.registerTimer(createTimer(1500, () => {
            let inverted = getRandomBool();
            this.addGo(new TrafficSpaceShip({
                inverted:inverted,
                position: !inverted ? new V2(289+ getRandomInt(-2,2), 127+ getRandomInt(-2,2)) : new V2(0, 90 -getRandomInt(0,20))
            }), 20)
        }, this, true))
        
    }

    backgroundRender() {
        let size = SCG.viewport.real.size;
        SCG.contexts.background.fillStyle = 'black';
        SCG.contexts.background.fillRect(0,0, size.x, size.x);
        
        let grd = SCG.contexts.background.createLinearGradient(size.x/2,0, size.x/2, size.y);
        grd.addColorStop(0, 'rgba(255,255,255,0)');grd.addColorStop(0.2, 'rgba(255,255,255,0)');grd.addColorStop(0.35, 'rgba(255,255,255,0.01)');
        grd.addColorStop(0.5, 'rgba(255,255,255,0.15)');
        grd.addColorStop(0.65, 'rgba(255,255,255,0.01)');grd.addColorStop(0.8, 'rgba(255,255,255,0)');grd.addColorStop(1, 'rgba(255,255,255,0)');

        SCG.contexts.background.fillStyle = grd;
        SCG.contexts.background.fillRect(0,0, size.x, size.x);

        //SCG.contexts.background.drawImage(this.bgImage, 0,0, SCG.viewport.real.width, SCG.viewport.real.height)
    }
}

class Stars extends MovingGO {
    constructor(options = {}){
        options = assignDeep({}, {
            starsColor: [255,255,255],
            vClamps: [0.1, 0.8],
            startCountClamps: [200, 4000],
            renderValuesRound: true,
            itemsCountPerLayer: 1,
            layersCount: 5,
            layeredStars: []
        }, options);

        options.destination = new V2(options.position.x, options.position.y - options.size.y/2)

        super(options);
    }

    init() {
        for(let layer = 0; layer < this.layersCount; layer++){
            this.layeredStars[layer] = [];
            for(let i = 0;i<this.itemsCountPerLayer;i++){
                this.layeredStars[layer][i] = [
                    this.addChild(new MovingGO({
                        size: this.size,
                        position: new V2().add(new V2(0,this.size.y*i)),
                        img: this.starsLayerGeneratr(layer, this.layersCount-1),
                        // setDestinationOnInit: true,
                        // destination: new V2().add(new V2(0, -this.size.y)),
                        // speed: 0.1 + (0.01*layer),
                        renderValuesRound: true,
                        // destinationCompleteCallBack: function(){
                        //     this.position = new V2().add(new V2(0, this.size.y*(this.parent.itemsCountPerLayer-1)));
                        //     this.setDestination( new V2().add(new V2(0, -this.size.y)))
                        // }
                    }), layer),
                    
                ]
            }

            let sc = this.starsColor;
            let hsv = rgbToHsv(sc[0], sc[1], sc[2]);
            hsv.v = this.vClamps[0] + (this.vClamps[1]-this.vClamps[0])*(layer/(this.layersCount-1));
            let fillStyle = '#' + rgbToHex( hsvToRgb(hsv.h, hsv.s, hsv.v, true));
            let img = createCanvas(new V2(1,1), (ctx) => { ctx.fillStyle = fillStyle; ctx.fillRect(0,0,1,1) });

            for(let i = 0; i < 100; i++){
                this.addChild(new GO({
                    position: new V2(getRandomInt(-this.size.x/2, this.size.x/2), getRandomInt(-this.size.y/2, this.size.y/2)),
                    size: new V2(1,1),
                    img: img,
                    init(){
                        this.createFadeInOutTimer();
                    },
                    createFadeInOutTimer() {
                        this.addEffectTimer = createTimer(getRandomInt(5000, 10000), () => {
                            this.addEffect(new FadeInOutEffect({ effectTime: getRandomInt(100, 300), updateDelay: 40, loop: false, initOnAdd: true, removeEffectOnComplete: true, 
                                completeCallback: () => { this.createFadeInOutTimer(); } }));
                            this.unregTimer(this.addEffectTimer);
                        }, this, false);
        
                        this.registerTimer(this.addEffectTimer);
                    }
                }))
            }
        }
    }

    starsLayerGeneratr(layer, layersMax) {
        let that = this;
        return createCanvas(this.size, (ctx, size)=> {
            let sc = that.starsColor;
            let hsv = rgbToHsv(sc[0], sc[1], sc[2]);
            hsv.v = this.vClamps[0] + (this.vClamps[1]-this.vClamps[0])*(layer/layersMax);
            ctx.fillStyle = '#' + rgbToHex( hsvToRgb(hsv.h, hsv.s, hsv.v, true));
            let count =  fastRoundWithPrecision(this.startCountClamps[1] - (this.startCountClamps[1] - this.startCountClamps[0])*(layer/layersMax));
            for(let i = 0; i < count; i++){
                ctx.fillRect(getRandomInt(0, size.x), fastRoundWithPrecision(getRandomGaussian(-size.y*0.25, 1.25*size.y)), 1, 1)
            }
        })
    }
}

class TrafficSpaceShip extends GO {
    constructor(options = {}){
        options = assignDeep({}, {
            size: new V2(1,1),
            renderValuesRound: true,
            baseColors: ['#E0BCAC', '#B5D6E2', '#88A4E2', '#E0D98D'],
            baseColor: '#CCA394',
        }, options)

        super(options);
    }

    init() {
        this.baseColor = colors.changeHSV({ initialValue: this.baseColors[getRandomInt(0,this.baseColors.length-1)], parameter: 'v', amount: getRandomInt(-10, 10) });

        if(this.inverted)
            this.script.items = [
                function(){
                    let goRight = { time: 0, duration: getRandomInt(50,70), change: getRandomInt(200,220), type: 'cubic', method: 'out', startValue: this.position.x };
                    let currentSizeX = 1;
                    this.scriptTimer = this.createScriptTimer(
                        function() { 
                            let next = easing.process(goRight);
                            let delta = next - this.position.x;
                            if(delta < 1)
                                delta = 1;

                            this.position.x = next;
                            this.size.x = delta > 1 ? fastRoundWithPrecision(delta*2) : delta;
                            if(currentSizeX != this.size.x){
                                currentSizeX = this.size.x;
                                //console.log(delta, currentSizeX);
                                this.regenImg();
                            }
                            goRight.time++; },
                        function() {return goRight.time > goRight.duration; }, true, 30)
                },function(){
                    //debugger;
                    this.scriptTimer = this.createScriptTimer(
                        function() {  },
                        function() {return true }, true, getRandomInt(300, 700))
                }, function(){
                    let duration = 120+getRandomInt(-10, 10);
                    let fall = { time: 0, duration: duration, change: 97 - this.position.y + getRandomInt(-2,2), type: 'quad', method: 'in', startValue: this.position.y };
                    let goRight = { time: 0, duration: duration, change: 259 - this.position.x+ getRandomInt(-4,4), type: 'quad', method: 'in', startValue: this.position.x };
                    this.size.x = 1;
                    this.regenImg();
                    this.scriptTimer = this.createScriptTimer(
                        function() { 
                            this.position.y = easing.process(fall); fall.time++; 
                            this.position.x = easing.process(goRight); goRight.time++;
                        },
                        function() {return fall.time > fall.duration; })
                }, function(){
                    let duration = 140+getRandomInt(-10, 10);
                    let fall = { time: 0, duration: duration, change: 30+ getRandomInt(-2,2), type: 'quad', method: 'out', startValue: this.position.y };
                    let goRight = { time: 0, duration: duration, change: 30+ getRandomInt(-2,2), type: 'quad', method: 'out', startValue: this.position.x };
                    this.size.x = 1;
                    this.regenImg();
                    this.scriptTimer = this.createScriptTimer(
                        function() { 
                            this.position.y = easing.process(fall); fall.time++; 
                            this.position.x = easing.process(goRight); goRight.time++;
                        },
                        function() {return fall.time > fall.duration; })
                }
                , function() {
                    this.setDead();
                }
            ]
        else 
            this.script.items = [
                function(){
                    let that =this;
                    let duration = 140 + getRandomInt(-10, 10);
                    this.img = createCanvas(new V2(1,1), (ctx) => { ctx.fillStyle = that.baseColor, ctx.fillRect(0,0,1,1)});
                    let rise = { time: 0, duration: duration, change: -30+ getRandomInt(-2,2), type: 'quad', method: 'in', startValue: this.position.y };
                    let goLeft = { time: 0, duration: duration, change: -30+ getRandomInt(-4,4), type: 'quad', method: 'in', startValue: this.position.x };
                    this.scriptTimer = this.createScriptTimer(
                        function() { 
                            this.position.y = easing.process(rise); rise.time++; 
                            this.position.x = easing.process(goLeft); goLeft.time++;
                        },
                        function() {return rise.time > rise.duration; })
                },
                function(){
                    let duration = 120 + getRandomInt(-10, 10);
                    let rise = { time: 0, duration: duration, change: -20 + getRandomInt(-5,5), type: 'quad', method: 'out', startValue: this.position.y };
                    let goLeft = { time: 0, duration: duration, change: -40 + getRandomInt(-10, 10), type: 'quad', method: 'out', startValue: this.position.x };
                    this.scriptTimer = this.createScriptTimer(
                        function() { 
                            this.position.y = easing.process(rise); rise.time++; 
                            this.position.x = easing.process(goLeft); goLeft.time++;
                        },
                        function() {return rise.time > rise.duration; })
                },
                function(){
                    let goLeft = { time: 0, duration: getRandomInt(30,50), change: -500, type: 'cubic', method: 'in', startValue: this.position.x };
                    let currentSizeX = 1;
                    this.scriptTimer = this.createScriptTimer(
                        function() { 
                            let next = fastRoundWithPrecision(easing.process(goLeft));
                            let delta = this.position.x - next;
                            if(delta == 0)
                                delta = 1;

                            this.position.x = next;
                            this.size.x = fastRoundWithPrecision(delta*2);
                            if(currentSizeX != this.size.x){
                                currentSizeX = this.size.x;
                                this.regenImg();
                            }
                            goLeft.time++; },
                        function() {return goLeft.time > goLeft.duration; }, true, 30)
                }, function() {
                    this.setDead();
                }
            ];

        this.processScript();
    }

    regenImg(){
        let currentSizeX = this.size.x;
        this.img = createCanvas(new V2(currentSizeX,1), (ctx) => { 
            let rgb = hexToRgb(this.baseColor, true);
            // if(currentSizeX == 40)
            //     debugger;

            for(let i = 0; i < currentSizeX;i++){
                let opacity = this.inverted ? (i+1)/currentSizeX : 1 - (i/currentSizeX);
                ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${opacity})`;
                ctx.fillRect(i,0,1,1);
            }
        });
    }
}