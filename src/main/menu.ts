import {
  app,
  Menu,
  shell,
  ipcRenderer,
  BrowserWindow,
  MenuItemConstructorOptions,
} from 'electron';
import { IpcCalls } from '../constants';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): Menu {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate() // not supported
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  /**
   * Mac menus, intentionally empty because not supported
   */
  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    return [];
  }

  /**
   * Windows and Linux Menus
   */
  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '&File',
        submenu: [
          {
            label: '&Open',
            accelerator: 'Ctrl+O',
            click: () => {
              this.mainWindow.webContents.send(IpcCalls.onImport);
            },
          },
          {
            label: '&Save As',
            accelerator: 'Ctrl+S',
            click: () => {
              this.mainWindow.webContents.send(IpcCalls.onExport);
            },
          },
          {
            label: '&Close',
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWindow.close();
            },
          },
        ],
      },
      {
        label: '&View',
        submenu:
          process.env.NODE_ENV === 'development' ||
          process.env.DEBUG_PROD === 'true'
            ? [
                {
                  label: '&Reload',
                  accelerator: 'Ctrl+R',
                  click: () => {
                    this.mainWindow.webContents.reload();
                  },
                },
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    );
                  },
                },
                {
                  label: 'Toggle &Developer Tools',
                  accelerator: 'Alt+Ctrl+I',
                  click: () => {
                    this.mainWindow.webContents.toggleDevTools();
                  },
                },
                {
                  label: 'Dump variables',
                  accelerator: 'Alt+Ctrl+V',
                  click: () => {
                    this.mainWindow.webContents.send(IpcCalls.onVarDump);
                  },
                },
              ]
            : [
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    );
                  },
                },
              ],
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'Source',
            click() {
              shell.openExternal('https://github.com/eCrowneEng/');
            },
          },
          {
            label: 'Discord',
            click() {
              shell.openExternal("https://discord.gg/EBbzWWyGgr")
            },
          },
          {
            label: 'Buy Hardware from eCrowne',
            click() {
              shell.openExternal("https://www.etsy.com/shop/eCrowneEng")
            },
          },
        ],
      },
    ];

    return templateDefault;
  }
}
