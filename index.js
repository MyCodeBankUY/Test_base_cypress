import { Page } from './test.js';

describe('Flujo completo con Page Object', () => {
  const page = new Page();
  const usuario = `Maxi_${Date.now()}`;
  const password = '1234';

  it('Registrar, loguear, validar dashboard y logout', () => {
    page.registrar(usuario, password);
    page.login(usuario, password);
    page.validarDashboard(usuario);
    page.logout();
  });
});
