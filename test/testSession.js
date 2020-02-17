const { assert } = require('chai');
const sinon = require('sinon');
const { Session } = require('../lib/session');

describe('Session', function() {
  let session;
  beforeEach(function() {
    session = new Session();
  });

  context('.createId', function() {
    it('should create the session for the given username', function() {
      const stubbedTime = sinon.stub();
      sinon.replace(Date.prototype, 'getTime', stubbedTime);
      stubbedTime.returns(123);
      const id = session.addUser('anil');
      assert.deepStrictEqual(id, 'anil123');
      sinon.restore();
    });
  });

  context('.deleteUser', function() {
    it('should delete the user from the session', function() {
      assert.isTrue(session.deleteUser('phani'));
    });
  });

  context('.getUser', function() {
    it('should get user from the given session id', function() {
      const stubbedTime = sinon.stub();
      sinon.replace(Date.prototype, 'getTime', stubbedTime);
      stubbedTime.returns(123);
      const id = session.addUser('anil');
      assert.deepStrictEqual(session.getUser(id), 'anil');
    });
  });
});
