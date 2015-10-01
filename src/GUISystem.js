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
        this._scene         = scene;

        // Push the activecamera in activeCameras
        var mainCam = scene.activeCamera;

        if (this._scene.activeCameras.indexOf(mainCam) == -1) {
            this._scene.activeCameras.push(mainCam);
        }

        // The device pixel ratio of the windo
        this.dpr            = window.devicePixelRatio;
        // Compute the zoom level for the camera
        if (typeof guiWidth === 'undefined') {
            guiWidth = scene.getEngine().getRenderWidth();
        }
        if (typeof guiHeight === 'undefined') {
            guiHeight = scene.getEngine().getRenderHeight();
        }
        this.zoom           = Math.max(guiWidth, guiHeight) / Math.max(scene.getEngine().getRenderingCanvas().width, scene.getEngine().getRenderingCanvas().height);

        // Init the GUI camera
        this._camera        = null;
        this._initCamera();

        this._scene.activeCamera = mainCam;
        this._scene.cameraToUseForPointers = mainCam;

        // Contains all gui objects
        this.objects        = [];

        // Contains all gui groups
        this.groups         = [];

        // True if the gui is visible, false otherwise
        this.visible        = true;
    };

    GUISystem.prototype.getScene = function() {
        return this._scene;
    };

    GUISystem.prototype.getCamera = function() {
      return this._camera;
    };

    GUISystem.prototype._initCamera = function() {
        this._camera            =  new BABYLON.FreeCamera("GUICAMERA", new BABYLON.Vector3(0,0,-30), this._scene);
        this._camera.mode       = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
        this._camera.setTarget(BABYLON.Vector3.Zero());
        this._camera.layerMask  = bGUI.GUISystem.LAYER_MASK;

        var width   = this.dpr * this._scene.getEngine().getRenderingCanvas().width;
        var height  = this.dpr * this._scene.getEngine().getRenderingCanvas().height;

        var right   = width/this.dpr;
        var top     = height/this.dpr;
        this._camera.orthoTop      = top/2;
        this._camera.orthoRight    = right/2;
        this._camera.orthoBottom   = -top/2;
        this._camera.orthoLeft     = -right/2;

        this.guiWidth       = right;
        this.guiHeight      = top;

        this._scene.activeCameras.push(this._camera);
    };

    GUISystem.prototype.dispose = function() {
        this.objects.forEach(function(p) {
            p.dispose();
        });
        this.objects = [];
        this.groups.forEach(function(g) {
            g.dispose();
        });
        this.groups = [];
        this._camera.dispose();

    };
    GUISystem.prototype.add = function(mesh) {
        var p = new bGUI.GUIObject(mesh, this);
        this.objects.push(p);
        return p;
    };
    /**
     * Set the whole GUI visible or not
     * @param bool
     */
    GUISystem.prototype.setVisible = function(bool) {
      this.visible = bool;
      // Hide all objects
      this.objects.forEach(function(p) {
        p.setVisible(bool);
      });
    };

    GUISystem.prototype.isVisible = function() {
      return this.visible;
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

    /**
     * Enable click actions on GUIObject.
     */
    GUISystem.prototype.enableClick = function() {

        var _this = this;
        // On pick down
        this._onPointerDown = function(evt) {
            var predicate = function (mesh) {
                return mesh.isPickable && mesh.isVisible && mesh.isReady() && mesh.actionManager && mesh.actionManager.hasPickTriggers;
            };
            _this._scene._updatePointerPosition(evt);
            var pickResult = _this._scene.pick(_this._scene._pointerX, _this._scene._pointerY, predicate, false, _this.getCamera());
            if (pickResult.hit) {
                if (pickResult.pickedMesh.actionManager) {
                    pickResult.pickedMesh.actionManager.processTrigger(BABYLON.ActionManager.OnPickTrigger, BABYLON.ActionEvent.CreateNew(pickResult.pickedMesh, evt));
                }
            }
        };
        // On pick up
        this._onPointerUp = function(evt) {
            var predicate = function (mesh) {
                return mesh.isPickable && mesh.isVisible && mesh.isReady() && mesh.actionManager && mesh.actionManager.hasPickTriggers;
            };
            _this._scene._updatePointerPosition(evt);
            var pickResult = _this._scene.pick(_this._scene._pointerX, _this._scene._pointerY, predicate, false, _this.getCamera());
            if (pickResult.hit) {
                if (pickResult.pickedMesh.actionManager) {
                    pickResult.pickedMesh.actionManager.processTrigger(BABYLON.ActionManager.OnPickUpTrigger, BABYLON.ActionEvent.CreateNew(pickResult.pickedMesh, evt));
                }
            }
        };

        var eventPrefix = BABYLON.Tools.GetPointerPrefix();
        this._scene.getEngine().getRenderingCanvas().addEventListener(eventPrefix + "down", this._onPointerDown, false);
        this._scene.getEngine().getRenderingCanvas().addEventListener(eventPrefix + "up",this._onPointerUp, false);
    };

    /**
     * Disable click events on GUI
     */
    GUISystem.prototype.disableClick = function() {
        var eventPrefix = BABYLON.Tools.GetPointerPrefix();
        this._scene.getEngine().getRenderingCanvas().removeEventListener(eventPrefix + "down", this._onPointerDown, false);
        this._scene.getEngine().getRenderingCanvas().removeEventListener(eventPrefix + "up",this._onPointerUp, false);
    };

    /**
     * Update the layer mask of all babylon meshes that are not GUI
     * in order to make them invisible to the GUI camera.
     * Updates the layer mask property of all meshes and of the given camerA.
     */
    GUISystem.prototype.updateCamera = function(cam) {
        // Camera
        var myCam = cam || this._scene.activeCamera;
        myCam.layerMask = GUISystem.GAME_LAYER_MASK;

        // Meshes
        for (var m=0; m<this._scene.meshes.length; m++) {
            var mesh = this._scene.meshes[m];
            if (!mesh.__gui) { // Don't update layer mask on gui object
                if (mesh.layerMask) {
                    mesh.layerMask = GUISystem.GAME_LAYER_MASK;
                }
            }
        }
    };

    GUISystem.LAYER_MASK = 8;
    GUISystem.GAME_LAYER_MASK = 1;
    bGUI.GUISystem = GUISystem;
})();
