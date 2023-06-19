# eCrowne Utilities (OLED)
A very crude layout editor for OLED screens used with SimHub.

<img src="/screenshot.jpg" alt="Screenshot of editor" />

NOTE: It currently only supports opening it's own created ini files.

Head over to the discord for support or discussion: https://discord.gg/EBbzWWyGgr 

## How to:
If you want to try it out, grab the latest compiled installer from the releases section.

By default it comes with a layout pre-built, feel free to tinker with it. You can add very basic elements, like text, progressbar, line and rectangles. Other more complex elements like the Map, relative layout modifiers, and "includes" are not yet supported.

It's built with Electron, so the size is a bit large because it has to include node and chrome with it. If you don't trust the release binaries I provide, feel free to recompile using the instructions below:

## Development

### Install

Clone the repo and install dependencies:

```bash
npm install
```

## Starting Development

Start the app in the `dev` environment:

```bash
npm start
```

## Packaging for Production

To package apps for the local platform:

```bash
npm run package -- --win
```
