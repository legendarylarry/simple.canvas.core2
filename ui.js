SCG.UI = {
    invalidate() {
        if(!SCG.contexts.ui)
            return;

        SCG.contexts.ui.clearRect(0, 0, SCG.viewport.real.width, SCG.viewport.real.height);

		var as = SCG.scenes.activeScene;
		var i = as.ui.length;
		while (i--) {
            as.ui[i].needRecalcRenderProperties = true;
			as.ui[i].update();
			as.ui[i].render();
		}
    },
    createCanvas(size, contextProcesser) {
        if(!size)
            throw 'SCG.UI.createCanvas -> No size provided ';

        let canvas = document.createElement('canvas');
        canvas.width = size.x;
        canvas.height = size.y;

        let ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        if(contextProcesser && isFunction(contextProcesser))
            contextProcesser(ctx, size);

        return canvas;
    }
}

class UIControl extends GO {
    constructor(options = {}){
        if(options.click && isFunction(options.click)){
            if(!options.handlers)
                options.handlers = {}

            options.handlers.click = options.click;
            delete options.click;
        }

        options = assignDeep({}, {
            preventDiving: true,
            handlers: {
                click: () => { console.log(`Control ${this.id} empty click handler`); },
                down: () => { /* do nothing */ },
                up: () => { /* do nothing */ },
                move: () => { /* do nothing */ },
                out: () => { /* do nothing */  }
            }
        }, options);

        Object.keys(options.handlers).forEach(key => {
            if(options.handlers[key] && isFunction(options.handlers[key])){
                let originalHandler = options.handlers[key];
                options.handlers[key] = () => {
                    originalHandler();

                    if(key === 'move'){
                        this.moveEventTriggered = true;
                    }

                    if(key === 'out'){
                        this.moveEventTriggered = false;
                    }

                    return {
                        preventDiving: this.preventDiving
                    };
                }
            }
        });

        options.contextName = 'ui';
        options.isStatic = true; 
        super(options);
    }

    invalidate() {
        if(!this.isVisible)
            return;

        let rp = this.renderPosition;
        let rs = this.renderSize;
        SCG.contexts.ui.clearRect(rp.x - rs.x/2, rp.y - rs.y/2, rs.x, rs.y);
        this.needRecalcRenderProperties = true;
        this.update();
        this.render();
    }
}

class UIPanel extends UIControl {
    constructor(options = {}){
        options = assignDeep({}, {
            preventDiving: true,
            draggable: false,
            scrollable: false,
            backgroundImg: undefined,
            controls: [],
            scroll: {
                enabled: false,
                started: false,
            },
            handlers: {
                down: () => { 
                    if(this.scroll.enabled)
                        this.scroll.started = true;
                 },
                up: () => { 
                    if(this.scroll.enabled)
                        this.scroll.started = false;
                },
                move: () => { 
                    if(this.scroll.enabled && this.scroll.started){
                        for(let ctl of this.controls){
                            ctl.originalPosition.add(new V2(0, -SCG.controls.mouse.state.movingDelta.y/SCG.viewport.scale), true);
                            this.truncateControl(ctl);
                        }

                        this.invalidate();
                    }
                 },
                 out: () => {
                    if(this.scroll.enabled)
                        this.scroll.started = false;
                 }
            }
        }, options);

        if(!options.backgroundImg){
            options.backgroundImg = SCG.UI.createCanvas(options.size, function(innerCtx, size){
                innerCtx.fillStyle="#EFEFEF";
                innerCtx.fillRect(0,0,size.x,size.y);
            })
        }

        options.img = options.backgroundImg;

        super(options);
    }

    addControl(control) {
        if(!control instanceof UIControl)
            throw 'Wrong control type';

        if(!control.asImage)
            throw 'Cant add not rasterized control';

        this.truncateControl(control);

        control.preventDiving = false;
        this.addChild(control);
        this.controls.push(control);
    }

