
/**
 * Copyright (c) 2008, Kai Schlichting
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 **/
if (!WAPAMA.Plugins) 
    WAPAMA.Plugins = new Object();

WAPAMA.Plugins.Validator = WAPAMA.Plugins.AbstractPlugin.extend({
    construct: function(facade){
        this.facade = facade;
        
        this.active = false;
        this.raisedEventIds = [];
        
        this.buttonId = WAPAMA.Editor.provideId();
        
        this.facade.offer({
            'name': WAPAMA.I18N.Validator.name,
            'id': this.buttonId,
            'functionality': this.load.bind(this),
            'group': "Verification",
            'icon': WAPAMA.PATH + "images/checker_validation.png",
            'description': WAPAMA.I18N.Validator.description,
            'index': 1,
            'toggle': true,
            'minShape': 0,
            'maxShape': 0
        });
    },
    
    load: function(button, pressed){
        if (!pressed) {
            this.hideOverlays();
            this.active = !this.active;
        }
        else {
            this.validate(button);
        }
    },
    
    setActive: function(active){
        this.active = active;
        this.facade.raiseEvent({
            type: WAPAMA.CONFIG.EVENT_BUTTON_UPDATE,
            id: this.buttonId,
            pressed: active
        });
    },
    
    hideOverlays: function(){
        this.raisedEventIds.each(function(id){
            this.facade.raiseEvent({
                type: WAPAMA.CONFIG.EVENT_OVERLAY_HIDE,
                id: id
            });
        }
.bind(this));
        
        this.raisedEventIds = [];
    },
    validate: function(button){
        this.facade.raiseEvent({
            type: WAPAMA.CONFIG.EVENT_LOADING_ENABLE,
            text: WAPAMA.I18N.Validator.checking
        });
      
        // Send the request to the server.
        new Ajax.Request(WAPAMA.CONFIG.VALIDATOR_URL, {
            method: 'POST',
            asynchronous: false,
            parameters: {
                resource: location.href,
                data: this.getRDFFromDOM()
            },
            onSuccess: function(request){
                var result = Ext.decode(request.responseText);
                
                this.facade.raiseEvent({
                    type: WAPAMA.CONFIG.EVENT_LOADING_DISABLE
                });
                
                // This should be implemented by child instances of validator 
                this.handleValidationResponse(result, button);
            }
.bind(this),
            onFailure: function(){
                this.facade.raiseEvent({
                    type: WAPAMA.CONFIG.EVENT_LOADING_DISABLE
                });
                Ext.Msg.alert(WAPAMA.I18N.Validator.error, WAPAMA.I18N.Validator.errorDesc);
            }.bind(this)
        });
    },
    
    showOverlay: function(shape, errorMsg, errorTitle){
    
        var id = "syntaxchecker." + this.raisedEventIds.length;
        
        var crossId = WAPAMA.Editor.provideId();
        
        var cross = WAPAMA.Editor.graft("http://www.w3.org/2000/svg", null, ['path', {
        	"id":crossId,
        	"title":"",
            "stroke-width": 5.0,
            "stroke": "red",
            "d": "M20,-5 L5,-20 M5,-5 L20,-20",
            "line-captions": "round"
        }]);
        
        this.facade.raiseEvent({
            type: WAPAMA.CONFIG.EVENT_OVERLAY_SHOW,
            id: id,
            shapes: [shape],
            node: cross,
            nodePosition: shape instanceof WAPAMA.Core.Edge ? "START" : "NW"
        });
        
        this.raisedEventIds.push(id);
        
        var tooltip = new Ext.ToolTip({
        	showDelay:50,
        	title:errorTitle,
        	html:errorMsg,
        	target:crossId
        });   
        
        return cross;
    },
    
    /**
     * Registers handler for deactivating syntax checker as soon as somewhere is clicked...
     * @param {Ext.Button} Toolbar button
     */
    enableDeactivationHandler: function(button){
        var deactivate = function(){
            this.setActive(false);
            this.facade.unregisterOnEvent(WAPAMA.CONFIG.EVENT_MOUSEDOWN, deactivate);
        };
        
        this.facade.registerOnEvent(WAPAMA.CONFIG.EVENT_MOUSEDOWN, deactivate.bind(this));
    }
});

