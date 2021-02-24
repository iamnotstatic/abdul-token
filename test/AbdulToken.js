const AbdulToken = artifacts.require("AbdulToken");


contract(AbdulToken, async accounts => {

    const name = "AbdulToken";
    const symbol = "AT";
    const initialSupply = 500;
    const decimal = 2;


    beforeEach(async () => {
        this.token = await AbdulToken.new(name, symbol, decimal, initialSupply);
    });

    it('has a name', async () => {
        expect(await this.token.name()).to.equal(name);
    });

    it("has a symbol", async () => {
        expect(await this.token.symbol()).to.equal(symbol);
    });

});