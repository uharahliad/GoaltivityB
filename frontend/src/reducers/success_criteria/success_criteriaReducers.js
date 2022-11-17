import list from 'reducers/success_criteria/success_criteriaListReducers';
import form from 'reducers/success_criteria/success_criteriaFormReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  form,
});
