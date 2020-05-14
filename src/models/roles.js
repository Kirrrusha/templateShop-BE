const AccessControl = require('accesscontrol');
let grantsObject = {
  supervisor: {
    profile: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*']
    },
    product: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*']
    },
    category: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*']
    },
    checkout: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*']
    },
    comments: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*']
    },
    manufacturer: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*']
    },
    page: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*']
    },
    widget: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*']
    }
  },
  basic: {
    profile: {
      'create:own': ['*'],
      'read:own': ['*'],
      'update:own': ['*']
    },
    product: {
      'read:own': ['*']
    },
    category: {
      'read:own': ['*']
    },
    checkout: {
      'read:own': ['*']
    },
    comments: {
      'create:own': ['*'],
      'update:own': ['*'],
      'read:own': ['*']
    },
    manufacturer: {
      'read:own': ['*']
    },
    page: {
      'read:own': ['*']
    },
    widget: {
      'read:own': ['*']
    }
  }
};

const roles = new AccessControl(grantsObject);

exports.roles = roles;
