import axios from 'axios';
import Errors from 'components/FormItems/error/errors';
import { push } from 'connected-react-router';
import { doInit } from 'actions/auth';
import { showSnackbar } from '../../components/Snackbar';

const actions = {
  doNew: () => {
    return {
      type: 'GOAL_CATEGORIES_FORM_RESET',
    };
  },

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: 'GOAL_CATEGORIES_FORM_FIND_STARTED',
      });

      axios.get(`/goal_categories/${id}`).then((res) => {
        const record = res.data;

        dispatch({
          type: 'GOAL_CATEGORIES_FORM_FIND_SUCCESS',
          payload: record,
        });
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'GOAL_CATEGORIES_FORM_FIND_ERROR',
      });

      dispatch(push('/admin/goal_categories'));
    }
  },

  doCreate: (values) => async (dispatch) => {
    try {
      dispatch({
        type: 'GOAL_CATEGORIES_FORM_CREATE_STARTED',
      });

      axios.post('/goal_categories', { data: values }).then((res) => {
        dispatch({
          type: 'GOAL_CATEGORIES_FORM_CREATE_SUCCESS',
        });
        showSnackbar({ type: 'success', message: 'Goal_categories created' });
        dispatch(push('/admin/goal_categories'));
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'GOAL_CATEGORIES_FORM_CREATE_ERROR',
      });
    }
  },

  doUpdate: (id, values, isProfile) => async (dispatch, getState) => {
    try {
      dispatch({
        type: 'GOAL_CATEGORIES_FORM_UPDATE_STARTED',
      });

      await axios.put(`/goal_categories/${id}`, { id, data: values });

      dispatch(doInit());

      dispatch({
        type: 'GOAL_CATEGORIES_FORM_UPDATE_SUCCESS',
      });

      if (isProfile) {
        showSnackbar({ type: 'success', message: 'Profile updated' });
      } else {
        showSnackbar({ type: 'success', message: 'Goal_categories updated' });
        dispatch(push('/admin/goal_categories'));
      }
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'GOAL_CATEGORIES_FORM_UPDATE_ERROR',
      });
    }
  },
};

export default actions;
