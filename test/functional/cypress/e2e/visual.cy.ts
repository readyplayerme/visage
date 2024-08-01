const VISUAL_TEST_CONFIG = Object.freeze({
  zoomLevel: {
    head: 0.5,
    body: 3.0
  },
  testUrl: 'http://localhost:3000/test',
  modelUrl: 'https://api.readyplayer.dev/v3/avatars/65f82db95462c113fe5c5bb6.glb'
});

function compareSnapshot(zoomLevel: number) {
  cy.visit(
    `${VISUAL_TEST_CONFIG.testUrl}/?modelUrl=${encodeURIComponent(VISUAL_TEST_CONFIG.modelUrl)}&zoomLevel=${zoomLevel}`
  );

  cy.intercept(VISUAL_TEST_CONFIG.modelUrl).as('modelDownloading');
  cy.wait('@modelDownloading');

  cy.wait(2000);
  cy.compareSnapshot(`avatar-zoom-${zoomLevel}`);
}

describe('visual', () => {
  it('compares avatar body snapshot', () => {
    compareSnapshot(VISUAL_TEST_CONFIG.zoomLevel.body);
  });
  it('compares avatar head snapshot', () => {
    compareSnapshot(VISUAL_TEST_CONFIG.zoomLevel.head);
  });
});
