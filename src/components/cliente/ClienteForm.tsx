import { useState, FormEvent, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { SexoEnum } from '../../domain/ficha/entity/enum/sexo';
import { ClienteDTO, CreateClienteDTO } from '../../application/dto/cliente.dto';

interface ClienteFormProps {
  initialData?: ClienteDTO;
  onSubmit: (data: CreateClienteDTO) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const sexoOptions = [
  { value: SexoEnum.MASCULINO, label: 'Masculino' },
  { value: SexoEnum.FEMININO, label: 'Feminino' },
  { value: SexoEnum.OUTRO, label: 'Outro' },
];

export function ClienteForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: ClienteFormProps) {
  const [formData, setFormData] = useState({
    nome: '',
    numeroRg: '',
    sexo: SexoEnum.OUTRO,
    dataNascimento: '',
    nomeCuidador: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        nome: initialData.nome,
        numeroRg: initialData.numeroRg,
        sexo: initialData.sexo,
        dataNascimento: initialData.dataNascimento || '',
        nomeCuidador: initialData.nomeCuidador || '',
      });
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.numeroRg.trim()) {
      newErrors.numeroRg = 'Número de RG é obrigatório';
    }

    if (formData.dataNascimento) {
      const date = new Date(formData.dataNascimento);
      if (isNaN(date.getTime())) {
        newErrors.dataNascimento = 'Data de nascimento inválida';
      } else if (date > new Date()) {
        newErrors.dataNascimento = 'Data de nascimento não pode estar no futuro';
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

    await onSubmit({
      nome: formData.nome.trim(),
      numeroRg: formData.numeroRg.trim(),
      sexo: formData.sexo,
      dataNascimento: formData.dataNascimento || undefined,
      nomeCuidador: formData.nomeCuidador.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Nome"
        value={formData.nome}
        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
        error={errors.nome}
        required
        disabled={isLoading}
      />

      <Input
        label="Número de RG"
        value={formData.numeroRg}
        onChange={(e) => setFormData({ ...formData, numeroRg: e.target.value })}
        error={errors.numeroRg}
        required
        disabled={isLoading}
      />

      <Select
        label="Sexo"
        value={formData.sexo}
        onChange={(e) => setFormData({ ...formData, sexo: e.target.value as typeof formData.sexo })}
        options={sexoOptions}
        disabled={isLoading}
      />

      <Input
        label="Data de Nascimento"
        type="date"
        value={formData.dataNascimento}
        onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
        error={errors.dataNascimento}
        disabled={isLoading}
      />

      <Input
        label="Nome do Cuidador"
        value={formData.nomeCuidador}
        onChange={(e) => setFormData({ ...formData, nomeCuidador: e.target.value })}
        disabled={isLoading}
      />

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
