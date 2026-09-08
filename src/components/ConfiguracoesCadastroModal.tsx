import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  TextInput,
  Platform,
  useWindowDimensions,
} from 'react-native';

export interface ConfiguracoesCadastroModalProps {
  visible: boolean;
  onClose: () => void;
}

export interface OpcaoCadastro {
  id: string;
  nome: string;
  codigo: string;
  usos: number;
  versao: number;
  status: 'ATIVA' | 'INATIVA';
  publicada: boolean;
}

export interface CatalogoCadastro {
  id: string;
  tag: string;
  nome: string;
  descricao: string;
  opcoes: OpcaoCadastro[];
}

const CATALOGOS_INICIAIS: CatalogoCadastro[] = [
  {
    id: 'tipo',
    tag: 'TIPO',
    nome: 'Tipo',
    descricao: 'Classificação do tipo de sinalização.',
    opcoes: [
      { id: '1', nome: 'Adesivo de parede', codigo: 'ADESIVO_DE_PAREDE_f6b7a6', usos: 10, versao: 1, status: 'ATIVA', publicada: true },
      { id: '2', nome: 'Adesivo de piso', codigo: 'ADESIVO_DE_PISO_b08d3d', usos: 10, versao: 1, status: 'ATIVA', publicada: true },
      { id: '3', nome: 'Banner', codigo: 'BANNER_175edf', usos: 3, versao: 1, status: 'ATIVA', publicada: true },
      { id: '4', nome: 'Mapa do Mall', codigo: 'MAPA_DO_MALL_37f28d', usos: 0, versao: 1, status: 'ATIVA', publicada: true },
      { id: '5', nome: 'Outra', codigo: 'OUTRA_e6d5d1', usos: 6, versao: 1, status: 'ATIVA', publicada: true },
      { id: '6', nome: 'Painel', codigo: 'PAINEL_53acb3', usos: 5, versao: 1, status: 'ATIVA', publicada: true },
      { id: '7', nome: 'Placa de emergência', codigo: 'PLACA_DE_EMERGENCIA_a9353d', usos: 1, versao: 1, status: 'ATIVA', publicada: true },
      { id: '8', nome: 'Placa informativa', codigo: 'PLACA_INFORMATIVA_48e712', usos: 14, versao: 1, status: 'ATIVA', publicada: true },
      { id: '9', nome: 'Placa de serviço', codigo: 'PLACA_DE_SERVICO_c3411a', usos: 4, versao: 1, status: 'ATIVA', publicada: true },
      { id: '10', nome: 'Placa de rua', codigo: 'PLACA_DE_RUA_9bf182', usos: 8, versao: 1, status: 'ATIVA', publicada: true },
      { id: '11', nome: 'Totem', codigo: 'TOTEM_71d49e', usos: 2, versao: 1, status: 'ATIVA', publicada: true },
      { id: '12', nome: 'Display Digital', codigo: 'DISPLAY_DIGITAL_62a13f', usos: 0, versao: 1, status: 'ATIVA', publicada: true },
      { id: '13', nome: 'Faixa Aérea', codigo: 'FAIXA_AEREA_18bc72', usos: 1, versao: 1, status: 'ATIVA', publicada: true },
      { id: '14', nome: 'Cavalete Operacional', codigo: 'CAVALETE_OPERACIONAL_5e9811', usos: 2, versao: 1, status: 'ATIVA', publicada: true },
      { id: '15', nome: 'Sinalização Tátil/Braille', codigo: 'SINALIZACAO_TATIL_3b190f', usos: 0, versao: 1, status: 'ATIVA', publicada: true },
      { id: '16', nome: 'Letreiro Fachada', codigo: 'LETREIRO_FACHADA_84f912', usos: 3, versao: 1, status: 'ATIVA', publicada: true },
      { id: '17', nome: 'Pictograma Sanitário', codigo: 'PICTOGRAMA_SANITARIO_47c81a', usos: 5, versao: 1, status: 'ATIVA', publicada: true },
      { id: '18', nome: 'Indicador de Nível/Piso', codigo: 'INDICADOR_NIVEL_d19a28', usos: 4, versao: 1, status: 'ATIVA', publicada: true },
      { id: '19', nome: 'Sinalizador de Saída', codigo: 'SINALIZADOR_SAIDA_76e492', usos: 6, versao: 1, status: 'ATIVA', publicada: true },
      { id: '20', nome: 'Painel Direcional Setor', codigo: 'PAINEL_DIRECIONAL_SETOR_9281bf', usos: 7, versao: 1, status: 'ATIVA', publicada: true },
      { id: '21', nome: 'Balcão de Informação', codigo: 'BALCAO_INFORMACAO_3108ff', usos: 1, versao: 1, status: 'ATIVA', publicada: true },
      { id: '22', nome: 'Extintor/Hidrante', codigo: 'EXTINTOR_HIDRANTE_8812c4', usos: 8, versao: 1, status: 'ATIVA', publicada: true },
      { id: '23', nome: 'Coluna de Numeração', codigo: 'COLUNA_NUMERACAO_b9211c', usos: 12, versao: 1, status: 'ATIVA', publicada: true },
      { id: '24', nome: 'Marcador de Corredor', codigo: 'MARCADOR_CORREDOR_a819bb', usos: 9, versao: 1, status: 'ATIVA', publicada: true },
      { id: '25', nome: 'Sinalizador de Vagas', codigo: 'SINALIZADOR_VAGAS_5518ae', usos: 4, versao: 1, status: 'ATIVA', publicada: true },
    ],
  },
  {
    id: 'finalidade',
    tag: 'FINALIDADE',
    nome: 'Finalidade',
    descricao: 'Classificação da finalidade da sinalização ou estrutura.',
    opcoes: [
      { id: '1', nome: 'Orientação', codigo: 'ORIENTACAO_01', usos: 35, versao: 1, status: 'ATIVA', publicada: true },
      { id: '2', nome: 'Segurança', codigo: 'SEGURANCA_02', usos: 28, versao: 1, status: 'ATIVA', publicada: true },
      { id: '3', nome: 'Comercial', codigo: 'COMERCIAL_03', usos: 19, versao: 1, status: 'ATIVA', publicada: true },
      { id: '4', nome: 'Operacional', codigo: 'OPERACIONAL_04', usos: 22, versao: 1, status: 'ATIVA', publicada: true },
      { id: '5', nome: 'Informativa', codigo: 'INFORMATIVA_05', usos: 15, versao: 1, status: 'ATIVA', publicada: true },
      { id: '6', nome: 'Emergência', codigo: 'EMERGENCIA_06', usos: 12, versao: 1, status: 'ATIVA', publicada: true },
      { id: '7', nome: 'Tráfego/Acesso', codigo: 'TRAFEGO_ACESSO_07', usos: 8, versao: 1, status: 'ATIVA', publicada: true },
      { id: '8', nome: 'Acessibilidade', codigo: 'ACESSIBILIDADE_08', usos: 6, versao: 1, status: 'ATIVA', publicada: true },
      { id: '9', nome: 'Institucional', codigo: 'INSTITUCIONAL_09', usos: 9, versao: 1, status: 'ATIVA', publicada: true },
      { id: '10', nome: 'Fiscalização', codigo: 'FISCALIZACAO_10', usos: 5, versao: 1, status: 'ATIVA', publicada: true },
      { id: '11', nome: 'Apoio Lojista', codigo: 'APOIO_LOJISTA_11', usos: 7, versao: 1, status: 'ATIVA', publicada: true },
    ],
  },
  {
    id: 'material',
    tag: 'MATERIAL',
    nome: 'Material',
    descricao: 'Tipo de material de fabricação da peça de sinalização.',
    opcoes: [
      { id: '1', nome: 'Alumínio', codigo: 'ALUMINIO_01', usos: 18, versao: 1, status: 'ATIVA', publicada: true },
      { id: '2', nome: 'Acrílico', codigo: 'ACRILICO_02', usos: 14, versao: 1, status: 'ATIVA', publicada: true },
      { id: '3', nome: 'Vinil Adesivo', codigo: 'VINIL_ADESIVO_03', usos: 25, versao: 1, status: 'ATIVA', publicada: true },
      { id: '4', nome: 'Poliestireno (PS)', codigo: 'POLIESTIRENO_04', usos: 11, versao: 1, status: 'ATIVA', publicada: true },
      { id: '5', nome: 'PVC Expandido', codigo: 'PVC_EXPANDIDO_05', usos: 9, versao: 1, status: 'ATIVA', publicada: true },
      { id: '6', nome: 'Lona com Ilhós', codigo: 'LONA_ILHOS_06', usos: 7, versao: 1, status: 'ATIVA', publicada: true },
      { id: '7', nome: 'Aço Galvanizado', codigo: 'ACO_GALVANIZADO_07', usos: 6, versao: 1, status: 'ATIVA', publicada: true },
      { id: '8', nome: 'ACM / Composto de Alumínio', codigo: 'ACM_08', usos: 8, versao: 1, status: 'ATIVA', publicada: true },
      { id: '9', nome: 'Vidro Temperado', codigo: 'VIDRO_09', usos: 2, versao: 1, status: 'ATIVA', publicada: true },
      { id: '10', nome: 'Policarbonato', codigo: 'POLICARBONATO_10', usos: 4, versao: 1, status: 'ATIVA', publicada: true },
    ],
  },
  {
    id: 'fixacao',
    tag: 'FIXAÇÃO',
    nome: 'Fixação',
    descricao: 'Método de ancoragem ou fixação física no mall.',
    opcoes: [
      { id: '1', nome: 'Parafuso com bucha', codigo: 'PARAFUSO_BUCHA_01', usos: 22, versao: 1, status: 'ATIVA', publicada: true },
      { id: '2', nome: 'Fita dupla-face 3M', codigo: 'FITA_DUPLA_FACE_02', usos: 18, versao: 1, status: 'ATIVA', publicada: true },
      { id: '3', nome: 'Abraçadeira plástica', codigo: 'ABRACADEIRA_03', usos: 6, versao: 1, status: 'ATIVA', publicada: true },
      { id: '4', nome: 'Cabo de aço suspenso', codigo: 'CABO_ACO_04', usos: 9, versao: 1, status: 'ATIVA', publicada: true },
      { id: '5', nome: 'Ventosa temporária', codigo: 'VENTOSA_05', usos: 0, versao: 1, status: 'INATIVA', publicada: false },
      { id: '6', nome: 'Adesivo solvente forte', codigo: 'ADESIVO_SOLVENTE_06', usos: 0, versao: 1, status: 'INATIVA', publicada: false },
      { id: '7', nome: 'Solda em estrutura metálica', codigo: 'SOLDA_07', usos: 0, versao: 1, status: 'INATIVA', publicada: false },
      { id: '8', nome: 'Grampo industrial', codigo: 'GRAMPO_08', usos: 0, versao: 1, status: 'INATIVA', publicada: false },
      { id: '9', nome: 'Rebite pop', codigo: 'REBITE_09', usos: 0, versao: 1, status: 'INATIVA', publicada: false },
      { id: '10', nome: 'Ímã neodímio', codigo: 'IMA_10', usos: 0, versao: 1, status: 'INATIVA', publicada: false },
    ],
  },
  {
    id: 'estado_conservacao',
    tag: 'ESTADO DE CONSERVAÇÃO',
    nome: 'Estado de conservação',
    descricao: 'Avaliação do estado físico de conservação da sinalização.',
    opcoes: [
      { id: '1', nome: 'Novo / Impecável', codigo: 'NOVO_01', usos: 30, versao: 1, status: 'ATIVA', publicada: true },
      { id: '2', nome: 'Bom estado', codigo: 'BOM_ESTADO_02', usos: 45, versao: 1, status: 'ATIVA', publicada: true },
      { id: '3', nome: 'Desgaste leve', codigo: 'DESGASTE_LEVE_03', usos: 15, versao: 1, status: 'ATIVA', publicada: true },
      { id: '4', nome: 'Danificado / Quebrado', codigo: 'DANIFICADO_04', usos: 4, versao: 1, status: 'ATIVA', publicada: true },
      { id: '5', nome: 'Ilegível / Desbotado', codigo: 'ILEGIVEL_05', usos: 2, versao: 1, status: 'ATIVA', publicada: true },
    ],
  },
  {
    id: 'condicao',
    tag: 'CONDIÇÃO',
    nome: 'Condição',
    descricao: 'Condição operacional e ciclo de vida do item.',
    opcoes: [
      { id: '1', nome: 'Operacional e Ativo', codigo: 'COND_OPERACIONAL_01', usos: 50, versao: 1, status: 'ATIVA', publicada: true },
      { id: '2', nome: 'Necessita Limpeza', codigo: 'COND_LIMPEZA_02', usos: 8, versao: 1, status: 'ATIVA', publicada: true },
      { id: '3', nome: 'Necessita Reposicionamento', codigo: 'COND_REPOSICIONAR_03', usos: 4, versao: 1, status: 'ATIVA', publicada: true },
      { id: '4', nome: 'Desalinhado', codigo: 'COND_DESALINHADO_04', usos: 3, versao: 1, status: 'ATIVA', publicada: true },
      { id: '5', nome: 'Descolando', codigo: 'COND_DESCOLANDO_05', usos: 5, versao: 1, status: 'ATIVA', publicada: true },
      { id: '6', nome: 'Rasurado / Vandalizado', codigo: 'COND_VANDALIZADO_06', usos: 2, versao: 1, status: 'ATIVA', publicada: true },
      { id: '7', nome: 'Obstruído por Mercadoria', codigo: 'COND_OBSTRUIDO_07', usos: 6, versao: 1, status: 'ATIVA', publicada: true },
      { id: '8', nome: 'Iluminação Queimada', codigo: 'COND_ILUMINACAO_08', usos: 3, versao: 1, status: 'ATIVA', publicada: true },
      { id: '9', nome: 'Em Manutenção', codigo: 'COND_MANUTENCAO_09', usos: 2, versao: 1, status: 'ATIVA', publicada: true },
      { id: '10', nome: 'Aguardando Substituição', codigo: 'COND_SUBSTITUICAO_10', usos: 3, versao: 1, status: 'ATIVA', publicada: true },
      { id: '11', nome: 'Removido Temporariamente', codigo: 'COND_REMOVIDO_11', usos: 1, versao: 1, status: 'ATIVA', publicada: true },
      { id: '12', nome: 'Fora de Padrão Visual', codigo: 'COND_FORA_PADRAO_12', usos: 4, versao: 1, status: 'ATIVA', publicada: true },
      { id: '13', nome: 'Provisório', codigo: 'COND_PROVISORIO_13', usos: 5, versao: 1, status: 'ATIVA', publicada: true },
      { id: '14', nome: 'Em Análise Técnica', codigo: 'COND_ANALISE_14', usos: 2, versao: 1, status: 'ATIVA', publicada: true },
    ],
  },
  {
    id: 'responsavel',
    tag: 'RESPONSÁVEL',
    nome: 'Responsável',
    descricao: 'Equipe ou departamento responsável pela gestão e manutenção.',
    opcoes: [
      { id: '1', nome: 'Operações / Sinalização', codigo: 'RESP_OPERACOES_01', usos: 40, versao: 1, status: 'ATIVA', publicada: true },
      { id: '2', nome: 'Marketing & Comunicação', codigo: 'RESP_MARKETING_02', usos: 25, versao: 1, status: 'ATIVA', publicada: true },
      { id: '3', nome: 'Segurança Patrimonial', codigo: 'RESP_SEGURANCA_03', usos: 18, versao: 1, status: 'ATIVA', publicada: true },
      { id: '4', nome: 'Manutenção & Infra', codigo: 'RESP_MANUTENCAO_04', usos: 22, versao: 1, status: 'ATIVA', publicada: true },
      { id: '5', nome: 'Estacionamento & Tráfego', codigo: 'RESP_ESTACIONAMENTO_05', usos: 12, versao: 1, status: 'ATIVA', publicada: true },
      { id: '6', nome: 'Comercial / Vendas', codigo: 'RESP_COMERCIAL_06', usos: 10, versao: 1, status: 'ATIVA', publicada: true },
      { id: '7', nome: 'Diretoria / Coordenação', codigo: 'RESP_DIRETORIA_07', usos: 6, versao: 1, status: 'ATIVA', publicada: true },
      { id: '8', nome: 'Brigada de Emergência', codigo: 'RESP_BRIGADA_08', usos: 8, versao: 1, status: 'ATIVA', publicada: true },
      { id: '9', nome: 'Fornecedor Externo / Terceirizado', codigo: 'RESP_TERCEIRIZADO_09', usos: 5, versao: 1, status: 'ATIVA', publicada: true },
      { id: '10', nome: 'TI / Infraestrutura Digital', codigo: 'RESP_TI_10', usos: 3, versao: 1, status: 'ATIVA', publicada: true },
    ],
  },
];

