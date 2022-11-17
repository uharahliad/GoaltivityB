import axios from 'axios';
import Errors from 'components/FormItems/error/errors';
import { push } from 'connected-react-router';
import { doInit } from 'actions/auth';
import { showSnackbar } from '../../components/Snackbar';

const actions = {
  doNew: () => {
    return {
      type: 'GOALS_FORM_RESET',
    };
  },

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: 'GOALS_FORM_FIND_STARTED',
      });

      axios.get(`/goals/${id}`).then((res) => {
        const record = res.data;

        dispatch({
          type: 'GOALS_FORM_FIND_SUCCESS',
          payload: record,
        });
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'GOALS_FORM_FIND_ERROR',
      });

      dispatch(push('/admin/goals'));
    }
  },

  doCreate: (values) => async (dispatch) => {
    try {
      dispatch({
        type: 'GOALS_FORM_CREATE_STARTED',
      });

      axios.post('/goals', { data: values }).then((res) => {
        dispatch({
          type: 'GOALS_FORM_CREATE_SUCCESS',
        });
        showSnackbar({ type: 'success', message: 'Goals created' });
        dispatch(push('/admin/goals'));
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'GOALS_FORM_CREATE_ERROR',
      });
    }
  },

  doUpdate: (id, values, isProfile) => async (dispatch, getState) => {
    try {
      dispatch({
        type: 'GOALS_FORM_UPDATE_STARTED',
      });

      await axios.put(`/goals/${id}`, { id, data: values });

      dispatch(doInit());

      dispatch({
        type: 'GOALS_FORM_UPDATE_SUCCESS',
      });

      if (isProfile) {
        showSnackbar({ type: 'success', message: 'Profile updated' });
      } else {
        showSnackbar({ type: 'success', message: 'Goals updated' });
        dispatch(push('/admin/goals'));
      }
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'GOALS_FORM_UPDATE_ERROR',
      });
    }
  },
};

export default actions;
