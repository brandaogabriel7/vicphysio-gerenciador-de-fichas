export const HistoriaPatologicaPregressaEnum = {
  ETILISTA: 'Etilista',
  TABAGISTA: 'Tabagista',
  OBESIDADE: 'Obesidade',
  SEDENTARISMO: 'Sedentarismo',
} as const;

export type HistoriaPatologicaPregressa =
  (typeof HistoriaPatologicaPregressaEnum)[keyof typeof HistoriaPatologicaPregressaEnum];
