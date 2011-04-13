// mocks

// mocking WAPAMA.Log
if(!WAPAMA) {var WAPAMA= {};}
if(!WAPAMA.Log) {WAPAMA.Log = {};}

// mocking WAPAMA.StencilSet.StencilSet
if(!WAPAMA) {var WAPAMA= {};}
if(!WAPAMA.Core) {WAPAMA.Core = {};}
if(!WAPAMA.Core.StencilSet) {WAPAMA.Core.StencilSet = {};}
WAPAMA.Core.StencilSet.StencilSet = Clazz.extend({
	construct : function(namespace) {
		arguments.callee.$.construct.apply(this, arguments);
		this._namespace = namespace
	},
	
	namespace : function() {
		return this._namespace
	},
	stencil : function(id) {
		if(id == "http://example.com#ANode" || id == "http://example.com#AnEdge")
			return {"stencil": true}
	}
})

// mocking WAPAMA.StencilSet.Rules
if(!WAPAMA) {var WAPAMA= {};}
if(!WAPAMA.Core) {WAPAMA.Core = {};}
if(!WAPAMA.Core.StencilSet) {WAPAMA.Core.StencilSet = {};}
WAPAMA.Core.StencilSet.Rules = Clazz.extend({
	construct : function(name) {
		arguments.callee.$.construct.apply(this, arguments);
		this._name = name
	},
	
	rulesName : function() {
		return this._name
	},
	
	initializeRules: function(stencilSet) {
		return
	}
})

// mocking WAPAMA.I18N.Language
if(!WAPAMA) {var WAPAMA= {};}
if(!WAPAMA.I18N) {WAPAMA.I18N = {};}
WAPAMA.I18N.Language = "de_at"

// stubs

// stubing WAPAMA.Log.trace()
WAPAMA.Log.trace = function(){return}

// Test Cases
function setUp() {
	// storage for loaded stencil sets by namespace
	WAPAMA.Core.StencilSet._stencilSetsByNamespace = new Hash();

	// storage for stencil sets by url
	WAPAMA.Core.StencilSet._stencilSetsByUrl = new Hash();

	// storage for stencil set namespaces by editor instances
	WAPAMA.Core.StencilSet._StencilSetNSByEditorInstance = new Hash();

	// storage for rules by editor instances
	WAPAMA.Core.StencilSet._rulesByEditorInstance = new Hash();
}


/**
 * Test, if the right stencilset can be found by namespace.
 * Namespace always ends with a '#' by convention
 */
function testGetStencilSetByNamespace() {

	WAPAMA.Core.StencilSet._stencilSetsByNamespace["http://www.firstexample.org/stencilset#"] =  "with#"
	WAPAMA.Core.StencilSet._stencilSetsByNamespace["http://www.firstexample.org/Stencilset#"] =  "With#"
	WAPAMA.Core.StencilSet._stencilSetsByNamespace["http://www.firstexample.org/stencilset"] =  "without#"
	
	var stencilset = WAPAMA.Core.StencilSet.stencilSet("http://www.firstexample.org/stencilset#")
	assertEquals("Checks, if the correct StencilSet is delivered by namespace", stencilset, "with#")
	
	var stencilset = WAPAMA.Core.StencilSet.stencilSet("http://www.firstexample.org/stencilset")
	assertEquals("Checks, if the correct StencilSet is delivered by namespace", stencilset, "with#")
	
	var stencilset = WAPAMA.Core.StencilSet.stencilSet("http://www.firstexample.org/stencilset#aaaaa")
	assertEquals("Checks, if the correct StencilSet is delivered by namespace", stencilset, "with#")
	
	var stencilset = WAPAMA.Core.StencilSet.stencilSet("http://www.firstexample.org/Stencilset")
	assertEquals("Checks, if the correct StencilSet is delivered by namespace", stencilset, "With#")

}

/**
 * Tests, if non existing stencil set namespaces are handled correctly.
 */
function testWrongStencilSetNamespaces() {
	WAPAMA.Core.StencilSet._stencilSetsByNamespace["http://www.firstexample.org/stencilset#"] =  "with#"
	
	var stencilset = WAPAMA.Core.StencilSet.stencilSet("##")
	assertEquals("Checks, if the wrong namespace syntax is handled correctly", stencilset, undefined)
	
	var stencilset = WAPAMA.Core.StencilSet.stencilSet("http://www.firstexample.org/stencilset2")
	assertEquals("Checks, if the wrong namespace syntax is handled correctly", stencilset, undefined)
}

