# Viz

Simple cross platform image viewer (MacOS, Linux, Windows).

## Motivations

There is no good default image viewer for MacOS (you need to open images one by one using `Preview`).

## Getting started

`npm i` <br>
`npm run electron`

## Setting up flow

### VS code

Search and install `flowtype.flow-for-vscode`.

In the user settings, add these two lines

```
    "flow.pathToFlow":"${workspaceRoot}/node_modules/.bin/flow",
    "javascript.validate.enable": false
```

## Debugging the app "in production" (a bundled exec of the app)

### MacOS

The electron logs will be available in `~/Library/Logs/viz/log.log`

## Roadmap

In the [Projects section](./projects/1) of this repo.
