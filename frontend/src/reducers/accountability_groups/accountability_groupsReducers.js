import list from 'reducers/accountability_groups/accountability_groupsListReducers';
import form from 'reducers/accountability_groups/accountability_groupsFormReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  form,
});
