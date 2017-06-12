import * as r from 'ramda';

export default (ps, obj) => r.map((path) => r.path(path, obj), ps);
