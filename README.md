# Gobi Web Integration

The Gobi Web Integration API allows you to interact with and customize an embedded Stories Layout and Gobi Player

## Installation

You can install the Gobi Web Integration through either npm: **npm install --save @gobistories/gobi-web-integration**

Alternatively, you can reference an up‐to‐date version on npm CDN: 

```html
<link href="https://unpkg.com/@gobistories/gobi-web-integration/dist/gobi-web-integration.css" rel="stylesheet">
<script src="https://unpkg.com/@gobistories/gobi-web-integration/dist/gobi-web-integration.js"></script>
```

## Browser Support

The library is supported in IE 11+, Chrome, Firefox, Safari, and
Opera.

## Using with a module bundler

If you’re using a module bundler like [webpack](https://webpack.js.org), the exported object will be the Player and Module
constructor (unlike the browser where it is attached to `window.gobi`):

```js
import { Module } from 'gobi-web-integration';

new Module({
    container: document.getElementById('container'),
    moduleId: 'module-id'
});
```

```js
import { Player } from 'gobi-web-integration';

const player = new Player({
    container: document.getElementById('container'),
    storyName: 'story-id',
    width: 640
});

player.on('play', function() {
    console.log('played the video!');
});
```

# Module Constructor

Function which create module layout with already embedded player. Getting options which allow to customize layout. Doesn't return any interface. 

## Create
```html
<head>
  <link href="https://unpkg.com/@gobistories/gobi-web-integration/dist/gobi-web-integration.css" rel="stylesheet">
  <script src="https://unpkg.com/@gobistories/gobi-web-integration/dist/gobi-web-integration.js"></script>
</head>
<body>
  <div id="container"></div>
  <script>
        new gobi.Module({
          moduleId: 'some-modul-id',
          container: document.getElementById('container'),
        });
  </script>
</body>
```
## Options

option                            | default  | description
----------------------------------| -------- | -----------
moduleId                          |          | **Required.** String. The id of the module.
container                         |          | **Required.** HTMLElement. Container where the module will be embed.
title                             |    ``    | String. Module title.
color                             |`#999999` | Any valid css color value (#000, rgb(...), rgba(...)). The color of border of unselected desktop story circle.
activeColor                       |`#15d6ea` | Any valid css color value (#000, rgb(...), rgba(...)). The color of border of selected desktop and mobile story circle.
**desktopStoryStyle**             |   `{}`   | Object which provides interface for customization of desktop stories circles. 
desktopStoryStyle.titleSize       |    ``    | Css size value ('20px, 10em..').Set font size of desktop circles titles.
desktopStoryStyle.descriptionSize |    ``    | Css size value ('20px, 10em..').Set font size of desktop circles descriptions.
desktopStoryStyle.avatarSize      |    ``    | Css size value ('20px, 10em..').Set size of desktop circles.
**playerOptions**                 |   `{}`   | Object. Provides interface for customization of player view.
playerOptions.roundedCorners      |  `true`  | Boolean. Remove or add rounded corners to player element.
playerOptions.shadow              |  `true`  | Boolean. Remove or add shadow to player element.
**stories**                       |   `{}`   | Object. Allow to change content of each stroy circle.
stories[0...n].title              |    ``    | String. Change title text of specific story.
stories[0...n].description        |    ``    | String. Change description text of specific story.
stories[0...n].avatarSrc          |    ``    | String. Avatar URL of specific story.
stories[0...n].titleColor         |    ``    | Any valid css color value (#000, rgb(...), rgba(...)). Set color of specific story title text.
stories[0...n].descriptionColor   |    ``    | Any valid css color value (#000, rgb(...), rgba(...)). Set color of specific story description text.

# MobileModule Constructor

Function which create **mobile** module layout with already embedded player. Getting options which allow to customize layout. Doesn't return any interface. 

## Create
```html
<head>
  <link href="https://unpkg.com/@gobistories/gobi-web-integration/dist/gobi-web-integration.css" rel="stylesheet">
  <script src="https://unpkg.com/@gobistories/gobi-web-integration/dist/gobi-web-integration.js"></script>
</head>
<body>
  <div id="container"></div>
  <script>
        new gobi.MobileModule({
          moduleId: 'some-modul-id',
          container: document.getElementById('container'),
        });
  </script>
</body>
```
## Options

option                            | default  | description
----------------------------------| -------- | -----------
moduleId                          |          | **Required.** String. The id of the module.
container                         |          | **Required.** HTMLElement. Container where the module will be embed.
title                             |    ``    | String. Module title.
color                             |`#15d6ea` | Any valid css color value (#000, rgb(...), rgba(...)). The color of border of story circle.
**playerOptions**                 |   `{}`   | Object. Provides interface for customization of player view.
playerOptions.roundedCorners      |  `true`  | Boolean. Remove or add rounded corners to player element.
playerOptions.shadow              |  `true`  | Boolean. Remove or add shadow to player element.
**stories**                       |   `{}`   | Object. Allow to change content of each stroy circle.
stories[0...n].title              |    ``    | String. Change title text of specific story.
stories[0...n].description        |    ``    | String. Change description text of specific story.
stories[0...n].avatarSrc          |    ``    | String. Avatar URL of specific story.
stories[0...n].titleColor         |    ``    | Any valid css color value (#000, rgb(...), rgba(...)). Set color of specific story title text.
stories[0...n].descriptionColor   |    ``    | Any valid css color value (#000, rgb(...), rgba(...)). Set color of specific story description text.

# Player Constructor

Function which create and return interface for managing and listening to events of Player.

## Create
```html
<head>
  <link href="https://unpkg.com/@gobistories/gobi-web-integration/dist/gobi-web-integration.css" rel="stylesheet">
  <script src="https://unpkg.com/@gobistories/gobi-web-integration/dist/gobi-web-integration.js"></script>
</head>
<body>
  <div id="player-container"></div>
  <script>
        var player = new gobi.Player({
          container: document.getElementById('player-container'),
          storyName: 'story-id'
        });
        player.on('play', function() {
            console.log('played the video!');
        });
  </script>
</body>
```

## Options
option             | default | description
-------------------| ------- | -----------
storyName          |         | **Required.** String. The id of the story.
container          |         | HTMLElement. Container where the player will be embed.
autoStart          | `false` | Boolean. Add `autoplay` and `mute` attributes to video.
loop               | `false` | Boolean. Add `loop` attributes to video.
hideOverlay        | `false` | Boolean. Hide play button and gobi logo.
roundedCorners     |  `true` | Boolean. Remove or add rounded corners to player element.
shadow             |  `true` | Boolean. Remove or add rounded corners to player element.
width              |  `612`  | Number. Set player width. If height option is not defined it will calculate automaticaly depending on aspect ration 16:9.
height             |  `1088`  | Number. Set player height. If width option is not defined it will calculate automaticaly depending on aspect ration 16:9.
checkViewPort      | `true`  | Boolean. Enable functionality which pause player if it outside of screen view area.

## Methods
You can call methods on the player by calling the function on the Player object:
```js
player.play();
```
#### play():void
Play the video if it’s paused. **Note:** In new browsers, there is an autoplay policy that does not allow play video with sound without user interaction.
```js
player.play();
```
#### pause():void
Pause the video if it’s playing.
```js
 player.pause();
```
#### reload():void
Reload player video.
```js
 player.reload();
```
#### setMute(flag:boolean):void
Enable or disable mute.
```js
 player.setMute(true); 
 //or
 player.setMute(false);
```
#### isInViewport():boolean
Return `true` if player is inside of screen view area.
```js
 if (player.isInViewport()) {
     alert('player is visible')
 }
 else {
     alert('player is outside of screen')
 }
```
#### on(event:string, callback:(data:any) => void):void
Add an event listener for the specified event. Will call the callback with a single parameter, `data`, that contains the data for that event.
```js
var onPlay = function(data) {
    // data is an object containing properties specific to that event
};
player.on('play', onPlay);
```
### off(event?:string, callback?:() => void): void
Remove an event listener for the specified event. Will remove all listeners for that event if a `callback` isn’t passed or only that specific callback if it is passed or all listeners from all events if any of params aren't passed.
```js
var onPlay = function(data) {
    // data is an object containing properties specific to that event
};
player.on('play', onPlay);
// If later on you decide that you don’t need to listen for play anymore.
player.off('play', onPlay);
// `off` can be called with just the event name to remove all listeners.
player.off('play');
// remove all listeners from all events.
player.off();
```
## Events
You can listen for events in the player by attaching a callback using .on():
```js
player.on('eventName', function(data) {
    // data is an object containing properties specific to that event
});
```

The events are equivalent to the HTML5 video events (except for `cuechange`,
which is slightly different).

To remove a listener, call `.off()` with the callback function:

```js
var callback = function() {};

player.off('eventName', callback);
```
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
undefined
```
#### error
Triggered when video error is generated in the player.
callback data:
```js
error:MediaError
```
#### backToChunk
Triggered when user tap on back button.
callback data:
```js
chunInd:0...n
```
#### skipChunk
Triggered when user skipped some video of current story by tap on player.
callback data:
```js
chunInd:0...n
```
#### chunkChange
Triggered each time when one of story videos was changed to another. Does not metter, by user tapping on back or skip buttons or automaticaly .
callback data:
```js
chunInd:0...n
```
#### newIteration
Triggered when `loop` flag is set and story start to play one more time
```js
undefined
```

## Examples

#### Response palyer 
Provides a class to resize the player according it parent element.
```html
<body>
  <style>
    .responsive-player {
        position: relative;
        display: block;
        width: 100%;
    }
    .responsive-player:before {
        content: '';
        display: block;
        width: 100%;
        /* 177.7777% = 16/9 * 100%;  The ratio of height to width of the video. Video aspect ratio always 9:16*/
        padding-top: 177.7777%;
    }
    .responsive-player iframe {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
     }
  </style>
  <div style="max-width: 350px"> 
    <div id="player-container" class="responsive-player"></div>
  <div>
  
  <script>
        var player = new gobi.Player({
          container: document.getElementById('player-container'),
          storyName: 'story-id'
        });
        player.on('play', function() {
            console.log('played the video!');
        });
  </script>
</body>
```

Also by adding a rule to the main class, you can guarantee that the height of the player will always be no more than the height of the screen.
```css
    .responsive-player {
        position: relative;
        display: block;
        width: 100%;
        /* 56.25vh = 100vh / (16 / 19) */
        max-width: 56.25vh;
    }
```
