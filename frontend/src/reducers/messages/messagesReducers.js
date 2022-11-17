import list from 'reducers/messages/messagesListReducers';
import form from 'reducers/messages/messagesFormReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  form,
});
