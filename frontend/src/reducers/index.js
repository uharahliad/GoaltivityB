import auth from 'reducers/auth';
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import users from 'reducers/users/usersReducers';

import goals from 'reducers/goals/goalsReducers';

import goal_categories from 'reducers/goal_categories/goal_categoriesReducers';

import success_criteria from 'reducers/success_criteria/success_criteriaReducers';

import action_items from 'reducers/action_items/action_itemsReducers';

import accountability_groups from 'reducers/accountability_groups/accountability_groupsReducers';

import messages from 'reducers/messages/messagesReducers';

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    auth,

    users,

    goals,

    goal_categories,

    success_criteria,

    action_items,

    accountability_groups,

    messages,
  });
