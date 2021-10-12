# Fog of war Chess assistant

This is a userscript that assist in playing fog of war chess on Chess.com. It only uses information you saw on previous moves and augments the board with better visuals about where the opponent pieces might be. Works in spectator mode as well but only for white.  

# Installation
- Install any userscript plugin (Greasemonkey, Tampermonley, Violentmonkey)
- build the script
- Copy the code from dist/index.user.js
- Open https://www.chess.com/variants/fog-of-war/ (The script activates only if you visited this page or any of the subpages)

## Development

```sh
$ yarn dev
```

## Building

```sh
$ yarn build
```

## Lint

```sh
$ yarn lint
```

# Thanks 
This script is initiated from [@violentmonkey/generator-userscript](https://github.com/violentmonkey/generator-userscript).
