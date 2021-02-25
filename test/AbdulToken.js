const AbdulToken = artifacts.require('AbdulToken');
const { shouldThrow } = require('./utils');

contract(AbdulToken, async (accounts) => {
  const [ initialHolder, recipient, anotherAccount ] = accounts;

  const name = 'Abdul Token';
  const symbol = 'ALT';
  const initialSupply = 500;

  beforeEach(async () => {
    this.token = await AbdulToken.new(initialSupply);
  });

  it('has a name', async () => {
    expect(await this.token.name()).to.equal(name);
  });

  it('has a symbol', async () => {
    expect(await this.token.symbol()).to.equal(symbol);
  });

  it('approves delegated transfer', async () => {
    // Approve account to spend 100 tokens from account
    const response = await this.token.approve.call(initialHolder, 100, {
      from: accounts[0],
    });
    assert.equal(response, true);

    // Sending invalid account for approval
    await shouldThrow(this.token.approve.call(0, 100, { from: initialHolder }));
  });

  it('handles delegated token transfers', async () => {
    const status = await this.token.transfer.call(recipient, 50, {
      from: initialHolder,
    });
    assert.equal(status, true);

    // Transferring amount larger than your balance
    await shouldThrow(
      this.token.transfer.call(recipient, 1000, { from: initialHolder })
    );

    // Try transferring something larger than the approved amount
    await shouldThrow(
      this.token.transferFrom.call(initialHolder, anotherAccount, 1000, {
        from: recipient,
      })
    );

    // Check balance of address
    const balanceStatus = await this.token.balanceOf.call(initialHolder);
    assert.equal(balanceStatus, 500);

    // Check for allowance balance
    const allowanceStatus = await this.token.allowance.call(
      initialHolder,
      recipient
    );
    assert.equal(allowanceStatus, 0);
  });

  describe('mint', () => {

    it('reject user that is not owner', async () => {
        await shouldThrow(this.token.mint.call(initialHolder, 0, { from: recipient }));
    });

    it('rejects a null account', async () => {
      await shouldThrow(this.token.mint.call(0, 50, { from: initialHolder }));
    });

    describe('for a non zero account', () => { 
        beforeEach('minting', async () => {
        await this.token.mint.call(initialHolder, 50, { from: initialHolder });
        });
    });
    
  });

  describe('burn', () => {

    it('reject user that is not owner', async () => {
        await shouldThrow(this.token.burn.call(initialHolder, 0, { from: recipient }));
    });

    it('rejects a null account', async () => {
      await shouldThrow(this.token.burn.call(0, 50, { from: initialHolder }));
    });

    describe('for a non zero account', () => {
      it('rejects burning more than balance', async () => {
        await shouldThrow(
          this.token.burn.call(recipient, 1000, { from: initialHolder })
        );
      });
    });

    beforeEach('burning', async () => {
      await this.token.burn.call(initialHolder, 50, { from: initialHolder });
    });

  });
});
