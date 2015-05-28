window.addEventListener("DOMContentLoaded", function() {


    var canvas          = document.getElementById("game");
    var engine          = new BABYLON.Engine(canvas, true);
    var scene           = new BABYLON.Scene(engine);
//    var light           = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
//
//    var sphere          = BABYLON.Mesh.CreateSphere("sphere1", 16, 20, scene);
//    sphere.material = new BABYLON.StandardMaterial("mat", scene);
//    sphere.material.emissiveColor = BABYLON.Color3.Red();

    var assets = [];

    var loader = new BABYLON.AssetsManager(scene);

    var toLoad = [
        {name : "head", src : "assets/vaultboy.png" },
        {name : "vault11", src : "assets/vault11.png" },
        {name : "bigboy", src : "assets/bigvaultboy.png" },
        {name : "bigboyred", src : "assets/bigvaultboy_red.png" },
        {name : "bgui", src : "assets/bgui.png" }
    ];

    toLoad.forEach(function(obj) {
        var img = loader.addTextureTask(obj.name, obj.src);
        img.onSuccess = function(t) {
            assets[t.name] = t.texture;
        };
    });

    loader.onFinish = function() {

        init3d(scene, canvas);
        scene.activeCamera.layerMask    = 1;
        setTimeout(function() {

            /* GUI CREATION when all texture are loaded*/
            var gui = new bGUI.GUISystem(scene, 1200, 780);

            // bGUI logo
            var logo = new bGUI.GUIPanel("bgui", assets["bgui"], null, gui);
            logo.relativePosition(new BABYLON.Vector3(0.05, 0.9, 0));
            logo.onClick = function() {
                gui.setVisible(!gui.isVisible());
                logo.setVisible(true);
            };

            // The vault boy head
            var head = new bGUI.GUIPanel("head", assets["head"], null, gui);
            head.guiposition(new BABYLON.Vector3(100, 100, 0));
            head.onClick = function() {
                animate(head.mesh, 30);
                var textGroup = gui.getGroupByName("text");
                textGroup.setVisible(!textGroup.isVisible());
            };

            var textGroup = new bGUI.GUIGroup("text", gui);
            // Title
            var title = new bGUI.GUIText("helpText", 256, 128, {font:"40px Segoe UI", text:"bGUI", color:"#cecb7a"}, gui);
            title.guiposition(new BABYLON.Vector3(170, 50, 0));
            textGroup.add(title);

            // Baseline
            var baseline = new bGUI.GUIText("helpText", 1024, 128, {font:"30px Segoe UI", text:"a Babylon.js extension", color:"#ffffff"}, gui);
            baseline.guiposition(new BABYLON.Vector3(170, 90, 0));
            textGroup.add(baseline);

            // author
            var author = new bGUI.GUIText("helpText", 512, 128, {font:"20px Segoe UI", text:"by Temechon", color:"#72bce3"}, gui);
            author.guiposition(new BABYLON.Vector3(170, 130, 0));
            textGroup.add(author);

            // big vault boy
            var boy = new bGUI.GUIPanel("boy", assets["bigboy"], assets["bigboyred"], gui);
            boy.relativePosition(new BABYLON.Vector3(0.85,0.5,0));

            // vault 11
            var vault = new bGUI.GUIPanel("boy", assets["vault11"], null, gui);
            vault.relativePosition(new BABYLON.Vector3(0.5,0.85,0));
            vault.onClick = function() {
                animate(boy.mesh, 60);
            }

        }, 10)
        engine.runRenderLoop(function() {
            scene.render();
        });
    };

    loader.load();


});

