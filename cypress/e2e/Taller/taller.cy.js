describe('Agregar nuevas tareas a la lista ', () => {

  before(() => {
    cy.visit('https://example.cypress.io/todo');
    cy.get('.todo-list li').then((list) => {
      if (list.length < 1) {
        const newItem = 'Lavar los Platos'
      cy.get('[data-test=new-todo]').type(`${newItem}{enter}`);
      }
    });
  })
  
  beforeEach(() => {
    cy.visit('https://example.cypress.io/todo')
  })

  after(() => {
    cy.get('.todo-list li').each(($el, index, $list) => {
      cy.wrap($el).parent().find('input[type=checkbox]').check();
    });
    cy.contains('Clear completed').click();
  })

  afterEach(() => {
    cy.window().then((win) => {
      win.close();
    });
  });

  it('Se Agrega una Tarea de forma correcta', () => {
    let initLength = 0
    cy.get('.todo-list li').then((list) => {
      initLength = list.length;
      console.log(list.length);
    });
    const newItem = 'Lavar los Platos'
    cy.get('[data-test=new-todo]').type(`${newItem}{enter}`);
    cy.get('.todo-list').should('have.length', (initLength + 1));
    
  })

  it('Se Agrega una Tarea con caracteres especiales', () => {
    let initLength = 0;
    cy.get('.todo-list li').then((list) => {
      initLength = list.length;
      console.log(list.length);
    });
    const newItem = '#"#$%$%&#% ¨¨**][?¡?<<>'
    cy.get('[data-test=new-todo]').type(`${newItem}{enter}`);
    cy.get('.todo-list').should('have.length', (initLength + 1));
  })

  it('Se Agrega una Tarea vacia', () => {
    let initLength = 0;
    cy.get('.todo-list li').then((list) => {
      initLength = list.length;
      console.log(list.length);
    });
    const newItem = ''
    cy.get('[data-test=new-todo]').type(`${newItem}{enter}`);
    cy.get('.todo-list').should('have.length', (initLength + 1));
  })


  it('Se Agrega una Tarea con gran numero de caracteres', () => {
    let initLength = 0;
    cy.get('.todo-list li').then((list) => {
      initLength = list.length;
      console.log(list.length);
    });
    const newItem = 'a'.repeat(1000);
    cy.get('[data-test=new-todo]').type(`${newItem}{enter}`);
    cy.get('.todo-list').should('have.length', (initLength + 1));
  })
})

describe('Completar Tareas', () => {

  it('Marcar como completa una tarea correctamente', () => {
    cy.visit('https://example.cypress.io/todo');
    cy.get('.todo-list li').then((list) => {
      if (list.length > 0) {
        cy.contains('Pay electric bill')
          .parent()
          .find('input[type=checkbox]')
          .check();
        cy.contains('Pay electric bill')
          .parents('li')
          .should('have.class', 'completed');
      } else {
        const newItem = "Lavar platos";
        cy.get('[data-test=new-todo]').type(`${newItem}{enter}`);
        cy.contains(newItem)
          .parent()
          .find('input[type=checkbox]')
          .check();
        cy.contains(newItem)
          .parents('li')
          .should('have.class', 'completed');
      }
    });
  })

  context('Una vez completada una tarea', () => {
    
    it('Se agrega correctamente una tarea completada a la lista de tareas completadas', () => {
      cy.visit('https://example.cypress.io/todo');
      cy.contains('Completed').click();
      let initLength = 0;
      cy.get('.todo-list').then((list) => {
        initLength = list.length?list.length:0;
        console.log(list.length);
      });
      cy.contains('Active').click();
      cy.contains('Pay electric bill')
        .parent()
        .find('input[type=checkbox]')
        .check();
      cy.contains('Completed').click(); 
      cy.get('.todo-list').should('have.length', (initLength + 1));
    })

    it('Se puede filtrar las tareas por Activas', () => {
      cy.visit('https://example.cypress.io/todo');
      cy.contains('Active').click();
      cy.get('.todo-list li')
        .should('have.length', 2)
        .first()
        .should('have.text', 'Pay electric bill')
    })

    it('Se pueden visualizar todas las tareas (completadas, pendientes)', () => {
      cy.visit('https://example.cypress.io/todo');
      cy.contains('All').click();
      cy.get('.todo-list li')
        .should('have.length', 2)
        .first()
        .should('have.text', 'Pay electric bill')
    })

    it('Se puede filtrar las tareas por Completadas', () => {
      cy.visit('https://example.cypress.io/todo');
      cy.contains('Active').click();
      cy.contains('Pay electric bill')
        .parent()
        .find('input[type=checkbox]')
        .check();
      cy.contains('Completed').click(); 
      let initLength = 0;
      cy.get('.todo-list').then((list) => {
        assert.equal(list.length, (initLength + 1), 'Error al filtrar tareas - tareas completadas');
      });
      cy.contains('Completed').click();
      cy.get('.todo-list li')
        .should('have.length', 1)
        .first()
        .should('have.text', 'Pay electric bill')
      cy.contains('Walk the dog').should('not.exist');
    })

    it('Se pueden eliminar todas las tareas', () => {
      cy.visit('https://example.cypress.io/todo');
      cy.get('.todo-list li').each(($el, index, $list) => {
        cy.wrap($el).parent().find('input[type=checkbox]').check();
      });
      cy.contains('Clear completed').click();
      cy.contains('Clear completed').should('not.exist');
    })
  })
})