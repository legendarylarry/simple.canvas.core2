document.addEventListener("DOMContentLoaded", function() {
    let scenesNames = ['controls', 'collisions', 'rain', 'tracks', 'sand', 'tank'];

    function sceneSelectByHashValue(){
        let sceneIndex = location.hash !== '' ? scenesNames.indexOf(location.hash.replace('#','')) : 0;
        if(sceneIndex === -1)
            sceneIndex = 0;

        SCG.scenes.selectScene(scenesNames[sceneIndex]);
    }

    SCG.globals.version = 0.2;

    SCG.src = {
        explosion1: 'images/explosion1.png'
	}

    debugger;
    
    let defaultViewpot = new V2(500,300);
    SCG.scenes.cacheScene(new ControlsDemoScene({
        name:'controls',
        viewport: defaultViewpot
    }));

    SCG.scenes.cacheScene(new CollisionsScene({
        name:'collisions',
        viewport: defaultViewpot
    }));

    SCG.scenes.cacheScene(new RainScene({
        name:'rain',
        viewport: new V2(500,300)
    }));

    SCG.scenes.cacheScene(new TracksScene({
        name:'tracks',
        viewport: defaultViewpot
    }));

    SCG.scenes.cacheScene(new SandScene({
        name:'sand',
        viewport: new V2(300, 500)
    }));

    SCG.scenes.cacheScene(new TankScene({
        name:'tank',
        viewport: defaultViewpot
    }));

    sceneSelectByHashValue();
    
    SCG.main.start();

    window.addEventListener("hashchange", sceneSelectByHashValue, false);
});