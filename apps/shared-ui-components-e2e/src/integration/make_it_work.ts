describe('MakeItWork', () => {
  beforeEach(() => cy.visit('/iframe.html'));

  it('should test anything', () => {
    expect(1).to.equal(1);
  });
});
