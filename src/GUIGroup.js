var bGUI = bGUI || {};
(function() {

    /**
     * A group of GUI elements
     * @param name
     * @param gui
     * @constructor
     */
    var GUIGroup = function(name, gui) {
        this.guiSystem = gui;
        this.name = name;
        this.elements = [];
        this.guiSystem.groups.push(this);
    };
    /**
     * Set visible or invisible each element of the group
     * @param bool
     */
    GUIGroup.prototype.setVisible = function(bool) {
        this.elements.forEach(function(e) {
            e.setVisible(bool);
        });
    };
    GUIGroup.prototype.add = function(guiElement) {
        this.elements.push(guiElement);
    };

    bGUI.GUIGroup = GUIGroup;

})();