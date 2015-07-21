var React = require('react');
var SampleStore = require('../stores/SampleStore');

var HelloWorld = React.createClass({
	getInitialState: function() {
        return {exclaim: true};
    },
	// hook up to the store
    componentDidMount: function() {
        SampleStore.addChangeListener(this._onChange);
    },
    // clean up after ourself
    componentWillUnmount: function() {
        SampleStore.removeChangeListener(this._onChange);
    },
	render: function(){
		return <div>Hello {this.props.name}{this.state.exclaim ? '!!!!' : '' }</div>
	},
	_onChange: function() {
        //this.setState({change: SampleStore.getFromApiOrSomething()});
    }
});

module.exports = HelloWorld;