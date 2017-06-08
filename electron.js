
const appName = "Wayward";
const electron = require("electron");

try {
	const fs = require("fs");
	const os = require("os");
	const path = require("path");
	const {app, BrowserWindow, ipcMain} = electron;

	var launchOptionsDefault = {
		fullscreen: true,
		maximized: true,
		width: "max",
		height: "max",
		x: null,
		y: null,
		zoomFactor: 1.0,
		devtools: false,
		inProcessGpu: true,
		extraGpuFlags: true,
		additionalLogging: false,
		internalVersion: 0
	};

	var args = {};
	process.argv.forEach(function (val, index, array) {
		var equalIndex = val.indexOf("=");
		if (equalIndex > -1) {
			args[val.substring(0, equalIndex)] = val.substring(equalIndex + 1);
		}
		else {
			args[val] = true;
		}
	});

	var mainWindow = null;
	var launchOptions = null;

	var installDir = "";

	if (process.platform === "darwin") {
		installDir = path.resolve(process.execPath, "..", "..", "..", "..");
	}
	else {
		installDir = process.cwd();
	}

	var launchOptionsPath = path.join(installDir, "launch_options.json");

	try {
		launchOptions = JSON.parse(fs.readFileSync(launchOptionsPath, "utf8"));
	} catch (ex) {
		launchOptions = launchOptionsDefault;
	}

	if (launchOptions == null || launchOptions == undefined || typeof (launchOptions) !== "object") {
		launchOptions = launchOptionsDefault;
	}

	var keys = Object.keys(launchOptionsDefault);
	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];
		if (launchOptions[key] === null || launchOptions[key] === undefined) {
			launchOptions[key] = launchOptionsDefault[key];
		}
	}

	function saveLaunchOptions() {
		fs.writeFileSync(launchOptionsPath, JSON.stringify(launchOptions, null, "\t"), "utf8");
	}

	if (launchOptions.internalVersion === 0) {
		launchOptions.internalVersion = 1

		// turn off inProcessGpu for windows 7
		if (os.release().substring(0, 3) === "6.1") {
			launchOptions.inProcessGpu = false;
		}

		saveLaunchOptions();
	}

	var keys2 = Object.keys(launchOptions);
	for (var i = 0; i < keys2.length; i++) {
		var key = keys2[i];
		if (launchOptionsDefault[key] === undefined) {
			delete launchOptions[key];
		}
	}

	app.setPath("userData", path.join(installDir, "save"));

	if (process.platform === "win32" && launchOptions.inProcessGpu) {
		app.commandLine.appendSwitch("in-process-gpu");
	}

	if (launchOptions.extraGpuFlags) {
		app.commandLine.appendSwitch("disable-transparency");
		app.commandLine.appendSwitch("ignore-gpu-blacklist");
		app.commandLine.appendSwitch("disable-hang-monitor");
		app.commandLine.appendSwitch("disable-renderer-backgrounding");
	}

	// enable gc
	app.commandLine.appendSwitch("js-flags", "--expose_gc");

	if (launchOptions.additionalLogging) {
		app.commandLine.appendSwitch("enable-logging");
		app.commandLine.appendSwitch("v", "3");
	}

	function updateFullscreenSetting() {
		mainWindow.webContents.executeJavaScript("game.options.windowMode = " + !launchOptions.fullscreen + ";");
	}

	ipcMain.on("fullscreen", function (event, arg) {
		launchOptions.fullscreen = arg === "1";
		mainWindow.setFullScreen(launchOptions.fullscreen);
	});

	ipcMain.on("fullscreen_update", function (event, arg) {
		updateFullscreenSetting();
	});

	ipcMain.on("zoomfactor_add", function (event, arg) {
		launchOptions.zoomFactor += parseFloat(arg) || 0;
		mainWindow.webContents.executeJavaScript("game.options.zoomFactor = " + launchOptions.zoomFactor + "; Steamworks.onUpdateZoomFactor();");
	});

	ipcMain.on("zoomfactor_reset", function (event, arg) {
		launchOptions.zoomFactor = 1.0;
		mainWindow.webContents.executeJavaScript("game.options.zoomFactor = " + launchOptions.zoomFactor + "; Steamworks.onUpdateZoomFactor();");
	});

	ipcMain.on("devtools", function () {
		mainWindow.toggleDevTools();
	});

	ipcMain.on("reload", function () {
		mainWindow.reload();
	});

	app.on("window-all-closed", function () {
		app.quit();
	});

	app.on("ready", function () {
		var windowObj = {
			title: appName,
			icon: __dirname + "/images/icons/32x32.png",
			minWidth: 800,
			minHeight: 600,
			webPreferences: {
				backgroundThrottling: false
			},
			backgroundColor: "#000000"
		};

		if (launchOptions.zoomFactor !== 1.0) {
			windowObj.zoomFactor = launchOptions.zoomFactor;
		}

		var sreen = electron.screen || require("screen");
		var screenSize = sreen.getPrimaryDisplay().workAreaSize;
		windowObj.width = launchOptions.width === "max" ? screenSize.width : launchOptions.width;
		windowObj.height = launchOptions.height === "max" ? screenSize.height : launchOptions.height;

		if (launchOptions.x !== null) {
			windowObj.x = launchOptions.x;
		}
		if (launchOptions.y !== null) {
			windowObj.y = launchOptions.y;
		}

		mainWindow = new BrowserWindow(windowObj);
		mainWindow.setMenu(null);

		if (launchOptions.fullscreen) {
			mainWindow.setFullScreen(true);
		} else if (launchOptions.maximized) {
			mainWindow.maximize();
		}

		var indexHtmlPath = __dirname + "/index.html";

		if (args["load"] && fs.existsSync(args["load"])) {
			indexHtmlPath = args["load"];
		}

		mainWindow.loadURL("file://" + indexHtmlPath);

		if (args["quickload"]) {
			mainWindow.webContents.executeJavaScript("quickLoad = 0;");
		}

		if (launchOptions.inProcessGpu) {
			mainWindow.webContents.executeJavaScript("Steamworks.setupOverlayAndLinks(true);");
		} else {
			mainWindow.webContents.executeJavaScript("Steamworks.setupOverlayAndLinks(false);");
		}

		if (launchOptions.devtools || args["dev"]) {
			mainWindow.openDevTools();
		}

		mainWindow.webContents.on("will-navigate", function (event, url) {
			event.preventDefault();
		});

		mainWindow.on("enter-full-screen", function () {
			if (!launchOptions.fullscreen) {
				launchOptions.fullscreen = true;
				updateFullscreenSetting();
			}
		});

		mainWindow.on("leave-full-screen", function () {
			if (launchOptions.fullscreen) {
				launchOptions.fullscreen = false;
				updateFullscreenSetting();
			}
		});

		mainWindow.on("close", function () {
			launchOptions.fullscreen = mainWindow.isFullScreen();
			launchOptions.maximized = mainWindow.isMaximized();

			if (!launchOptions.fullscreen && !launchOptions.maximized) {
				var size = mainWindow.getSize();
				launchOptions.width = size[0];
				launchOptions.height = size[1];

				var position = mainWindow.getPosition();
				launchOptions.x = position[0];
				launchOptions.y = position[1];
			}

			saveLaunchOptions();
		});

		mainWindow.on("closed", function () {
			mainWindow = null;
		});
	});

} catch (ex) {
	const dialog = electron.dialog || require("dialog");
	dialog.showErrorBox(appName, "An error occured loading the game. Please contact the developers.\nError: " + ex);
	process.exit(1);
}
