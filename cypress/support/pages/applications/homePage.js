import BasePage from "../basePage"
import new_parameters from "../../../fixtures/new_parameters.json"

const selectors = {
  chart_points: 'g[fill="rgba(0,0,0,0)"] > [cursor="pointer"]',
  table_menu: '[aria-haspopup="dialog"]',
  order_search: 'input[id*="column_header_search"]',
  tbcell_quantity: 'td[class="a-GV-cell u-tE"]',
  tbcell_customer: 'td[class="a-GV-cell u-tS"]',
  tbcell_customer_button: 'button[class="a-Button a-Button--popupLOV"]',
  search_customer: 'input[aria-label="Search"]',
  select_customer: 'li[data-id="1"]',
  save_button: "button[onclick=\"apex.submit({request:'Save',validate:true});\"]"
}

class HomePage extends BasePage {
  /**
   * Retrieves the initial values from the chart and stores them in a list.
   * The chart elements are hovered to make the aria-label attribute visible,
   * then the attribute value is extracted using regex patterns to find the value and name.
   * 
   * @returns {Array} The list of chart values with their corresponding names.
   */
  getChartValues() {
    let list = []

    // Wait for the chart to finish loading
    cy.wait(5000)

    // Retrieves elements matching the chart points selector and iterate over each of them
    cy.get(selectors.chart_points).each(($element) => {
      cy.wrap($element)
        .wait(200)
        .trigger("mouseover", { force: true, wait:3000}) // Triggers a change in the element to make aria-label visible
        .invoke("attr", "aria-label") // Retrieves the aria-label attribute value of the chart element
        .then((attributeValue) => {

          // This regex finds an integer number in the aria-label text
          const matches = String(attributeValue).match(/(\d+)/)
          const value = matches ? matches[0] : null
          
          const match_names = String(attributeValue).match(/Series: ([^;]+)/)
          const value_name = match_names ? match_names[1] : null

          list.push({ name: value_name.toString(), value: value.toString() }) // Saves data in the list
        })
    })
    cy.log("List: ", list)
    return list
  }

  /**
   * Changes the quantity of a specified order, then validates if the change was reflected in the table and the chart.
   */
  changeQuantity() {
    // Gets the chart values and stores them in the "@ariaLabel" alias.
    cy.wrap(this.getChartValues()).as("ariaLabel")

    // Filters the table by order number
    this.filterByOrderNumber(selectors.table_menu, selectors.order_search)

    // Double clicks on the cell in the table to edit the quantity
    cy.get(selectors.tbcell_quantity)
      .dblclick()
      .wait(500)
      .type(new_parameters.new_quantity) // Types the new quantity from the "new_parameters" fixture into the input field

    // Focus on save button to garantee the input will be registered
    cy.get(selectors.save_button).focus()

    // Saves new value
    cy.get(selectors.save_button).click().wait(1000)

    // Asserts if the value was saved correctly in the table cell by comparing it to the "new_parameters.new_quantity" value
    cy.get(selectors.tbcell_quantity).should("have.text", new_parameters.new_quantity)

    // Gets the chart points and iterates over each element
    cy.get(selectors.chart_points).each(($element, index) => {

      /**
       *  Compares the index of the order to the index in the chart (adjusted by subtracting 1 to account for zero-based indexing).
       *  If the index matches, triggers a mouseover event on the element to update its data. 
       */     
      if (index === new_parameters.order_number - 1) {
        cy.wrap($element)
          .wait(100)
          .trigger("mouseover", { force: true })
          // Asserts if the element in the chart was updated to the "new_parameters.new_quantity" value by checking its "aria-label" attribute.
          .invoke("attr", "aria-label").should('contain', `Value: ${new_parameters.new_quantity}`)
      }
    })
  }

  /**
   * Changes the customer of a specified order, then validates if the change was reflected in the table and the chart.
   */
  changeCustomer() {
    // Filters the table by order number
    this.filterByOrderNumber(selectors.table_menu, selectors.order_search)

    // Gets the text of the current customer from the table cell.
    let oldCustomertxt
    cy.get(selectors.tbcell_customer).invoke('text').then(text=>{
      oldCustomertxt = text
    })
      
    // Double clicks on the cell in the table to make the customer selection button visible
    cy.get(selectors.tbcell_customer).dblclick()
    
    // Clicks the button and opens the search div
    cy.get(selectors.tbcell_customer_button).click()

    // Searches for the new customer in the search dialog and selects it
    cy.get(selectors.search_customer).click()
      .type(new_parameters.new_customer).type("{enter}")
      .wait(1000)
    cy.get(selectors.select_customer).click()

    // Focus on save button to garantee the input will be registered
    cy.get(selectors.save_button).focus()
    
    // Saves the new value
    cy.get(selectors.save_button).click().wait(5000)

    // Asserts if the value was saved correctly in the table cell by comparing it to the "new_parameters.new_customer" value
    cy.get(selectors.tbcell_customer).should("have.text", new_parameters.new_customer)
    
    // Reloads the page and waits for 5000 milliseconds.
    cy.reload()
    cy.wait(5000)

    // Gets the updated chart values and stores them in the "@ariaLabel1" alias.
    cy.wrap(this.getChartValues()).as("ariaLabelUpdated")
    
    // Compares the values between the original chart values and the updated chart values.
    cy.get('@ariaLabel').each((json, index)=>{
      cy.get('@ariaLabelUpdated').then((json1)=>{
        if(json.value != json1[index].value || (json.value == 0 && json1[index].value==0)){
          
          // Validates the new customer passed by the fixture
          if(json.name == new_parameters.new_customer){
            let val = Math.max(json1[index].value, json.value) - Math.min(json1[index].value, json.value)
            cy.log('Valida a alteração dos valores adicionados na nova loja')
            expect(String(val)).eq(new_parameters.new_quantity)
            }
            //loja que foi removida o valor 
            if(String(json1[index].name) === oldCustomertxt ){
              cy.log('Valida a alteração dos valores na loja antiga ')
              expect(String(json1[index].value)).eq('0')
            }
        }     
      })
    })
  }

}

export default HomePage