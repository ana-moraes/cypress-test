import Application from "../support/pages/applications"
const application = new Application()

describe('The application', () => {
  it('loads successfully', () => {
    cy.visit('/') // Visits the application
    // Checks URL to see if the application loaded the login page and inputs credentials
    cy.url().should('include', '/login').then(() => {
      application.loginPage.accessLogin()
      application.homePage.changeQuantity()
      application.homePage.changeCustomer()
    })    
  })
})