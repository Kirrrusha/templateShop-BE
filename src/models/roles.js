const AccessControl = require('accesscontrol');
let grantsObject = {
  supervisor: {
    profile: {
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
    }
  }
};

const roles = new AccessControl(grantsObject);

exports.roles = roles;
