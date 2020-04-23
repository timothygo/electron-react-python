const { ipcMain, dialog, BrowserWindow } = require("electron");

function executePython(client, funcName, replyName) {
  return (event, value) => {
    client.invoke(funcName, value, (response, error) => {
      if (error) {
        event.reply(replyName, createErrorResponse(error));
      } else {
        event.reply(replyName, createSuccessResponse(response));
      }
    });
  };
}

function createErrorResponse(error) {
  let errorMsg = "";
  if (error.includes("PermissionError")) {
    errorMsg = "Please close required excel file/s.";
  } else {
    errorMsg = error;
  }

  dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
    title: "Error Message",
    buttons: ["Dismiss"],
    type: "error",
    message: errorMsg
  });

  return {
    type: "ERROR",
    response: errorMsg
  };
}

function createSuccessResponse(args) {
  let response;

  try {
    response = JSON.parse(args);
  } catch (exception) {
    response = args;
  }

  return {
    type: "SUCCESS",
    response: response
  };
}

const actions = {
  pythonFunc: client => executePython(client, "hello", "hello-reply"),
  normalFunc: (event, value) => {
    dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
      title: "Testing Electron Functions",
      buttons: ["Dismiss"],
      type: "info",
      message: `This is working with react ${value}.`
    });
  }
};

module.exports = actions;