function init3d (scene, canvas) {
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, BABYLON.Vector3.Zero(), scene);
    var material = new BABYLON.StandardMaterial("kosh", scene);
    var sphere1 = BABYLON.Mesh.CreateSphere("Sphere1", 32, 3, scene);
    sphere1.layerMask = 1;
    var sphere2 = BABYLON.Mesh.CreateSphere("Sphere2", 32, 3, scene);
    sphere2.layerMask = 1;
    var sphere3 = BABYLON.Mesh.CreateSphere("Sphere3", 32, 3, scene);
    sphere3.layerMask = 1;
    var sphere4 = BABYLON.Mesh.CreateSphere("Sphere4", 32, 3, scene);
    sphere4.layerMask = 1;
    var sphere5 = BABYLON.Mesh.CreateSphere("Sphere5", 32, 3, scene);
    sphere5.layerMask = 1;
    var light = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(-17.6, 18.8, -49.9), scene);

    camera.setPosition(new BABYLON.Vector3(-15, 3, 0));
    camera.attachControl(canvas, true);

    sphere2.position.z -= 5;
    sphere3.position.z += 5;
    sphere4.position.x += 5;
    sphere5.position.x -= 5;

    // Sphere1 material
    material.reflectionTexture = new BABYLON.CubeTexture("skybox/TropicalSunnyDay", scene);
    material.diffuseColor = new BABYLON.Color3(0, 0, 0);
    material.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    material.alpha = 0.2;
    material.specularPower = 16;

    // Fresnel
    material.reflectionFresnelParameters = new BABYLON.FresnelParameters();
    material.reflectionFresnelParameters.bias = 0.1;

    material.emissiveFresnelParameters = new BABYLON.FresnelParameters();
    material.emissiveFresnelParameters.bias = 0.6;
    material.emissiveFresnelParameters.power = 4;
    material.emissiveFresnelParameters.leftColor = BABYLON.Color3.White();
    material.emissiveFresnelParameters.rightColor = BABYLON.Color3.Black();

    material.opacityFresnelParameters = new BABYLON.FresnelParameters();
    material.opacityFresnelParameters.leftColor = BABYLON.Color3.White();
    material.opacityFresnelParameters.rightColor = BABYLON.Color3.Black();

    sphere1.material = material;

    // Sphere2 material
    material = new BABYLON.StandardMaterial("kosh2", scene);
    material.reflectionTexture = new BABYLON.CubeTexture("skybox/TropicalSunnyDay", scene);
    material.diffuseColor = new BABYLON.Color3(0, 0, 0);
    material.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    material.specularPower = 32;

    // Fresnel
    material.reflectionFresnelParameters = new BABYLON.FresnelParameters();
    material.reflectionFresnelParameters.bias = 0.1;

    material.emissiveFresnelParameters = new BABYLON.FresnelParameters();
    material.emissiveFresnelParameters.bias = 0.5;
    material.emissiveFresnelParameters.power = 4;
    material.emissiveFresnelParameters.leftColor = BABYLON.Color3.White();
    material.emissiveFresnelParameters.rightColor = BABYLON.Color3.Black();

    sphere2.material = material;

    // Sphere3 material
    material = new BABYLON.StandardMaterial("kosh3", scene);
    material.diffuseColor = new BABYLON.Color3(0, 0, 0);
    material.emissiveColor = BABYLON.Color3.White();
    material.specularPower = 64;
    material.alpha = 0.2;

    // Fresnel
    material.emissiveFresnelParameters = new BABYLON.FresnelParameters();
    material.emissiveFresnelParameters.bias = 0.2;
    material.emissiveFresnelParameters.leftColor = BABYLON.Color3.White();
    material.emissiveFresnelParameters.rightColor = BABYLON.Color3.Black();

    material.opacityFresnelParameters = new BABYLON.FresnelParameters();
    material.opacityFresnelParameters.power = 4;
    material.opacityFresnelParameters.leftColor = BABYLON.Color3.White();
    material.opacityFresnelParameters.rightColor = BABYLON.Color3.Black();

    sphere3.material = material;

    // Sphere4 material
    material = new BABYLON.StandardMaterial("kosh4", scene);
    material.diffuseColor = new BABYLON.Color3(0, 0, 0);
    material.emissiveColor = BABYLON.Color3.White();
    material.specularPower = 64;

    // Fresnel
    material.emissiveFresnelParameters = new BABYLON.FresnelParameters();
    material.emissiveFresnelParameters.power = 4;
    material.emissiveFresnelParameters.bias = 0.5;
    material.emissiveFresnelParameters.leftColor = BABYLON.Color3.White();
    material.emissiveFresnelParameters.rightColor = BABYLON.Color3.Black();

    sphere4.material = material;

    // Sphere5 material
    material = new BABYLON.StandardMaterial("kosh5", scene);
    material.diffuseColor = new BABYLON.Color3(0, 0, 0);
    material.reflectionTexture = new BABYLON.CubeTexture("skybox/TropicalSunnyDay", scene);
    material.reflectionTexture.level = 0.5;
    material.specularPower = 64;
    material.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);

    // Fresnel
    material.emissiveFresnelParameters = new BABYLON.FresnelParameters();
    material.emissiveFresnelParameters.bias = 0.4;
    material.emissiveFresnelParameters.power = 2;
    material.emissiveFresnelParameters.leftColor = BABYLON.Color3.Black();
    material.emissiveFresnelParameters.rightColor = BABYLON.Color3.White();

    sphere5.material = material;

    // Skybox
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("skybox/TropicalSunnyDay", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
    skybox.layerMask = 1;

}

function animate (mesh, fps) {
    BABYLON.Animation.CreateAndStartAnimation("", mesh, "rotation.z", 60, fps, mesh.rotation.z, mesh.rotation.z + Math.PI *2, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
}