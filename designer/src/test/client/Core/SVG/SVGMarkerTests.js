//mocks
/**
 * Init package
 */
if(!WAPAMA) {var WAPAMA= {};}
if(!WAPAMA.Core) {WAPAMA.Core = {};}
if(!WAPAMA.Core.SVG) {WAPAMA.Core.SVG = {};}

// mocking WAPAMA.Editor object
if(!WAPAMA) {var WAPAMA= {};}
if(!WAPAMA.Editor) {WAPAMA.Editor = {};}

//stubs

// stubbing WAPAMA.Editor.checkClassType
WAPAMA.Editor.checkClassType = function( classInst, classType ) {
		return classInst instanceof classType
}

//tests

function setUp() {
	// set wapama namespace
	NAMESPACE_WAPAMA_TEST = "http://www.wapama.net/diagram";
	testChild1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg' )
	testChild2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect' )
	testChildChild1 = document.createElementNS('http://www.w3.org/2000/svg', 'path' )
	testSVGMarkerElement = document.createElementNS('http://www.w3.org/2000/svg', 'marker')
}

/**
 * Tests if an exception is thrown if no valid SVGMarkerElement is passed to the constructor.
 */
function testFailForAnInvalidSVGMarkerElement() {
	try {
		testSVGMarker = new WAPAMA.Core.SVG.SVGMarker(5);
		fail("SVGMarker test should fail yet.")
	} catch (e) {
		if ((e instanceof JsUnitException)) {
			throw e;
		}
	}
}

/**
 * Creates a SVGMarker instance, from an empty SVGMarkerElement.
 */
function testCreateSVGMarkerFromDOMElement() {
	try {
		testSVGMarker = new WAPAMA.Core.SVG.SVGMarker(testSVGMarkerElement);
		fail(" ")
	} catch (e) {
		if (!(e instanceof JsUnitException)) {
			throw e;
		}
	}
}

/**
 * No further attributes specified. So check if default values are set.
 */
function testDefaultValues() {
	testSVGMarker = new WAPAMA.Core.SVG.SVGMarker(testSVGMarkerElement);
	assertNotNaN("Is oldRefX a Number?",Number(testSVGMarker.oldRefX))
	assertNotNaN("Is oldRefY a Number?",Number(testSVGMarker.oldRefY))
	assertNotNaN("Is oldMarkerWidth a Number?",Number(testSVGMarker.oldMarkerWidth))
	assertNotNaN("Is oldMarkerHeight a Number?",Number(testSVGMarker.oldMarkerHeight))
	assertFalse("Not optional",testSVGMarker.optional)
	assertTrue("Enabled",testSVGMarker.enabled)
	assertFalse("Should not be resizable",testSVGMarker.resize)
}

/**
 * Test parsing of id attribute
 */
function testIDValue() {
	testSVGMarkerElement.setAttributeNS(null, "id", "myMarker")
	testSVGMarker = new WAPAMA.Core.SVG.SVGMarker(testSVGMarkerElement);
	assertEquals("ID value should be 'myMarker'", testSVGMarker.id, "myMarker")
}

/**
 * Test parsing of refX attribute
 */
function testRefXValue() {
	testSVGMarkerElement.setAttributeNS(null, "refX", 89.45)
	testSVGMarker = new WAPAMA.Core.SVG.SVGMarker(testSVGMarkerElement);
	assertEquals("Checks RefX value.", testSVGMarker.refX, 89.45)
	assertEquals("Checks oldRefX value.", testSVGMarker.oldRefX, 89.45)
}

/**
 * Test parsing of refX as String attribute
 */
function testRefXStringValue() {
	testSVGMarkerElement.setAttributeNS(null, "refX", "89.45")
	testSVGMarker = new WAPAMA.Core.SVG.SVGMarker(testSVGMarkerElement);
	assertEquals("Checks RefX value.", testSVGMarker.refX, 89.45)
	assertEquals("Checks oldRefX value.", testSVGMarker.oldRefX, 89.45)
}

/**
 * If RefX is not a number, it should throw an Exception.
 */
function testFailForNaNRefXValue() {
	try {
		testSVGMarkerElement.setAttributeNS(null, "refX", "two")
		testSVGMarker = new WAPAMA.Core.SVG.SVGMarker(testSVGMarkerElement);
		fail("Test should fail yet.")
	} catch (e) {
		if ((e instanceof JsUnitException)) {
			throw e;
		}
	}
}

/**
 * Test parsing of refY attribute
 */
function testRefYValue() {
	testSVGMarkerElement.setAttributeNS(null, "refY", 89.45)
	testSVGMarker = new WAPAMA.Core.SVG.SVGMarker(testSVGMarkerElement);
	assertEquals("Checks RefY value.", testSVGMarker.refY, 89.45)
	assertEquals("Checks oldRefX value.", testSVGMarker.oldRefY, 89.45)
}

/**
 * Test parsing of refY as String attribute
 */
