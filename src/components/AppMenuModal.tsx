import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Platform } from 'react-native';

interface AppMenuModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectMenu: (itemId: string) => void;
  userRole?: string;
}

export const AppMenuModal: React.FC<AppMenuModalProps> = ({
  visible,
  onClose,
  onSelectMenu,
  userRole = 'ADMIN',
}) => {
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
  const temAcessoFinanceiro = userRole === 'ADMIN' || userRole === 'FINANCEIRO';

  const menuItems = [
    { id: 'novo', icon: '＋', label: 'Novo registro', primary: true, adminOnly: false, financeiroOnly: false },
    { id: 'camadasBtn', icon: '▱', label: 'Camadas', primary: false, adminOnly: false, financeiroOnly: false },
    { id: 'prepararOffline', icon: '↓', label: 'Atualizar offline', primary: false, adminOnly: false, financeiroOnly: false },
    { id: 'filaBtn', icon: '⇅', label: 'Fila', badge: '0', primary: false, adminOnly: false, financeiroOnly: false },
    { id: 'centralGestaoBtn', icon: '◎', label: 'Central', primary: false, adminOnly: false, financeiroOnly: false },
    { id: 'centralFinanceiraBtn', icon: '💳', label: 'Central Financeira', primary: false, adminOnly: false, financeiroOnly: true },
    { id: 'loja360Btn', icon: '🏬', label: 'Loja 360 / Boxes', primary: false, adminOnly: false, financeiroOnly: false },
    { id: 'ativoMallBtn', icon: '📺', label: 'Ativos do Mall & Mídia', primary: false, adminOnly: false, financeiroOnly: false },
    { id: 'campanhasBtn', icon: '📢', label: 'Campanhas de Marketing', primary: false, adminOnly: false, financeiroOnly: false },
    { id: 'levantamentoBtn', icon: '📝', label: 'Levantamento de Campo', primary: false, adminOnly: false, financeiroOnly: false },
    { id: 'rondaBtn', icon: '📋', label: 'Ronda / Checklist', primary: false, adminOnly: false, financeiroOnly: false },
    { id: 'agendaBtnS19', icon: '□', label: 'Agenda', primary: false, adminOnly: false, financeiroOnly: false },
    { id: 'alertasBtnS21', icon: '!', label: 'Alertas', badge: '0', primary: false, adminOnly: false, financeiroOnly: false },
    { id: 'dashboardBtn', icon: '▦', label: 'Dashboard', primary: false, adminOnly: false, financeiroOnly: false },
    { id: 'relatoriosBtn', icon: '≡', label: 'Relatórios', primary: false, adminOnly: false, financeiroOnly: false },
    { id: 'calibracaoBtnS242', icon: '⌖', label: 'Calibrar níveis', primary: false, adminOnly: true, financeiroOnly: false },
    { id: 'areaVermelhaBtnS244', icon: '▱', label: 'Delimitar estacionamento', primary: false, adminOnly: true, financeiroOnly: false },
    { id: 'areasNivel1BtnS246', icon: '⌗', label: 'Delimitar áreas do Nível 1', primary: false, adminOnly: true, financeiroOnly: false },
    { id: 'adminBtnS14', icon: '⚙', label: 'Administração', primary: false, adminOnly: true, financeiroOnly: false },
  ];

  return (
    <View style={styles.overlayContainer}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View id="appMenuBackdropS22513" style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View id="appMenuS22513" style={styles.menuBox}>
        <View style={styles.menuHeader}>
          <Text style={styles.menuHeaderTitle}>Menu</Text>
          <TouchableOpacity
            id="appMenuCloseS22513"
            style={styles.closeBtn}
            onPress={onClose}
            aria-label="Fechar menu"
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
                  onSelectMenu(item.id);
                  if (item.id === 'camadasBtn') {
                    onClose();
                  }
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
});
