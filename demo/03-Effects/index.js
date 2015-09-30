window.addEventListener("DOMContentLoaded", function() {


  var canvas    = document.getElementById("game");
  var engine    = new BABYLON.Engine(canvas, true);
  var scene     = new BABYLON.Scene(engine);

  new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

  var camera    = new BABYLON.ArcRotateCamera("gameCam", 0,0,10,BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas);

  var spinning = BABYLON.Mesh.CreateBox("box", 2.0, scene);
  spinning.registerBeforeRender(function() {
    spinning.rotation.x += 0.01;
    spinning.rotation.z += 0.02;
  });
  spinning.material = new BABYLON.StandardMaterial("box", scene);
  spinning.layerMask = 1;

  spinning.actionManager = new BABYLON.ActionManager(scene);
  var updateMat = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger,
    function() {
      spinning.material.diffuseColor = BABYLON.Color3.Red();
    }
  );
  spinning.actionManager.registerAction(updateMat);

  var gui = new bGUI.GUISystem(scene);
  var text = new bGUI.GUIText("helpText", 128, 128, {font:"20px Open Sans", textAlign:"center", text:"Flip", color:"#FF530D"}, gui);
  text.relativePosition(new BABYLON.Vector3(0.1, 0.3, 0));
  text.onClick = function() {
      text.flip(500);
  };

  // Tip text
  var tip = new bGUI.GUIText("tipText", 512, 128, {font:"30px Open Sans", textAlign:"center", text:"Click on the box or click on the GUI", color:"#FFFFFF"}, gui);
  tip.relativePosition(new BABYLON.Vector3(0.5, 0.1, 0));
  tip.onClick = function(m) {
    spinning.material.diffuseColor = BABYLON.Color3.Purple();
  };

    // Fade out text
    var fadeout = new bGUI.GUIText("fadeout", 256, 128, {font:"20px Open Sans", textAlign:"center", text:"Fade out 500ms", color:"#00D5A9"}, gui);
    fadeout.relativePosition(new BABYLON.Vector3(0.1, 0.4, 0));
    fadeout.onClick = function() {
        fadeout.fadeout(500);
    };

    // Fade in text
    var fadein = new bGUI.GUIText("fadein", 128, 128, {font:"20px Open Sans", textAlign:"center", text:"Fade in 2s", color:"#00D5A9"}, gui);
    fadein.relativePosition(new BABYLON.Vector3(0.1, 0.5, 0));
    fadein.onClick = function() {
        fadein.fadein(2000);
    };

  gui.enableClick();

  scene.onPointerDown = function(evt, pr) {
    if (pr.hit) {
      console.log(pr.pickedMesh.name);
    }
  };

  engine.runRenderLoop(function() {
      scene.render();
  });
});
