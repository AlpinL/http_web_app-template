'use strict';

function showMessage(message) {
	console.log('Message: ', message);
}

function getNewXMLHttpRequest() {
	const xhr = new XMLHttpRequest();
	xhr.onload = console.log;
	xhr.onerror = console.log;
	xhr.onreadystatechange = console.log;
	return xhr;
}

function testGetRequest(dataKey) {
	// const xhr = getNewXMLHttpRequest();
	// xhr.open('GET', 'dataKey');
	// xhr.send();
	console.log('testGetRequest dataKey', dataKey);
}

function testPostRequest() {
	const xhr = getNewXMLHttpRequest();
	xhr.open('POST', '/createGame');
	xhr.send();
}

function testPutRequest() {
	const xhr = getNewXMLHttpRequest();
	xhr.open('PUT', '/updateGame');
	xhr.send();
}

function testDeleteRequest() {
	const xhr = getNewXMLHttpRequest();
	xhr.open('DELETE', '/deleteGame');
	xhr.send();
}
