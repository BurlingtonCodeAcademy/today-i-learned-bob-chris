describe("page loading", ()=>{
  it ("shows user interface", () =>{
    cy.visit("localhost:5000")
  cy.get("#inputComment")
  cy.get("#inputEntry")

  })
})