/**
 * It is expected that numbers as namespace are not a
 */
function testFailForNumberAsStencilSetNamespace() {
	WAPAMA.Core.StencilSet._stencilSetsByNamespace[3] =  "testStencil";
	try {
		var stencilset = WAPAMA.Core.StencilSet.stencilSet(3)
		fail("Test should fail yet for number used as namespace.")
	}catch(e) {
		if(!( e instanceof JsUnitException)) {
			throw e
		}
	}	
}

/**
 * Tests, if the right stencil sets are returned for a editor instance.
 */
function testGetStencilSetsForEditorInstance() {
	// prepare stencil sets
	var stencilset1 = new WAPAMA.Core.StencilSet.StencilSet("http://www.firstexample.org/stencilset1#")
	var stencilset2 = new WAPAMA.Core.StencilSet.StencilSet("http://www.firstexample.org/stencilset2#")
	
	// prepare Hashes
	WAPAMA.Core.StencilSet._stencilSetsByNamespace[stencilset1.namespace()] =  stencilset1
	WAPAMA.Core.StencilSet._stencilSetsByNamespace[stencilset2.namespace()] =  stencilset2
	
	WAPAMA.Core.StencilSet._StencilSetNSByEditorInstance["editor1"] = new Array();
	WAPAMA.Core.StencilSet._StencilSetNSByEditorInstance["editor2"] = new Array();
	
	WAPAMA.Core.StencilSet._StencilSetNSByEditorInstance["editor1"].push(stencilset1.namespace())
	WAPAMA.Core.StencilSet._StencilSetNSByEditorInstance["editor1"].push(stencilset2.namespace())
	WAPAMA.Core.StencilSet._StencilSetNSByEditorInstance["editor2"].push(stencilset1.namespace())
	
	var stencilsets = WAPAMA.Core.StencilSet.stencilSets("editor1")
	var compareStencilSets = new Hash()
	compareStencilSets[stencilset1.namespace()] = stencilset1
	compareStencilSets[stencilset2.namespace()] = stencilset2
	
	// test if the appropriate stencilsets are passed
	assertEquals(2, $A(stencilsets).length)
	assertEquals("Checks, if the appropriate stencil sets are loaded.", stencilsets[stencilset1.namespace()], compareStencilSets[stencilset1.namespace()])
	assertEquals("Checks, if the appropriate stencil sets are loaded.", stencilsets[stencilset2.namespace()], compareStencilSets[stencilset2.namespace()])
	
	// tests for second editor instance
	var stencilsets = WAPAMA.Core.StencilSet.stencilSets("editor2")
	var compareStencilSets = new Hash()
	compareStencilSets[stencilset1.namespace()] = stencilset1
	
	assertEquals("Checks, if the appropriate stencil sets are loaded.", stencilsets[stencilset1.namespace()], compareStencilSets[stencilset1.namespace()])
	assertUndefined("The Editor2 instance should not have an reference to the stencilset2.", stencilsets[stencilset2.namespace()])
}

/**
 * Test if not existing editor instances are handled.
 * It should return an empty Hash.
 */
function testNotExistingEditorInstances() {
	assertEquals("A not existing editor instance should not have any reference to a stencil set", 0, $A(WAPAMA.Core.StencilSet.stencilSets("editorXX")).length)
}

/**
 * Tests if undefined is returned if the stencilset or stencil does not exists.
 */
function testGetUndefindedStencil() {
	assertUndefined(WAPAMA.Core.StencilSet.stencil("http://notexistingStencilSet.com#ANode"))
	
	// preparation for not existing stencil in existing stencil set
	var stencilset1 = new WAPAMA.Core.StencilSet.StencilSet("http://www.firstexample.org/stencilset1#")
	WAPAMA.Core.StencilSet._stencilSetsByNamespace[stencilset1.namespace()] =  stencilset1
	
	assertUndefined(WAPAMA.Core.StencilSet.stencil("http://www.firstexample.org/stencilset1#ANotNode"))
}

