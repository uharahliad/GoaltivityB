import list from 'reducers/goals/goalsListReducers';
import form from 'reducers/goals/goalsFormReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  form,
});
