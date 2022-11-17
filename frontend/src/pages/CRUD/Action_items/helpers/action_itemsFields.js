const action_itemsFields = {
  id: { type: 'id', label: 'ID' },

  name: {
    type: 'string',
    label: 'Name',

    options: [{ value: 'value', label: 'value' }],
  },

  goal: {
    type: 'relation_one',
    label: 'Goal',

    options: [{ value: 'value', label: 'value' }],
  },

  status: {
    type: 'string',
    label: 'Status',

    options: [{ value: 'value', label: 'value' }],
  },
};

export default action_itemsFields;