/**
 * Test if the appropriated rules for an editor instance are returned
 */
function testRulesForEditorInstance() {
	var rules1 = new WAPAMA.Core.StencilSet.Rules("rule1")
	
	// prepare Hash
	WAPAMA.Core.StencilSet._rulesByEditorInstance["first"] = rules1
	
	// test
	assertEquals("Rules of first editor should be rules1", rules1, WAPAMA.Core.StencilSet.rules("first"))
	assertTrue("Rules should be created for a new editor instance", WAPAMA.Core.StencilSet.rules("second") instanceof WAPAMA.Core.StencilSet.Rules)
}

/**
 * Test tries to load a stencil form a given stencilset.
 */
function testGetStencilFromStencilSet() {
	// prepare stencil set
	
	var stencilset = new WAPAMA.Core.StencilSet.StencilSet("http://example.com#")
	
	// prepare Hash
	WAPAMA.Core.StencilSet._stencilSetsByNamespace[stencilset.namespace()] =  stencilset
	
	// node
	var stencil = WAPAMA.Core.StencilSet.stencil("http://example.com#ANode")
	assertTrue("Verify return value from stubed stencil method.", stencil["stencil"])
	
	// edge
	var stencil = WAPAMA.Core.StencilSet.stencil("http://example.com#AnEdge")
	assertTrue("Verify return value from stubed stencil method.", stencil["stencil"])
}

/**
 * The test loads a new stencilset.
 */
function testLoadNewStencilSet() {
	WAPAMA.Core.StencilSet.loadStencilSet("http://example.com#", "myId")
	
	//test if the new stencil set exists
	assertTrue("Test existence of stencil set.",WAPAMA.Core.StencilSet._stencilSetsByNamespace["http://example.com#"] instanceof WAPAMA.Core.StencilSet.StencilSet)
	
	assertTrue("Test existence of stencil set in stencil set by url hash.",WAPAMA.Core.StencilSet._stencilSetsByUrl["http://example.com#"] instanceof WAPAMA.Core.StencilSet.StencilSet)
	
	assertTrue("Test if rules are set correctly.", WAPAMA.Core.StencilSet._rulesByEditorInstance["myId"] instanceof WAPAMA.Core.StencilSet.Rules)
}

/**
 *  Test getTranslation with an invalid JSON-object.
 */
function testFailForInvalidJSONInTranslation() {
	
	try {
		WAPAMA.Core.StencilSet.getTranslation("invalidjsonObject", "title")
		fail("Test should fail yet for invalid JSON.")
	} catch (e) {
		if((e instanceof JsUnitException)) {
			throw e
		}
	}
}

/**
 * If a Attributes does not exists, it should return undefined.
 */
function testNotExistingAttributeTranslationInJSON() {
	var json = {
			"type":			"node",
			"id":			"Diagram",
			"title":		"Diagram",	
			"title_de": 	"Diagram_de",
			"title_de_at": "Diagram_de_at"
			}
			
	assertUndefined("Test not existing Attribute.",WAPAMA.Core.StencilSet.getTranslation(json, "name"))
}

/**
 * Tries to get an attribute for different languages.
 */
function testgetTranslationOfJSONAttr() {
	var json = {
			"type":			"node",
			"id":			"Diagram",
			"title":		"Diagram",	
			"title_de": 	"Diagram_de",
			"title_de_at": "Diagram_de_at",
			"title_ch": "Diagram_ch"
			}
	
	// get title with lang de
	WAPAMA.I18N.Language = "de"		
	assertEquals("Get title_de",WAPAMA.Core.StencilSet.getTranslation(json, "title"), "Diagram_de")
	
	// get title with lang de_at
	WAPAMA.I18N.Language = "de_at"		
	assertEquals("Get title_de_at",WAPAMA.Core.StencilSet.getTranslation(json, "title"), "Diagram_de_at")
	
	// get title default
	WAPAMA.I18N.Language = "ar"		
	assertEquals("Get title default",WAPAMA.Core.StencilSet.getTranslation(json, "title"), "Diagram")
	
	// get title_ch with lang ch_zz
	WAPAMA.I18N.Language = "ch_zz"		
	assertEquals("Get title_de",WAPAMA.Core.StencilSet.getTranslation(json, "title"), "Diagram_ch")
}














