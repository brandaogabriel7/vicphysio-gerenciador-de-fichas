import { useState, FormEvent, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { TipoFichaEnum, TipoFicha } from '../../domain/ficha/entity/enum/tipo-ficha';
import { QualidadeAlimentacaoEnum, QualidadeAlimentacao } from '../../domain/ficha/entity/enum/qualidade-alimentacao';
import { HistoriaPatologicaPregressaEnum, HistoriaPatologicaPregressa } from '../../domain/ficha/entity/enum/historia-patologica-pregressa';
import { FichaDTO, CreateFichaDTO, CamposPilatesDTO, CamposFisioterapiaDTO } from '../../application/dto/ficha.dto';

interface FichaFormProps {
  clienteId: string;
  initialData?: FichaDTO;
  onSubmit: (data: CreateFichaDTO) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const tipoFichaOptions = [
  { value: TipoFichaEnum.NAO_ESPECIFICADO, label: 'Não especificado' },
  { value: TipoFichaEnum.PILATES, label: 'Pilates' },
  { value: TipoFichaEnum.FISIOTERAPIA, label: 'Fisioterapia' },
];

const qualidadeAlimentacaoOptions = [
  { value: '', label: 'Selecione...' },
  { value: QualidadeAlimentacaoEnum.BOA, label: 'Boa' },
  { value: QualidadeAlimentacaoEnum.RAZOAVEL, label: 'Razoável' },
  { value: QualidadeAlimentacaoEnum.RUIM, label: 'Ruim' },
  { value: QualidadeAlimentacaoEnum.PESSIMA, label: 'Péssima' },
];

const historiasPatologicasOptions = [
  { value: HistoriaPatologicaPregressaEnum.ETILISTA, label: 'Etilista' },
  { value: HistoriaPatologicaPregressaEnum.TABAGISTA, label: 'Tabagista' },
  { value: HistoriaPatologicaPregressaEnum.OBESIDADE, label: 'Obesidade' },
  { value: HistoriaPatologicaPregressaEnum.SEDENTARISMO, label: 'Sedentarismo' },
];

interface FormData {
  tipoFicha: TipoFicha;
  data: string;
  historiaMolestiaAtual: string;
  historiasPatologicasPregressas: HistoriaPatologicaPregressa[];
  qualidadeAlimentacao: QualidadeAlimentacao | '';
  medicacoes: string;
  observacoes: string;
  // Pilates fields
  peso: string;
  altura: string;
  // Fisioterapia fields
  testesReflexos: string;
  palpacao: string;
  nivelDor: string;
  inspecaoGeral: string;
  movimentosAtivosPassivos: string;
  classificacaoInternacionalDeFuncionalidade: string;
  objetivoTerapeutico: string;
  frequenciaRespiratoria: string;
  pressaoArterialSistolica: string;
  pressaoArterialDiastolica: string;
  oxigenacao: string;
  autorizaUsoImagem: boolean;
  outros: string;
}

const initialFormData: FormData = {
  tipoFicha: TipoFichaEnum.NAO_ESPECIFICADO,
  data: '',
  historiaMolestiaAtual: '',
  historiasPatologicasPregressas: [],
  qualidadeAlimentacao: '',
  medicacoes: '',
  observacoes: '',
  peso: '',
  altura: '',
  testesReflexos: '',
  palpacao: '',
  nivelDor: '',
  inspecaoGeral: '',
  movimentosAtivosPassivos: '',
  classificacaoInternacionalDeFuncionalidade: '',
  objetivoTerapeutico: '',
  frequenciaRespiratoria: '',
  pressaoArterialSistolica: '',
  pressaoArterialDiastolica: '',
  oxigenacao: '',
  autorizaUsoImagem: false,
  outros: '',
};

export function FichaForm({
  clienteId,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: FichaFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      const camposPilates = initialData.camposEspecificos as CamposPilatesDTO;
      const camposFisio = initialData.camposEspecificos as CamposFisioterapiaDTO;

      setFormData({
        tipoFicha: initialData.tipoFicha,
        data: initialData.data ? initialData.data.split('T')[0] : '',
        historiaMolestiaAtual: initialData.historiaMolestiaAtual || '',
        historiasPatologicasPregressas: initialData.historiasPatologicasPregressas || [],
        qualidadeAlimentacao: initialData.qualidadeAlimentacao || '',
        medicacoes: initialData.medicacoes || '',
        observacoes: initialData.observacoes || '',
        // Pilates
        peso: camposPilates?.peso?.toString() || '',
        altura: camposPilates?.altura?.toString() || '',
        // Fisioterapia
        testesReflexos: camposFisio?.testesReflexos || '',
        palpacao: camposFisio?.palpacao || '',
        nivelDor: camposFisio?.nivelDor?.toString() || '',
        inspecaoGeral: camposFisio?.inspecaoGeral || '',
        movimentosAtivosPassivos: camposFisio?.movimentosAtivosPassivos || '',
        classificacaoInternacionalDeFuncionalidade: camposFisio?.classificacaoInternacionalDeFuncionalidade || '',
        objetivoTerapeutico: camposFisio?.objetivoTerapeutico || '',
        frequenciaRespiratoria: camposFisio?.frequenciaRespiratoria?.toString() || '',
        pressaoArterialSistolica: camposFisio?.pressaoArterial?.valorSistolica?.toString() || '',
        pressaoArterialDiastolica: camposFisio?.pressaoArterial?.valorDiastolica?.toString() || '',
        oxigenacao: camposFisio?.oxigenacao?.toString() || '',
        autorizaUsoImagem: camposFisio?.autorizaUsoImagem || false,
        outros: camposFisio?.outros || '',
      });
    }
  }, [initialData]);

  const handleHistoriaToggle = (value: HistoriaPatologicaPregressa) => {
    setFormData((prev) => {
      const exists = prev.historiasPatologicasPregressas.includes(value);
      return {
        ...prev,
        historiasPatologicasPregressas: exists
          ? prev.historiasPatologicasPregressas.filter((h) => h !== value)
          : [...prev.historiasPatologicasPregressas, value],
      };
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.nivelDor) {
      const nivel = parseFloat(formData.nivelDor);
      if (isNaN(nivel) || nivel < 0 || nivel > 10) {
        newErrors.nivelDor = 'Nível de dor deve estar entre 0 e 10';
      }
    }

    if (formData.peso) {
      const peso = parseFloat(formData.peso);
      if (isNaN(peso) || peso <= 0) {
        newErrors.peso = 'Peso deve ser maior que 0';
      }
    }

    if (formData.altura) {
      const altura = parseFloat(formData.altura);
      if (isNaN(altura) || altura <= 0) {
        newErrors.altura = 'Altura deve ser maior que 0';
      }
    }

    if (formData.oxigenacao) {
      const ox = parseFloat(formData.oxigenacao);
      if (isNaN(ox) || ox < 0 || ox > 100) {
        newErrors.oxigenacao = 'Oxigenação deve estar entre 0 e 100';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    let camposEspecificos: CamposPilatesDTO | CamposFisioterapiaDTO | undefined;

    if (formData.tipoFicha === TipoFichaEnum.PILATES) {
      camposEspecificos = {
        peso: formData.peso ? parseFloat(formData.peso) : undefined,
        altura: formData.altura ? parseFloat(formData.altura) : undefined,
      };
    } else if (formData.tipoFicha === TipoFichaEnum.FISIOTERAPIA) {
      camposEspecificos = {
        testesReflexos: formData.testesReflexos || undefined,
        palpacao: formData.palpacao || undefined,
        nivelDor: formData.nivelDor ? parseFloat(formData.nivelDor) : undefined,
        inspecaoGeral: formData.inspecaoGeral || undefined,
        movimentosAtivosPassivos: formData.movimentosAtivosPassivos || undefined,
        classificacaoInternacionalDeFuncionalidade: formData.classificacaoInternacionalDeFuncionalidade || undefined,
        objetivoTerapeutico: formData.objetivoTerapeutico || undefined,
        frequenciaRespiratoria: formData.frequenciaRespiratoria ? parseFloat(formData.frequenciaRespiratoria) : undefined,
        pressaoArterial: formData.pressaoArterialSistolica && formData.pressaoArterialDiastolica
          ? {
              valorSistolica: parseFloat(formData.pressaoArterialSistolica),
              valorDiastolica: parseFloat(formData.pressaoArterialDiastolica),
            }
          : undefined,
        oxigenacao: formData.oxigenacao ? parseFloat(formData.oxigenacao) : undefined,
        autorizaUsoImagem: formData.autorizaUsoImagem,
        outros: formData.outros || undefined,
      };
    }

    await onSubmit({
      clienteId,
      tipoFicha: formData.tipoFicha,
      data: formData.data || undefined,
      historiaMolestiaAtual: formData.historiaMolestiaAtual || undefined,
      historiasPatologicasPregressas: formData.historiasPatologicasPregressas.length > 0
        ? formData.historiasPatologicasPregressas
        : undefined,
      qualidadeAlimentacao: formData.qualidadeAlimentacao || undefined,
      medicacoes: formData.medicacoes || undefined,
      observacoes: formData.observacoes || undefined,
      camposEspecificos,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tipo de Ficha */}
      <Select
        label="Tipo de Ficha"
        value={formData.tipoFicha}
        onChange={(e) => setFormData({ ...formData, tipoFicha: e.target.value as TipoFicha })}
        options={tipoFichaOptions}
        disabled={isLoading}
      />

      {/* Data */}
      <Input
        label="Data da Avaliação"
        type="date"
        value={formData.data}
        onChange={(e) => setFormData({ ...formData, data: e.target.value })}
        disabled={isLoading}
      />

      {/* Shared fields */}
      <Textarea
        label="História da Moléstia Atual"
        value={formData.historiaMolestiaAtual}
        onChange={(e) => setFormData({ ...formData, historiaMolestiaAtual: e.target.value })}
        disabled={isLoading}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Histórias Patológicas Pregressas
        </label>
        <div className="flex flex-wrap gap-4">
          {historiasPatologicasOptions.map((option) => (
            <label key={option.value} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.historiasPatologicasPregressas.includes(option.value)}
                onChange={() => handleHistoriaToggle(option.value)}
                disabled={isLoading}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <Select
        label="Qualidade da Alimentação"
        value={formData.qualidadeAlimentacao}
        onChange={(e) => setFormData({ ...formData, qualidadeAlimentacao: e.target.value as QualidadeAlimentacao })}
        options={qualidadeAlimentacaoOptions}
        disabled={isLoading}
      />

      <Textarea
        label="Medicações"
        value={formData.medicacoes}
        onChange={(e) => setFormData({ ...formData, medicacoes: e.target.value })}
        disabled={isLoading}
      />

      <Textarea
        label="Observações"
        value={formData.observacoes}
        onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
        disabled={isLoading}
      />

      {/* Pilates fields */}
      {formData.tipoFicha === TipoFichaEnum.PILATES && (
        <div className="border-t pt-6 space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Campos Específicos - Pilates</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Peso (kg)"
              type="number"
              step="0.1"
              value={formData.peso}
              onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
              error={errors.peso}
              disabled={isLoading}
            />
            <Input
              label="Altura (cm)"
              type="number"
              value={formData.altura}
              onChange={(e) => setFormData({ ...formData, altura: e.target.value })}
              error={errors.altura}
              disabled={isLoading}
            />
          </div>
        </div>
      )}

      {/* Fisioterapia fields */}
      {formData.tipoFicha === TipoFichaEnum.FISIOTERAPIA && (
        <div className="border-t pt-6 space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Campos Específicos - Fisioterapia</h3>

          <Textarea
            label="Testes e Reflexos"
            value={formData.testesReflexos}
            onChange={(e) => setFormData({ ...formData, testesReflexos: e.target.value })}
            disabled={isLoading}
          />

          <Textarea
            label="Palpação"
            value={formData.palpacao}
            onChange={(e) => setFormData({ ...formData, palpacao: e.target.value })}
            disabled={isLoading}
          />

          <Input
            label="Nível de Dor (0-10)"
            type="number"
            min="0"
            max="10"
            value={formData.nivelDor}
            onChange={(e) => setFormData({ ...formData, nivelDor: e.target.value })}
            error={errors.nivelDor}
            disabled={isLoading}
          />

          <Textarea
            label="Inspeção Geral"
            value={formData.inspecaoGeral}
            onChange={(e) => setFormData({ ...formData, inspecaoGeral: e.target.value })}
            disabled={isLoading}
          />

          <Textarea
            label="Movimentos Ativos/Passivos"
            value={formData.movimentosAtivosPassivos}
            onChange={(e) => setFormData({ ...formData, movimentosAtivosPassivos: e.target.value })}
            disabled={isLoading}
          />

          <Textarea
            label="Classificação Internacional de Funcionalidade (CIF)"
            value={formData.classificacaoInternacionalDeFuncionalidade}
            onChange={(e) => setFormData({ ...formData, classificacaoInternacionalDeFuncionalidade: e.target.value })}
            disabled={isLoading}
          />

          <Textarea
            label="Objetivo Terapêutico"
            value={formData.objetivoTerapeutico}
            onChange={(e) => setFormData({ ...formData, objetivoTerapeutico: e.target.value })}
            disabled={isLoading}
          />

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Frequência Respiratória (rpm)"
              type="number"
              value={formData.frequenciaRespiratoria}
              onChange={(e) => setFormData({ ...formData, frequenciaRespiratoria: e.target.value })}
              disabled={isLoading}
            />
            <Input
              label="Oxigenação (%)"
              type="number"
              min="0"
              max="100"
              value={formData.oxigenacao}
              onChange={(e) => setFormData({ ...formData, oxigenacao: e.target.value })}
              error={errors.oxigenacao}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Pressão Arterial Sistólica (mmHg)"
              type="number"
              value={formData.pressaoArterialSistolica}
              onChange={(e) => setFormData({ ...formData, pressaoArterialSistolica: e.target.value })}
              disabled={isLoading}
            />
            <Input
              label="Pressão Arterial Diastólica (mmHg)"
              type="number"
              value={formData.pressaoArterialDiastolica}
              onChange={(e) => setFormData({ ...formData, pressaoArterialDiastolica: e.target.value })}
              disabled={isLoading}
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.autorizaUsoImagem}
              onChange={(e) => setFormData({ ...formData, autorizaUsoImagem: e.target.checked })}
              disabled={isLoading}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Autoriza uso de imagem</span>
          </label>

          <Textarea
            label="Outros"
            value={formData.outros}
            onChange={(e) => setFormData({ ...formData, outros: e.target.value })}
            disabled={isLoading}
          />
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  );
}
