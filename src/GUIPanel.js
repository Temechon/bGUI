var bGUI = bGUI || {};
(function() {
    /**
     * A Panel
     * @param name
     * @param guisystem
     * @param onclick
     * @param texture
     * @param textureOnPress
     * @constructor
     */
    var GUIPanel = function (name, texture, textureOnPress, guisystem) {
        // Panel
        bGUI.GUIObject.call(this, BABYLON.Mesh.CreatePlane(name, 1, guisystem.getScene()), guisystem);

        // Material
        this.texture            = texture;

        var textSize            = this.texture.getBaseSize();
        if (textSize.width === 0) {
            // Dynamic Texture
            textSize            = this.texture.getSize();
        }
        this.texture.hasAlpha   = true;
        var mat                     = new BABYLON.StandardMaterial(name+"_material", guisystem.getScene());
        mat.emissiveColor           = BABYLON.Color3.White();
        mat.diffuseTexture          = texture;
        mat.opacityTexture          = texture;
        mat.backFaceCulling         = false;
        this.mesh.material   = mat;


        this.mesh.scaling    = new BABYLON.Vector3((textSize.width-0.1) / guisystem.zoom, (textSize.height-0.1)/guisystem.zoom, 1);

        // Should not be empty is this panel is a button
        this.texturePressed = textureOnPress;
        if (this.texturePressed) {
            this.texturePressed.hasAlpha = true;
        }

        // update texture when pressed
        var _this = this;
        var updateOnPick = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger,
            function() {
                if (_this.texturePressed) {
                    _this.mesh.material.diffuseTexture = _this.texturePressed;
                }
            }
        );
        var updateOnPointerUp = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger,
            function(e) {
                _this.mesh.material.diffuseTexture = _this.texture;
            }
        );
        this.mesh.actionManager.registerAction(updateOnPick);
        this.mesh.actionManager.registerAction(updateOnPointerUp);
    };
    GUIPanel.prototype = Object.create(bGUI.GUIObject.prototype);
    GUIPanel.prototype.constructor = bGUI.GUIPanel;
    bGUI.GUIPanel = GUIPanel;

})();
