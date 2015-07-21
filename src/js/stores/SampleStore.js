const AppDispatcher = require('../dispatcher/AppDispatcher');
const Constants = require('../constants/AppConstants');
const BaseStore = require('./BaseStore');
const assign = require('object-assign');
const _ = require('lodash');

let SampleStore = assign({}, BaseStore, {

	dispatcherIndex: AppDispatcher.register(function(payload) {
		let action = payload.action;

		switch(action.type) {
			case Constants.ActionTypes.SAMPLE_ACTION:
				console.log('an action. wow');
				SampleStore.emitChange();
				break;
			case Constants.ActionTypes.ANOTHER_ACTION:
				console.log('a different action. whoa');
				SampleStore.emitChange();
				break;
			}
		})

});

module.exports = SampleStore;