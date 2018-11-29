describe("posting entry", ()=>{
  it (" makes post from text that is typed", () =>{
    cy.get ("input[name=title]")
      .type('test entry'),
    cy.get("input[name=text]")
      .type('This is my first test entry! It is very exciting.'),
    cy.get("#user-input button[type=submit]")
      .click()
  })
})