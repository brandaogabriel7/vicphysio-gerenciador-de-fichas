import { isElectron } from '../config';
import { FichaService, ElectronFichaService, WebFichaService } from './ficha.service';

let fichaServiceInstance: FichaService | null = null;

export function createFichaService(): FichaService {
  if (fichaServiceInstance) {
    return fichaServiceInstance;
  }

  fichaServiceInstance = isElectron()
    ? new ElectronFichaService()
    : new WebFichaService();

  return fichaServiceInstance;
}
