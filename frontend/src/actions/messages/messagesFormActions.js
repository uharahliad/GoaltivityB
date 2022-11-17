import axios from 'axios';
import Errors from 'components/FormItems/error/errors';
import { push } from 'connected-react-router';
import { doInit } from 'actions/auth';
import { showSnackbar } from '../../components/Snackbar';

const actions = {
  doNew: () => {
    return {
      type: 'MESSAGES_FORM_RESET',
    };
  },

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: 'MESSAGES_FORM_FIND_STARTED',
      });

      axios.get(`/messages/${id}`).then((res) => {
        const record = res.data;

        dispatch({
          type: 'MESSAGES_FORM_FIND_SUCCESS',
          payload: record,
        });
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'MESSAGES_FORM_FIND_ERROR',
      });

      dispatch(push('/admin/messages'));
    }
  },

  doCreate: (values) => async (dispatch) => {
    try {
      dispatch({
        type: 'MESSAGES_FORM_CREATE_STARTED',
      });

      axios.post('/messages', { data: values }).then((res) => {
        dispatch({
          type: 'MESSAGES_FORM_CREATE_SUCCESS',
        });
        showSnackbar({ type: 'success', message: 'Messages created' });
        dispatch(push('/admin/messages'));
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'MESSAGES_FORM_CREATE_ERROR',
      });
    }
  },

  doUpdate: (id, values, isProfile) => async (dispatch, getState) => {
    try {
      dispatch({
        type: 'MESSAGES_FORM_UPDATE_STARTED',
      });

      await axios.put(`/messages/${id}`, { id, data: values });

      dispatch(doInit());

      dispatch({
        type: 'MESSAGES_FORM_UPDATE_SUCCESS',
      });

      if (isProfile) {
        showSnackbar({ type: 'success', message: 'Profile updated' });
      } else {
        showSnackbar({ type: 'success', message: 'Messages updated' });
        dispatch(push('/admin/messages'));
      }
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'MESSAGES_FORM_UPDATE_ERROR',
      });
    }
  },
};

export default actions;
