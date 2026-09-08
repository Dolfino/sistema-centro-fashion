import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  Platform,
  useWindowDimensions,
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
  onAbrirCartografia?: () => void;
}

export type TabAdmin =
  | 'USUARIOS'
  | 'PERFIS'
  | 'AUDITORIA'
  | 'ACESSOS'
  | 'BACKUP'
  | 'SAUDE'
  | 'INVENTARIO'
  | 'PLANOS'
  | 'COMUNICACAO'
  | 'CARTOGRAFIA';

interface DispositivoSessao {
  id: string;
  nome: string;
  tipo: 'CONFIÁVEL' | 'TEMPORÁRIA';
  status: 'ATIVA' | 'EXPIRADA' | 'REVOGADA';
  ref: string;
  ultimoUso: string;
  expira: string;
  criada: string;
  versao: string;
}

interface RegraComunicacao {
  id: string;
  titulo: string;
  nivelMinimo: string;
  cooldown: string;
  destinatarios: string;
  escalonamento: string;
  status: 'ATIVA' | 'INATIVA';
}

export const AdminModal: React.FC<AdminModalProps> = ({
  visible,
  userRole = 'ADMIN',
  onClose,
  onAbrirCartografia,
}) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const [tabAtiva, setTabAtiva] = useState<TabAdmin>('USUARIOS');
  const [usuarios, setUsuarios] = useState<UsuarioSistema[]>([]);
  const [permissoes, setPermissoes] = useState<PermissaoModulo[]>([]);
  const [logs, setLogs] = useState<EventoAuditoria[]>([]);
  const [backups, setBackups] = useState<PontoBackup[]>([]);
  const [saude, setSaude] = useState<DiagnosticoSaude | null>(null);
  const [planos, setPlanos] = useState<PlanoPreventivo[]>([]);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Filtros de Acessos & Dispositivos
  const [buscaDispositivo, setBuscaDispositivo] = useState('');
  const [filtroStatusDisp, setFiltroStatusDisp] = useState('TODOS');
  const [filtroTipoDisp, setFiltroTipoDisp] = useState('TODOS');

  // Dispositivos do usuário David
  const [dispositivos, setDispositivos] = useState<DispositivoSessao[]>([
    {
      id: 'disp-1',
      nome: 'Google Chrome • Linux',
      tipo: 'CONFIÁVEL',
      status: 'ATIVA',
      ref: 'A7DF6D3C14',
      ultimoUso: '06/09/2026, 21:44:30',
      expira: '12/09/2026, 13:07:58',
      criada: '05/09/2026, 13:07:54',
      versao: 'MVP-3.32.0-SINALIZACAO-S26.10',
    },
    {
      id: 'disp-2',
      nome: 'Google Chrome • Linux',
      tipo: 'CONFIÁVEL',
      status: 'EXPIRADA',
      ref: '00195C0C36',
      ultimoUso: '30/08/2026, 17:09:52',
      expira: '06/09/2026, 16:59:09',
      criada: '30/08/2026, 16:59:06',
      versao: 'MVP-3.32.0-SINALIZACAO-S26.10',
    },
    {
      id: 'disp-3',
      nome: 'Dispositivo identificado',
      tipo: 'TEMPORÁRIA',
      status: 'EXPIRADA',
      ref: '5A35BD6881',
      ultimoUso: '30/08/2026, 13:25:02',
      expira: '31/08/2026, 01:25:02',
      criada: '30/08/2026, 13:25:02',
      versao: 'MVP-3.32.0-SINALIZACAO-S26.10',
    },
    {
      id: 'disp-4',
      nome: 'Google Chrome • Android',
      tipo: 'CONFIÁVEL',
      status: 'EXPIRADA',
      ref: '80EE9C3433',
      ultimoUso: '28/08/2026, 10:40:00',
      expira: '03/09/2026, 12:18:19',
      criada: '27/08/2026, 12:18:13',
      versao: 'MVP-3.31.0-SINALIZACAO-S26.9',
    },
  ]);

  // Regras de Comunicação
  const [automacaoAtiva, setAutomacaoAtiva] = useState(true);
  const [regrasComunicacao, setRegrasComunicacao] = useState<RegraComunicacao[]>([
    {
      id: 'r-1',
      titulo: 'Críticos — e-mail imediato',
      nivelMinimo: 'CRÍTICO',
      cooldown: '24 h',
      destinatarios: 'davidsilva@centrofashion.com,davidsilva.centrofashion@gmail.com',
      escalonamento: 'não configurado',
      status: 'ATIVA',
    },
    {
      id: 'r-2',
      titulo: 'Altos — e-mail',
      nivelMinimo: 'ALTO',
      cooldown: '24 h',
      destinatarios: 'davidsilva@centrofashion.com,davidsilva.centrofashion@gmail.com',
      escalonamento: 'davidsilva.centrofashion@gmail.com',
      status: 'ATIVA',
    },
    {
      id: 'r-3',
      titulo: 'Médios — resumo operacional',
      nivelMinimo: 'MEDIO',
      cooldown: '24 h',
      destinatarios: 'davidsilva@centrofashion.com,davidsilva.centrofashion@gmail.com',
      escalonamento: 'não configurado',
      status: 'ATIVA',
    },
  ]);

  // Lista padrão de usuários com paridade ao Google Apps Script
  const usuariosPadrao = [
    {
      id: 'u-1',
      nome: 'davidsilva.centrofashion',
      email: 'davidsilva.centrofashion@gmail.com',
      ultimoAcesso: '07/09/2026 19:20',
      perfil: 'ADMIN',
      status: 'ATIVO',
    },
    {
      id: 'u-2',
      nome: 'David Nascimento da Silva',
      email: 'centrofashionmarketing@gmail.com',
      ultimoAcesso: '03/09/2026 19:12',
      perfil: 'ADMIN',
      status: 'ATIVO',
    },
    {
      id: 'u-3',
      nome: 'Wendel',
      email: 'wendellucas@centrofashion.com',
      ultimoAcesso: '21/08/2026 15:34',
      perfil: 'CONSULTA',
      status: 'ATIVO',
    },
    {
      id: 'u-4',
      nome: 'Albanir',
      email: 'albaniramerico@centrofashion.com',
      ultimoAcesso: '—',
      perfil: 'CONSULTA',
      status: 'ATIVO',
    },
  ];

  useEffect(() => {
    if (visible) {
      setUsuarios(AdminService.obterUsuarios());
      setPermissoes(AdminService.obterMatrizPermissoes());
      setLogs(AdminService.obterLogsAuditoria());
      setBackups(AdminService.obterBackups());
      setSaude(AdminService.obterDiagnosticoSaude());
      setPlanos(AdminService.obterPlanosPreventivos());
    }
  }, [visible]);

  if (!visible) return null;

  const mostrarToast = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleRevogarDispositivo = (id: string) => {
    setDispositivos((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'REVOGADA' } : d))
    );
    mostrarToast('Dispositivo revogado com sucesso!');
  };

  const handleRevogarTodos = () => {
    setDispositivos((prev) => prev.map((d) => ({ ...d, status: 'REVOGADA' })));
    mostrarToast('Todas as sessões e dispositivos foram revogados.');
  };

  const tabsConfig: { key: TabAdmin; label: string }[] = [
    { key: 'USUARIOS', label: 'Usuários' },
    { key: 'PERFIS', label: 'Perfis e permissões' },
    { key: 'AUDITORIA', label: 'Auditoria' },
    { key: 'ACESSOS', label: 'Acessos e dispositivos' },
    { key: 'BACKUP', label: 'Backup e integridade' },
    { key: 'SAUDE', label: 'Saúde operacional' },
    { key: 'INVENTARIO', label: 'Inventário' },
    { key: 'PLANOS', label: 'Planos preventivos' },
    { key: 'COMUNICACAO', label: 'Comunicação' },
    { key: 'CARTOGRAFIA', label: 'Cartografia' },
  ];

  return (
    <View style={styles.modalOverlay}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View
        style={[
          styles.modalContainer,
          {
            width: Math.min(windowWidth * 0.96, 1140),
            height: Math.min(windowHeight * 0.94, 900),
          },
        ]}
      >
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerCode}>S14</Text>
            <Text style={styles.headerTitle}>Administração e Governança</Text>
          </View>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* FEEDBACK TOAST */}
        {feedbackMsg && (
          <View style={styles.toastBar}>
            <Text style={styles.toastText}>✓ {feedbackMsg}</Text>
          </View>
        )}

        <ScrollView
          style={styles.scrollBody}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          {/* CARD DO USUÁRIO LOGADO */}
          <View style={styles.userProfileCard}>
            <Text style={styles.userProfileName}>davidsilva.centrofashion</Text>
            <Text style={styles.userProfileSub}>
              davidsilva.centrofashion@gmail.com • Perfil ADMIN
            </Text>
          </View>

          {/* MENU DE ABAS EM PÍLULAS (2 LINHAS) */}
          <View style={styles.pillTabsWrapper}>
            {tabsConfig.map((tab) => {
              const ativa = tabAtiva === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.pillTab, ativa && styles.pillTabAtiva]}
                  onPress={() => {
                    if (tab.key === 'CARTOGRAFIA' && onAbrirCartografia) {
                      onAbrirCartografia();
                    } else {
                      setTabAtiva(tab.key);
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.pillTabText, ativa && styles.pillTabTextAtiva]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ========================================================== */}
          {/* ABA 1: USUÁRIOS */}
          {/* ========================================================== */}
          {tabAtiva === 'USUARIOS' && (
            <View style={styles.tabContentSection}>
              <View style={styles.tabActionHeaderRow}>
                <View style={{ flex: 1 }} />
                <TouchableOpacity
                  style={styles.btnMagenta}
                  onPress={() => mostrarToast('Abrindo formulário de novo usuário...')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.btnMagentaText}>Novo usuário</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.cardsList}>
                {usuariosPadrao.map((user) => (
                  <View key={user.id} style={styles.userCard}>
                    <View style={styles.userCardHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.userCardName}>{user.nome}</Text>
                        <Text style={styles.userCardEmail}>{user.email}</Text>
                        <Text style={styles.userCardAcesso}>
                          Último acesso: {user.ultimoAcesso}
                        </Text>
                        <View style={styles.userBadgesRow}>
                          <View style={styles.badgeCinza}>
                            <Text style={styles.badgeCinzaText}>{user.perfil}</Text>
                          </View>
                          <View style={styles.badgeCinza}>
                            <Text style={styles.badgeCinzaText}>{user.status}</Text>
                          </View>
                        </View>
                      </View>

                      <TouchableOpacity
                        style={styles.btnEditarOutline}
                        onPress={() => mostrarToast(`Editando usuário: ${user.nome}`)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.btnEditarOutlineText}>Editar</Text>
                      </TouchableOpacity>
                    </View>

                    {/* BOTÃO INFERIOR LARGO DEFINIR PIN */}
                    <TouchableOpacity
                      style={styles.btnDefinirPin}
                      onPress={() => mostrarToast(`Definir PIN para ${user.nome}`)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.btnDefinirPinText}>Definir PIN</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ========================================================== */}
          {/* ABA 2: PERFIS E PERMISSÕES */}
          {/* ========================================================== */}
          {tabAtiva === 'PERFIS' && (
            <View style={styles.tabContentSection}>
              <View style={styles.cardsList}>
                {/* ADMIN */}
                <View style={styles.perfilCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.perfilCardTitle}>ADMIN</Text>
                    <Text style={styles.perfilCardSub}>Administrador geral</Text>
                    <View style={styles.perfilTagsRow}>
                      {[
                        'Dashboard',
                        'Relatórios',
                        'Admin',
                        'Cadastrar',
                        'Inspecionar',
                        'Central',
                        'Pendências',
                        'Mapa',
                        'Editar',
                      ].map((tag) => (
                        <View key={tag} style={styles.perfilTagBadge}>
                          <Text style={styles.perfilTagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.btnEditarOutline}
                    onPress={() => mostrarToast('Editando perfil ADMIN')}
                  >
                    <Text style={styles.btnEditarOutlineText}>Editar</Text>
                  </TouchableOpacity>
                </View>

                {/* GESTOR */}
                <View style={styles.perfilCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.perfilCardTitle}>GESTOR</Text>
                    <Text style={styles.perfilCardSub}>Gestor operacional</Text>
                    <View style={styles.perfilTagsRow}>
                      {[
                        'Dashboard',
                        'Relatórios',
                        'Cadastrar',
                        'Inspecionar',
                        'Central',
                        'Pendências',
                        'Mapa',
                        'Editar',
                      ].map((tag) => (
                        <View key={tag} style={styles.perfilTagBadge}>
                          <Text style={styles.perfilTagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.btnEditarOutline}
                    onPress={() => mostrarToast('Editando perfil GESTOR')}
                  >
                    <Text style={styles.btnEditarOutlineText}>Editar</Text>
                  </TouchableOpacity>
                </View>

                {/* OPERACIONAL */}
                <View style={styles.perfilCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.perfilCardTitle}>OPERACIONAL</Text>
                    <Text style={styles.perfilCardSub}>Operação de campo</Text>
                    <View style={styles.perfilTagsRow}>
                      {['Cadastrar', 'Inspecionar', 'Pendências', 'Mapa'].map((tag) => (
                        <View key={tag} style={styles.perfilTagBadge}>
                          <Text style={styles.perfilTagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.btnEditarOutline}
                    onPress={() => mostrarToast('Editando perfil OPERACIONAL')}
                  >
                    <Text style={styles.btnEditarOutlineText}>Editar</Text>
                  </TouchableOpacity>
                </View>

                {/* CONSULTA */}
                <View style={styles.perfilCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.perfilCardTitle}>CONSULTA</Text>
                    <Text style={styles.perfilCardSub}>Somente consulta</Text>
                    <View style={styles.perfilTagsRow}>
                      {['Mapa'].map((tag) => (
                        <View key={tag} style={styles.perfilTagBadge}>
                          <Text style={styles.perfilTagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.btnEditarOutline}
                    onPress={() => mostrarToast('Editando perfil CONSULTA')}
                  >
                    <Text style={styles.btnEditarOutlineText}>Editar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* ========================================================== */}
          {/* ABA 4: ACESSOS E DISPOSITIVOS */}
          {/* ========================================================== */}
          {tabAtiva === 'ACESSOS' && (
            <View style={styles.tabContentSection}>
              {/* CARD SUPERIOR DE ACESSOS E DISPOSITIVOS */}
              <View style={styles.acessosHeaderCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.acessosHeaderTitle}>
                    Acessos e dispositivos confiáveis
                  </Text>
                  <Text style={styles.acessosHeaderSub}>
                    Gerencie sessões do Mall sem expor PINs ou tokens.
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.btnOutline}
                  onPress={() => mostrarToast('Sessões atualizadas')}
                >
                  <Text style={styles.btnOutlineText}>Atualizar</Text>
                </TouchableOpacity>
              </View>

              {/* 4 CARDS DE MÉTRICAS */}
              <View style={styles.metricsGrid4}>
                <View style={styles.metricItemBox}>
                  <Text style={styles.metricItemNum}>2</Text>
                  <Text style={styles.metricItemLbl}>Dispositivos confiáveis ativos</Text>
                </View>
                <View style={styles.metricItemBox}>
                  <Text style={styles.metricItemNum}>2</Text>
                  <Text style={styles.metricItemLbl}>Sessões ativas</Text>
                </View>
                <View style={styles.metricItemBox}>
                  <Text style={styles.metricItemNum}>0</Text>
                  <Text style={styles.metricItemLbl}>Expiram em 24h</Text>
                </View>
                <View style={styles.metricItemBox}>
                  <Text style={styles.metricItemNum}>4</Text>
                  <Text style={styles.metricItemLbl}>Usuários com histórico</Text>
                </View>
              </View>

              {/* FILTROS */}
              <View style={styles.filtrosAcessosRow}>
                <TextInput
                  style={[styles.filterInput, { flex: 1.6 }]}
                  placeholder="Buscar usuário, e-mail ou dispositivo..."
                  placeholderTextColor="#94a3b8"
                  value={buscaDispositivo}
                  onChangeText={setBuscaDispositivo}
                />
                {Platform.OS === 'web' ? (
                  <>
                    <select
                      value={filtroStatusDisp}
                      onChange={(e) => setFiltroStatusDisp(e.target.value)}
                      style={styles.webSelect}
                    >
                      <option value="TODOS">Todos os status</option>
                      <option value="ATIVA">Ativos</option>
                      <option value="EXPIRADA">Expirados</option>
                      <option value="REVOGADA">Revogados</option>
                    </select>

                    <select
                      value={filtroTipoDisp}
                      onChange={(e) => setFiltroTipoDisp(e.target.value)}
                      style={styles.webSelect}
                    >
                      <option value="TODOS">Todos os tipos</option>
                      <option value="CONFIÁVEL">Confiáveis</option>
                      <option value="TEMPORÁRIA">Temporários</option>
                    </select>
                  </>
                ) : null}
              </View>

              {/* BLOCO USUÁRIO DAVID */}
              <View style={styles.userSessoesBox}>
                <View style={styles.userSessoesHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.userSessoesNome}>David</Text>
                    <Text style={styles.userSessoesEmail}>
                      davidnascimentodasilva@gmail.com • Perfil ADMIN
                    </Text>
                    <View style={styles.userSessoesBadges}>
                      <View style={styles.badgePillBlue}>
                        <Text style={styles.badgePillBlueText}>USUÁRIO ATIVO</Text>
                      </View>
                      <View style={styles.badgePillGray}>
                        <Text style={styles.badgePillGrayText}>1 confiável(is) ativo(s)</Text>
                      </View>
                      <View style={styles.badgePillGray}>
                        <Text style={styles.badgePillGrayText}>1 sessão(ões) ativa(s)</Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.btnRevogarTodos}
                    onPress={handleRevogarTodos}
                  >
                    <Text style={styles.btnRevogarTodosText}>Revogar todos</Text>
                  </TouchableOpacity>
                </View>

                {/* LISTA DE DISPOSITIVOS */}
                <View style={{ gap: 10, marginTop: 14 }}>
                  {dispositivos.map((disp) => {
                    const isAtiva = disp.status === 'ATIVA';

                    return (
                      <View key={disp.id} style={styles.dispCard}>
                        <View style={styles.dispCardContent}>
                          <View style={styles.dispCardHeader}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                              <View
                                style={[
                                  styles.dispDiamond,
                                  isAtiva ? styles.dispDiamondActive : styles.dispDiamondInactive,
                                ]}
                              />
                              <Text style={styles.dispCardNome}>{disp.nome}</Text>
                              {isAtiva ? (
                                <View style={styles.badgeStatusGreen}>
                                  <Text style={styles.badgeStatusGreenText}>ATIVA</Text>
                                </View>
                              ) : (
                                <View style={styles.badgeStatusOrange}>
                                  <Text style={styles.badgeStatusOrangeText}>EXPIRADA</Text>
                                </View>
                              )}
                            </View>

                            {isAtiva && (
                              <TouchableOpacity
                                style={styles.btnRevogarDisp}
                                onPress={() => handleRevogarDispositivo(disp.id)}
                              >
                                <Text style={styles.btnRevogarDispText}>
                                  Revogar dispositivo
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>

                          <Text style={styles.dispCardMeta}>
                            DISPOSITIVO {disp.tipo} • Ref. {disp.ref}
                          </Text>
                          <Text style={styles.dispCardMetaSub}>
                            Último uso: {disp.ultimoUso} • Expira: {disp.expira}
                          </Text>
                          <Text style={styles.dispCardMetaSub}>
                            Criada: {disp.criada} • {disp.versao}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          )}

          {/* ========================================================== */}
          {/* ABA 9: COMUNICAÇÃO */}
          {/* ========================================================== */}
          {tabAtiva === 'COMUNICACAO' && (
            <View style={styles.tabContentSection}>
              {/* BOTÕES DE TOPO */}
              <View style={styles.comunicacaoTopActions}>
                <TouchableOpacity
                  style={styles.btnMagenta}
                  onPress={() => mostrarToast('Abrindo formulário de nova regra')}
                >
                  <Text style={styles.btnMagentaText}>Nova regra</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btnOutline}
                  onPress={() => mostrarToast('Processando regras de comunicação...')}
                >
                  <Text style={styles.btnOutlineText}>Processar agora</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btnOutline}
                  onPress={() => mostrarToast('Regras atualizadas')}
                >
                  <Text style={styles.btnOutlineText}>Atualizar</Text>
                </TouchableOpacity>
              </View>

              {/* CARD AUTOMAÇÃO HORÁRIA */}
              <View style={styles.automacaoCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.automacaoTitle}>Automação horária</Text>
                  <Text style={styles.automacaoSub}>
                    {automacaoAtiva ? 'ATIVA' : 'DESATIVADA'} • execução horária • 1 gatilho(s)
                  </Text>
                </View>

                <View style={styles.automacaoBtnsGroup}>
                  <TouchableOpacity
                    style={[styles.btnOutlineSmall, { opacity: automacaoAtiva ? 0.5 : 1 }]}
                    disabled={automacaoAtiva}
                    onPress={() => {
                      setAutomacaoAtiva(true);
                      mostrarToast('Automação ativada');
                    }}
                  >
                    <Text style={styles.btnOutlineSmallText}>Ativar automação</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnOutlineSmall}
                    onPress={() => {
                      setAutomacaoAtiva(false);
                      mostrarToast('Automação desativada');
                    }}
                  >
                    <Text style={styles.btnOutlineSmallText}>Desativar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnOutlineSmall}
                    onPress={() => mostrarToast('Executando teste agora...')}
                  >
                    <Text style={styles.btnOutlineSmallText}>Executar teste agora</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnOutlineSmall}
                    onPress={() => mostrarToast('Testando escalonamento...')}
                  >
                    <Text style={styles.btnOutlineSmallText}>Testar escalonamento</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* AVISO AMARELO */}
              <View style={styles.avisoAmareloBox}>
                <Text style={styles.avisoAmareloText}>
                  As regras são criadas desativadas. Nenhum e-mail é enviado automaticamente até você ativar uma regra.
                </Text>
              </View>

              {/* SEÇÃO REGRAS */}
              <View style={{ gap: 10, marginTop: 4 }}>
                <Text style={styles.sectionSubtitleBold}>Regras</Text>

                {regrasComunicacao.map((regra) => (
                  <View key={regra.id} style={styles.regraCard}>
                    <View style={{ flex: 1, gap: 3 }}>
                      <Text style={styles.regraTitle}>{regra.titulo}</Text>
                      <Text style={styles.regraMeta}>
                        {regra.status} • nível mínimo {regra.nivelMinimo} • cooldown {regra.cooldown}
                      </Text>
                      <Text style={styles.regraMeta}>Destino: {regra.destinatarios}</Text>
                      <Text style={styles.regraMeta}>
                        Escalonamento após {regra.nivelMinimo === 'ALTO' ? '6 h → ' : '2 h — '}
                        {regra.escalonamento}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.btnEditarOutline}
                      onPress={() => mostrarToast(`Editando regra: ${regra.titulo}`)}
                    >
                      <Text style={styles.btnEditarOutlineText}>Editar</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              {/* HISTÓRICO DE ENVIOS */}
              <View style={{ gap: 10, marginTop: 14 }}>
                <Text style={styles.sectionSubtitleBold}>Histórico de envios</Text>

                <View style={styles.envioCard}>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={styles.envioTitle}>
                      ESCALONAMENTO • [Mall • ALERTA] SIG-20260814-0007 — Triedo
                    </Text>
                    <Text style={styles.envioSub}>
                      20/08/2026 07:56 • davidsilva.centrofashion@gmail.com
                    </Text>
                  </View>
                  <Text style={styles.envioSucessoText}>SUCESSO</Text>
                </View>

                <View style={styles.envioCard}>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={styles.envioTitle}>
                      ESCALONAMENTO • [Mall • ALERTA] SIG-20260814-0002 — Placa direcional
                    </Text>
                    <Text style={styles.envioSub}>
                      20/08/2026 07:50 • davidsilva.centrofashion@gmail.com
                    </Text>
                  </View>
                  <Text style={styles.envioSucessoText}>SUCESSO</Text>
                </View>
              </View>
            </View>
          )}

          {/* ========================================================== */}
          {/* DEMAIS ABAS (AUDITORIA, BACKUP, SAÚDE, INVENTÁRIO, PLANOS) */}
          {/* ========================================================== */}
          {tabAtiva === 'AUDITORIA' && (
            <View style={styles.tabContentSection}>
              <Text style={styles.sectionSubtitleBold}>Trilha de Auditoria do Sistema</Text>
              <View style={styles.cardsList}>
                {logs.slice(0, 8).map((log) => (
                  <View key={log.id} style={styles.logCard}>
                    <Text style={styles.logDesc}>{log.detalhes || log.acao}</Text>
                    <Text style={styles.logMeta}>
                      {log.operadorNome || log.operadorEmail} • {log.timestamp} • IP: {log.ipOrigem}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {tabAtiva === 'BACKUP' && (
            <View style={styles.tabContentSection}>
              <Text style={styles.sectionSubtitleBold}>Pontos de Backup & Integridade</Text>
              <View style={styles.cardsList}>
                {backups.map((b) => (
                  <View key={b.id} style={styles.backupCard}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.backupTitulo}>{b.tipo} — {b.id}</Text>
                      <Text style={styles.backupMeta}>
                        Data: {b.dataHora} • Tamanho: {b.tamanhoMb} MB • Registros: {b.totalRegistros}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.btnOutlineSmall}
                      onPress={() => mostrarToast(`Restaurando backup: ${b.id}`)}
                    >
                      <Text style={styles.btnOutlineSmallText}>Restaurar</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {tabAtiva === 'SAUDE' && saude && (
            <View style={styles.tabContentSection}>
              <Text style={styles.sectionSubtitleBold}>Saúde Operacional do Cluster</Text>
              <View style={styles.metricsGrid4}>
                <View style={styles.metricItemBox}>
                  <Text style={styles.metricItemNum}>{saude.statusGeral}</Text>
                  <Text style={styles.metricItemLbl}>Status do Cluster</Text>
                </View>
                <View style={styles.metricItemBox}>
                  <Text style={styles.metricItemNum}>{saude.bancoPostgres.latenciaMs} ms</Text>
                  <Text style={styles.metricItemLbl}>Latência Média</Text>
                </View>
                <View style={styles.metricItemBox}>
                  <Text style={styles.metricItemNum}>{saude.clusterK3s.consumoMemoriaPercentual}%</Text>
                  <Text style={styles.metricItemLbl}>Memória Cluster</Text>
                </View>
                <View style={styles.metricItemBox}>
                  <Text style={styles.metricItemNum}>{saude.bancoPostgres.status}</Text>
                  <Text style={styles.metricItemLbl}>Banco de Dados</Text>
                </View>
              </View>
            </View>
          )}

          {tabAtiva === 'PLANOS' && (
            <View style={styles.tabContentSection}>
              <Text style={styles.sectionSubtitleBold}>Planos Preventivos</Text>
              <View style={styles.cardsList}>
                {planos.map((plano) => (
                  <View key={plano.id} style={styles.userCard}>
                    <Text style={styles.userCardName}>{plano.titulo}</Text>
                    <Text style={styles.userCardEmail}>Setor: {plano.setorAlvo} • Pontos: {plano.totalPontosAlvo}</Text>
                    <Text style={styles.userCardAcesso}>
                      Periodicidade: {plano.periodicidade} • Responsável: {plano.responsavelEquipe}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {tabAtiva === 'INVENTARIO' && (
            <View style={styles.tabContentSection}>
              <Text style={styles.sectionSubtitleBold}>Inventário Geral de Ativos</Text>
              <Text style={styles.userCardEmail}>
                Visualização consolidada de todos os pontos notáveis e estruturas físicas de sinalização.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },
  headerCode: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#475569',
  },
  toastBar: {
    backgroundColor: '#10b981',
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  toastText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 14,
  },
  userProfileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 2,
  },
  userProfileName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  userProfileSub: {
    fontSize: 12,
    color: '#64748b',
  },
  pillTabsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pillTab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillTabAtiva: {
    backgroundColor: '#ec4899',
    borderColor: '#ec4899',
  },
  pillTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
  },
  pillTabTextAtiva: {
    color: '#ffffff',
    fontWeight: '700',
  },
  tabContentSection: {
    gap: 12,
    marginTop: 4,
  },
  tabActionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  btnMagenta: {
    backgroundColor: '#ec4899',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnMagentaText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  cardsList: {
    gap: 10,
  },
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    gap: 10,
  },
  userCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userCardName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  userCardEmail: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 1,
  },
  userCardAcesso: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  userBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  badgeCinza: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeCinzaText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  btnEditarOutline: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#ffffff',
  },
  btnEditarOutlineText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
  },
  btnDefinirPin: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    paddingVertical: 7,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDefinirPinText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  perfilCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    gap: 12,
  },
  perfilCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  perfilCardSub: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 6,
  },
  perfilTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  perfilTagBadge: {
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  perfilTagText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '500',
  },
  acessosHeaderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
  },
  acessosHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  acessosHeaderSub: {
    fontSize: 12,
    color: '#64748b',
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#ffffff',
  },
  btnOutlineText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
  },
  metricsGrid4: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  metricItemBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
  },
  metricItemNum: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  metricItemLbl: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 2,
  },
  filtrosAcessosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  filterInput: {
    height: 36,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#0f172a',
    backgroundColor: '#ffffff',
  },
  webSelect: {
    height: 36,
    paddingLeft: 10,
    paddingRight: 24,
    fontSize: 12,
    color: '#0f172a',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    fontWeight: '500',
  },
  userSessoesBox: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
  },
  userSessoesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 10,
  },
  userSessoesNome: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  userSessoesEmail: {
    fontSize: 12,
    color: '#64748b',
  },
  userSessoesBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  badgePillBlue: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgePillBlueText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563eb',
  },
  badgePillGray: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgePillGrayText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  btnRevogarTodos: {
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ffffff',
  },
  btnRevogarTodosText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#b91c1c',
  },
  dispCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
  },
  dispCardContent: {
    gap: 3,
  },
  dispCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dispDiamond: {
    width: 8,
    height: 8,
    transform: [{ rotate: '45deg' }],
  },
  dispDiamondActive: {
    backgroundColor: '#2563eb',
  },
  dispDiamondInactive: {
    backgroundColor: '#94a3b8',
  },
  dispCardNome: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  badgeStatusGreen: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeStatusGreenText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#166534',
  },
  badgeStatusOrange: {
    backgroundColor: '#ffedd5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeStatusOrangeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9a3412',
  },
  btnRevogarDisp: {
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#ffffff',
  },
  btnRevogarDispText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#b91c1c',
  },
  dispCardMeta: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 2,
  },
  dispCardMetaSub: {
    fontSize: 11,
    color: '#94a3b8',
  },
  comunicacaoTopActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  automacaoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    gap: 10,
  },
  automacaoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  automacaoSub: {
    fontSize: 12,
    color: '#166534',
    fontWeight: '600',
  },
  automacaoBtnsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  btnOutlineSmall: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#ffffff',
  },
  btnOutlineSmallText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1e293b',
  },
  avisoAmareloBox: {
    backgroundColor: '#fefce8',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fef08a',
    padding: 10,
  },
  avisoAmareloText: {
    fontSize: 12,
    color: '#854d0e',
  },
  sectionSubtitleBold: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  regraCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    gap: 10,
  },
  regraTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  regraMeta: {
    fontSize: 11,
    color: '#64748b',
  },
  envioCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
  },
  envioTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  envioSub: {
    fontSize: 11,
    color: '#64748b',
  },
  envioSucessoText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#166534',
  },
  logCard: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 10,
    gap: 2,
  },
  logDesc: {
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '600',
  },
  logMeta: {
    fontSize: 11,
    color: '#64748b',
  },
  backupCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
  },
  backupTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  backupMeta: {
    fontSize: 11,
    color: '#64748b',
  },
});

export default AdminModal;
