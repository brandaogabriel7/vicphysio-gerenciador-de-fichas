export const TipoFichaEnum = {
  PILATES: 'Pilates',
  FISIOTERAPIA: 'Fisioterapia',
  NAO_ESPECIFICADO: 'Não especificado',
} as const;

export type TipoFicha = (typeof TipoFichaEnum)[keyof typeof TipoFichaEnum];
