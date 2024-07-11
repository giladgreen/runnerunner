// import {} from 'jest-specific-snapshot';
import * as nock from 'nock';

// disabling all http requests.
nock.disableNetConnect();
// Allow localhost connections, so we can test local routes and mock servers.
nock.enableNetConnect('127.0.0.1');
