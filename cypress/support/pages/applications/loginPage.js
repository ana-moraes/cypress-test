import BasePage from '../basePage'

const selectors = {
	user_input:'input[id=P9999_USERNAME]',
    password_input:'input[id=P9999_PASSWORD]',
    login_button: 'div[class="t-Login-buttons"] > button'
}

class LoginPage extends BasePage {
	accessLogin() {
        cy.fixture('user_data').then((data) => {
            cy.get(selectors.user_input).type(data.user_name)
            cy.get(selectors.password_input).type(data.password)
        })
        cy.get(selectors.login_button).click()
    }
}

export default LoginPage