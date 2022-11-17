import list from 'reducers/action_items/action_itemsListReducers';
import form from 'reducers/action_items/action_itemsFormReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  form,
});
