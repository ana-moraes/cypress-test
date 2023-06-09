import new_parameters from "../../fixtures/new_parameters.json";

class BasePage {
    /**
     * Filters the table by the specified order number.
     * 
     * @param {string} table_menu - The selector for the table menu element.
     * @param {string} order_search - The selector for the order search input.
     */
    filterByOrderNumber(table_menu, order_search) {
        // Selects the table menu element that contains the text "Order" (the header for filtering by order number)
        cy.get(table_menu).contains("Order").click();
        // Types the order number from the new_parameters fixture into the order search input
        cy.get(order_search).type(new_parameters.order_number).type('{enter}').wait(1000);
    }
}

export default BasePage;