WAPAMA.Plugins.BPMNValidator = Ext.extend(WAPAMA.Plugins.Validator, {
    handleValidationResponse: function(result, button){
        var conflictingNodes = result.conflictingNodes;
        var leadsToEnd = result.leadsToEnd;
        var unsafeNode = result.unsafeNode;
        // Only stay active if there is anything to visualize
        this.setActive(conflictingNodes.size() > 0);
        
//        if (!leadsToEnd) {
//            Ext.Msg.alert("Validation Result", "The process will never reach a final state!");
//        }
        if (conflictingNodes.size() > 0) {
            conflictingNodes.each(function(node){
                sh = this.facade.getCanvas().getChildShapeByResourceId(node.id);
                if (sh) {
                    this.showOverlay(sh, WAPAMA.I18N.Validator.bpmnDeadlock,  WAPAMA.I18N.Validator.bpmnDeadlockTitle);
                }
            }.bind(this));
        }
        if(unsafeNode) {
        	var shape = this.facade.getCanvas().getChildShapeByResourceId(unsafeNode);
        	if (shape) {
                this.showOverlay(shape, WAPAMA.I18N.Validator.bpmnUnsafe, WAPAMA.I18N.Validator.bpmnUnsafeTitle);
            }
        }
        if(leadsToEnd && conflictingNodes.size() === 0 && !unsafeNode) {
        	this.facade.raiseEvent({
    			type:WAPAMA.CONFIG.EVENT_LOADING_STATUS,
    			text:WAPAMA.I18N.Validator.noErrors,
    			timeout:10000
    		});
        	//Ext.Msg.alert(WAPAMA.I18N.Validator.result, WAPAMA.I18N.Validator.noErrors);
        } else if(!leadsToEnd && conflictingNodes.size() === 0 && !unsafeNode){
        	Ext.Msg.alert(WAPAMA.I18N.Validator.bpmnLeadsToNoEndTitle, WAPAMA.I18N.Validator.bpmnLeadsToNoEnd);
        } else {
        	this.enableDeactivationHandler(button);
        	//show a status message with a hint to the error messages in the tooltip
            this.facade.raiseEvent({
    			type:WAPAMA.CONFIG.EVENT_LOADING_STATUS,
    			text:WAPAMA.I18N.SyntaxChecker.notice,
    			timeout:10000
    		});
        }
    }
});

WAPAMA.Plugins.EPCValidator = Ext.extend(WAPAMA.Plugins.Validator, {
  getLabelOfShape: function(node){
    if(node.properties["wapama-title"] === ""){
      return node.id;
    } else {
      return node.properties["wapama-title"];
    }
  },
  findShapeById: function(id){
    return this.facade.getCanvas().getChildShapeByResourceId(id);
  },
  
    handleValidationResponse: function(result, button){
      //TODO use Ext XTemplate
        var isSound = result.isSound;
        var badStartArcs = result.badStartArcs;
        var badEndArcs = result.badEndArcs;
        var goodInitialMarkings = result.goodInitialMarkings;
        var goodFinalMarkings = result.goodFinalMarkings;
        
        var message = "";
        
        if (isSound) {
          message += WAPAMA.I18N.Validator.epcIsSound;
        } else {
          message += WAPAMA.I18N.Validator.epcNotSound;
        }
        
        message += "<hr />";
        
        var arrayOfArraysToMessage = function(arrayOfArrays, formatter){
          var message = "<ul>"
          arrayOfArrays.each(function(array){
            message += "<li> - ";
            array.each(function(element){
              message += '"' + formatter(element) + '" ';
            });
            message += "</li>";
          });
          message += "</ul>";
          return message;
        }
        var arrayToMessage = function(array, formatter){
          var message = "<ul>"
          array.each(function(element){
            message += "<li> - " + formatter(element) + "</li>";
          });
          message += "</ul>";
          return message;
        }
        
        message += "<p>There are "+ goodInitialMarkings.length +" initial markings which does not run into a deadlock.</p>";
        message += arrayOfArraysToMessage(goodInitialMarkings, function(arc){
          return this.getLabelOfShape(this.findShapeById(arc.id).getIncomingShapes()[0]);
        }.createDelegate(this));
        message += "<p>The initial markings do not include "+ badStartArcs.length +" start nodes.</p>";
        message += arrayToMessage(badStartArcs, function(arc){
          return this.getLabelOfShape(this.findShapeById(arc.id).getIncomingShapes()[0]);
        }.createDelegate(this));
        
        message += "<hr />";
        
        message += "<p>There are "+ goodFinalMarkings.length +" final markings which can be reached from the initial markings.</p>";
        message += arrayOfArraysToMessage(goodFinalMarkings, function(arc){
          return this.getLabelOfShape(this.findShapeById(arc.id).getOutgoingShapes()[0]);
        }.createDelegate(this));
        message += "<p>The final markings do not include "+ badEndArcs.length +" end nodes.</p>";
        message += arrayToMessage(badEndArcs, function(arc){
          return this.getLabelOfShape(this.findShapeById(arc.id).getOutgoingShapes()[0]);
        }.createDelegate(this))
        
        message += "<hr />";
        
        message += "<p><i>Remark: Set titles of functions and events to get some nicer output (names instead of ids)</i></p>"
        
        Ext.Msg.alert('Validation Result', message);
        
        this.setActive(false);
    }
});