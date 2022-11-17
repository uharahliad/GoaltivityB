const success_criteriaFields = {
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
};

export default success_criteriaFields;
