import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';
import {
  PontoLevantamento,
  SituacaoEncontrada,
  ResultadoCadastro,
  SITUACOES_LABELS,
  RESULTADOS_CONFIG,
  registrarLevantamento,
} from '../services/levantamentoCampoService';

interface LevantamentoRegistroModalProps {
  visible: boolean;
  ponto: PontoLevantamento | null;
  onClose: () => void;
  onSalvo: (pontoAtualizado: PontoLevantamento) => void;
  onSalvarEProximo: (pontoAtualizado: PontoLevantamento) => void;
}

export const LevantamentoRegistroModal: React.FC<LevantamentoRegistroModalProps> = ({
  visible,
  ponto,
  onClose,
  onSalvo,
  onSalvarEProximo,
}) => {
  if (!ponto) return null;

  const [situacao, setSituacao] = useState<SituacaoEncontrada>(ponto.situacao || 'EM_OPERACAO');
  const [resultado, setResultado] = useState<ResultadoCadastro>(
    ponto.resultado === 'PENDENTE' ? 'CONCLUIDO' : ponto.resultado
  );
  const [completude, setCompletude] = useState<number>(ponto.percentualCompletude || 100);
  const [observacao, setObservacao] = useState<string>(ponto.observacao || '');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (ponto) {
      setSituacao(ponto.situacao || 'EM_OPERACAO');
      setResultado(ponto.resultado === 'PENDENTE' ? 'CONCLUIDO' : ponto.resultado);
      setCompletude(ponto.percentualCompletude !== undefined ? ponto.percentualCompletude : 100);
      setObservacao(ponto.observacao || '');
    }
  }, [ponto]);

  const executarSalvar = (proximo: boolean) => {
    try {
      setSalvando(true);
      const res = registrarLevantamento({
        idPonto: ponto.idPonto,
        situacao,
        resultado,
        percentualCompletude: completude,
        observacao,
        usuario: 'Fiscal Operacional',
      });

      if (proximo) {
        onSalvarEProximo(res.pontoAtualizado);
      } else {
        onSalvo(res.pontoAtualizado);
      }
    } catch (e) {
      alert('Erro ao registrar levantamento');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerBadge}>VISTORIA EM CAMPO</Text>
              <Text style={styles.headerTitle}>Box {ponto.numeroBox} • {ponto.nomeLoja}</Text>
              <Text style={styles.headerSubtitle}>
                {ponto.corredor} • {ponto.segmento}
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* 1. Situação Encontrada */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>1. SITUAÇÃO ENCONTRADA NO LOCAL</Text>
              <View style={styles.optionsWrap}>
                {(Object.keys(SITUACOES_LABELS) as SituacaoEncontrada[]).map((sit) => {
                  const sel = situacao === sit;
                  return (
                    <TouchableOpacity
                      key={sit}
                      style={[styles.optionBtn, sel && styles.optionBtnSel]}
                      onPress={() => setSituacao(sit)}
                    >
                      <Text style={[styles.optionBtnText, sel && styles.optionBtnTextSel]}>
                        {SITUACOES_LABELS[sit]}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 2. Resultado do Cadastro */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>2. RESULTADO DO CADASTRO</Text>
              <View style={styles.optionsWrap}>
                {(Object.keys(RESULTADOS_CONFIG) as ResultadoCadastro[]).map((res) => {
                  const sel = resultado === res;
                  const conf = RESULTADOS_CONFIG[res];
                  return (
                    <TouchableOpacity
                      key={res}
                      style={[
                        styles.resultadoBtn,
                        sel && { borderColor: conf.cor, backgroundColor: conf.bg },
                      ]}
                      onPress={() => {
                        setResultado(res);
                        if (res === 'CONCLUIDO') setCompletude(100);
                        if (res === 'RECUSOU') setCompletude(10);
                        if (res === 'FECHADO') setCompletude(80);
                      }}
                    >
                      <Text style={[styles.resultadoBtnText, sel && { color: conf.cor, fontWeight: '800' }]}>
                        {conf.icon} {conf.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 3. Completude Cadastral */}
            <View style={styles.section}>
              <View style={styles.sliderHeader}>
                <Text style={styles.sectionLabel}>3. COMPLETUDE CADASTRAL</Text>
                <Text style={[styles.completudeValueText, { color: RESULTADOS_CONFIG[resultado].cor }]}>
                  {completude}%
                </Text>
              </View>

              <View style={styles.quickPercentages}>
                {[0, 25, 50, 75, 100].map((pct) => {
                  const sel = completude === pct;
                  return (
                    <TouchableOpacity
                      key={pct}
                      style={[styles.pctBtn, sel && styles.pctBtnSel]}
                      onPress={() => setCompletude(pct)}
                    >
                      <Text style={[styles.pctBtnText, sel && styles.pctBtnTextSel]}>
                        {pct}%
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 4. Observações de Campo */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>4. OBSERVAÇÃO OPERACIONAL</Text>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={3}
                placeholder="Observações da visita, contato abordado, pendências ou justificativa..."
                placeholderTextColor="#64748b"
                value={observacao}
                onChangeText={setObservacao}
              />
            </View>
          </ScrollView>

          {/* Footer de Ações Rápidas */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={() => executarSalvar(false)}
              disabled={salvando}
            >
              <Text style={styles.saveBtnText}>💾 Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveNextBtn}
              onPress={() => executarSalvar(true)}
              disabled={salvando}
            >
              <Text style={styles.saveNextBtnText}>⏩ Salvar e Próximo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: Math.min(680, width - 24),
    maxHeight: '90%',
    backgroundColor: '#0f172a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#38bdf8',
    letterSpacing: 1,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f8fafc',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: 'bold',
  },
  scrollArea: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionBtn: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  optionBtnSel: {
    backgroundColor: 'rgba(2, 132, 199, 0.25)',
    borderColor: '#38bdf8',
  },
  optionBtnText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
  },
  optionBtnTextSel: {
    color: '#38bdf8',
    fontWeight: '800',
  },
  resultadoBtn: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  resultadoBtnText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  completudeValueText: {
    fontSize: 16,
    fontWeight: '800',
  },
  quickPercentages: {
    flexDirection: 'row',
    gap: 8,
  },
  pctBtn: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  pctBtnSel: {
    backgroundColor: '#0284c7',
    borderColor: '#38bdf8',
  },
  pctBtnText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '700',
  },
  pctBtnTextSel: {
    color: '#ffffff',
    fontWeight: '800',
  },
  textArea: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#f8fafc',
    padding: 12,
    fontSize: 13,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    gap: 10,
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600',
  },
  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  saveNextBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveNextBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
});
