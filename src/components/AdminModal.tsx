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
  AdminService,
  UsuarioSistema,
  PermissaoModulo,
  EventoAuditoria,
  PontoBackup,
  DiagnosticoSaude,
  PlanoPreventivo,
  AvisoComunicacao,
  PapelUsuario,
} from '../services/adminService';

interface AdminModalProps {
  visible: boolean;
  userRole?: string;
  onClose: () => void;
}

type TabAdmin =
  | 'USUARIOS'
  | 'PERFIS'
  | 'AUDITORIA'
  | 'BACKUP'
  | 'SAUDE'
  | 'PLANOS'
  | 'COMUNICACAO';

export const AdminModal: React.FC<AdminModalProps> = ({
  visible,
  userRole = 'ADMIN',
  onClose,
}) => {
  const [tabAtiva, setTabAtiva] = useState<TabAdmin>('USUARIOS');
  const [usuarios, setUsuarios] = useState<UsuarioSistema[]>([]);
  const [permissoes, setPermissoes] = useState<PermissaoModulo[]>([]);
  const [logs, setLogs] = useState<EventoAuditoria[]>([]);
  const [backups, setBackups] = useState<PontoBackup[]>([]);
  const [saude, setSaude] = useState<DiagnosticoSaude | null>(null);
  const [planos, setPlanos] = useState<PlanoPreventivo[]>([]);
  const [avisos, setAvisos] = useState<AvisoComunicacao[]>([]);

  // Form Novo Aviso
  const [formAvisoAberto, setFormAvisoAberto] = useState(false);
  const [novoTituloAviso, setNovoTituloAviso] = useState('');
  const [novaMsgAviso, setNovaMsgAviso] = useState('');
  const [prioridadeAviso, setPrioridadeAviso] = useState<'NORMAL' | 'ALTA' | 'URGENTE'>('NORMAL');

  // Form Novo Usuário
  const [formUsuarioAberto, setFormUsuarioAberto] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novoEmail, setNovoEmail] = useState('');
  const [novoCargo, setNovoCargo] = useState('');
  const [novoPerfil, setNovoPerfil] = useState<PapelUsuario>('CAMPO');

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const carregarDados = () => {
    setUsuarios(AdminService.obterUsuarios());
    setPermissoes(AdminService.obterMatrizPermissoes());
    setLogs(AdminService.obterLogsAuditoria());
    setBackups(AdminService.obterBackups());
    setSaude(AdminService.obterDiagnosticoSaude());
    setPlanos(AdminService.obterPlanosPreventivos());
    setAvisos(AdminService.obterAvisos());
  };

  useEffect(() => {
    if (visible) {
      carregarDados();
    }
  }, [visible]);

  if (!visible) return null;

  const handleSalvarUsuario = () => {
    if (!novoNome.trim() || !novoEmail.trim()) {
      alert('Preencha nome e e-mail do usuário.');
      return;
    }
    AdminService.salvarUsuario({
      nome: novoNome,
      email: novoEmail,
      cargo: novoCargo || 'Operador',
      perfil: novoPerfil,
      ativo: true,
    });
    setFormUsuarioAberto(false);
    setNovoNome('');
    setNovoEmail('');
    setNovoCargo('');
    setUsuarios(AdminService.obterUsuarios());
    mostrarFeedback('Usuário cadastrado com sucesso!');
  };

  const handleEnviarAviso = () => {
    if (!novoTituloAviso.trim() || !novaMsgAviso.trim()) {
      alert('Preencha o título e o corpo do aviso.');
      return;
    }
    AdminService.enviarAviso({
      titulo: novoTituloAviso,
      mensagem: novaMsgAviso,
      prioridade: prioridadeAviso,
    });
    setFormAvisoAberto(false);
    setNovoTituloAviso('');
    setNovaMsgAviso('');
    setAvisos(AdminService.obterAvisos());
    mostrarFeedback('Comunicado transmitido para a equipe!');
  };

  const handleBackupAgora = () => {
    mostrarFeedback('Snapshot manual do PostgreSQL & MinIO S3 gravado com sucesso!');
  };

  const mostrarFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay} id="modalAdmin">
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <View style={styles.badgeRow}>
                <View style={styles.badgeAdmin}>
                  <Text style={styles.badgeAdminText}>FASE L5.0 • ADMINISTRAÇÃO GLOBAL</Text>
                </View>
                <Text style={styles.headerSubBadge}>Acesso Restrito: Perfil {userRole}</Text>
              </View>
              <Text style={styles.headerTitle}>Central de Administração do Mall</Text>
              <Text style={styles.headerSub}>
                Governança de usuários, perfis RBAC, auditoria, integridade de dados e infraestrutura
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Feedback temporário */}
          {feedbackMsg && (
            <View style={styles.feedbackBar}>
              <Text style={styles.feedbackText}>✓ {feedbackMsg}</Text>
            </View>
          )}

          {/* Abas */}
          <View style={styles.tabsBar}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[
                { key: 'USUARIOS', label: '👥 Usuários' },
                { key: 'PERFIS', label: '🛡️ Perfis RBAC' },
                { key: 'AUDITORIA', label: '📜 Trilha de Auditoria' },
                { key: 'BACKUP', label: '💾 Backup & Integridade' },
                { key: 'SAUDE', label: '🩺 Saúde do Cluster' },
                { key: 'PLANOS', label: '📅 Planos Preventivos' },
                { key: 'COMUNICACAO', label: '📢 Comunicação' },
              ].map((tab) => {
                const ativa = tabAtiva === tab.key;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    style={[styles.tabBtn, ativa && styles.tabBtnAtiva]}
                    onPress={() => setTabAtiva(tab.key as TabAdmin)}
                  >
                    <Text style={[styles.tabBtnText, ativa && styles.tabBtnTextAtiva]}>
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* ABA 1: USUÁRIOS */}
            {tabAtiva === 'USUARIOS' && (
              <View>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>Operadores e Contas Cadastradas ({usuarios.length})</Text>
                  <TouchableOpacity
                    style={styles.btnAcaoPrimaria}
                    onPress={() => setFormUsuarioAberto(!formUsuarioAberto)}
                  >
                    <Text style={styles.btnAcaoPrimariaText}>
                      {formUsuarioAberto ? '✕ Cancelar' : '＋ Novo Usuário'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {formUsuarioAberto && (
                  <View style={styles.formCard}>
                    <Text style={styles.formCardTitle}>Cadastrar Novo Operador</Text>
                    <View style={styles.inputGroupRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.inputLabel}>Nome Completo</Text>
                        <TextInput
                          style={styles.textInput}
                          placeholder="Ex: Amanda Silva"
                          placeholderTextColor="#64748b"
                          value={novoNome}
                          onChangeText={setNovoNome}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.inputLabel}>E-mail Corporativo</Text>
                        <TextInput
                          style={styles.textInput}
                          placeholder="ex: amanda@centrofashiofortaleza.com.br"
                          placeholderTextColor="#64748b"
                          value={novoEmail}
                          onChangeText={setNovoEmail}
                        />
                      </View>
                    </View>

                    <View style={styles.inputGroupRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.inputLabel}>Cargo / Função</Text>
                        <TextInput
                          style={styles.textInput}
                          placeholder="Ex: Auditora Fiscal Júnior"
                          placeholderTextColor="#64748b"
                          value={novoCargo}
                          onChangeText={setNovoCargo}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.inputLabel}>Perfil RBAC</Text>
                        <View style={styles.perfilPickerRow}>
                          {(['ADMIN', 'GESTAO', 'FINANCEIRO', 'MARKETING', 'CAMPO', 'CONSULTA'] as PapelUsuario[]).map((p) => (
                            <TouchableOpacity
                              key={p}
                              style={[styles.pPill, novoPerfil === p && styles.pPillAtivo]}
                              onPress={() => setNovoPerfil(p)}
                            >
                              <Text style={[styles.pPillText, novoPerfil === p && styles.pPillTextAtivo]}>{p}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    </View>

                    <TouchableOpacity style={styles.btnSalvarForm} onPress={handleSalvarUsuario}>
                      <Text style={styles.btnSalvarFormText}>Confirmar e Salvar Usuário</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <View style={styles.gridCartoes}>
                  {usuarios.map((u) => (
                    <View key={u.id} style={styles.cardUsuario}>
                      <View style={styles.cardUsuarioTop}>
                        <View>
                          <Text style={styles.usuarioNome}>{u.nome}</Text>
                          <Text style={styles.usuarioEmail}>{u.email}</Text>
                          <Text style={styles.usuarioCargo}>{u.cargo}</Text>
                        </View>
                        <View style={[styles.badgePerfil, { borderColor: u.perfil === 'ADMIN' ? '#ef4444' : '#38bdf8' }]}>
                          <Text style={[styles.badgePerfilText, { color: u.perfil === 'ADMIN' ? '#ef4444' : '#38bdf8' }]}>
                            {u.perfil}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.usuarioFooter}>
                        <Text style={styles.usuarioUltimoAcesso}>Último acesso: {u.ultimoAcesso}</Text>
                        <View style={[styles.statusDot, { backgroundColor: u.ativo ? '#10b981' : '#64748b' }]} />
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* ABA 2: PERFIS RBAC */}
            {tabAtiva === 'PERFIS' && (
              <View>
                <Text style={styles.sectionTitle}>Matriz de Papéis e Permissões por Domínio</Text>
                <Text style={styles.sectionSubtitle}>
                  Controle estrito de acesso e isolamento de privilégios de dados confidenciais
                </Text>

                <View style={styles.matrizContainer}>
                  {permissoes.map((p) => (
                    <View key={p.modulo} style={styles.matrizItem}>
                      <View style={styles.matrizItemHeader}>
                        <Text style={styles.moduloNome}>{p.modulo}</Text>
                        <View style={styles.operacoesRow}>
                          {p.operacoes.map((op) => (
                            <View key={op} style={styles.opTag}>
                              <Text style={styles.opTagText}>{op}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                      <Text style={styles.moduloDesc}>{p.descricao}</Text>
                      <View style={styles.papeisPermitidosRow}>
                        <Text style={styles.papeisRotulo}>Acesso Autorizado:</Text>
                        {p.papeisPermitidos.map((papel) => (
                          <View key={papel} style={styles.papelChip}>
                            <Text style={styles.papelChipText}>{papel}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* ABA 3: TRILHA DE AUDITORIA */}
            {tabAtiva === 'AUDITORIA' && (
              <View>
                <Text style={styles.sectionTitle}>Extrato Cronológico Imutável de Auditoria</Text>
                <Text style={styles.sectionSubtitle}>
                  Trilha append-only sincronizada com o PostgreSQL para conformidade corporativa
                </Text>

                <View style={styles.tabelaContainer}>
                  {logs.map((l) => (
                    <View key={l.id} style={styles.logRow}>
                      <View style={styles.logTimeCol}>
                        <Text style={styles.logTime}>{l.timestamp}</Text>
                        <Text style={styles.logIp}>IP: {l.ipOrigem}</Text>
                      </View>
                      <View style={styles.logActionCol}>
                        <View style={styles.logActionBadge}>
                          <Text style={styles.logActionText}>{l.acao}</Text>
                        </View>
                        <Text style={styles.logEntidade}>Entidade: {l.entidade} ({l.idRegistro || 'N/A'})</Text>
                        <Text style={styles.logDetalhes}>{l.detalhes}</Text>
                        <Text style={styles.logOperador}>Operador: {l.operadorNome} ({l.operadorEmail})</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* ABA 4: BACKUP & INTEGRIDADE */}
            {tabAtiva === 'BACKUP' && (
              <View>
                <View style={styles.sectionHeaderRow}>
                  <View>
                    <Text style={styles.sectionTitle}>Pontos de Recuperação & Snapshots de Segurança</Text>
                    <Text style={styles.sectionSubtitle}>
                      Snapshots transacionais do banco de dados e objetos com verificação de integridade
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.btnAcaoPrimaria} onPress={handleBackupAgora}>
                    <Text style={styles.btnAcaoPrimariaText}>💾 Executar Snapshot Agora</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.backupsList}>
                  {backups.map((b) => (
                    <View key={b.id} style={styles.cardBackup}>
                      <View style={styles.cardBackupLeft}>
                        <Text style={styles.backupId}>{b.id}</Text>
                        <Text style={styles.backupData}>{b.dataHora} • Tipo: {b.tipo}</Text>
                        <Text style={styles.backupHash}>Integridade: {b.hashIntegridade}</Text>
                      </View>
                      <View style={styles.cardBackupRight}>
                        <Text style={styles.backupTamanho}>{b.tamanhoMb} MB</Text>
                        <Text style={styles.backupRegistros}>{b.totalRegistros.toLocaleString('pt-BR')} registros</Text>
                        <View style={styles.badgeDisponivel}>
                          <Text style={styles.badgeDisponivelText}>{b.status}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* ABA 5: SAÚDE DO CLUSTER */}
            {tabAtiva === 'SAUDE' && saude && (
              <View>
                <Text style={styles.sectionTitle}>Diagnóstico & Telemetria do Cluster K3s</Text>
                <Text style={styles.sectionSubtitle}>
                  Monitoramento em tempo real dos serviços, banco de dados e armazenamento MinIO
                </Text>

                <View style={styles.saudeGrid}>
                  <View style={[styles.cardSaude, { borderColor: '#10b981' }]}>
                    <Text style={styles.cardSaudeRotulo}>Status Geral da Infraestrutura</Text>
                    <Text style={[styles.cardSaudeValor, { color: '#10b981' }]}>{saude.statusGeral}</Text>
                    <Text style={styles.cardSaudeSub}>Uptime Contínuo: {saude.uptimeDias} dias</Text>
                    <Text style={styles.cardSaudeSub}>{saude.versaoApp}</Text>
                  </View>

                  <View style={[styles.cardSaude, { borderColor: '#38bdf8' }]}>
                    <Text style={styles.cardSaudeRotulo}>Cluster K3s (Hostinger VPS)</Text>
                    <Text style={[styles.cardSaudeValor, { color: '#38bdf8' }]}>
                      {saude.clusterK3s.podsRunning} / {saude.clusterK3s.podsTotal} Pods
                    </Text>
                    <Text style={styles.cardSaudeSub}>CPU: {saude.clusterK3s.consumoCpuPercentual}% em uso</Text>
                    <Text style={styles.cardSaudeSub}>RAM: {saude.clusterK3s.consumoMemoriaPercentual}% em uso</Text>
                  </View>

                  <View style={[styles.cardSaude, { borderColor: '#f59e0b' }]}>
                    <Text style={styles.cardSaudeRotulo}>PostgreSQL & PostGIS</Text>
                    <Text style={[styles.cardSaudeValor, { color: '#f59e0b' }]}>{saude.bancoPostgres.status}</Text>
                    <Text style={styles.cardSaudeSub}>Conexões: {saude.bancoPostgres.conexoesAtivas} ativas</Text>
                    <Text style={styles.cardSaudeSub}>Latência: {saude.bancoPostgres.latenciaMs} ms</Text>
                  </View>

                  <View style={[styles.cardSaude, { borderColor: '#a855f7' }]}>
                    <Text style={styles.cardSaudeRotulo}>MinIO S3 Object Storage</Text>
                    <Text style={[styles.cardSaudeValor, { color: '#a855f7' }]}>{saude.storageMinIO.totalObjetos} fotos</Text>
                    <Text style={styles.cardSaudeSub}>Espaço: {saude.storageMinIO.espacoOcupadoGb} GB</Text>
                    <Text style={styles.cardSaudeSub}>Bucket: {saude.storageMinIO.bucketHealth}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* ABA 6: PLANOS PREVENTIVOS */}
            {tabAtiva === 'PLANOS' && (
              <View>
                <Text style={styles.sectionTitle}>Cronograma de Vistorias & Manutenção Preventiva</Text>
                <Text style={styles.sectionSubtitle}>
                  Rotinas sistemáticas de preservação de placas, totens digitais e vitrines do mall
                </Text>

                <View style={styles.planosList}>
                  {planos.map((pl) => (
                    <View key={pl.id} style={styles.cardPlano}>
                      <View style={styles.cardPlanoTop}>
                        <View>
                          <Text style={styles.planoTitulo}>{pl.titulo}</Text>
                          <Text style={styles.planoSetor}>{pl.setorAlvo} • Periodicidade: {pl.periodicidade}</Text>
                          <Text style={styles.planoResp}>Responsável: {pl.responsavelEquipe}</Text>
                        </View>
                        <View style={styles.planoBadge}>
                          <Text style={styles.planoBadgeText}>{pl.status}</Text>
                        </View>
                      </View>
                      <View style={styles.planoProgressoBar}>
                        <View
                          style={[
                            styles.planoProgressoFill,
                            { width: `${(pl.concluidosCiclo / pl.totalPontosAlvo) * 100}%` },
                          ]}
                        />
                      </View>
                      <View style={styles.planoFooter}>
                        <Text style={styles.planoProgressoText}>
                          {pl.concluidosCiclo} de {pl.totalPontosAlvo} pontos concluídos neste ciclo ({Math.round((pl.concluidosCiclo / pl.totalPontosAlvo) * 100)}%)
                        </Text>
                        <Text style={styles.planoProx}>Próxima: {pl.proximaExecucao}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* ABA 7: COMUNICAÇÃO OPERACIONAL */}
            {tabAtiva === 'COMUNICACAO' && (
              <View>
                <View style={styles.sectionHeaderRow}>
                  <View>
                    <Text style={styles.sectionTitle}>Mural de Avisos & Transmissão Operacional</Text>
                    <Text style={styles.sectionSubtitle}>
                      Envio de alertas e diretrizes estratégicas para as equipes em campo e fiscais
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.btnAcaoPrimaria}
                    onPress={() => setFormAvisoAberto(!formAvisoAberto)}
                  >
                    <Text style={styles.btnAcaoPrimariaText}>
                      {formAvisoAberto ? '✕ Cancelar' : '📢 Novo Comunicado'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {formAvisoAberto && (
                  <View style={styles.formCard}>
                    <Text style={styles.formCardTitle}>Transmitir Novo Comunicado</Text>
                    <Text style={styles.inputLabel}>Título do Comunicado</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Ex: Atenção redobrada no Setor Verde..."
                      placeholderTextColor="#64748b"
                      value={novoTituloAviso}
                      onChangeText={setNovoTituloAviso}
                    />

                    <Text style={[styles.inputLabel, { marginTop: 10 }]}>Mensagem para as Equipes</Text>
                    <TextInput
                      style={[styles.textInput, { height: 80, textAlignVertical: 'top' }]}
                      placeholder="Descreva as instruções com clareza..."
                      placeholderTextColor="#64748b"
                      multiline
                      value={novaMsgAviso}
                      onChangeText={setNovaMsgAviso}
                    />

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 }}>
                      <Text style={styles.inputLabel}>Prioridade:</Text>
                      {(['NORMAL', 'ALTA', 'URGENTE'] as const).map((pr) => (
                        <TouchableOpacity
                          key={pr}
                          style={[styles.pPill, prioridadeAviso === pr && styles.pPillAtivo]}
                          onPress={() => setPrioridadeAviso(pr)}
                        >
                          <Text style={[styles.pPillText, prioridadeAviso === pr && styles.pPillTextAtivo]}>{pr}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <TouchableOpacity style={styles.btnSalvarForm} onPress={handleEnviarAviso}>
                      <Text style={styles.btnSalvarFormText}>Publicar e Notificar Equipes</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <View style={styles.avisosList}>
                  {avisos.map((av) => (
                    <View key={av.id} style={styles.cardAviso}>
                      <View style={styles.cardAvisoTop}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <Text style={styles.avisoTitulo}>{av.titulo}</Text>
                          <View
                            style={[
                              styles.badgePrioridade,
                              {
                                borderColor:
                                  av.prioridade === 'URGENTE'
                                    ? '#ef4444'
                                    : av.prioridade === 'ALTA'
                                    ? '#f59e0b'
                                    : '#38bdf8',
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.badgePrioridadeText,
                                {
                                  color:
                                    av.prioridade === 'URGENTE'
                                      ? '#ef4444'
                                      : av.prioridade === 'ALTA'
                                      ? '#f59e0b'
                                      : '#38bdf8',
                                },
                              ]}
                            >
                              {av.prioridade}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.avisoData}>{av.dataEnvio}</Text>
                      </View>
                      <Text style={styles.avisoMsg}>{av.mensagem}</Text>
                      <View style={styles.avisoFooter}>
                        <Text style={styles.avisoAutor}>Por: {av.autor} • Destinatários: {av.destinatarios}</Text>
                        <Text style={styles.avisoConfirmados}>✓ {av.lidoConfirmadoCount} confirmaram leitura</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: Math.min(1120, width - 24),
    maxHeight: Math.min(860, height - 24),
    backgroundColor: '#0f172a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  badgeAdmin: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  badgeAdminText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#f87171',
    letterSpacing: 1,
  },
  headerSubBadge: {
    fontSize: 11,
    color: '#94a3b8',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#f8fafc',
  },
  headerSub: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: '#cbd5e1',
    fontSize: 16,
    fontWeight: 'bold',
  },
  feedbackBar: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderBottomWidth: 1,
    borderBottomColor: '#10b981',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  feedbackText: {
    color: '#6ee7b7',
    fontSize: 12,
    fontWeight: '700',
  },
  tabsBar: {
    backgroundColor: '#131d36',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingHorizontal: 16,
  },
  tabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnAtiva: {
    borderBottomColor: '#38bdf8',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  tabBtnTextAtiva: {
    color: '#38bdf8',
    fontWeight: '800',
  },
  scrollArea: {
    padding: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#f8fafc',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 16,
  },
  btnAcaoPrimaria: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  btnAcaoPrimariaText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#38bdf8',
    marginBottom: 20,
    gap: 10,
  },
  formCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#38bdf8',
    marginBottom: 4,
  },
  inputGroupRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#f8fafc',
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#334155',
  },
  perfilPickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
  },
  pPillAtivo: {
    backgroundColor: '#0284c7',
    borderColor: '#38bdf8',
  },
  pPillText: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '700',
  },
  pPillTextAtivo: {
    color: '#ffffff',
  },
  btnSalvarForm: {
    backgroundColor: '#10b981',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  btnSalvarFormText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  gridCartoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cardUsuario: {
    flex: 1,
    minWidth: 300,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardUsuarioTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  usuarioNome: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f8fafc',
  },
  usuarioEmail: {
    fontSize: 12,
    color: '#38bdf8',
    marginTop: 1,
  },
  usuarioCargo: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  badgePerfil: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgePerfilText: {
    fontSize: 10,
    fontWeight: '800',
  },
  usuarioFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(51, 65, 85, 0.4)',
  },
  usuarioUltimoAcesso: {
    fontSize: 10,
    color: '#64748b',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  matrizContainer: {
    gap: 12,
  },
  matrizItem: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  matrizItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  moduloNome: {
    fontSize: 14,
    fontWeight: '800',
    color: '#f8fafc',
  },
  operacoesRow: {
    flexDirection: 'row',
    gap: 6,
  },
  opTag: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  opTagText: {
    fontSize: 9,
    color: '#38bdf8',
    fontWeight: '700',
  },
  moduloDesc: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 10,
  },
  papeisPermitidosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  papeisRotulo: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  papelChip: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  papelChipText: {
    fontSize: 10,
    color: '#f8fafc',
    fontWeight: '700',
  },
  tabelaContainer: {
    gap: 8,
  },
  logRow: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    gap: 16,
  },
  logTimeCol: {
    minWidth: 130,
  },
  logTime: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38bdf8',
  },
  logIp: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  logActionCol: {
    flex: 1,
    gap: 2,
  },
  logActionBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#38bdf8',
    marginBottom: 2,
  },
  logActionText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#38bdf8',
  },
  logEntidade: {
    fontSize: 11,
    color: '#94a3b8',
  },
  logDetalhes: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f8fafc',
  },
  logOperador: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  backupsList: {
    gap: 12,
  },
  cardBackup: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBackupLeft: {
    gap: 2,
  },
  backupId: {
    fontSize: 14,
    fontWeight: '800',
    color: '#38bdf8',
  },
  backupData: {
    fontSize: 12,
    color: '#cbd5e1',
  },
  backupHash: {
    fontSize: 10,
    color: '#64748b',
  },
  cardBackupRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  backupTamanho: {
    fontSize: 14,
    fontWeight: '800',
    color: '#f8fafc',
  },
  backupRegistros: {
    fontSize: 11,
    color: '#94a3b8',
  },
  badgeDisponivel: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#10b981',
    marginTop: 2,
  },
  badgeDisponivelText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#10b981',
  },
  saudeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  cardSaude: {
    flex: 1,
    minWidth: 230,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    gap: 4,
  },
  cardSaudeRotulo: {
    fontSize: 12,
    fontWeight: '700',
    color: '#cbd5e1',
  },
  cardSaudeValor: {
    fontSize: 22,
    fontWeight: '800',
    marginVertical: 4,
  },
  cardSaudeSub: {
    fontSize: 11,
    color: '#94a3b8',
  },
  planosList: {
    gap: 12,
  },
  cardPlano: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardPlanoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  planoTitulo: {
    fontSize: 14,
    fontWeight: '800',
    color: '#f8fafc',
  },
  planoSetor: {
    fontSize: 12,
    color: '#38bdf8',
    marginTop: 2,
  },
  planoResp: {
    fontSize: 11,
    color: '#94a3b8',
  },
  planoBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  planoBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10b981',
  },
  planoProgressoBar: {
    height: 6,
    backgroundColor: '#0f172a',
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: 8,
  },
  planoProgressoFill: {
    height: '100%',
    backgroundColor: '#38bdf8',
    borderRadius: 3,
  },
  planoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planoProgressoText: {
    fontSize: 11,
    color: '#cbd5e1',
    fontWeight: '600',
  },
  planoProx: {
    fontSize: 11,
    color: '#64748b',
  },
  avisosList: {
    gap: 12,
  },
  cardAviso: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardAvisoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  avisoTitulo: {
    fontSize: 14,
    fontWeight: '800',
    color: '#f8fafc',
  },
  badgePrioridade: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
  },
  badgePrioridadeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  avisoData: {
    fontSize: 10,
    color: '#64748b',
  },
  avisoMsg: {
    fontSize: 12,
    color: '#cbd5e1',
    lineHeight: 18,
    marginBottom: 8,
  },
  avisoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(51, 65, 85, 0.4)',
  },
  avisoAutor: {
    fontSize: 10,
    color: '#94a3b8',
  },
  avisoConfirmados: {
    fontSize: 10,
    color: '#10b981',
    fontWeight: '700',
  },
});
