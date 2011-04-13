
/**
 * Copyright (c) 2006
 * Martin Czuchra, Nicolas Peters, Daniel Polak, Willi Tscheschner, Gero Decker
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

WAPAMA.Plugins.SimplePnmlexport = WAPAMA.Plugins.AbstractPlugin.extend({

    facade: undefined,
    
    construct: function(facade){
        this.facade = facade;
        
        this.facade.offer({
            'name': WAPAMA.I18N.SimplePnmlexport.name,
            'functionality': this.exportIt.bind(this),
            'group': WAPAMA.I18N.SimplePnmlexport.group,
            dropDownGroupIcon: WAPAMA.PATH + "images/export2.png",
			'icon': WAPAMA.PATH + "images/page_white_gear.png",
            'description': WAPAMA.I18N.SimplePnmlexport.desc,
            'index': 1,
            'minShape': 0,
            'maxShape': 0
        });
        
    },

    exportIt: function(){

		// raise loading enable event
        this.facade.raiseEvent({
            type: WAPAMA.CONFIG.EVENT_LOADING_ENABLE
        });
            
		// asynchronously ...
        window.setTimeout((function(){
			
			// ... save synchronously
            this.exportSynchronously();
			
			// raise loading disable event.
            this.facade.raiseEvent({
                type: WAPAMA.CONFIG.EVENT_LOADING_DISABLE
            });
			
        }).bind(this), 10);

		return true;
    },

    exportSynchronously: function() {

        var resource = location.href;
		
		
		try {
			var serialized_rdf = this.getRDFFromDOM();
			if (!serialized_rdf.startsWith("<?xml")) {
				serialized_rdf = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + serialized_rdf;
			}
			// Send the request to the server.
			new Ajax.Request(WAPAMA.CONFIG.SIMPLE_PNML_EXPORT_URL, {
				method: 'POST',
				asynchronous: false,
				parameters: {
					resource: resource,
					data: serialized_rdf
				},
				onSuccess: function(request){
					this.openDownloadWindow(window.document.title+".xml",request.responseText);
					/* 
					 * Data URIs do not work properly in chrome
					 * this.openXMLWindow(request.responseText);
					 * TODO Check for an better solution for download windows, without remaining open window
					 * @author Philipp Berger
					 */
				}.bind(this)
			});
			
		} catch (error){
			this.facade.raiseEvent({type:WAPAMA.CONFIG.EVENT_LOADING_DISABLE});
			Ext.Msg.alert(WAPAMA.I18N.Wapama.title, error);
	 	}
	}
});