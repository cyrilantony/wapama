var p1 = {x: 0, y: 0};
var p2 = {x: 4, y: 3.5};
var p3 = {x: 2, y: 1.75};

/**
 * Test the WAPAMA.Core.Math.midPoint function
 */
function testMidPoint() {
	assertEquals(WAPAMA.Core.Math.midPoint(p1, p2).x, 2);
	assertEquals(WAPAMA.Core.Math.midPoint(p1, p2).y, 1.75);
}

/**
 * Test the WAPAMA.Core.Math.isPointInLine function
 */
function testIsPointInLine() {
	assertTrue(WAPAMA.Core.Math.isPointInLine(p3.x, p3.y, p1.x, p1.y, p2.x, p2.y));
	assertFalse(WAPAMA.Core.Math.isPointInLine(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y));
	assertTrue(WAPAMA.Core.Math.isPointInLine(p3.x+1, p3.y+1, p1.x, p1.y, p2.x, p2.y, 2));
	assertTrue(WAPAMA.Core.Math.isPointInLine(p3.x+1, p3.y+1, p1.x, p1.y, p2.x, p2.y, -2));
	assertFalse(WAPAMA.Core.Math.isPointInLine(p3.x+1, p3.y+1, p1.x, p1.y, p2.x + 2, p2.y, 1));
}

/**
 * Test the WAPAMA.Core.Math.isPointInLine function for degenerated lines
 */
function testIsPointInLineDegenerated() {
	assertFalse(WAPAMA.Core.Math.isPointInLine(p1.x, p1.y, p1.x, p1.y, p1.x, p1.y));
	assertFalse(WAPAMA.Core.Math.isPointInLine(p1.x, p1.y, p1.x, p1.y, p1.x, p1.y, 2));
	assertFalse(WAPAMA.Core.Math.isPointInLine(p1.x, p1.y, p2.x, p2.y, p2.x, p2.y));
}

/**
 * Test the WAPAMA.Core.Math.isPointInEllipse function
 */
function testIsPointInEllipse() {
	assertTrue(WAPAMA.Core.Math.isPointInEllipse(p2.x, p2.y, 5, 4, 2, 1));
	assertFalse(WAPAMA.Core.Math.isPointInEllipse(p3.x, p3.y, 5, 4, 2, 1));
}

/**
 * Test the WAPAMA.Core.Math.isPointInEllipse function for ellipses with radius 0
 */
function testIsPointInEllipseZeroRadius() {
	assertFalse(WAPAMA.Core.Math.isPointInEllipse(p2.x, p2.y, p2.x, p2.y, 0, 0));
}

/**
 * Test the WAPAMA.Core.Math.isPointInEllipse function for ellipses with negative radius
 */
function testIsPointInEllipseNegativeRadius() {
	assertTrue(WAPAMA.Core.Math.isPointInEllipse(p2.x, p2.y, 5, 4, -2, -1));
	assertFalse(WAPAMA.Core.Math.isPointInEllipse(p3.x, p3.y, 5, 4, -2, -1));
}

/**
 * Test the WAPAMA.Core.Math.isPointInPolygone function
 */
function testIsPointInPolygone() {
	var polygone = [ 1,2, 4,2.5, 3,3, 6,9, 1,8 ];
	assertTrue(WAPAMA.Core.Math.isPointInPolygone(2, 2.4, polygone));
	assertTrue(WAPAMA.Core.Math.isPointInPolygone(5, 8, polygone));
	assertFalse(WAPAMA.Core.Math.isPointInPolygone(4, 3, polygone));
	assertFalse(WAPAMA.Core.Math.isPointInPolygone(1, 9, polygone));
}

/**
 * Test the WAPAMA.Core.Math.isPointInPolygone function for degenerated polygones
 */
function testIsPointInPolygoneDegenerated() {
	var polygone = [ 1,1 ];
	assertFalse(WAPAMA.Core.Math.isPointInPolygone(1, 1, polygone));
	
	var polygone = [ 1,1, 1,1 ];
	assertTrue(WAPAMA.Core.Math.isPointInPolygone(1, 1, polygone));
	
	polygone = [ 1,1, 3,3 ];
	assertTrue(WAPAMA.Core.Math.isPointInPolygone(2, 2, polygone));
}