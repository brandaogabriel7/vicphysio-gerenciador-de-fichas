export const QualidadeAlimentacaoEnum = {
  BOA: 'Boa',
  RAZOAVEL: 'Razoável',
  RUIM: 'Ruim',
  PESSIMA: 'Péssima',
} as const;

export type QualidadeAlimentacao =
  (typeof QualidadeAlimentacaoEnum)[keyof typeof QualidadeAlimentacaoEnum];
