import LoginPage from "./applications/loginPage"
import HomePage from "./applications/homePage";

/**
 * This class encapsulates all pages related to the application, except the basePage, as it's not meant to be directly called.
 * 
 * By using this Application class, there is no need to import and create objects for each individual page, you can simply call this class instead.
 *
 * Any new pages related to the application should be added here, so they can be used.
 */
class Application {
	constructor() {
		this.loginPage = new LoginPage();
        this.homePage =  new HomePage();
	}
}

export default Application