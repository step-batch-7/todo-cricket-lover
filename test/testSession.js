const { assert } = require('chai');
const sinon = require('sinon');
const { Sessions } = require('../lib/sessions');

describe('Session', function() {
  let session;
  beforeEach(function() {
    session = new Sessions();
  });

  context('.createId', function() {
    it('should create the session for the given username', function() {
      const stubbedTime = sinon.stub();
      sinon.replace(Date.prototype, 'getTime', stubbedTime);
      stubbedTime.returns(123);
      const id = session.addSession('anil');
      assert.deepStrictEqual(id, 'anil123');
      sinon.restore();
    });
  });

  context('.deleteUser', function() {
    it('should delete the user from the session', function() {
      assert.isTrue(session.deleteSession('phani'));
    });
  });

  context('.getUser', function() {
    it('should get user from the given session id', function() {
      const stubbedTime = sinon.stub();
      sinon.replace(Date.prototype, 'getTime', stubbedTime);
      stubbedTime.returns(123);
      const id = session.addSession('anil');
      assert.deepStrictEqual(session.getUser(id), 'anil');
    });
  });
});
