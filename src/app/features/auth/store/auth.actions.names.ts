import { ActionNamesHelper } from '../../../../helpers/action-names.helper';

const actionNamesHelper = new ActionNamesHelper('Auth');

const LOGIN = actionNamesHelper.getName('Login');
const LOGIN_STARTED = actionNamesHelper.getStartedName(LOGIN);
const LOGIN_COMPLETED = actionNamesHelper.getCompletedName(LOGIN);
const LOGIN_FAILED = actionNamesHelper.getFailedName(LOGIN);

export const AUTH_ACTION_NAMES = {
    LOGIN,
    LOGIN_STARTED,
    LOGIN_COMPLETED,
    LOGIN_FAILED
};