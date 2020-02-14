const fs = require('fs');
const { assert } = require('chai');
const sinon = require('sinon');
const { getTodoList, writeToTodoList } = require('../lib/fileSystem');

describe('getTodoList', function() {
  let stubbedExists, stubbedRead;

  beforeEach(function() {
    stubbedExists = sinon.stub();
    stubbedRead = sinon.stub();
    sinon.replace(fs, 'existsSync', stubbedExists);
    sinon.replace(fs, 'readFileSync', stubbedRead);
  });

  afterEach(function() {
    sinon.restore();
  });

  it('should get the parsed todo list if it exists', function() {
    stubbedRead.returns(JSON.stringify([{ name: 'hello world' }]));
    stubbedExists.returns(true);
    const todoList = getTodoList();
    assert.deepStrictEqual(todoList, [{ name: 'hello world' }]);
  });

  it('should get an empty array if file does not exists', function() {
    stubbedExists.returns(false);
    const todoList = getTodoList();
    assert.deepStrictEqual(todoList, []);
  });
});

describe('writeToTodoList', function() {
  let stubbedExists, writeSpy, mkDirSpy;

  beforeEach(function() {
    stubbedExists = sinon.stub();
    writeSpy = sinon.spy();
    mkDirSpy = sinon.spy();
    sinon.replace(fs, 'existsSync', stubbedExists);
    sinon.replace(fs, 'writeFileSync', writeSpy);
    sinon.replace(fs, 'mkdirSync', mkDirSpy);
  });

  afterEach(function() {
    sinon.restore();
  });

  it('should write to the file if exists', function() {
    stubbedExists.returns(true);
    writeToTodoList({ todos: 'someText' });
    sinon.assert.notCalled(mkDirSpy);
    sinon.assert.calledWithExactly(
      writeSpy,
      './test/resources/todo.json',
      '"someText"'
    );
  });

  it('should create the directory  before writing to the file', function() {
    stubbedExists.returns(false);
    writeToTodoList({ todos: 'someText' });
    sinon.assert.calledWithExactly(mkDirSpy, './data');
    sinon.assert.calledWithExactly(
      writeSpy,
      './test/resources/todo.json',
      '"someText"'
    );
  });
});
