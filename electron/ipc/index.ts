import { registerClienteIpcHandlers } from './cliente.ipc';
import { registerFichaIpcHandlers } from './ficha.ipc';

export function registerAllIpcHandlers(): void {
  registerClienteIpcHandlers();
  registerFichaIpcHandlers();
}
