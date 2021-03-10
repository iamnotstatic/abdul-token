async function shouldThrow(promise) {
  try {
    await promise;
    assert(true);
  } catch (err) {
    return;
  }
  assert(false, 'The contract did not throw.');
}

async function expectEvent(promise, event) {
  try {
    let result = await promise;
    for (var i = 0; i < result.logs.length; i++) {
      var log = result.logs[i];
      if (log.event === event) {
        return; // Found the event, return!
      }
    }
  } catch (err) {
    assert(false, 'Exception thrown when not expected');
  }
  assert(false, 'Expected ' + event + ' event not fired');
}

module.exports = {
  shouldThrow,
  expectEvent
};
