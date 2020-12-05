'use strict';

// import

const Path = require('path');
const Http = require('http');
const FileSystem = require('fs');
const HttpRouteMap = require('@luba/http-route-map');
const MimeType = require('@luba/mime-type');

// state

const APP_DIR = Path.resolve(__dirname, '..');
const httpRouteMap = new HttpRouteMap();

// run

start(error => {
	if (error) {
		console.error(minimalErrorStack(error));
	}
});

// functions

function start(callback) {
	httpRouteMap.setHttpRoutes(setHttpRouteSetup);

	const httpServer = Http.createServer(onHttpRequest);
	httpServer.on('error', error => {
		callback(error);
	});
	httpServer.listen(80, () => {
		console.log('Listening to http on port 80');
		callback(null);
	});
}

function onHttpRequest(request, response) {
	// const urlObject = new URL(request.url, 'http://a');
	// console.log({urlObject});
	const {pathname} = new URL(request.url, 'http://a');
	const {method} = request;
	httpRouteMap.get(method, pathname)(request, response);
	// response.end('4004');
}

function minimalErrorStack(error) {
	const lines = error.stack.split('\n');
	error.stack = [lines[0], ...lines.slice(1).filter(it => it.includes(APP_DIR))].join('\n');
	return error;
}

function setHttpRouteSetup(on) {
	on('GET', '/', onIndex);
	on('GET', '/welcome', onWelcome);
	on('GET', '/settings', onSettings);

	on('POST', '/test', onHttpPostTest);
	on('*', '*', onHttpAnyAny);
}

function onIndex(request, response) {
	getHtmlFile('internal/index.html', response);
}

function onWelcome(request, response) {
	getHtmlFile('internal/welcome.html', response);
}

function onSettings(request, response) {
	getHtmlFile('internal/settings.html', response);
}

function getHtmlFile(fileRelativePath, response) {
	const filePath = Path.join(APP_DIR, 'src/web_client', fileRelativePath);
	const ext = Path.extname(filePath);
	response.setHeader('content-type', MimeType.toMimeType(ext));
	const readStream = FileSystem.createReadStream(filePath);
	readStream.pipe(response);
}

function onHttpPostTest(request, response) {
	response.statusCode = 201;
	response.setHeader('content-type', 'application/json');
	response.end(JSON.stringify({
		code: 'OK',
		message: 'REST example',
	}));
}

function onHttpAnyAny(request, response) {
	const {pathname} = new URL(request.url, 'http://a');
	// pathname = '../../my/file/path.ext';
	// filePath = 'APP_DIR/src/web_client/url_mapped/my/file/path.ext';

	// if pathname has '..' -> return bad request (403) permission
	// else create filePath from pathname
	// if not file exists in filePath -> return bad request (404) not found
	// else stream file

	response.end('onHttpAnyAny');
}
