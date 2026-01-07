import { isElectron } from '../config';
import { ClienteService, ElectronClienteService, WebClienteService } from './cliente.service';

let clienteServiceInstance: ClienteService | null = null;

export function createClienteService(): ClienteService {
  if (clienteServiceInstance) {
    return clienteServiceInstance;
  }

  clienteServiceInstance = isElectron()
    ? new ElectronClienteService()
    : new WebClienteService();

  return clienteServiceInstance;
}
