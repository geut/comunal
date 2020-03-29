'use strict'

const { app, BrowserWindow, Menu } = require('electron')
const { startHyper } = require('./hyper')

const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS
} = require('electron-devtools-installer')
const debug = require('electron-debug')

debug({ isEnabled: true, showDevTools: false })
let mainWindow

const createMainWindow = async () => {
  const win = new BrowserWindow({
    title: app.name,
    show: false,
    width: 1440,
    height: 920,
    minWidth: 820,
    minHeight: 764,
    webPreferences: {
      nodeIntegration: true
    },
    titleBarStyle: 'hiddenInset'
  })
  Menu.setApplicationMenu(null)

  win.on('ready-to-show', () => win.show())
  win.on('closed', () => (mainWindow = undefined))
  if (!app.isPackaged && !process.env.CI) win.webContents.openDevTools()
  if (app.isPackaged) {
    await win.loadFile('build/index.html')
  } else {
    await win.loadURL('http://localhost:1212/assets/index.html')
  }
  return win
}

if (!app.requestSingleInstanceLock) app.quit()

app.on('second-instance', () => {
  if (!mainWindow) return
  if (mainWindow.isMinimized()) mainWindow.restore()
  mainWindow.show()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin' || process.env.CI) {
    app.quit()
  }
})

app.on('activate', async () => {
  if (!mainWindow) mainWindow = await createMainWindow()
})

const main = async () => {
  await startHyper()
  await app.whenReady()
  if (!process.env.CI && process.platform !== 'win32') {
    await installExtension(REACT_DEVELOPER_TOOLS)
  }
  mainWindow = await createMainWindow()
}

main()
