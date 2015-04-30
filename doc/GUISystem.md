##new [GUISystem](page.php?p=24904)(scene, guiWidth, guiHeight)

Creates a new GUISystem and a new orthographic camera, which size is computed according to the canvas size (canvas.width, canvas.height) and the window device pixel ratio.
(The active camera is not updated.)

The new orthographic camera is the camera used to display all GUI elements. In order to set the GUI elements invisible to the game camera, the babylon layer mask system
is used. All GUI elements have their layerMask set to bGUI.GUISystem.LAYER_MASK.


####Parameters
 | Name | Type | Description
---|---|---|---
 | scene | [BABYLON.Scene]() | The BABYLON game scene
 | width | number | The gui desired width
 | height | number | The gui desired height
---

##Members
###dpr : number
The screen device pixel ratio. Used to compute the correct camera parameters

###guiWidth : number
The **real** GUI width used for the GUI system.

###guiHeight : number
The **real** GUI height used for the GUI system.

###zoom : number
The zoom level computed for the orthographic camera.

###objects : Array<[GUIObject]()>
Contains all GUIObjects created on the GUI

###groups : Array<[GUIGroup]()>
Contains all GUIGroups added on this GUI

###static LAYER_MASK : number = 8
The layer mask used for all GUI objects

##Methods
###add([BABYLON.Mesh]()) → [GUIObject]()
Add a Babylon mesh to the GUI, and returns a new GUIObject. The given mesh layerMask is updated to GUISystem.LAYER_MASK.

###getGroupByName(string) → [GUIGroup]()
Returns the GUIGroup corresponding to the given name, or null if nothing is found.

###getObjectByName(string) → [GUIObject]()
Returns the GUIObject corresponding to the given name, or null if nothing is found.

###getScene() → [BABYLON.Scene]()
Returns the game scene

###dispose() → void
Dispose the GUI, and delete each GUI object. The orthographic camera is also disposed.
