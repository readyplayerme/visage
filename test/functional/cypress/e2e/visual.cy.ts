describe('visual', () => {
  it('open', () => {
    const MODEL_URL = 'https://api.readyplayer.dev/v3/avatars/65f82db95462c113fe5c5bb6.glb';

    cy.visit(`http://localhost:3000/test/?modelUrl=${encodeURIComponent(MODEL_URL)}`);

    cy.intercept(MODEL_URL).as('modelDownloading');
    cy.wait('@modelDownloading');

    cy.wait(2000);
    cy.compareSnapshot('home-page');
  });
});