function testRefYStringValue() {
	testSVGMarkerElement.setAttributeNS(null, "refY", "89.45")
	testSVGMarker = new WAPAMA.Core.SVG.SVGMarker(testSVGMarkerElement);
	assertEquals("Checks RefY value.", testSVGMarker.refY, 89.45)
	assertEquals("Checks oldRefY value.", testSVGMarker.oldRefY, 89.45)
}

/**
 * If RefY is not a number, it should throw an Exception.
 */
function testFailForNaNRefYValue() {
	try {
		testSVGMarkerElement.setAttributeNS(null, "refY", "two")
		testSVGMarker = new WAPAMA.Core.SVG.SVGMarker(testSVGMarkerElement);
		fail("Test should fail yet.")
	} catch (e) {
		if ((e instanceof JsUnitException)) {
			throw e;
		}
	}
}

/**
 * Test parsing of markerWidth attribute
 */
function testMarkerWidthValue() {
	testSVGMarkerElement.setAttributeNS(null, "markerWidth", 4.45)
	testSVGMarker = new WAPAMA.Core.SVG.SVGMarker(testSVGMarkerElement);
	assertEquals("Checks MarkerWidth value.", testSVGMarker.markerWidth, 4.45)
}

/**
 * Test parsing of markerWidth as String attribute
 */
function testMarkerWidthStringValue() {
	testSVGMarkerElement.setAttributeNS(null, "markerWidth", "4.45")
	testSVGMarker = new WAPAMA.Core.SVG.SVGMarker(testSVGMarkerElement);
	assertEquals("Checks markerWidth value.", testSVGMarker.markerWidth, 4.45)
}

/**
 * If markerWidth is not a number, it should throw an Exception.
 */
function testFailForNaNMarkerWidthValue() {
	try {
		testSVGMarkerElement.setAttributeNS(null, "markerWidth", "two")
		testSVGMarker = new WAPAMA.Core.SVG.SVGMarker(testSVGMarkerElement);
		fail("Test should fail yet.")
	} catch (e) {
		if ((e instanceof JsUnitException)) {
			throw e;
		}
	}
}

/**
 * Test parsing of markerHeight attribute
 */
function testMarkerHeightValue() {
	testSVGMarkerElement.setAttributeNS(null, "markerHeight", 4.45)
	testSVGMarker = new WAPAMA.Core.SVG.SVGMarker(testSVGMarkerElement);
	assertEquals("Checks MarkerHeight value.", testSVGMarker.markerHeight, 4.45)
}

/**
 * Test parsing of markerHeight as String attribute
 */
function testMarkerHeightStringValue() {
	testSVGMarkerElement.setAttributeNS(null, "markerHeight", "4.45")
	testSVGMarker = new WAPAMA.Core.SVG.SVGMarker(testSVGMarkerElement);
	assertEquals("Checks markerHeight value.", testSVGMarker.markerHeight, 4.45)
}

/**
 * If markerHeight is not a number, it should throw an Exception.
 */
function testFailForNaNMarkerHeightValue() {
	try {
		testSVGMarkerElement.setAttributeNS(null, "markerHeight", "two")
		testSVGMarker = new WAPAMA.Core.SVG.SVGMarker(testSVGMarkerElement);
		fail("Test should fail yet.")
	} catch (e) {
		if ((e instanceof JsUnitException)) {
			throw e;
		}
	}
}

/**
 * Test parsing of wapama:optional attribute
 */
function testMarkerWapamaOptionalValue() {
	testSVGMarkerElement.setAttributeNS(NAMESPACE_WAPAMA_TEST, "optional", "yes")
	testSVGMarker = new WAPAMA.Core.SVG.SVGMarker(testSVGMarkerElement);
	assertTrue("Checks wapama:optional value.", testSVGMarker.optional)
}

/**
 * Test parsing of wapama:optional with a "no" value
 */
function testMarkerWapamaOptionalNoValue() {
	testSVGMarkerElement.setAttributeNS(NAMESPACE_WAPAMA_TEST, "optional", "")
	testSVGMarker = new WAPAMA.Core.SVG.SVGMarker(testSVGMarkerElement);
	assertFalse("Checks wapama:optional value.", testSVGMarker.optional)
}

/**
 * Test parsing of wapama:enabled attribute
 */
function testMarkerWapamaEnabledValue() {
	testSVGMarkerElement.setAttributeNS(NAMESPACE_WAPAMA_TEST, "enabled", "yes")
	testSVGMarker = new WAPAMA.Core.SVG.SVGMarker(testSVGMarkerElement);
	assertTrue("Checks wapama:enabled value.", testSVGMarker.enabled)
}

/**
 * Test parsing of wapama:optional with a "no" value
 */
function testMarkerWapamaEnabledNoValue() {
	testSVGMarkerElement.setAttributeNS(NAMESPACE_WAPAMA_TEST, "enabled", "nO")
	testSVGMarker = new WAPAMA.Core.SVG.SVGMarker(testSVGMarkerElement);
	assertFalse("Checks wapama:enabled value.", testSVGMarker.optional)
}

