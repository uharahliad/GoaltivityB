const goalsFields = {
  id: { type: 'id', label: 'ID' },

  name: {
    type: 'string',
    label: 'Name',

    options: [{ value: 'value', label: 'value' }],
  },

  category: {
    type: 'relation_one',
    label: 'Category',

    options: [{ value: 'value', label: 'value' }],
  },

  author: {
    type: 'relation_one',
    label: 'Author',

    options: [{ value: 'value', label: 'value' }],
  },

  award: {
    type: 'string',
    label: 'Award',

    options: [{ value: 'value', label: 'value' }],
  },
};

export default goalsFields;
