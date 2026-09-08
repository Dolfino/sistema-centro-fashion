import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Platform } from 'react-native';

interface AppMenuModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectMenu: (itemId: string) => void;
  userRole?: string;
  contextoSetorAtual?: string;
  initialView?: 'main' | 'cartografia';
}

export const AppMenuModal: React.FC<AppMenuModalProps> = ({
  visible,
  onClose,
  onSelectMenu,
  userRole = 'ADMIN',
  contextoSetorAtual = 'Setor Azul • Piso 1',
  initialView = 'main',
}) => {
  const [viewMode, setViewMode] = React.useState<'main' | 'cartografia'>('main');

  useEffect(() => {
    if (visible) {
      setViewMode(initialView);
    }
  }, [visible, initialView]);

  useEffect(() => {
    if (!visible || Platform.OS !== 'web') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, onClose]);

  if (!visible) return null;

  const isAdmin = userRole === 'ADMIN';
  const temAcessoFinanceiro = userRole === 'ADMIN' || userRole === 'FINANCEIRO' || userRole === 'AUDITORIA';

  const cartografiaItems = [
    {
      id: 'calibracaoBtnS242',
      icon: '✦',
      title: 'Calibração dos níveis',
      desc: 'Alinhar os Setores às plantas operacionais 2025.',
    },
    {
      id: 'areasSubsoloBtn',
      icon: '⌗',
      title: 'Áreas do Subsolo',
      desc: 'Estacionamento, circulação, acessos e área externa do Nível 0.',
    },
    {
      id: 'areasNivel1BtnS246',
      icon: '⌗',
      title: 'Áreas especiais do Nível 1',
      desc: 'Hotel, CDM, frente e áreas externas.',
    },
    {
      id: 'areaVermelhaBtnS244',
      icon: '▱',
      title: 'Estacionamento / Nível 3',
      desc: 'Delimitar a Área Vermelha e o estacionamento.',
    },
    {
      id: 'torresNucleosBtn',
      icon: '⇅',
      title: 'Torres / Núcleos verticais',
      desc: 'Identidades físicas e polígonos independentes em N0, N1, N2 e N3.',
    },
  ];

  const menuItems = [
    { id: 'novo', icon: '＋', label: 'Novo registro', primary: true, adminOnly: false, financeiroOnly: false },
    { id: 'camadasBtn', icon: '▱', label: 'Camadas', primary: false, adminOnly: false, financeiroOnly: false },
    { id: 'referenciasBtn', icon: '📍', label: 'Central de Referências', primary: false, adminOnly: false, financeiroOnly: false },
    { id: 'centralCartograficaBtn', icon: '🗺️', label: 'Cartografia', primary: false, adminOnly: true, financeiroOnly: false },
    { id: 'prepararOffline', icon: '↓', label: 'Atualizar offline', primary: false, adminOnly: false, financeiroOnly: false },
    { id: 'filaBtn', icon: '⇅', label: 'Fila', badge: '0', primary: false, adminOnly: false, financeiroOnly: false },
    { id: 'centralGestaoBtn', icon: '◎', label: 'Central', primary: false, adminOnly: false, financeiroOnly: false },
    { id: 'centralFinanceiraBtn', icon: '💳', label: 'Central Financeira', primary: false, adminOnly: false, financeiroOnly: true },
    { id: 'auditoriaVendasBtn', icon: '📈', label: 'Auditoria de Vendas', primary: false, adminOnly: false, financeiroOnly: true },
    { id: 'analiticaBtn', icon: '📊', label: 'Central Analítica', primary: false, adminOnly: false, financeiroOnly: false },
    { id: 'loja360Btn', icon: '🏬', label: 'Loja 360 / Boxes', primary: false, adminOnly: false, financeiroOnly: false },
    { id: 'ativoMallBtn', icon: '📺', label: 'Ativos do Mall & Mídia', primary: false, adminOnly: false, financeiroOnly: false },
    { id: 'campanhasBtn', icon: '📢', label: 'Campanhas de Marketing', primary: false, adminOnly: false, financeiroOnly: false },
    { id: 'levantamentoBtn', icon: '📝', label: 'Levantamento de Campo', primary: false, adminOnly: false, financeiroOnly: false },
    { id: 'rondaBtn', icon: '📋', label: 'Ronda / Checklist', primary: false, adminOnly: false, financeiroOnly: false },
    { id: 'agendaBtnS19', icon: '□', label: 'Agenda', primary: false, adminOnly: false, financeiroOnly: false },
    { id: 'alertasBtnS21', icon: '!', label: 'Alertas', badge: '0', primary: false, adminOnly: false, financeiroOnly: false },
    { id: 'dashboardBtn', icon: '▦', label: 'Dashboard', primary: false, adminOnly: false, financeiroOnly: false },
    { id: 'relatoriosBtn', icon: '≡', label: 'Relatórios', primary: false, adminOnly: false, financeiroOnly: false },
    { id: 'adminBtnS14', icon: '⚙', label: 'Administração', primary: false, adminOnly: true, financeiroOnly: false },
    { id: 'configuracoesCadastroBtn', icon: '⚙', label: 'Configurações de cadastro', primary: false, adminOnly: true, financeiroOnly: false },
  ];

  return (
    <View style={styles.overlayContainer}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View id="appMenuBackdropS22513" style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View
        id="appMenuS22513"
        style={[
          styles.menuBox,
          viewMode === 'cartografia' && styles.menuBoxCartografia,
        ]}
      >
        {viewMode === 'cartografia' ? (
          <>
            {/* Cabeçalho do Submenu Cartografia */}
            <View style={styles.cartografiaHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                <TouchableOpacity
                  id="btnVoltarMenuMain"
                  style={styles.btnVoltar}
                  onPress={() => setViewMode('main')}
                  accessibilityLabel="Voltar para o menu principal"
                >
                  <Text style={styles.btnVoltarText}>←</Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cartografiaTitle}>Cartografia</Text>
                  <Text style={styles.cartografiaSub} numberOfLines={1}>
                    Contexto atual: {contextoSetorAtual}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                id="appMenuCloseS22513"
                style={styles.closeBtn}
                onPress={onClose}
                accessibilityLabel="Fechar menu"
              >
                <Text style={styles.closeBtnText}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Lista dos 5 itens de Cartografia */}
            <View style={styles.cartografiaList}>
              {cartografiaItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  id={item.id}
                  style={styles.cartografiaCard}
                  activeOpacity={0.7}
                  onPress={() => {
                    onSelectMenu(item.id);
                    onClose();
                  }}
                >
                  <View style={styles.cartografiaIconBox}>
                    <Text style={styles.cartografiaIcon}>{item.icon}</Text>
                  </View>
                  <View style={styles.cartografiaCardBody}>
                    <Text style={styles.cartografiaItemTitle}>{item.title}</Text>
                    <Text style={styles.cartografiaItemDesc}>{item.desc}</Text>
                  </View>
                  <Text style={styles.cartografiaChevron}>›</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Rodapé informativo */}
            <View style={styles.cartografiaFooterBox}>
              <Text style={styles.cartografiaFooterText}>
                As ferramentas alteram a cartografia administrativa, não os registros operacionais.
              </Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.menuHeader}>
              <Text style={styles.menuHeaderTitle}>Menu</Text>
              <TouchableOpacity
                id="appMenuCloseS22513"
                style={styles.closeBtn}
                onPress={onClose}
                accessibilityLabel="Fechar menu"
              >
                <Text style={styles.closeBtnText}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.menuGrid}>
              {menuItems.map((item) => {
                if (item.adminOnly && !isAdmin) return null;
                if (item.financeiroOnly && !temAcessoFinanceiro) return null;

                return (
                  <TouchableOpacity
                    key={item.id}
                    id={item.id}
                    style={[
                      styles.menuItem,
                      item.primary && styles.menuItemPrimary,
                    ]}
                    onPress={() => {
                      if (item.id === 'centralCartograficaBtn') {
                        setViewMode('cartografia');
                        return;
                      }
                      onSelectMenu(item.id);
                      onClose();
                    }}
                  >
                    <Text style={[styles.menuItemIcon, item.primary && styles.menuItemIconPrimary]}>
                      {item.icon}
                    </Text>
                    <Text style={[styles.menuItemLabel, item.primary && styles.menuItemLabelPrimary]}>
                      {item.label}
                    </Text>
                    {item.badge !== undefined && (
                      <View style={styles.itemBadge}>
                        <Text style={styles.itemBadgeText}>{item.badge}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 200,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(16, 18, 40, 0.45)',
  },
  menuBox: {
    position: 'absolute',
    top: 70,
    right: 20,
    width: 330,
    maxWidth: '92%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE2EA',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 30,
    elevation: 8,
    zIndex: 210,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F7',
    marginBottom: 12,
  },
  menuHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#171B68',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F4F5F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#676A7A',
    marginTop: -2,
  },
  menuGrid: {
    gap: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#F8F9FC',
    borderWidth: 1,
    borderColor: '#E8EBF2',
    gap: 10,
  },
  menuItemPrimary: {
    backgroundColor: '#F50087',
    borderColor: '#F50087',
  },
  menuItemIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#171B68',
  },
  menuItemIconPrimary: {
    color: '#FFFFFF',
  },
  menuItemLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#20233A',
  },
  menuItemLabelPrimary: {
    color: '#FFFFFF',
  },
  itemBadge: {
    backgroundColor: '#171B68',
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  itemBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  menuBoxCartografia: {
    width: 380,
    maxWidth: '94%',
  },
  cartografiaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F7',
    marginBottom: 12,
  },
  btnVoltar: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DFE2EA',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnVoltarText: {
    fontSize: 18,
    color: '#1E293B',
    fontWeight: 'bold',
  },
  cartografiaTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  cartografiaSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  cartografiaList: {
    gap: 8,
  },
  cartografiaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  cartografiaIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FDF2F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartografiaIcon: {
    fontSize: 16,
    color: '#EC4899',
    fontWeight: 'bold',
  },
  cartografiaCardBody: {
    flex: 1,
  },
  cartografiaItemTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  cartografiaItemDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 15,
  },
  cartografiaChevron: {
    fontSize: 18,
    color: '#94A3B8',
    fontWeight: '600',
  },
  cartografiaFooterBox: {
    marginTop: 14,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cartografiaFooterText: {
    fontSize: 10.5,
    color: '#64748B',
    lineHeight: 14,
  },
});
