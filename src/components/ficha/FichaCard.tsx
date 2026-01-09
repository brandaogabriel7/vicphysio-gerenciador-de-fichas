import { FichaDTO, CamposPilatesDTO, CamposFisioterapiaDTO } from '../../application/dto/ficha.dto';
import { TipoFichaEnum } from '../../domain/ficha/entity/enum/tipo-ficha';

interface FichaCardProps {
  ficha: FichaDTO;
}

function InfoRow({ label, value }: { label: string; value: string | number | undefined | null }) {
  if (!value) return null;
  return (
    <div className="py-2 border-b border-gray-100">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{value}</dd>
    </div>
  );
}

export function FichaCard({ ficha }: FichaCardProps) {
  const camposPilates = ficha.camposEspecificos as CamposPilatesDTO;
  const camposFisio = ficha.camposEspecificos as CamposFisioterapiaDTO;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Ficha - {ficha.tipoFicha}
        </h3>
        {ficha.data && (
          <p className="mt-1 text-sm text-gray-500">
            Data: {new Date(ficha.data).toLocaleDateString('pt-BR')}
          </p>
        )}
      </div>

      <div className="px-6 py-4">
        <dl className="space-y-1">
          {/* Shared fields */}
          <InfoRow label="História da Moléstia Atual" value={ficha.historiaMolestiaAtual} />

          {ficha.historiasPatologicasPregressas?.length > 0 && (
            <div className="py-2 border-b border-gray-100">
              <dt className="text-sm font-medium text-gray-500">Histórias Patológicas Pregressas</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {ficha.historiasPatologicasPregressas.join(', ')}
              </dd>
            </div>
          )}

          <InfoRow label="Qualidade da Alimentação" value={ficha.qualidadeAlimentacao} />
          <InfoRow label="Medicações" value={ficha.medicacoes} />
          <InfoRow label="Observações" value={ficha.observacoes} />

          {/* Pilates fields */}
          {ficha.tipoFicha === TipoFichaEnum.PILATES && (camposPilates?.peso || camposPilates?.altura) && (
            <div className="pt-4 mt-4 border-t border-gray-200">
              <h4 className="text-md font-medium text-gray-800 mb-3">Medidas - Pilates</h4>
              <div className="grid grid-cols-2 gap-4">
                {camposPilates.peso && (
                  <InfoRow label="Peso" value={`${camposPilates.peso} kg`} />
                )}
                {camposPilates.altura && (
                  <InfoRow label="Altura" value={`${camposPilates.altura} cm`} />
                )}
              </div>
            </div>
          )}

          {/* Fisioterapia fields */}
          {ficha.tipoFicha === TipoFichaEnum.FISIOTERAPIA && camposFisio && (
            <div className="pt-4 mt-4 border-t border-gray-200">
              <h4 className="text-md font-medium text-gray-800 mb-3">Avaliação - Fisioterapia</h4>

              <InfoRow label="Testes e Reflexos" value={camposFisio.testesReflexos} />
              <InfoRow label="Palpação" value={camposFisio.palpacao} />

              {camposFisio.nivelDor !== undefined && camposFisio.nivelDor !== null && (
                <InfoRow label="Nível de Dor" value={`${camposFisio.nivelDor} / 10`} />
              )}

              <InfoRow label="Inspeção Geral" value={camposFisio.inspecaoGeral} />
              <InfoRow label="Movimentos Ativos/Passivos" value={camposFisio.movimentosAtivosPassivos} />
              <InfoRow label="CIF" value={camposFisio.classificacaoInternacionalDeFuncionalidade} />
              <InfoRow label="Objetivo Terapêutico" value={camposFisio.objetivoTerapeutico} />

              {camposFisio.frequenciaRespiratoria && (
                <InfoRow label="Frequência Respiratória" value={`${camposFisio.frequenciaRespiratoria} rpm`} />
              )}

              {camposFisio.pressaoArterial && (
                <InfoRow
                  label="Pressão Arterial"
                  value={`${camposFisio.pressaoArterial.valorSistolica}/${camposFisio.pressaoArterial.valorDiastolica} mmHg`}
                />
              )}

              {camposFisio.oxigenacao !== undefined && camposFisio.oxigenacao !== null && (
                <InfoRow label="Oxigenação" value={`${camposFisio.oxigenacao}%`} />
              )}

              {camposFisio.autorizaUsoImagem !== undefined && (
                <InfoRow
                  label="Autoriza Uso de Imagem"
                  value={camposFisio.autorizaUsoImagem ? 'Sim' : 'Não'}
                />
              )}

              <InfoRow label="Outros" value={camposFisio.outros} />
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