/**
 * Test parsing of wapama:resize attribute
 */
function testMarkerWapamaResizeValue() {
	testSVGMarkerElement.setAttributeNS(NAMESPACE_WAPAMA_TEST, "resize", "yes")
	testSVGMarker = new WAPAMA.Core.SVG.SVGMarker(testSVGMarkerElement);
	assertTrue("Checks wapama:resize value.", testSVGMarker.resize)
}

/**
 * Test parsing of wapama:resize with a "no" value
 */
function testMarkerWapamaOptionalNoValue() {
	testSVGMarkerElement.setAttributeNS(NAMESPACE_WAPAMA_TEST, "resize", "")
	testSVGMarker = new WAPAMA.Core.SVG.SVGMarker(testSVGMarkerElement);
	assertFalse("Checks wapama:resize value.", testSVGMarker.resize)
}

/**
 * Test parsing of wapama:minimumLength attribute as string
 */
function testMarkerWapamaMinimumLengthAsStringValue() {
	testSVGMarkerElement.setAttributeNS(NAMESPACE_WAPAMA_TEST, "minimumLength", "51.8")
	testSVGMarker = new WAPAMA.Core.SVG.SVGMarker(testSVGMarkerElement);
	assertEquals("Checks wapama:minimumLength value.", testSVGMarker.minimumLength, 51.8)
}

/**
 * Test parsing of wapama:minimumLength attribute
 */
function testMarkerWapamaMinimumLengthValue() {
	testSVGMarkerElement.setAttributeNS(NAMESPACE_WAPAMA_TEST, "minimumLength", 51.8)
	testSVGMarker = new WAPAMA.Core.SVG.SVGMarker(testSVGMarkerElement);
	assertEquals("Checks wapama:minimumLength value.", testSVGMarker.minimumLength, 51.8)
}

/**
 * If wapama:minimumLength is not a number, it should throw an Exception.
 */
function testFailForNaNMarkerWapamaMinimumLengthtValue() {
	try {
		testSVGMarkerElement.setAttributeNS(NAMESPACE_WAPAMA_TEST, "minimumLength", "two")
		testSVGMarker = new WAPAMA.Core.SVG.SVGMarker(testSVGMarkerElement);
		fail("Test should fail yet.")
	} catch (e) {
		if ((e instanceof JsUnitException)) {
			throw e;
		}
	}
}

// test _getSVGShape method

/**
 * 
 */
function testReturnEmptyArrayForNonNestedElement() {
	testSVGMarker = new WAPAMA.Core.SVG.SVGMarker(testSVGMarkerElement);
	assertEquals("_getSVGShape() without child nodes should return an empty array.", testSVGMarker._getSVGShapes(testSVGMarkerElement), [])
}

/**
 * There are two rectagle shape added to the SVGMarker. So you should retrieve two WAPAMA.Core.SVG.SVGShape 
 * instances from the _getSVGShapes method
 */
function testGetSVGShapes() {
	testSVGRectElement1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	testSVGRectElement1.setAttributeNS(null, "x", 2);
	testSVGRectElement1.setAttributeNS(null, "y", 2);
	testSVGRectElement1.setAttributeNS(null, "height", 3);
	testSVGRectElement1.setAttributeNS(null, "width", 4);
	
	testSVGRectElement2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	testSVGRectElement2.setAttributeNS(null, "x", 2);
	testSVGRectElement2.setAttributeNS(null, "y", 2);
	testSVGRectElement2.setAttributeNS(null, "height", 5);
	testSVGRectElement2.setAttributeNS(null, "width", 4);
	
	testSVGMarkerElement.appendChild(testSVGRectElement1)
	testSVGMarkerElement.appendChild(testSVGRectElement2)
	
	testSVGMarker = new WAPAMA.Core.SVG.SVGMarker(testSVGMarkerElement);
	var childShapes = testSVGMarker._getSVGShapes(testSVGMarkerElement)
	
	assertTrue("SVGShape instance in array", childShapes[0] instanceof WAPAMA.Core.SVG.SVGShape)
	assertTrue("SVGShape instance in array", childShapes[1] instanceof WAPAMA.Core.SVG.SVGShape)
}

/**
 * Test the update method
 */
function testUpdate() {
	testSVGMarker = new WAPAMA.Core.SVG.SVGMarker(testSVGMarkerElement);
	testSVGMarker.refX = 66
	testSVGMarker.refY = 88
	testSVGMarker.markerWidth = 9
	testSVGMarker.markerHeight = 22
	testSVGMarker.update();
	
	assertEquals("Check oldRefX value", testSVGMarker.oldRefX, 66 )	
	assertEquals("Check oldRefY value", testSVGMarker.oldRefY, 88 )
	assertEquals("Check oldMarkerWidth value", testSVGMarker.oldMarkerWidth, 9 )
	assertEquals("Check oldMarkerHeight value", testSVGMarker.oldMarkerHeight, 22)		
}
