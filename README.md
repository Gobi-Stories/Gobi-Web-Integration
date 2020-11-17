[![npm version](https://badge.fury.io/js/%40gobistories%2Fgobi-web-integration.svg)](https://badge.fury.io/js/%40gobistories%2Fgobi-web-integration)

# Gobi Web Integration

Welcome to Gobi Web Integration. This library will let you put your Gobi stories on your site. If you don't have any Gobi Stories yet, contact us at contact@gobistories.com to get access to our production tools.

Below follow

- What it will look like
- Requirements & prerequisites
- Functionality breakdown
- Implementation steps
- Advanced configuration
- Troubleshooting
- Browser Support
- Development (how to build and publish)

## Installation

```bash
npm install --save @gobistories/gobi-web-integration
```

See [Implementation steps](#implementation-steps) for more details.

## What it will look like (demo)

See a demo of this library in action at
[https://gobiapp.com/external/example-stories](https://gobiapp.com/external/example-stories)

Check the demo source for a full code example using most common options at
[https://gist.github.com/andreaog/2dabbe392ef1b51339bc8c7a0e6d3917](https://gist.github.com/andreaog/2dabbe392ef1b51339bc8c7a0e6d3917)


## Functionality breakdown

An outline of what this library does:
- exports to the global (window) scope on the browser, functions which find a placeholder element and trigger creation of story bubbles
- the bubbles contain thumbnails for each story, which are automatically generated
- the appearance of the ring around bubbles and other visual elements can be configured in your Javascript
- the title of each story will appear under each respective bubble
- the story bubbles, when clicked, will cause a player to load, and play the selected story
- the story video player will appear either side-by-side with the bubbles, or fullscreen, depending on your configuration choices and on the device screen size
- the player contains buttons for
  - navigating back and forth in the story (skipping),
  - pausing playback,
  - closing the player,
  - muting the sound

## Implementation steps


Steps:
- Add placeholder element
– link to script and CSS
- write your inline script

Details:
- Add a placeholder element to your HTML. Put it where you want the Gobi story bubbles to appear.
  eg.
  
  ```<div id="container"></div>```
  
  This placeholder is any simple ```div```, and can have a class name instead of an ```ID```. The important thing is that you are able to refer to it in your script code (below).
  
- Include the library Javascript and the library CSS in your HTML page. This can be done in two ways:
  - by downloading ( for instance using ```npm``` (advanced)) and serving the files yourself.  To install using npm, do
  
    ```npm install --save @gobistories/gobi-web-integration```.

  - by reference the up‐to‐date version on npm CDN, as in the example below.

  If you don't know what this means, just follow the example below. 
- Implement your custom code in a ```<script>``` tag, which should at least call the `gobi.Bubbles` function, to get the placeholder replaced and the stories running.

  ```html
    <script>
        new gobi.Bubbles({
          container: '#container',
          stories: [{...}, {...}],
        });
    </script>
  ```

  Specify each story from story ID. Example:
  
  ```javascript
  new gobi.Bubbles({
    stories: [
      {id: 'zt4kt', title: 'Summer', bubbleSrc: 'https://...'}, 
      { ... }
    ]
  });
  ```

  bubbleSrc and title are optional – the avatar (thumbnail or picture in the bubble) will be fetched
  automatically from the story video, but set bubbleSrc if you wish to override it with your own.

Full example:

```html
<html>
<head>
  <script src="https://unpkg.com/@gobistories/gobi-web-integration"></script>
</head>
<body>
  <div id="gobi-container"></div>
  <script>
    new gobi.Bubbles({
      container: '#gobi-container',
      stories: [
        {id: "zt4kt"},
        {id: "k85k5"},
        {id: "pz2pm"}
      ]
    });
  </script>
</body>
</html>
```

## Referencing a specific version of the library

If you want to reference a specific version, replace
```html
<script src="https://unpkg.com/@gobistories/gobi-web-integration"></script>
```
with
```html
<script src="https://unpkg.com/@gobistories/gobi-web-integration@^6.6.5"></script>
```
where ^6.6.5 is the version you require.


## Using with a bundler

If you’re using a bundler like [webpack](https://webpack.js.org), the exported object will be the Player and Module constructor (unlike the browser where it is attached to `window.gobi`):

```js
import { Bubbles } from 'gobi-web-integration';

new Bubbles({
    container: '#container',
        stories: [
          {id: "zt4kt"},
          {id: "k85k5"},
          {id: "pz2pm"}
      ]
    });
```

```js
import { Player } from 'gobi-web-integration';

new Player({
    container: '#container',
    storyName: 'story-id',
    width: 640,
    playerOptions: {
    	on: {
    		'videoPlay': function(){
                console.log('played the video!')
            },
    	}
    }
});
```

----


## Troubleshooting & FAQ

- No bubbles show

  See the console. Can you spot any errors? Try to understand them. If there seems to be a bug in the library, please email us.

- If you have a website where the server uses the Content-Security-Policy HTTP header, it must include "blob:" in default-src or media-src.

- If your page scrolls to the top when opening a story, this is usually caused by the height styling for the HTML tag of your page. Removing or replaceing this by "min-height" usally solves the problem. 

- If you want to hide the text under the Bubble, you could set title: " "; 

- If you want to style the text under the Bubbles, you could do this by CSS. Check this code example: [https://gist.github.com/andreaog/2dabbe392ef1b51339bc8c7a0e6d3917](https://gist.github.com/andreaog/2dabbe392ef1b51339bc8c7a0e6d3917)

## Browser Support

The library will work in IE 11+, Edge, Chrome, Firefox, Safari, and Opera.


## Development (how to build and publish)

Run:

  `npm run build`

This populates the dist/ folder which will be used when publishing. Note, that this folder doesn't
get committed.

Commit your work. When your working directory is clean, continue.

To automatically bump version numbers in package.json according to semver rules, and also
automatically create a commit, run (usually, just choose patch):

  `npm version [major | minor | patch]`

Push your work.

Finally, publish your new version

```
npm login  (only if needed)
npm publish
```

----

# Technical documentation

## Bubbles Constructor

Function which creates a bubble layout with an already embedded player.

### Create
```html
<head>
  <script src="https://unpkg.com/@gobistories/gobi-web-integration"></script>
</head>
<body>
  <div id="container"></div>
  <script>
        new gobi.Bubbles({
          container: '#container',
          stories: [{
                id: 'story-key',
                title: 'Some Title'
            }, {
                id: 'another-story-key',
            }],
        });
  </script>
</body>
```
### Options

option                            | default    | description
----------------------------------| ---------- | -----------
container                         |`#gobi-here`| **Required.** String. Query Selector for HTMLElement. Container where the module will be embed.
color                             |  `#15d6ea` | Any valid css color value (#000, rgb(...), rgba(...)). The color of the border around the story bubble.
bubbleSize                        |   `96px`   | Valid css size value, except % (10px, 10vw...). The size of the avatar aka bubble.
animatedBubble                    |   `false`  | Boolean. Makes the bubbles as gif animation.
verticalOrientation               |   `false`  | Boolean. Makes the bubbles appear vertically.
wrap                              |   `false`  | Boolean. Add styles which allow a horizontal series of bubbles to wrap to new lines, when the screen is narrow.
isFullHeightMobile                |   `true`   | Boolean. Add styles which allow making a full-screen popup. Only works on mobile phones.
showPlayIcon                      |   `false`  | Boolean. Add Play icon inside the bubbles.
align                             |  `center`  | String. Valid values 'left', 'right', 'end', 'start', 'center' . It sets alignment for bubbles horizontally.
autoSegue                         |   `false`  | Boolean. Enable or disable the transition to next story in the end.
on.loaded                         |  `()=>{}`  | Function. Called when all Bubbles have loaded.
**stories**                       |    `[]`    | **Required.** Array. Data of stories.
stories[0...n].id                 |    ``      | **Required.** String. Identifier of story.
stories[0...n].title              |    ``      | String. Change title text of specific story.
stories[0...n].bubbleSrc          |    ``      | String. Avatar URL of specific story.
**playerOptions**                 |    `{}`    | Object. Provides an interface for customization of the player.
playerOptions.container           |   ``       | Query Selector for HTMLElement. Container where the player will be inserted.
playerOptions.autoStart           |  `false`   | Boolean. Add `autoplay` attributes to the video.
playerOptions.loop                |  `false`   | Boolean. Add `loop` function to video.
playerOptions.roundedCorners      |   `true`   | Boolean. Enable or disable rounded corners to player element.
playerOptions.shadow              |   `true`   | Boolean. Enable or disable shadow on the player element.
playerOptions.width               |   `612`    | Number. Set player width. If height option is not defined it will calculate automaticaly depending on aspect ration 16:9.
playerOptions.height              |   `1088`   | Number. Set player height. If width option is not defined it will calculate automaticaly depending on aspect ration 16:9.
playerOptions.checkViewPort       |   `true`   | Boolean. Enable functionality which pause player if it outside of screen view area.
playerOptions.enableHls           |   `true`   | Boolean. Enable or disable a HLS (HTTP Live Streaming).
playerOptions.playButton          |   `true`   | Boolean. Enable or disable play button.
playerOptions.savePosition        |   `true`   | Boolean. Enable or disable save last watched chapter. It needs to confirm policy by user.
**playerOptions.on**              |   `[]`     | Array. Data of event listener.
playerOptions.on.videoPlay        |  `()=>{}`  | Function. The callback for the play event.
playerOptions.on.videoPause       |  `()=>{}`  | Function. The callback for the pause event.
playerOptions.on.videoComplete    |  `()=>{}`  | Function. The callback for the complete event.
playerOptions.on.clipChange       |  `()=>{}`  | Function. The callback for the change chunk event.
playerOptions.on.clickPrevious    |  `()=>{}`  | Function. The callback for the change to previous chunk event.
playerOptions.on.chunkProgress    |  `()=>{}`  | Function. The callback for the update chunk progress event.
playerOptions.on.clickNext        |  `()=>{}`  | Function. The callback for the change to next chunk event.
playerOptions.on.newIteration     |  `()=>{}`  | Function. The callback for the new iteration event.
playerOptions.on.error            |  `()=>{}`  | Function. The callback for the error event.
playerOptions.on.loaded           |  `()=>{}`  | Function. The callback for the loaded event.


## Player Constructor

Creates a Player and returns an interface for managing it, and for listening to its events.

### Example

```html
<head>
  <script src="https://unpkg.com/@gobistories/gobi-web-integration"></script>
</head>
<body>
  <div id="player-container"></div>
  <script>
        new gobi.Player({
          container: '#player-container',
          storyId: 'story-key',
          on: {
            'videoPlay': function(){
              console.log('played the video!')
            },
          }
        });
  </script>
</body>
```

### Options
option             | default  | description
-------------------| -------- | -----------
container          |   ``     | Query Selector for HTMLElement. Container where the player will be inserted.
storyId            |   ``     | **Required.** String. The key of the story.
autoStart          | `false`  | Boolean. Add `autoplay` attributes to the video.
loop               | `false`  | Boolean. Add `loop` function to video.
roundedCorners     |  `true`  | Boolean. Enable or disable rounded corners to player element.
shadow             |  `true`  | Boolean. Enable or disable shadow on the player element.
width              |  `612`   | Number. Set player width. If height option is not defined it will calculate automaticaly depending on aspect ration 16:9.
height             |  `1088`  | Number. Set player height. If width option is not defined it will calculate automaticaly depending on aspect ration 16:9.
checkViewPort      |  `true`  | Boolean. Enable functionality which pause player if it outside of screen view area.
enableHls          |  `true`  | Boolean. Enable or disable a HLS (HTTP Live Streaming).
playButton         |  `true`  | Boolean. Enable or disable play button.
savePosition       |  `true`  | Boolean. Enable or disable save last watched chapter. It needs to confirm policy by user.
**on**             |  `[]`    | Array. Data of event listener.
on.videoPlay       | `()=>{}` | Function. The callback for the play event.
on.videoPause      | `()=>{}` | Function. The callback for the pause event.
on.videoComplete   | `()=>{}` | Function. The callback for the complete event.
on.chunkProgress   | `()=>{}` | Function. The callback for the update chunk progress event.
on.clickPrevious   | `()=>{}` | Function. The callback for the change to previous chunk event.
on.clickNext       | `()=>{}` | Function. The callback for the change to nuxt chunk event.
on.clipChange      | `()=>{}` | Function. The callback for the change chunk event.
on.newIteration    | `()=>{}` | Function. The callback for the new iteration event.
on.error           | `()=>{}` | Function. The callback for the error event.
on.loaded          | `()=>{}` | Function. The callback for the loaded event.

#### loaded
Occurs when meta data for the video has been loaded. The player gets the size and begins to occupy space on the page.
callback data:
```js
chunInd:0...n
```

#### play
Sent when the playback state is no longer paused, as a result of the `play` method, or the `autoStart` option
Play the video if it’s paused. Note: on iOS and some other mobile devices, you cannot programmatically trigger play. Once the viewer has tapped on the play button in the player, however, you will be able to use this function.
callback data:
```js
chunInd:0...n
```

#### pause
Sent when the playback state is changed to paused.
callback data:
```js
chunInd:0...n
```

#### ended
Triggered any time the video playback reaches the end. Note: when `loop` is turned on, the ended event will not fire.
callback data:
```js
chunInd:0...n
```

#### error
Triggered when video error is generated in the player.
callback data:
```js
error:MediaError
```

#### clickPrevious
Triggered when user tap on back button.
callback data:
```js
chunInd:0...n
```

#### clickNext
Triggered when user skipped some video of current story by tap on player.
callback data:
```js
chunInd:0...n
```

#### clipChange
Triggered each time when one of story videos was changed to another. Either by the user tapping for back or forward, or automatically.
callback data:
```js
chunInd:0...n
```

#### newIteration
Triggered when the `loop` flag is set and the story starts to play again.
```js
chunInd:0...n
```

### Methods
You can call methods on the Player object, eg.:

```js
  var player = new gobi.Player({
     container: '#player-container',
     storyId: 'story-key',
  });

  player.destroy();
```

#### Destroy
You can destroy player in a valid way 
```js
  player.destroy()
```