export const ConfiguracoesCadastroModal: React.FC<ConfiguracoesCadastroModalProps> = ({
  visible,
  onClose,
}) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const [catalogos, setCatalogos] = useState<CatalogoCadastro[]>(CATALOGOS_INICIAIS);
  const [catalogoAtivoId, setCatalogoAtivoId] = useState<string>('tipo');
  const [pesquisa, setPesquisa] = useState<string>('');
  const [filtroStatus, setFiltroStatus] = useState<'TODAS' | 'ATIVA' | 'INATIVA'>('TODAS');
  const [menuAbertoId, setMenuAbertoId] = useState<string | null>(null);

  // Modal para adicionar nova opção
  const [modalNovaOpcaoAberta, setModalNovaOpcaoAberta] = useState<boolean>(false);
  const [novoNome, setNovoNome] = useState<string>('');
  const [novoCodigo, setNovoCodigo] = useState<string>('');

  if (!visible) return null;

  // Métricas globais
  const totalCatalogos = catalogos.length;
  const totalOpcoes = catalogos.reduce((acc, cat) => acc + cat.opcoes.length, 0);
  const totalAtivas = catalogos.reduce(
    (acc, cat) => acc + cat.opcoes.filter((o) => o.status === 'ATIVA').length,
    0
  );
  const totalInativas = catalogos.reduce(
    (acc, cat) => acc + cat.opcoes.filter((o) => o.status === 'INATIVA').length,
    0
  );

  const catalogoAtual = catalogos.find((c) => c.id === catalogoAtivoId) || catalogos[0];

  // Opções filtradas
  const opcoesFiltradas = catalogoAtual.opcoes.filter((op) => {
    const matchTexto =
      !pesquisa.trim() ||
      op.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
      op.codigo.toLowerCase().includes(pesquisa.toLowerCase());

    const matchStatus =
      filtroStatus === 'TODAS' || op.status === filtroStatus;

    return matchTexto && matchStatus;
  });

  const countCatTotal = catalogoAtual.opcoes.length;
  const countCatAtivas = catalogoAtual.opcoes.filter((o) => o.status === 'ATIVA').length;
  const countCatInativas = catalogoAtual.opcoes.filter((o) => o.status === 'INATIVA').length;

  // Toggle status de uma opção
  const handleToggleStatus = (opId: string) => {
    setCatalogos((prev) =>
      prev.map((cat) => {
        if (cat.id !== catalogoAtual.id) return cat;
        return {
          ...cat,
          opcoes: cat.opcoes.map((op) => {
            if (op.id !== opId) return op;
            const novoStatus = op.status === 'ATIVA' ? 'INATIVA' : 'ATIVA';
            return {
              ...op,
              status: novoStatus,
              publicada: novoStatus === 'ATIVA',
            };
          }),
        };
      })
    );
    setMenuAbertoId(null);
  };

  // Adicionar nova opção
  const handleCriarOpcao = () => {
    if (!novoNome.trim()) return;

    const codigoGerado =
      novoCodigo.trim() ||
      `${novoNome
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^A-Z0-9]/g, '_')}_${Math.random().toString(16).substring(2, 8)}`;

    const novaOp: OpcaoCadastro = {
      id: `${Date.now()}`,
      nome: novoNome.trim(),
      codigo: codigoGerado,
      usos: 0,
      versao: 1,
      status: 'ATIVA',
      publicada: true,
    };

    setCatalogos((prev) =>
      prev.map((cat) => {
        if (cat.id !== catalogoAtual.id) return cat;
        return {
          ...cat,
          opcoes: [novaOp, ...cat.opcoes],
        };
      })
    );

    setNovoNome('');
    setNovoCodigo('');
    setModalNovaOpcaoAberta(false);
  };

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
            height: Math.min(windowHeight * 0.94, 880),
          },
        ]}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerCode}>S26.9-C2</Text>
            <Text style={styles.headerTitle}>Configurações de cadastro</Text>
            <Text style={styles.headerSubtitle}>
              Administre as classificações utilizadas nos cadastros da aplicação.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* 4 CARDS SUPERIORES DE MÉTRICAS */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricCardValue}>{totalCatalogos}</Text>
            <Text style={styles.metricCardLabel}>Catálogos</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricCardValue}>{totalOpcoes}</Text>
            <Text style={styles.metricCardLabel}>Opções</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricCardValue}>{totalAtivas}</Text>
            <Text style={styles.metricCardLabel}>Ativas</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricCardValue}>{totalInativas}</Text>
            <Text style={styles.metricCardLabel}>Inativas</Text>
          </View>
        </View>

        {/* CORPO PRINCIPAL EM 2 COLUNAS */}
        <View style={styles.mainContent}>
          {/* COLUNA ESQUERDA: LISTA DE CLASSIFICAÇÕES */}
          <View style={styles.leftColumn}>
            <Text style={styles.sectionTitle}>Campos</Text>
            <Text style={styles.sectionSubtitle}>Selecione uma classificação</Text>

            <ScrollView
              style={styles.camposList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {catalogos.map((cat) => {
                const isSelected = cat.id === catalogoAtivoId;
                const ativasCount = cat.opcoes.filter((o) => o.status === 'ATIVA').length;
                const totalCount = cat.opcoes.length;

                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.campoItem,
                      isSelected && styles.campoItemSelected,
                    ]}
                    onPress={() => {
                      setCatalogoAtivoId(cat.id);
                      setMenuAbertoId(null);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.campoItemTitle,
                          isSelected && styles.campoItemTitleSelected,
                        ]}
                      >
                        {cat.nome}
                      </Text>
                      <Text style={styles.campoItemSubtitle}>
                        {ativasCount} ativas • {totalCount} total
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.campoBadge,
                        isSelected ? styles.campoBadgeSelected : styles.campoBadgeDefault,
                      ]}
                    >
                      <Text
                        style={[
                          styles.campoBadgeText,
                          isSelected ? styles.campoBadgeTextSelected : styles.campoBadgeTextDefault,
                        ]}
                      >
                        {totalCount}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* COLUNA DIREITA: GERENCIAMENTO DO CATÁLOGO SELECIONADO */}
          <View style={styles.rightColumn}>
            {/* TOPO DO CATÁLOGO */}
            <View style={styles.rightHeaderRow}>
              <View style={{ flex: 1 }}>
                <View style={styles.tagBadge}>
                  <Text style={styles.tagBadgeText}>{catalogoAtual.tag}</Text>
                </View>
                <Text style={styles.catalogoTitle}>{catalogoAtual.nome}</Text>
                <Text style={styles.catalogoDesc}>{catalogoAtual.descricao}</Text>
              </View>

              <TouchableOpacity
                style={styles.btnAdicionarOpcao}
                onPress={() => setModalNovaOpcaoAberta(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.btnAdicionarOpcaoText}>+ Adicionar opção</Text>
              </TouchableOpacity>
            </View>

            {/* LINHA DE FILTROS */}
            <View style={styles.filtersRow}>
              {/* CAMPO DE BUSCA */}
              <View style={[styles.filterGroup, { flex: 1.6 }]}>
                <Text style={styles.filterLabel}>Pesquisar neste catálogo</Text>
                <TextInput
                  style={styles.filterInput}
                  placeholder="Nome, descrição ou código"
                  placeholderTextColor="#94a3b8"
                  value={pesquisa}
                  onChangeText={setPesquisa}
                />
              </View>

              {/* SELECT STATUS */}
              <View style={[styles.filterGroup, { width: 140 }]}>
                <Text style={styles.filterLabel}>Status</Text>
                {Platform.OS === 'web' ? (
                  <select
                    value={filtroStatus}
                    onChange={(e) =>
                      setFiltroStatus(e.target.value as 'TODAS' | 'ATIVA' | 'INATIVA')
                    }
                    style={{
                      height: 38,
                      paddingLeft: 12,
                      paddingRight: 28,
                      fontSize: 13,
                      color: '#0f172a',
                      borderRadius: 6,
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      outline: 'none',
                      cursor: 'pointer',
                      fontWeight: '500',
                      width: '100%',
                    }}
                  >
                    <option value="TODAS">Todas</option>
                    <option value="ATIVA">Ativas</option>
                    <option value="INATIVA">Inativas</option>
                  </select>
                ) : (
                  <View style={styles.filterInput}>
                    <Text style={{ fontSize: 13, color: '#0f172a' }}>{filtroStatus}</Text>
                  </View>
                )}
              </View>

              {/* BOTÃO ATUALIZAR */}
              <View style={{ justifyContent: 'flex-end' }}>
                <TouchableOpacity
                  style={styles.btnAtualizar}
                  onPress={() => {
                    setPesquisa('');
                    setFiltroStatus('TODAS');
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.btnAtualizarText}>Atualizar</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* RESUMO DE CONTAGENS / CHIPS */}
            <View style={styles.chipsRow}>
              <View style={styles.chipItem}>
                <Text style={styles.chipText}>
                  <Text style={styles.chipTextBold}>{countCatTotal}</Text> opções
                </Text>
              </View>
              <View style={styles.chipItem}>
                <Text style={styles.chipText}>
                  <Text style={styles.chipTextBold}>{countCatAtivas}</Text> ativas
                </Text>
              </View>
              <View style={styles.chipItem}>
                <Text style={styles.chipText}>
                  <Text style={styles.chipTextBold}>{countCatInativas}</Text> inativas
                </Text>
              </View>
              <View style={styles.chipItem}>
                <Text style={styles.chipText}>
                  Revisão <Text style={styles.chipTextBold}>5</Text>
                </Text>
              </View>
            </View>

            {/* LISTA DE OPÇÕES EM CARDS */}
            <ScrollView
              style={styles.opcoesListScroll}
              contentContainerStyle={styles.opcoesListContainer}
              showsVerticalScrollIndicator={true}
            >
              {opcoesFiltradas.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>Nenhuma opção encontrada com os filtros atuais.</Text>
                </View>
              ) : (
                opcoesFiltradas.map((opcao, index) => {
                  const isAtiva = opcao.status === 'ATIVA';
                  const menuAberto = menuAbertoId === opcao.id;

                  return (
                    <View key={opcao.id} style={styles.opcaoCard}>
                      {/* NÚMERO SEQUENCIAL */}
                      <View style={styles.opcaoNumCircle}>
                        <Text style={styles.opcaoNumText}>{index + 1}</Text>
                      </View>

                      {/* DETALHES DA OPÇÃO */}
                      <View style={styles.opcaoDetails}>
                        <Text style={styles.opcaoNome}>{opcao.nome}</Text>
                        <View style={styles.opcaoMetaRow}>
                          <Text style={styles.opcaoMetaText}>
                            Código: <Text style={styles.opcaoMetaCode}>{opcao.codigo}</Text>
                          </Text>
                          <Text style={styles.opcaoMetaText}>
                            Usos: <Text style={styles.opcaoMetaBold}>{opcao.usos}</Text>
                          </Text>
                          <Text style={styles.opcaoMetaText}>
                            Versão: <Text style={styles.opcaoMetaBold}>{opcao.versao}</Text>
                          </Text>
                        </View>
                      </View>

                      {/* BADGES À DIREITA */}
                      <View style={styles.opcaoBadgesGroup}>
                        {isAtiva ? (
                          <View style={styles.badgeAtiva}>
                            <Text style={styles.badgeAtivaText}>Ativa</Text>
                          </View>
                        ) : (
                          <View style={styles.badgeInativa}>
                            <Text style={styles.badgeInativaText}>Inativa</Text>
                          </View>
                        )}

                        {opcao.publicada && (
                          <View style={styles.badgePublicada}>
                            <Text style={styles.badgePublicadaText}>Publicada</Text>
                          </View>
                        )}

                        {/* BOTÃO ••• */}
                        <View style={{ position: 'relative' }}>
                          <TouchableOpacity
                            style={styles.btnOptions}
                            onPress={() =>
                              setMenuAbertoId(menuAberto ? null : opcao.id)
                            }
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          >
                            <Text style={styles.btnOptionsText}>•••</Text>
                          </TouchableOpacity>

                          {/* MENU POPOVER */}
                          {menuAberto && (
                            <View style={styles.popoverMenu}>
                              <TouchableOpacity
                                style={styles.popoverMenuItem}
                                onPress={() => handleToggleStatus(opcao.id)}
                              >
                                <Text style={styles.popoverMenuItemText}>
                                  {isAtiva ? 'Desativar opção' : 'Ativar opção'}
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.popoverMenuItem}
                                onPress={() => {
                                  alert(`Editar metadados da opção: ${opcao.nome}`);
                                  setMenuAbertoId(null);
                                }}
                              >
                                <Text style={styles.popoverMenuItemText}>Editar</Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>
          </View>
        </View>

        {/* MODAL ADICIONAR OPÇÃO */}
        {modalNovaOpcaoAberta && (
          <View style={styles.subModalOverlay}>
            <View style={styles.subModalContainer}>
              <View style={styles.subModalHeader}>
                <Text style={styles.subModalTitle}>Nova Opção — {catalogoAtual.nome}</Text>
                <TouchableOpacity
                  onPress={() => setModalNovaOpcaoAberta(false)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={{ fontSize: 18, color: '#64748b' }}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={{ gap: 12, paddingVertical: 14 }}>
                <View style={{ gap: 4 }}>
                  <Text style={styles.controlLabel}>Nome da Opção *</Text>
                  <TextInput
                    style={styles.filterInput}
                    placeholder="Ex.: Totem Iluminado"
                    placeholderTextColor="#94a3b8"
                    value={novoNome}
                    onChangeText={setNovoNome}
                  />
                </View>

                <View style={{ gap: 4 }}>
                  <Text style={styles.controlLabel}>Código Identificador (opcional)</Text>
                  <TextInput
                    style={styles.filterInput}
                    placeholder="Deixe em branco para gerar automático"
                    placeholderTextColor="#94a3b8"
                    value={novoCodigo}
                    onChangeText={setNovoCodigo}
                  />
                </View>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <TouchableOpacity
                  style={styles.btnAtualizar}
                  onPress={() => setModalNovaOpcaoAberta(false)}
                >
                  <Text style={styles.btnAtualizarText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btnAdicionarOpcao}
                  onPress={handleCriarOpcao}
                >
                  <Text style={styles.btnAdicionarOpcaoText}>Salvar opção</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
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
  headerSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
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
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 22,
    paddingVertical: 14,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  metricCardValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  metricCardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 2,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  leftColumn: {
    width: 260,
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 12,
  },
  camposList: {
    flex: 1,
  },
  campoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },
  campoItemSelected: {
    borderColor: '#f43f5e',
    backgroundColor: '#fff1f2',
  },
  campoItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  campoItemTitleSelected: {
    color: '#e11d48',
  },
  campoItemSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  campoBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  campoBadgeDefault: {
    backgroundColor: '#f1f5f9',
  },
  campoBadgeSelected: {
    backgroundColor: '#ec4899',
  },
  campoBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  campoBadgeTextDefault: {
    color: '#64748b',
  },
  campoBadgeTextSelected: {
    color: '#ffffff',
  },
  rightColumn: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 14,
    display: 'flex',
    flexDirection: 'column',
  },
  rightHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  tagBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  tagBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.5,
  },
  catalogoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  catalogoDesc: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  btnAdicionarOpcao: {
    backgroundColor: '#ec4899',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnAdicionarOpcaoText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    marginBottom: 12,
  },
  filterGroup: {
    gap: 4,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filterInput: {
    height: 38,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#0f172a',
    backgroundColor: '#ffffff',
  },
  btnAtualizar: {
    height: 38,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnAtualizarText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  chipItem: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  chipText: {
    fontSize: 12,
    color: '#475569',
  },
  chipTextBold: {
    fontWeight: '700',
    color: '#0f172a',
  },
  opcoesListScroll: {
    flex: 1,
  },
  opcoesListContainer: {
    gap: 8,
    paddingBottom: 16,
  },
  opcaoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 14,
  },
  opcaoNumCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  opcaoNumText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  opcaoDetails: {
    flex: 1,
    gap: 3,
  },
  opcaoNome: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  opcaoMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  opcaoMetaText: {
    fontSize: 11,
    color: '#64748b',
  },
  opcaoMetaCode: {
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
    color: '#334155',
  },
  opcaoMetaBold: {
    fontWeight: '700',
    color: '#334155',
  },
  opcaoBadgesGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeAtiva: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeAtivaText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
  },
  badgeInativa: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeInativaText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#991b1b',
  },
  badgePublicada: {
    backgroundColor: '#f3e8ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgePublicadaText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6b21a8',
  },
  btnOptions: {
    width: 28,
    height: 28,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  btnOptionsText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: -1,
  },
  popoverMenu: {
    position: 'absolute',
    right: 0,
    top: 32,
    width: 150,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    zIndex: 999,
  },
  popoverMenuItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  popoverMenuItemText: {
    fontSize: 12,
    color: '#1e293b',
    fontWeight: '500',
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 13,
    color: '#94a3b8',
  },
  controlLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  subModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999999,
  },
  subModalContainer: {
    width: 420,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 18,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  subModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 10,
  },
  subModalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
});

export default ConfiguracoesCadastroModal;
