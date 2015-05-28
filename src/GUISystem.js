var bGUI = bGUI || {};

(function() {
    "use strict";
    /**
     * The main part of bGUI system.
     * @param scene The scene to build the GUI on
     * @param guiWidth The desired guiWidth
     * @param guiHeight The desired guiHeight
     * @constructor
     */
    var GUISystem = function(scene, guiWidth, guiHeight) {
        // The babylon scene
        this._scene = scene;

        // Push the activecamera in activeCameras
        var mainCam = scene.activeCamera;
        this._scene.activeCameras.push(mainCam);
		this._scene.activeCamera = mainCam;

        // The device pixel ratio of the windo
        this.dpr = window.devicePixelRatio;
        // Compute the zoom level for the camera
        this.zoom = Math.max(guiWidth, guiHeight) / Math.max(scene.getEngine().getRenderingCanvas().width, scene.getEngine().getRenderingCanvas().height);

        // Init the GUI camera
        this._camera = null;
        this._initCamera();

        // Contains all gui objects
        this.objects = [];

        // Contains all gui groups
        this.groups = [];
    };

    GUISystem.prototype.getScene = function() {
        return this._scene;
    }

    GUISystem.prototype._initCamera = function() {
        this._camera            =  new BABYLON.FreeCamera("GUICAMERA", new BABYLON.Vector3(0, 0, -30), this._scene);
        this._camera.mode       = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;        
        this._camera.layerMask  = bGUI.GUISystem.LAYER_MASK;
		this._camera.setTarget(BABYLON.Vector3.Zero());

        var width   = this.dpr * this._scene.getEngine().getRenderingCanvas().width;
        var height  = this.dpr * this._scene.getEngine().getRenderingCanvas().height;

        var right                  = width/this.dpr;
        var top                    = height/this.dpr;
        this._camera.orthoTop      = top/2;
        this._camera.orthoRight    = right/2;
        this._camera.orthoBottom   = -top/2;
        this._camera.orthoLeft     = -right/2;

        this.guiWidth       = right;
        this.guiHeight      = top;

        this._scene.activeCameras.push(this._camera);
        // The camera to use for picks
		this._scene.cameraToUseForPointers = this._camera;
    };	
    GUISystem.prototype.dispose = function() {
        this.objects.forEach(function(p) {
            p.dispose();
        });
        this._camera.dispose();
    };
    GUISystem.prototype.add = function(mesh) {
        var p = new bGUI.GUIObject(mesh, this);
        this.objects.push(p);
        return p;
    };
    /**
     * Return a GUi object by its name. Returns the first object found in the list.
     * Returns null if not found
     * @param name
     */
    GUISystem.prototype.getObjectByName = function(name) {
        for (var o=0; o<this.objects.length; o++) {
            if (this.objects[o].mesh.name === name) {
                return this.objects[o];
            }
        }
        return null;
    };
    /**
     * Returns a GUIGroup by its name
     * @param name
     * @returns {GUIGroup}
     */
    GUISystem.prototype.getGroupByName = function(name) {
        for (var o=0; o<this.groups.length; o++) {
            if (this.groups[o].name === name) {
                return this.groups[o];
            }
        }
        return null;
    };
    GUISystem.LAYER_MASK = 8;
    bGUI.GUISystem = GUISystem;
})();
