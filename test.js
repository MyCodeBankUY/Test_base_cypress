// =======================
// Clase Entrada: Inputs, Selects y Checkboxes
// =======================
export class Entrada {
  escribir(nombre, valor) {
    cy.get(`input[name="${nombre}"]`).clear().type(valor);
  }

  escribirPorSelector(selector, valor) {
    cy.get(selector).clear().type(valor);
  }

  marcar(nombre) {
    cy.get(nombre.startsWith('#') ? nombre : `input[name="${nombre}"]`).check();
  }

  desmarcar(nombre) {
    cy.get(nombre.startsWith('#') ? nombre : `input[name="${nombre}"]`).uncheck();
  }

  seleccionar(nombre, valor) {
    cy.get(`select[name="${nombre}"]`).select(valor);
  }
}

// =======================
// Clase Boton
// =======================
export class Boton {
  clicPorTipo(tipo = 'submit') {
    cy.get(`button[type="${tipo}"]`).click();
  }

  clicPorTexto(texto) {
    cy.contains('button', texto).click();
  }

  clicPorSelector(selector) {
    cy.get(selector).click();
  }
}

// =======================
// Clase Visita
// =======================
export class Visita {
  ir(ruta) {
    cy.visit(ruta); // Ruta pasada directamente
  }

  validar(ruta) {
    cy.url().should('include', ruta); // Ruta pasada directamente
  }

  irYValidar(ruta) {
    this.ir(ruta);
    this.validar(ruta);
  }
}

// =======================
// Clase Tabla
// =======================
export class Tabla {
  validarCelda(selector, texto) {
    cy.get(selector).should('be.visible');
    cy.get(selector)
      .contains('td', texto, { timeout: 10000 })
      .should('be.visible');
  }

  validarFilas(selector, minFilas) {
    cy.get(selector + ' tbody tr').should('have.length.gte', minFilas);
  }
}

// =======================
// Clase Page (antes Formulario)
// =======================
export class Page {
  constructor() {
    this.entrada = new Entrada();
    this.boton = new Boton();
    this.visita = new Visita();
    this.tabla = new Tabla();
  }

  // Registro genérico
  registrar(usuario, contraseña, rol = 'user') {
    this.visita.ir('/register.html'); // Ruta directa
    this.entrada.escribir('username', usuario);
    this.entrada.escribir('password', contraseña);
    this.entrada.seleccionar('role', rol);
    this.boton.clicPorTipo('submit');

    this.visita.validar('/login.html');
  }

  // Login genérico
  login(usuario, contraseña, apiUsers = '/api/users') {
    cy.intercept('GET', apiUsers).as('getUsers');
    this.visita.ir('/login.html');
    this.entrada.escribir('username', usuario);
    this.entrada.escribir('password', contraseña);
    this.boton.clicPorTipo('submit');

    this.visita.validar('/dashboard.html');
  }

  // Validar dashboard
  validarDashboard(usuario, selectorTabla = '#user-table', apiUsers = '/api/users') {
    cy.wait('@getUsers', { timeout: 10000 }).then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      const existe = (interception.response.body || []).some((u) => u.username === usuario);
      expect(existe, `El usuario ${usuario} debe existir`).to.be.true;
    });

    this.tabla.validarCelda(selectorTabla, usuario);
  }

  // Logout genérico
  logout(selector = '#logout-btn') {
    this.boton.clicPorSelector(selector);
    this.visita.validar('/login.html');
  }
}
