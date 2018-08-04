SCG.events = {
    register(){
        addListenerMulti(window, 'orientationchange resize', function(e){
			SCG.viewport.graphInit();
        });
        
        addListenerMulti(SCG.canvases.ui, 'mouseup touchend', function(e){
			absorbTouchEvent(e);
			SCG.controls.mouse.up(e);
        });
        
        addListenerMulti(SCG.canvases.ui, 'mousedown touchstart', function(e){
			absorbTouchEvent(e);
			SCG.controls.mouse.down(e);
        });
        
        addListenerMulti(SCG.canvases.ui, 'mousemove touchmove', function(e){
			absorbTouchEvent(e);
			SCG.controls.mouse.move(e);
		});

        if(SCG.globals.isMobile)
            {
                setTimeout( function(){ window.scrollTo(0, 1); }, 100 );
    
                addListenerMulti(document, 'fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange', function(e){
                    SCG.viewport.graphInit();
                });
            }
    }
}