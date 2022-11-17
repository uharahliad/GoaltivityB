import axios from 'axios';
import Errors from 'components/FormItems/error/errors';
import { push } from 'connected-react-router';
import { doInit } from 'actions/auth';
import { showSnackbar } from '../../components/Snackbar';

const actions = {
  doNew: () => {
    return {
      type: 'ACCOUNTABILITY_GROUPS_FORM_RESET',
    };
  },

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: 'ACCOUNTABILITY_GROUPS_FORM_FIND_STARTED',
      });

      axios.get(`/accountability_groups/${id}`).then((res) => {
        const record = res.data;

        dispatch({
          type: 'ACCOUNTABILITY_GROUPS_FORM_FIND_SUCCESS',
          payload: record,
        });
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'ACCOUNTABILITY_GROUPS_FORM_FIND_ERROR',
      });

      dispatch(push('/admin/accountability_groups'));
    }
  },

  doCreate: (values) => async (dispatch) => {
    try {
      dispatch({
        type: 'ACCOUNTABILITY_GROUPS_FORM_CREATE_STARTED',
      });

      axios.post('/accountability_groups', { data: values }).then((res) => {
        dispatch({
          type: 'ACCOUNTABILITY_GROUPS_FORM_CREATE_SUCCESS',
        });
        showSnackbar({
          type: 'success',
          message: 'Accountability_groups created',
        });
        dispatch(push('/admin/accountability_groups'));
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'ACCOUNTABILITY_GROUPS_FORM_CREATE_ERROR',
      });
    }
  },

  doUpdate: (id, values, isProfile) => async (dispatch, getState) => {
    try {
      dispatch({
        type: 'ACCOUNTABILITY_GROUPS_FORM_UPDATE_STARTED',
      });

      await axios.put(`/accountability_groups/${id}`, { id, data: values });

      dispatch(doInit());

      dispatch({
        type: 'ACCOUNTABILITY_GROUPS_FORM_UPDATE_SUCCESS',
      });

      if (isProfile) {
        showSnackbar({ type: 'success', message: 'Profile updated' });
      } else {
        showSnackbar({
          type: 'success',
          message: 'Accountability_groups updated',
        });
        dispatch(push('/admin/accountability_groups'));
      }
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'ACCOUNTABILITY_GROUPS_FORM_UPDATE_ERROR',
      });
    }
  },
};

export default actions;
