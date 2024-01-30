# Duckhunt

Simple script enabling you to add ducks on any page.

## Usage

Include `js` and `css` in html:

```html
<link type="text/css" rel="stylesheet" href="duckhunt.css" />
<script type="text/javascript" src="duckHunt.js"></script>
```

Create element to place the container in

```html
<div id="flySpace"></div>
```

Create an instance of the duckhunt

```js
var hunter = Duckhunt.create('flySpace');

// optionally edit some values
hunter.maxDucks = 10;
hunter.duckSpawnDelay = [ 200 /*min*/, 1500 /*max*/]; // in ms
```

## Example

Example can be found [here](https://depuits.github.io/duckhunt/index.html).
