import React, { useState, useEffect } from 'react';
import Accountability_groupsForm from 'pages/CRUD/Accountability_groups/form/Accountability_groupsForm';
import { push } from 'connected-react-router';
import actions from 'actions/accountability_groups/accountability_groupsFormActions';
import { connect } from 'react-redux';

const Accountability_groupsFormPage = (props) => {
  const { dispatch, match, saveLoading, findLoading, record, currentUser } =
    props;

  const [dispatched, setDispatched] = useState(false);

  const isEditing = () => {
    return !!match.params.id;
  };

  const isProfile = () => {
    return match.url === '/app/profile';
  };

  const doSubmit = (id, data) => {
    if (isEditing() || isProfile()) {
      dispatch(actions.doUpdate(id, data, isProfile()));
    } else {
      dispatch(actions.doCreate(data));
    }
  };

  useEffect(() => {
    if (isEditing()) {
      dispatch(actions.doFind(match.params.id));
    } else {
      if (isProfile()) {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const currentUserId = currentUser.user.id;
        dispatch(actions.doFind(currentUserId));
      } else {
        dispatch(actions.doNew());
      }
    }
    setDispatched(true);
  }, [match, dispatch]);

  return (
    <React.Fragment>
      {dispatched && (
        <Accountability_groupsForm
          saveLoading={saveLoading}
          findLoading={findLoading}
          currentUser={currentUser}
          record={isEditing() || isProfile() ? record : {}}
          isEditing={isEditing()}
          isProfile={isProfile()}
          onSubmit={doSubmit}
          onCancel={() => dispatch(push('/admin/accountability_groups'))}
        />
      )}
    </React.Fragment>
  );
};

function mapStateToProps(store) {
  return {
    findLoading: store.accountability_groups.form.findLoading,
    saveLoading: store.accountability_groups.form.saveLoading,
    record: store.accountability_groups.form.record,
    currentUser: store.auth.currentUser,
  };
}

export default connect(mapStateToProps)(Accountability_groupsFormPage);
