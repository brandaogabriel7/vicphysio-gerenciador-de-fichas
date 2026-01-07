import { ipcRenderer, contextBridge } from 'electron';

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args));
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },
});

// --------- Expose Cliente API ---------
contextBridge.exposeInMainWorld('clienteApi', {
  findAll: () => ipcRenderer.invoke('cliente:findAll'),
  find: (id: string) => ipcRenderer.invoke('cliente:find', id),
  create: (data: unknown) => ipcRenderer.invoke('cliente:create', data),
  update: (data: unknown) => ipcRenderer.invoke('cliente:update', data),
  delete: (id: string) => ipcRenderer.invoke('cliente:delete', id),
});
