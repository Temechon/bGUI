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
  spinning.layerMask = 1;


  var gui = new bGUI.GUISystem(scene, engine.getRenderWidth(), engine.getRenderHeight() );
  var text = new bGUI.GUIText("helpText", 512, 128, {font:"40px Open Sans", textAlign:"center", text:"bGUI is awesome !", color:"#FF530D"}, gui);
  text.relativePosition(new BABYLON.Vector3(0.5, 0.75, 0));

  // Tip text
  var tip = new bGUI.GUIText("tipText", 512, 128, {font:"30px Open Sans", textAlign:"center", text:"Click on the box or click on the GUI", color:"#FFFFFF"}, gui);
  tip.relativePosition(new BABYLON.Vector3(0.5, 0.1, 0));

  var count = 0;
  var max = 120;
  scene.registerBeforeRender(function() {
   count ++;
   if (count >= max) {
      text.relativePosition(new BABYLON.Vector3(Math.random(), Math.random(), 0));
      count = 0;
   }
  });



  engine.runRenderLoop(function() {
      scene.render();
  });
});
