import list from 'reducers/goal_categories/goal_categoriesListReducers';
import form from 'reducers/goal_categories/goal_categoriesFormReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  form,
});
