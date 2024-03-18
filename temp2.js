import debug from 'debug';
const httpRequestLog = debug('http:request');
const rpcLog = debug('rpc');

httpRequestLog('request');
rpcLog('action');