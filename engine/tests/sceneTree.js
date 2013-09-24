/**
 * @fileoverview Scene Tree Display - Uses Dynatree to Display Vizi Scene Tree
 * @author Tony Parisi
 */

sceneTreeMap = {};

buildSceneTree = function(scene, tree) {
	
	function build(object, node, level) {
		
		var noname = level ? "[object]" : "Scene";
		
		var childNode = node.addChild({
			title: object.name ? object.name : noname,
			expand: level <= 1,
			activeVisible:true,
			tooltip: "object",
			isFolder: false,
			vizi:object,
		});

		sceneTreeMap[object._id] = childNode;
		
		var i, len = object._children.length;
		for (i = 0; i < len; i++) {	
			build(object._children[i], childNode, level+1);
		}
	}
	
	build(scene, tree, 0);
	
	
	//return map;
	
	// tree.childList[0].activate();
	/*
	var childNode = rootNode.addChild({
		title: "Programatically addded nodes",
		tooltip: "This folder and all child nodes were added programmatically.",
		isFolder: false,
	});
	childNode.addChild({
		title: "Document using a custom icon",
	});
	*/
}

var selectedSceneNode = null;

selectSceneNode = function(viewer, node) {
	
	if (selectedSceneNode) {
//		selectedSceneNode.activate(false);
//		selectedSceneNode.select(false);
	}
	
	if (node.data.vizi) {
//		alert("Node " + node.data.vizi.name + " selected.");
		
		setTimeout(function() {
			viewer.highlightObject(node.data.vizi);
		}, 10);
	}
	
	selectedSceneNode = node;
	
}

vec3toString = function(vec) {
	return "" + vec.x.toFixed(6) + "," + vec.y.toFixed(6) + "," + vec.z.toFixed(6) + "";
}

colorToString = function(color) {
	return "" + color.r.toFixed(6) + "," + color.g.toFixed(6) + "," + color.b.toFixed(6) + "";
}

transformToString = function(transform) {

	var str = "<b>Transform</b><br><table border='0' width='95%'><tr><td>Position:</td><td> " + vec3toString(transform.position) +
		"</td><tr><td>Rotation:</td><td> " + vec3toString(transform.position) +
		"</td><tr><td>Scale:</td><td> " + vec3toString(transform.scale) +
		"</td></tr></tr></table>";		
	
	return str;
}

meshToString = function(geometry) {
	var str = "<b>Mesh</b><br>";

	var nFaces = geometry.faces ? geometry.faces.length : geometry.attributes.index.array.length / 3;
	var nVertices = geometry.vertices ? geometry.vertices.length :
		geometry.attributes.position.array.length;
	
	str += (nFaces.toString() + " faces<br>");
	str += (nVertices.toString() + " vertices<br>");
	
	if (!geometry.boundingBox)
		geometry.computeBoundingBox();
	
	var size = geometry.boundingBox.size();
	var boundingBoxSize = 
		"[" + size.x.toFixed(2) + ", " + 
	size.y.toFixed(2) + ", " + 
	size.z.toFixed(2) +
	"]<br>";

	str += ("Bounds " + boundingBoxSize);
	return str;
}

materialToString = function(material) {
	if (material instanceof THREE.MeshFaceMaterial) {
		material = material.materials[0];
	}
	
	
	var str = "<b>Material</b><br><table border='0' width='95%'>";
	
	var shading = "Unknown";
	if (material instanceof THREE.MeshLambertMaterial) {
		shading = "Lambert";
	}
	else if (material instanceof THREE.MeshPhongMaterial) {
		shading = "Phong";
	}
	else if (material instanceof THREE.MeshBasicMaterial) {
		shading = "Basic (unlit)";
	}
		
	str += ("Shading: " + shading + "<br>");
	
	if (material.ambient) { 
		str += ("<tr><td>Ambient:</td><td> " + colorToString(material.ambient));
	}
	
	if (material.color) {
		str += ("<tr><td>Diffuse:</td><td> " + colorToString(material.color));
	}
	
	if (material.specular) {
		str += ("</td><tr><td>Specular:</td><td> " + colorToString(material.specular));
	}
	
	if (material.emissive) {
		str += ("</td><tr><td>Emissive:</td><td> " + colorToString(material.emissive));
	}
	
	str += ("</td><tr><td>Opacity:</td><td> " + material.opacity);
	str += "</td></tr></tr></table>";		

	return str;
}

lightToString = function(light) {

	var str = "<b>Light</b>";		
	
	return str;
}

cameraToString = function(camera) {

	var str = "<b>Camera</b>";		
	
	return str;
}

groupToString = function(children) {

	var str = "<b>Group</b>";		
	
	return str;
}

sceneNodeInfo = function(viewer, node) {

	var info = {};
	
	if (node.data.vizi) {
		var object = node.data.vizi;
		var transform = transformToString(object.transform);
		var mesh = object.visuals && object.visuals.length ? meshToString(object.visuals[0].geometry) : null;
		var material = object.visuals && object.visuals.length ? materialToString(object.visuals[0].material) : null;
		var light = lightToString(object.light);
		var camera = cameraToString(object.camera);
		var group = groupToString(object.children);
		info.object = {
				name : object.name,
				id : object._id,
				components : {
					transform : object.transform,
					visual : object.visuals && object.visuals.length ? object.visuals[0] : null,
					light : object.light,
					camera : object.camera,
				}
		};
		
		info.text = {
				name : object.name,
				id : object._id,
				components : {
					transform : transform,
					mesh : mesh,
					material : material,
					light : light,
					camera : camera,
					group : group
				}
		};
		
		//	info.object.name + "<br>" + info.object.id + "<br>" + info.object.components.transform;
	}

	return info;
}

selectSceneNodeFromId = function(viewer, id) {
	
	if (selectedSceneNode) {
//		selectedSceneNode.activate(false);
//		selectedSceneNode.select(false);
	}
	
	var node = sceneTreeMap[id];
	
	if (node) {
		node.focus();
		node.activate(true);
		node.select(true);
		selectedSceneNode = node;
	}

	return node;
}