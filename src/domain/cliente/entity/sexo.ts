export const SexoEnum = {
  MASCULINO: 'Masculino',
  FEMININO: 'Feminino',
  OUTRO: 'Outro',
} as const;

export type Sexo = (typeof SexoEnum)[keyof typeof SexoEnum];
