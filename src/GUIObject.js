var bGUI = bGUI || {};

(function() {
    /**
     * Represents an object in the gui system
     * @param mesh
     * @param guisystem
     * @param onclick
     * @constructor
     */
    var GUIObject = function(mesh, guiSystem) {
        this.mesh       = mesh;
        this.guiSystem  = guiSystem;
        this.onClick    = null;

        this.mesh.actionManager = new BABYLON.ActionManager(mesh._scene);

        var _this = this;
        var updateOnPointerUp = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger,
            function(e) {
                if (_this.onClick) {
                    _this.onClick(e);
                }
            }
        );
        this.mesh.actionManager.registerAction(updateOnPointerUp);

        this.mesh.layerMask     = bGUI.GUISystem.LAYER_MASK;

        this.guiSystem.objects.push(this);

        // The object position in the gui system
        this.guiposition(BABYLON.Vector3.Zero());
    };
    /**
     * Set the absolute position of this object in the gui world
     * @param guiposition
     */
    GUIObject.prototype.guiposition = function(gp) {
        this.guiPosition = gp;

        // Update the object posion
        this.mesh.position = new BABYLON.Vector3(
            gp.x / this.guiSystem.zoom - this.guiSystem.guiWidth / 2,
            this.guiSystem.guiHeight / 2 - gp.y / this.guiSystem.zoom,
            gp.z);
    };
    /**
     * Set the object in percentage position of the screen.
     * @param wp
     * @param hp
     * @param z
     */
    GUIObject.prototype.relativePosition = function(pos) {
        if (pos) {
            this.mesh.position.x = this.guiSystem.guiWidth * pos.x - this.guiSystem.guiWidth/2;
            this.mesh.position.y = this.guiSystem.guiHeight * (1-pos.y) - this.guiSystem.guiHeight/2;
            this.mesh.position.z = pos.z;
        } else {
            return new BABYLON.Vector3(
                (this.mesh.position.x + this.guiSystem.guiWidth/2) / this.guiSystem.guiWidth,
                (this.guiSystem.guiHeight/2 - this.mesh.position.y) / this.guiSystem.guiHeight,
                this.mesh.position.z
            );
        }

    };
    GUIObject.prototype.position = function(pos) {
        if (pos) {
            // Update the object position
            this.mesh.position = pos;
            // Compute the gui position
            this.guiPosition = new BABYLON.Vector3(
                this.guiSystem.guiWidth/2+pos.x,
                this.guiSystem.guiHeight/2+pos.y,
                pos.z);
        } else {
            return this.mesh.position;
        }

    };
    GUIObject.prototype.scaling = function(scale) {
        if (scale) {
            // Update the object position
            this.mesh.scaling = scale;

        } else {
            return this.mesh.scaling;
        }
    };
    GUIObject.prototype.dispose = function() {
        this.mesh.dispose();
    };
    GUIObject.prototype.setVisible = function(bool) {
        this.mesh.isVisible = bool;
    };
    bGUI.GUIObject = GUIObject;
})();