var React = require('react');


var HelloWorld = require('./components/HelloWorld.jsx');


React.render(
	<div><HelloWorld name={'World'}/></div>,
	document.getElementById('container')
);