    truncateControl(control) {
        if(!control.asImage)
            return;

        
        let c = control;
        c.destSourcePosition = undefined;

        if(c.originalSize === undefined)
            c.originalSize = c.size.clone();
        else 
            c.size = c.originalSize.clone();
        
        if(c.originalPosition === undefined)
            c.originalPosition = c.position.clone();
        else 
            c.position = c.originalPosition.clone();

        let relativeBox = new Box(new V2(-this.size.x/2, -this.size.y/2), this.size);
        let cBox = new Box(c.position.add(new V2(-c.size.x/2,-c.size.y/2)), c.size);

        c.isVisible = true;
        if(!relativeBox.isIntersectsWithBox(cBox)){
            c.isVisible = false;
        }else {
            if(
                !relativeBox.isPointInside(cBox.topLeft) 
                || !relativeBox.isPointInside(cBox.topRight)
                || !relativeBox.isPointInside(cBox.bottomLeft)
                || !relativeBox.isPointInside(cBox.bottomRight)
            ){
                if(cBox.bottomLeft.y > relativeBox.bottomLeft.y){
                    c.size.y = relativeBox.bottomLeft.y - cBox.topLeft.y;
                    c.position.y = relativeBox.bottomLeft.y-c.size.y/2;
                    c.destSourcePosition = new V2();
                    c.destSourceSize = new V2(c.img.width, c.size.y*c.img.height/c.originalSize.y);
                }
                else if(cBox.topLeft.y < relativeBox.topLeft.y) {
                    c.size.y = cBox.bottomLeft.y - relativeBox.topLeft.y;
                    c.position.y = relativeBox.topLeft.y+c.size.y/2;
                    //console.log(`Original height: ${c.originalSize.y}; visible height: ${c.size.y}; original position.y: ${c.originalPosition.y}; visible position.y: ${c.position.y}`);
                    c.destSourcePosition = new V2(0, c.img.height * (relativeBox.topLeft.y-cBox.topLeft.y)/c.originalSize.y);
                    c.destSourceSize = new V2(c.img.width, c.size.y*c.img.height/c.originalSize.y);
                }
            }
        }
        
    }
}

class UIDropdownItem extends UIControl {
    constructor(options = {}) {
        options = assignDeep({}, {
            
        }, options);

        super(options);
    }
}

class UIDropdown extends UIControl {
    constructor(options = {}) {
        options = assignDeep({}, {
            expanded: false,
            selectedValue: undefined,
            selectedIndex: undefined,
            size: new V2(80, 25),
            items: [],
            maxItemsVisible: 5,
            placeHolderText: 'Select',
            itemHeight: 20,
            panelDirection: 'down',
            toggleButtonWidth: 20,
            selectedItemImg: undefined,
            toggleButtonImg: undefined,
            toggleButtonActiveImg: undefined,
        }, options);

        if(!options.selectedItemImg){
            options.selectedItemImg = SCG.UI.createCanvas(new V2(options.size.x - options.toggleButtonWidth, options.size.y).mul(3), function(innerCtx, size){
                innerCtx.fillStyle="#EFEFEF";
                innerCtx.fillRect(0,0,size.x,size.y);
            })
        }

        if(!options.toggleButtonImg){
            options.selectedItemImg = SCG.UI.createCanvas(new V2(options.toggleButtonWidth, options.size.y).mul(3), function(innerCtx, size){
                innerCtx.fillStyle="#EEEEEE";
                innerCtx.fillRect(0,0,size.x,size.y);
            })
        }

        super(options);
    }

    internalPreUpdate(){
        if(!this.initialized){
            this.initialized = true;

            let panelHeight = (this.items.length > this.maxItemsVisible ? this.maxItemsVisible : this.items.length) * this.itemHeight;
            let toTop = this.position - this.size.y/2
            let toBottom = SCG.scenes.activeScene.viewport.y - this.position.y+this.size.y/2;
            
            let toBorder = toBottom;
            if(toTop > toBottom){
                this.panelDirection = "up";
                toBorder = toTop;
            }

            if(toBorder < panelHeight){
                panelHeight = toBorder;
            }

            this.collapsedSize = this.size.clone();
            this.expandedSize = new V2(this.size.x, this.size.y+panelHeight);

            this.selectedItemControl = new UIControl({
                size: new V2(this.size.x - this.toggleButtonWidth, this.size.y),
                img: this.selectedItemImg,
                position: new V2(1,1)
            });
            this.toggleButtonControl = new UIControl({
                size: new V2(this.toggleButtonWidth, this.size.y),
                img: this.toggleButtonImg,
                position: new V2(1,1)
            });

            this.setChildSizesAndPositions();
            this.addChild(this.selectedItemControl);
            this.addChild(this.toggleButtonControl);
        }
    }

