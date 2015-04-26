var bGUI = bGUI || {};
(function() {
    /**
     * A dynamic text. Check <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_text">this</a>
     * @param name
     * @param guisystem
     * @param width
     * @param height
     * @param options.font
     * @param options.textBaseline
     * @param options.textAlign
     * @param options.direction
     * @param options.fillStyle
     * @constructor
     */
    var GUIText = function(name, width, height, options, guisystem) {

        var dynamicTexture = new BABYLON.DynamicTexture(name, {width:width, height:height}, guisystem.getScene(), true);
        var ctx            = dynamicTexture.getContext();
        ctx.font           = options.font;
        ctx.textBaseline   = options.textBaseline || "middle";
        ctx.textAlign      = options.textAlign || "start";
        ctx.direction      = options.direction || "inherit";
        ctx.fillStyle      = options.color || "#ffffff";
        this._ctx           = ctx;

        var size = dynamicTexture.getSize();
        ctx.fillText(options.text, size.width/2, size.height/2);

        // Call super constructor
        bGUI.GUIPanel.call(this, name, dynamicTexture, null, guisystem);

        dynamicTexture.update();
    };
    GUIText.prototype = Object.create(bGUI.GUIPanel.prototype);
    GUIText.prototype.constructor = GUIText;
    /**
     * Update the text
     * @param text
     */
    GUIText.prototype.update = function(text) {
        var size = this.texture.getSize();
        this._ctx.clearRect(0, 0, size.width, size.height);
        this._ctx.fillText(text, size.width/2, size.height/2);
        this.texture.update();
    };
    bGUI.GUIText = GUIText;

})();
