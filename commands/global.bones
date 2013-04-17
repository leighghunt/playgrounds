Bones.Command.options['secret'] = {
    'description': 'This is very secret',
    'default': 'Thisisverysecret'
};

Bones.Command.options['adminEmail'] = {
    'title': 'adminEmail=[email]',
    'description': 'Email address used to send administrative emails.',
    'default': 'test@example.com'
};

Bones.Command.options['passwordResetSubject'] = {
    'title': 'passwordResetSubject=[subject]',
    'description': 'Subject used for password reset emails.',
    'default': 'Your password reset request'
};

Bones.Command.options['passwordResetTimeout'] = {
    'title': 'passwordResetTimeout=[seconds]',
    'description': 'The time that token login links remain valid.',
    'default': 86400
};

commands['start'].options.adminParty = {
    'shortcut': 'a',
    'description': 'Enable admin mode.',
    'default': false
};