    setChildSizesAndPositions(){
        if(this.expanded){
            this.size = this.expandedSize;
            // todo
        }
        else {
            this.size = this.collapsedSize;
            let sic = this.selectedItemControl;
            sic.position = new V2((sic.size.x-this.size.x)/2, 0);

            let tbc = this.toggleButtonControl;
            tbc.position = new V2((this.size.x - tbc.size.x)/2,0)
        }
    }

    toggle(){
        this.expanded = !this.expanded;

        this.setChildSizesAndPositions();
        this.invalidate();
    }
}


class UILabel extends UIControl {
    constructor(options = {}){
        options = assignDeep({}, {
            size: new V2(50,10),
            debug: false,
            text: GO.getTextPropertyDefaults('sample'),
            format: undefined
        }, options);

        super(options);
    }

    internalPreUpdate(now){
        if(this.format){
            var args = this.format.argsRetriever ? this.format.argsRetriever() : this.format.arguments;
            this.text.value = String.format(this.format.format, args);
        }
    }
}

class UIProgressBar extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            text: GO.getTextPropertyDefaults('progress'),
            img: undefined,
            current: 0,
            max: 100,
            fillColor: 'rgb(180,255,50)'
        }, options)

        options.isStatic = true;
        options.contextName = 'ui'

        super(options);
    }
}

class UIRadioButton extends UIControl {
    constructor(options = {}) {
        options = assignDeep({}, {
            checked: false,
            group: undefined,
            borderImg: undefined,
            checkImg: undefined,
            handlers: {
                up: () => {
                    for(let control of this.parentScene.ui.filter((control) => control instanceof UIRadioButton && control.group === this.group)){
                        if(control !== this){
                            control.check(false);
                        }
                        else {
                            this.check(true);
                        }  
                    }   
                }
            }
        }, options);

        if(!options.group)
            throw 'Can create RadioButton without group';

        if(!options.borderImg){
            options.borderImg = SCG.UI.createCanvas(new V2(50,50), function(ctx, size){
                ctx.strokeStyle ="#CCCCCC";
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.arc(size.x/2, size.y/2, size.x/2-ctx.lineWidth/2, 0, 2 * Math.PI, false);
                ctx.stroke();
            });
        }

        if(!options.checkImg){
            options.checkImg = SCG.UI.createCanvas(new V2(50,50), function(ctx, size){
                ctx.fillStyle ="#AAAAAA";
                ctx.arc(size.x/2, size.y/2, size.x/2-ctx.lineWidth*8, 0, 2 * Math.PI, false);
                ctx.fill();
            });
        }

        options.img = options.borderImg;

        super(options);

        this.checkedGo = new GO({
            position: new V2(),
            size: this.size.clone(),
            img: this.checkImg,
            contextName: 'ui',
            isStatic: true,
            isVisible: this.checked
        });

        this.addChild(this.checkedGo);

        if(this.label){
            let labelProps = {
                text: {
                    ...this.label,
                    align: 'left'
                },
                position:  new V2(this.size.x*0.75,0),
                size: this.size.clone()
            }

            this.addChild(new UILabel(labelProps))
        }
    }

    check(checked){
        if(this.checked === checked)
            return;

        this.checked = checked;
        this.checkedGo.isVisible = checked;
        this.invalidate();
    }
}

