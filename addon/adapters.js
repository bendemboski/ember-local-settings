import Cookie from './adapters/cookie';
import LocalMemory from './adapters/local-memory';
import LocalStorage from './adapters/local-storage';
import SessionStorage from './adapters/session-storage';

export default {
  cookie: Cookie,
  'local-memory': LocalMemory,
  'local-storage': LocalStorage,
  'session-storage': SessionStorage,
};
