import axios from 'axios';
import Errors from 'components/FormItems/error/errors';
import { push } from 'connected-react-router';
import { doInit } from 'actions/auth';
import { showSnackbar } from '../../components/Snackbar';

const actions = {
  doNew: () => {
    return {
      type: 'ACTION_ITEMS_FORM_RESET',
    };
  },

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: 'ACTION_ITEMS_FORM_FIND_STARTED',
      });

      axios.get(`/action_items/${id}`).then((res) => {
        const record = res.data;

        dispatch({
          type: 'ACTION_ITEMS_FORM_FIND_SUCCESS',
          payload: record,
        });
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'ACTION_ITEMS_FORM_FIND_ERROR',
      });

      dispatch(push('/admin/action_items'));
    }
  },

  doCreate: (values) => async (dispatch) => {
    try {
      dispatch({
        type: 'ACTION_ITEMS_FORM_CREATE_STARTED',
      });

      axios.post('/action_items', { data: values }).then((res) => {
        dispatch({
          type: 'ACTION_ITEMS_FORM_CREATE_SUCCESS',
        });
        showSnackbar({ type: 'success', message: 'Action_items created' });
        dispatch(push('/admin/action_items'));
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'ACTION_ITEMS_FORM_CREATE_ERROR',
      });
    }
  },

  doUpdate: (id, values, isProfile) => async (dispatch, getState) => {
    try {
      dispatch({
        type: 'ACTION_ITEMS_FORM_UPDATE_STARTED',
      });

      await axios.put(`/action_items/${id}`, { id, data: values });

      dispatch(doInit());

      dispatch({
        type: 'ACTION_ITEMS_FORM_UPDATE_SUCCESS',
      });

      if (isProfile) {
        showSnackbar({ type: 'success', message: 'Profile updated' });
      } else {
        showSnackbar({ type: 'success', message: 'Action_items updated' });
        dispatch(push('/admin/action_items'));
      }
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'ACTION_ITEMS_FORM_UPDATE_ERROR',
      });
    }
  },
};

export default actions;