class UICheckbox extends UIControl {
    constructor(options = {}) {
        options = assignDeep({}, {
            checked: true,
            label: undefined,
            borderImg: undefined,
            checkImg: undefined,
            handlers: {
                up: () => {
                    this.checkedGo.isVisible = !this.checkedGo.isVisible;
                    this.invalidate();
                }
            }
        }, options);
        
        if(!options.borderImg){
            options.borderImg = SCG.UI.createCanvas(new V2(50,50), function(ctx, size){
                ctx.strokeStyle ="#CCCCCC";
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.rect(0,0,size.x, size.y);
                ctx.stroke();
            });
        }

        if(!options.checkImg){
            options.checkImg = SCG.UI.createCanvas(new V2(50,50), function(ctx, size){
                ctx.strokeStyle ="#AAAAAA";
                ctx.lineCap = 'round';
                ctx.lineWidth = 5;
                drawByPoints(ctx, new V2(10,10), [new V2(size.x/2-5, size.y-20), new V2(size.x/2-12, -size.y/2+10)]);
                ctx.stroke();
            });
        }
        
        options.img = options.borderImg;

        super(options);

        this.checkedGo = new GO({
            position: new V2(),
            size: this.size.clone(),
            img: this.checkImg,
            contextName: 'ui',
            isStatic: true,
            isVisible: this.checked
        });

        this.addChild(this.checkedGo);

        if(this.label){
            let labelProps = {
                text: {
                    ...this.label,
                    align: 'left'
                },
                position:  new V2(this.size.x*0.75,0),
                size: this.size.clone()
            }

            this.addChild(new UILabel(labelProps))
        }
    }
}

class UIButton extends UIControl {
    constructor(options = {}){
        options = assignDeep({}, {
            handlers: {
                down: () => {
                    if(!this.clickedImg)
                        return;

                    this.img = this.clickedImg; 
                    this.invalidate()
                },
                up: () => {
                    if(!this.defaultImg)
                        return;

                    this.img = this.defaultImg; 
                    this.invalidate()
                },
                out: () => {
                    if(!this.defaultImg)
                        return;

                    this.img = this.defaultImg; 
                    this.invalidate()
                }
            },
            text: GO.getTextPropertyDefaults('btn'),
            asImage: false
        }, options);

        if(!options.imgPropertyName && !options.img){
            options.defaultImg = SCG.UI.createCanvas(options.size.mul(options.asImage?3:1), function(innerCtx, size){
                innerCtx.fillStyle="#CCCCCC";
                innerCtx.fillRect(0,0,size.x,size.y);
                innerCtx.lineWidth = size.x*0.05;
                innerCtx.strokeStyle = '#DEDEDE';
                innerCtx.beginPath();
                innerCtx.moveTo(0, size.y);
                innerCtx.lineTo(0, 0);
                innerCtx.lineTo(size.x, 0);
                innerCtx.stroke();

                innerCtx.strokeStyle = '#AAAAAA';
                innerCtx.beginPath();
                innerCtx.moveTo(0, size.y);
                innerCtx.lineTo(size.x, size.y);
                innerCtx.lineTo(size.x, 0);
                innerCtx.stroke();

                if(options.asImage){
                    let text = options.text;
                    innerCtx.font = `${text.size*3}px ${text.font}`;
                    innerCtx.fillStyle = text.color;
                    innerCtx.textAlign = text.align;
                    innerCtx.textBaseline = text.textBaseline;
                    innerCtx.fillText(text.value, size.x/2, size.y/2);   
                }
                
            })

            options.clickedImg = SCG.UI.createCanvas(options.size.mul(options.asImage?3:1), function(innerCtx, size){
                innerCtx.fillStyle="#CCCCCC";
                innerCtx.fillRect(0,0,size.x,size.y);
                innerCtx.lineWidth = size.x*0.05;
                innerCtx.strokeStyle = '#AAAAAA';
                innerCtx.beginPath();
                innerCtx.moveTo(0, size.y);
                innerCtx.lineTo(0, 0);
                innerCtx.lineTo(size.x, 0);
                innerCtx.stroke();
    
                innerCtx.strokeStyle = '#DEDEDE';
                innerCtx.beginPath();
                innerCtx.moveTo(0, size.y);
                innerCtx.lineTo(size.x, size.y);
                innerCtx.lineTo(size.x, 0);
                innerCtx.stroke();

                if(options.asImage){
                    let text = options.text;
                    innerCtx.font = `${text.size*3}px ${text.font}`;
                    innerCtx.fillStyle = text.color;
                    innerCtx.textAlign = text.align;
                    innerCtx.textBaseline = text.textBaseline;
                    innerCtx.fillText(text.value, size.x/2, size.y/2);   
                }
            });

            options.img = options.defaultImg;
        }

        if(options.asImage){
            options.originalText = options.text;
            delete options.text;
        }

        super(options);
    }
}