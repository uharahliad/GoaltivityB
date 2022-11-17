const accountability_groupsFields = {
  id: { type: 'id', label: 'ID' },

  name: {
    type: 'string',
    label: 'Name',

    options: [{ value: 'value', label: 'value' }],
  },

  users: {
    type: 'relation_many',
    label: 'Users',

    options: [{ value: 'value', label: 'value' }],
  },
};

export default accountability_groupsFields;
