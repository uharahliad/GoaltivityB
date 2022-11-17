const messagesFields = {
  id: { type: 'id', label: 'ID' },

  text: {
    type: 'string',
    label: 'Text',

    options: [{ value: 'value', label: 'value' }],
  },

  author: {
    type: 'relation_one',
    label: 'Author',

    options: [{ value: 'value', label: 'value' }],
  },

  group: {
    type: 'relation_one',
    label: 'Group',

    options: [{ value: 'value', label: 'value' }],
  },
};

export default messagesFields;
