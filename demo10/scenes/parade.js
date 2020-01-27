class Demo10ParadeScene extends Scene {
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
        this.backgroundRenderDefault('#445461');
    }

    start(){
        this.bg = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y),
            size: this.viewport.clone(),
            init() {
                
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    let drawWindow = ({p, s, cOuter, cInner, cUpperShadow}) => {
                        hlp.setFillColor(cOuter).rect(p.x,p.y,s.x,s.y)
                        .setFillColor(cInner).rect(p.x+1,p.y+1,s.x-2,s.y-2)
                        .setFillColor(cUpperShadow).rect(p.x+1,p.y+1,s.x-2,1)
                    }


                    hlp.setFillColor('#435561').rect(0,0,size.x, size.y); //общий фон
                    hlp.setFillColor('#3E4E59').rect(37,0, 125, 120); // средняя глубина
                    hlp.setFillColor('#37454F').rect(61, 0, 77, 120) // центральная секция
                    hlp.setFillColor('#2A3843').rect(37, 0, 1, 120).rect(61, 0, 1, 120).rect(138, 0, 1, 120).rect(162, 0, 1, 120) // темные вертикали
                    hlp.setFillColor('#34434e').rect(38, 0, 1, 120).rect(161, 0, 1, 120) // полутона в средней части
                    hlp.setFillColor('#313f49').rect(62, 0, 1, 120).rect(137, 0, 1, 120) // полутона в центральной части
                    //
                    hlp.setFillColor('#4C606D').rect(61,98, 78, 77).setFillColor('#42535e').rect(61,97,78,1)

                    //дополнительные линии
                    hlp.setFillColor('#394A54').rect(2,0,1, 120).rect(10,0,1, 120).rect(16,0,1, 120).rect(24,0,1, 120).rect(30,0,1, 120)
                    .rect(0,10, 3, 1).rect(11,10, 6, 1).rect(24,10, 7, 1)
                    .rect(3,20, 8, 1).rect(17,20, 8, 1).rect(31,20, 6, 1)
                    .rect(0,10+37, 3, 1).rect(11,10+37, 6, 1).rect(24,10+37, 7, 1)
                    .rect(3,20+37, 8, 1).rect(17,20+37, 8, 1).rect(31,20+37, 6, 1)
                    .rect(0,10+74, 3, 1).rect(11,10+74, 6, 1).rect(24,10+74, 7, 1)
                    .rect(3,20+74, 8, 1).rect(17,20+74, 8, 1).rect(31,20+74, 6, 1);

                    let outerWindowsP = [
                        new V2(10,-10), new V2(24,-10),new V2(-4,-10), new V2(169,-10), new V2(183,-10), new V2(197,-10),
                        new V2(10,26), new V2(24,26),new V2(-4,26), new V2(169,26), new V2(183,26), new V2(197,26),
                        new V2(10,62), new V2(24,62),new V2(-4,62), new V2(169,62), new V2(183,62), new V2(197,62),
                    ];
                    outerWindowsP.forEach(
                         (p) => drawWindow({p, s: new V2(7, 15), cOuter: '#2E4453', cInner: '#1F3A4D', cUpperShadow: '#1D313E'}))
                    
                    let midWindowsP = [
                        new V2(40,-8), new V2(49,-8), new V2(145,-8), new V2(154,-8),
                        new V2(40,28), new V2(49,28), new V2(145,28), new V2(154,28),
                        new V2(40,64), new V2(49,64), new V2(145,64), new V2(154,64)
                    ]

                    midWindowsP.forEach(
                        (p) => drawWindow({p, s: new V2(6, 13), cOuter: '#2E4453', cInner: '#1F3A4D', cUpperShadow: '#1D313E'}))

                    let innerWindowsP = [
                        new V2(64,-9), new V2(78,-9), new V2(90,-9), new V2(90+12,-9), new V2(90+24,-9), new V2(128,-9),
                        new V2(64,27), new V2(78,27), new V2(90,27), new V2(90+12,27), new V2(90+24,27), new V2(128,27),
                        new V2(64,63), new V2(78,63), new V2(90,63), new V2(90+12,63), new V2(90+24,63), new V2(128,63)
                    ]

                    innerWindowsP.forEach(
                        (p) => drawWindow({p, s: new V2(7, 17), cOuter: '#2A4050', cInner: '#1F3A4D', cUpperShadow: '#1D313E'}))

                    hlp.setFillColor('#132E48').rect(0,175,size.x, 75)
                })
            }
        }), 1)

        this.mid = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y),
            size: this.viewport.clone(),
            init() {
                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(Demo10ParadeScene.models.mid)
                }))
            }
        }), 2)

        this.man = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y),
            size: this.viewport.clone(),
            init() {
                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(Demo10ParadeScene.models.man)
                }))
            }
        }), 5)
    }
}