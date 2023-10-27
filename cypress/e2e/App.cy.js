/* globals cy */

describe('Test App', () => {

  it('launches', () => {
    cy.visit('/');
  });

  it('opens with CS Courses for 2018-2019', () => {
    cy.visit('/');
    cy.get('[data-cy=course]').should('contain', 'CS Courses for 2018-2019');
  });

  it('shows Winter courses when Winter is selected', () => {
    cy.visit('/');
    cy.get('[data-cy=Winter]').click();
    cy.get('[data-cy=course]').should('contain', 'Winter');
  });
});