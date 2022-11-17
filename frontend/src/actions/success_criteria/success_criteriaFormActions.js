import axios from 'axios';
import Errors from 'components/FormItems/error/errors';
import { push } from 'connected-react-router';
import { doInit } from 'actions/auth';
import { showSnackbar } from '../../components/Snackbar';

const actions = {
  doNew: () => {
    return {
      type: 'SUCCESS_CRITERIA_FORM_RESET',
    };
  },

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: 'SUCCESS_CRITERIA_FORM_FIND_STARTED',
      });

      axios.get(`/success_criteria/${id}`).then((res) => {
        const record = res.data;

        dispatch({
          type: 'SUCCESS_CRITERIA_FORM_FIND_SUCCESS',
          payload: record,
        });
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'SUCCESS_CRITERIA_FORM_FIND_ERROR',
      });

      dispatch(push('/admin/success_criteria'));
    }
  },

  doCreate: (values) => async (dispatch) => {
    try {
      dispatch({
        type: 'SUCCESS_CRITERIA_FORM_CREATE_STARTED',
      });

      axios.post('/success_criteria', { data: values }).then((res) => {
        dispatch({
          type: 'SUCCESS_CRITERIA_FORM_CREATE_SUCCESS',
        });
        showSnackbar({ type: 'success', message: 'Success_criteria created' });
        dispatch(push('/admin/success_criteria'));
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'SUCCESS_CRITERIA_FORM_CREATE_ERROR',
      });
    }
  },

  doUpdate: (id, values, isProfile) => async (dispatch, getState) => {
    try {
      dispatch({
        type: 'SUCCESS_CRITERIA_FORM_UPDATE_STARTED',
      });

      await axios.put(`/success_criteria/${id}`, { id, data: values });

      dispatch(doInit());

      dispatch({
        type: 'SUCCESS_CRITERIA_FORM_UPDATE_SUCCESS',
      });

      if (isProfile) {
        showSnackbar({ type: 'success', message: 'Profile updated' });
      } else {
        showSnackbar({ type: 'success', message: 'Success_criteria updated' });
        dispatch(push('/admin/success_criteria'));
      }
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'SUCCESS_CRITERIA_FORM_UPDATE_ERROR',
      });
    }
  },
};

export default actions;
