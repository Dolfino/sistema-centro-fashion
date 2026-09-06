import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Loja360Service, FichaLoja360 } from '../services/loja360Service';

interface Loja360ModalProps {
  visible: boolean;
  onClose: () => void;
  lojaInicial?: FichaLoja360 | null;
  onAbrirOcorrenciaParaLoja?: (loja: FichaLoja360) => void;
}

export const Loja360Modal: React.FC<Loja360ModalProps> = ({
  visible,
  onClose,
  lojaInicial,
  onAbrirOcorrenciaParaLoja,
}) => {
  const [lojaSelecionada, setLojaSelecionada] = useState<FichaLoja360 | null>(lojaInicial || null);
  const [termoBusca, setTermoBusca] = useState('');
  const [abaAtiva, setAbaAtiva] = useState<
    'geral' | 'produtos' | 'promocoes' | 'fotos' | 'contatos' | 'ocorrencias' | 'historico'
  >('geral');
  const [filtroStatus, setFiltroStatus] = useState('TODOS');

  // Atualiza se mudar por prop
  React.useEffect(() => {
    if (lojaInicial) {
      setLojaSelecionada(lojaInicial);
    }
  }, [lojaInicial]);

  const lojasEncontradas = Loja360Service.listarLojas({
    termo: termoBusca,
    status: filtroStatus,
  });

  const abrirWhatsApp = (numero: string, nomeLoja: string) => {
    const texto = encodeURIComponent(
      `Olá! Sou da equipe de gestão do Centro Fashion referente à unidade ${nomeLoja}.`
    );
    const url = `https://wa.me/${numero.replace(/\D/g, '')}?text=${texto}`;
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url).catch(() => {});
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ATIVA':
        return { bg: '#065f46', text: '#34d399', label: 'Operação Ativa' };
      case 'REFORMA':
        return { bg: '#854d0e', text: '#facc15', label: 'Em Reforma' };
      case 'DESOCUPADA':
        return { bg: '#475569', text: '#cbd5e1', label: 'Desocupada' };
      case 'FECHADA':
        return { bg: '#991b1b', text: '#f87171', label: 'Fechada' };
      default:
        return { bg: '#334155', text: '#94a3b8', label: status };
    }
  };

  const getPrioridadeBadge = (prioridade: string) => {
    switch (prioridade) {
      case 'CRITICA':
        return { bg: '#ef4444', text: '#fff' };
      case 'ALTA':
        return { bg: '#f97316', text: '#fff' };
      case 'MEDIA':
        return { bg: '#eab308', text: '#000' };
      default:
        return { bg: '#3b82f6', text: '#fff' };
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="storefront" size={24} color="#38bdf8" />
              </View>
              <View>
                <Text style={styles.headerTitle}>
                  {lojaSelecionada ? `Loja 360 • Box ${lojaSelecionada.numeroLoja}` : 'Loja 360 • Gestão de Boxes'}
                </Text>
                <Text style={styles.headerSubtitle}>
                  {lojaSelecionada ? lojaSelecionada.nomeLoja : 'Centro Fashion Fortaleza • Cadastro e Ocupações'}
                </Text>
              </View>
            </View>

            <View style={styles.headerRight}>
              {lojaSelecionada && (
                <TouchableOpacity
                  style={styles.btnVoltarLista}
                  onPress={() => setLojaSelecionada(null)}
                >
                  <Ionicons name="search-outline" size={16} color="#38bdf8" />
                  <Text style={styles.btnVoltarListaText}>Buscar Outro Box</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.btnClose} onPress={onClose}>
                <Ionicons name="close" size={22} color="#94a3b8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Conteúdo Principal */}
          {lojaSelecionada ? (
            <View style={styles.detalhesWrapper}>
              {/* Card Resumo Superior */}
              <View style={styles.resumoCard}>
                <View style={styles.resumoRow}>
                  <View style={styles.resumoInfo}>
                    <Text style={styles.resumoNumero}>Box {lojaSelecionada.numeroLoja}</Text>
                    <Text style={styles.resumoNome}>{lojaSelecionada.nomeLoja}</Text>
                    <Text style={styles.resumoSegmento}>
                      {lojaSelecionada.tipoUnidade} • {lojaSelecionada.segmentoPrincipal}
                    </Text>

                    {lojaSelecionada.espacosVinculados && lojaSelecionada.espacosVinculados.length > 1 && (
                      <View style={styles.badgeMultiEspaco}>
                        <Ionicons name="git-network-outline" size={12} color="#38bdf8" />
                        <Text style={styles.badgeMultiEspacoText}>
                          Espaços Atuais: {lojaSelecionada.espacosVinculados.map((b) => `Box ${b}`).join(' • ')}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.resumoBadges}>
                    <View
                      style={[
                        styles.badgeStatus,
                        { backgroundColor: getStatusBadge(lojaSelecionada.statusOperacao).bg },
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeStatusText,
                          { color: getStatusBadge(lojaSelecionada.statusOperacao).text },
                        ]}
                      >
                        {getStatusBadge(lojaSelecionada.statusOperacao).label}
                      </Text>
                    </View>

                    {lojaSelecionada.luc && (
                      <View style={styles.badgeLuc}>
                        <Text style={styles.badgeLucText}>{lojaSelecionada.luc}</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Métricas rápidas */}
                <View style={styles.metricasRow}>
                  <View style={styles.metricaItem}>
                    <Text style={styles.metricaValor}>
                      {lojaSelecionada.produtos?.length || 0}
                    </Text>
                    <Text style={styles.metricaRotulo}>Produtos no Catálogo</Text>
                  </View>
                  <View style={styles.metricaDivisor} />
                  <View style={styles.metricaItem}>
                    <Text style={styles.metricaValor}>
                      {lojaSelecionada.promocoes?.length || 0}
                    </Text>
                    <Text style={styles.metricaRotulo}>Promoções Ativas</Text>
                  </View>
                  <View style={styles.metricaDivisor} />
                  <View style={styles.metricaItem}>
                    <Text style={styles.metricaValor}>
                      {lojaSelecionada.indicadores.ocorrenciasAbertas}
                    </Text>
                    <Text style={styles.metricaRotulo}>Ocorrências Abertas</Text>
                  </View>
                  <View style={styles.metricaDivisor} />
                  <View style={styles.metricaItem}>
                    <Text style={styles.metricaValor}>{lojaSelecionada.contatos.length}</Text>
                    <Text style={styles.metricaRotulo}>Contatos</Text>
                  </View>
                </View>

                {/* Botão de Ação Direta */}
                <TouchableOpacity
                  style={styles.btnAcaoNovaOcorrencia}
                  onPress={() => {
                    onClose();
                    if (onAbrirOcorrenciaParaLoja) {
                      onAbrirOcorrenciaParaLoja(lojaSelecionada);
                    }
                  }}
                >
                  <Ionicons name="add-circle" size={18} color="#fff" />
                  <Text style={styles.btnAcaoNovaOcorrenciaText}>
                    Abrir Nova Ocorrência para este Box
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Barra de Abas */}
              <View style={styles.tabsContainer}>
                <TouchableOpacity
                  style={[styles.tabBtn, abaAtiva === 'geral' && styles.tabBtnAtivo]}
                  onPress={() => setAbaAtiva('geral')}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={16}
                    color={abaAtiva === 'geral' ? '#38bdf8' : '#64748b'}
                  />
                  <Text style={[styles.tabBtnText, abaAtiva === 'geral' && styles.tabBtnTextAtivo]}>
                    Ficha Técnica
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tabBtn, abaAtiva === 'produtos' && styles.tabBtnAtivo]}
                  onPress={() => setAbaAtiva('produtos')}
                >
                  <Ionicons
                    name="pricetags-outline"
                    size={16}
                    color={abaAtiva === 'produtos' ? '#38bdf8' : '#64748b'}
                  />
                  <Text style={[styles.tabBtnText, abaAtiva === 'produtos' && styles.tabBtnTextAtivo]}>
                    Produtos ({lojaSelecionada.produtos?.length || 0})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tabBtn, abaAtiva === 'promocoes' && styles.tabBtnAtivo]}
                  onPress={() => setAbaAtiva('promocoes')}
                >
                  <Ionicons
                    name="megaphone-outline"
                    size={16}
                    color={abaAtiva === 'promocoes' ? '#38bdf8' : '#64748b'}
                  />
                  <Text style={[styles.tabBtnText, abaAtiva === 'promocoes' && styles.tabBtnTextAtivo]}>
                    Promoções ({lojaSelecionada.promocoes?.length || 0})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tabBtn, abaAtiva === 'fotos' && styles.tabBtnAtivo]}
                  onPress={() => setAbaAtiva('fotos')}
                >
                  <Ionicons
                    name="camera-outline"
                    size={16}
                    color={abaAtiva === 'fotos' ? '#38bdf8' : '#64748b'}
                  />
                  <Text style={[styles.tabBtnText, abaAtiva === 'fotos' && styles.tabBtnTextAtivo]}>
                    Fotos ({lojaSelecionada.fotos?.length || 0})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tabBtn, abaAtiva === 'contatos' && styles.tabBtnAtivo]}
                  onPress={() => setAbaAtiva('contatos')}
                >
                  <Ionicons
                    name="people-outline"
                    size={16}
                    color={abaAtiva === 'contatos' ? '#38bdf8' : '#64748b'}
                  />
                  <Text
                    style={[styles.tabBtnText, abaAtiva === 'contatos' && styles.tabBtnTextAtivo]}
                  >
                    Contatos ({lojaSelecionada.contatos.length})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tabBtn, abaAtiva === 'ocorrencias' && styles.tabBtnAtivo]}
                  onPress={() => setAbaAtiva('ocorrencias')}
                >
                  <Ionicons
                    name="warning-outline"
                    size={16}
                    color={abaAtiva === 'ocorrencias' ? '#38bdf8' : '#64748b'}
                  />
                  <Text
                    style={[
                      styles.tabBtnText,
                      abaAtiva === 'ocorrencias' && styles.tabBtnTextAtivo,
                    ]}
                  >
                    Ocorrências ({lojaSelecionada.ocorrencias.length})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tabBtn, abaAtiva === 'historico' && styles.tabBtnAtivo]}
                  onPress={() => setAbaAtiva('historico')}
                >
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color={abaAtiva === 'historico' ? '#38bdf8' : '#64748b'}
                  />
                  <Text
                    style={[styles.tabBtnText, abaAtiva === 'historico' && styles.tabBtnTextAtivo]}
                  >
                    Ocupação
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Conteúdo da Aba */}
              <ScrollView style={styles.abaConteudo}>
                {abaAtiva === 'geral' && (
                  <View style={styles.gridCards}>
                    <View style={styles.cardInfo}>
                      <Text style={styles.cardInfoTitulo}>Localização no Shopping</Text>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Setor / Nível:</Text>
                        <Text style={styles.infoValue}>{lojaSelecionada.setor}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Corredor:</Text>
                        <Text style={styles.infoValue}>{lojaSelecionada.corredor}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Lado do Corredor:</Text>
                        <Text style={styles.infoValue}>{lojaSelecionada.ladoCorredor}</Text>
                      </View>
                    </View>

                    <View style={styles.cardInfo}>
                      <Text style={styles.cardInfoTitulo}>Dados Cadastrais</Text>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Razão Social:</Text>
                        <Text style={styles.infoValue}>
                          {lojaSelecionada.razaoSocial || 'Não informada'}
                        </Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>CNPJ / CPF:</Text>
                        <Text style={styles.infoValue}>
                          {lojaSelecionada.cnpj || 'Não cadastrado'}
                        </Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Código LUC:</Text>
                        <Text style={styles.infoValue}>{lojaSelecionada.luc || 'Sem LUC'}</Text>
                      </View>
                    </View>
                  </View>
                )}

                {abaAtiva === 'produtos' && (
                  <View style={styles.produtosWrapper}>
                    <View style={styles.produtosHeaderInfo}>
                      <View>
                        <Text style={styles.produtosHeaderTitulo}>Catálogo & Vitrine da Loja</Text>
                        <Text style={styles.produtosHeaderSubtitulo}>
                          {lojaSelecionada.produtos?.length || 0} produto(s) representativo(s) cadastrado(s)
                        </Text>
                      </View>
                    </View>

                    {(!lojaSelecionada.produtos || lojaSelecionada.produtos.length === 0) ? (
                      <View style={styles.vazioBox}>
                        <Ionicons name="pricetag-outline" size={44} color="#64748b" />
                        <Text style={styles.vazioTitulo}>Nenhum produto cadastrado</Text>
                        <Text style={styles.vazioTexto}>
                          O mix comercial e os produtos desta unidade ainda não foram enriquecidos no levantamento.
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.produtosGrid}>
                        {lojaSelecionada.produtos.map((prod) => (
                          <View key={prod.id} style={styles.produtoCard}>
                            <View style={styles.produtoCardTopo}>
                              <View style={styles.produtoCategorias}>
                                <View style={styles.badgeCategoria}>
                                  <Text style={styles.badgeCategoriaText}>{prod.categoria}</Text>
                                </View>
                                {prod.subcategoria && (
                                  <Text style={styles.produtoSubcategoria}>• {prod.subcategoria}</Text>
                                )}
                              </View>
                              {prod.destaque && (
                                <View style={styles.badgeDestaque}>
                                  <Ionicons name="star" size={11} color="#f59e0b" />
                                  <Text style={styles.badgeDestaqueText}>Destaque</Text>
                                </View>
                              )}
                            </View>

                            <Text style={styles.produtoNome}>{prod.nome}</Text>
                            {prod.descricao && (
                              <Text style={styles.produtoDescricao}>{prod.descricao}</Text>
                            )}

                            {/* Seção de Preços */}
                            <View style={styles.produtoPrecosBloco}>
                              {prod.emPromocao && prod.precoPromocional ? (
                                <View>
                                  <View style={styles.produtoDePorRow}>
                                    <Text style={styles.precoDeText}>
                                      De R$ {prod.precoNormal.toFixed(2).replace('.', ',')}
                                    </Text>
                                    <View style={styles.badgePromocaoPill}>
                                      <Ionicons name="flame" size={11} color="#ef4444" />
                                      <Text style={styles.badgePromocaoPillText}>
                                        {prod.vigenciaPromocao ? `Promoção até ${prod.vigenciaPromocao}` : 'Em Promoção'}
                                      </Text>
                                    </View>
                                  </View>
                                  <Text style={styles.precoPorText}>
                                    Por R$ {prod.precoPromocional.toFixed(2).replace('.', ',')}
                                  </Text>
                                </View>
                              ) : (
                                <View>
                                  <Text style={styles.precoUnicoLabel}>Preço Normal</Text>
                                  <Text style={styles.precoUnicoValor}>
                                    R$ {prod.precoNormal.toFixed(2).replace('.', ',')}
                                  </Text>
                                </View>
                              )}

                              {/* Preço de Atacado */}
                              {prod.atacado && prod.precoAtacado && (
                                <View style={styles.atacadoBadge}>
                                  <Ionicons name="cube-outline" size={12} color="#38bdf8" />
                                  <Text style={styles.atacadoBadgeText}>
                                    Atacado: R$ {prod.precoAtacado.toFixed(2).replace('.', ',')} (Mín. {prod.qtdMinimaAtacado || 6} un.)
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                )}

                {abaAtiva === 'promocoes' && (
                  <View style={styles.promocoesWrapper}>
                    <View style={styles.produtosHeaderInfo}>
                      <View>
                        <Text style={styles.produtosHeaderTitulo}>Promoções & Campanhas da Loja</Text>
                        <Text style={styles.produtosHeaderSubtitulo}>
                          {lojaSelecionada.promocoes?.length || 0} ação(ões) promocional(is) vigentes
                        </Text>
                      </View>
                    </View>

                    {(!lojaSelecionada.promocoes || lojaSelecionada.promocoes.length === 0) ? (
                      <View style={styles.vazioBox}>
                        <Ionicons name="megaphone-outline" size={44} color="#64748b" />
                        <Text style={styles.vazioTitulo}>Nenhuma promoção ativa</Text>
                        <Text style={styles.vazioTexto}>
                          Esta unidade não possui ações promocionais cadastradas no momento.
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.promocoesLista}>
                        {lojaSelecionada.promocoes.map((promo) => (
                          <View key={promo.id} style={styles.promoCard}>
                            <View style={styles.promoCardHeader}>
                              <View style={styles.promoTituloRow}>
                                <Ionicons name="pricetag" size={18} color="#f59e0b" />
                                <Text style={styles.promoTitulo}>{promo.titulo}</Text>
                              </View>
                              <View style={styles.badgePromoAtiva}>
                                <Text style={styles.badgePromoAtivaText}>{promo.status}</Text>
                              </View>
                            </View>

                            <View style={styles.promoVigenciaRow}>
                              <Ionicons name="calendar-outline" size={14} color="#94a3b8" />
                              <Text style={styles.promoVigenciaText}>
                                Vigência: {promo.vigenciaInicio} → {promo.vigenciaFim}
                              </Text>
                            </View>

                            {promo.descricao && (
                              <Text style={styles.promoDescricao}>{promo.descricao}</Text>
                            )}

                            {/* Produtos Vinculados */}
                            <View style={styles.promoProdutosVinculados}>
                              <Text style={styles.promoProdutosTitulo}>
                                Produtos Vinculados à Promoção ({promo.produtosVinculadosIds.length}):
                              </Text>
                              <View style={styles.promoProdutosChips}>
                                {promo.produtosVinculadosIds.map((pId) => {
                                  const prod = lojaSelecionada.produtos?.find((p) => p.id === pId);
                                  return (
                                    <View key={pId} style={styles.promoProdChip}>
                                      <Ionicons name="checkmark-circle" size={13} color="#10b981" />
                                      <Text style={styles.promoProdChipText}>
                                        {prod ? `${prod.nome} (De R$ ${prod.precoNormal.toFixed(2).replace('.', ',')} Por R$ ${prod.precoPromocional?.toFixed(2).replace('.', ',')})` : pId}
                                      </Text>
                                    </View>
                                  );
                                })}
                              </View>
                            </View>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                )}

                {abaAtiva === 'fotos' && (
                  <View style={styles.fotosWrapper}>
                    <View style={styles.produtosHeaderInfo}>
                      <View>
                        <Text style={styles.produtosHeaderTitulo}>Galeria de Fotos do Estabelecimento</Text>
                        <Text style={styles.produtosHeaderSubtitulo}>
                          Fachada, vitrine, interior e exposição física de produtos
                        </Text>
                      </View>
                    </View>

                    {/* Categorias de Fotos */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.fotosCategoriasRow}>
                      {['Todas (0)', 'Fachada (0)', 'Vitrine (0)', 'Interior (0)', 'Exposição (0)', 'Equipe (0)'].map((cat, idx) => (
                        <View key={cat} style={[styles.fotoCategoriaChip, idx === 0 && styles.fotoCategoriaChipAtivo]}>
                          <Text style={[styles.fotoCategoriaChipText, idx === 0 && styles.fotoCategoriaChipTextAtivo]}>
                            {cat}
                          </Text>
                        </View>
                      ))}
                    </ScrollView>

                    {(!lojaSelecionada.fotos || lojaSelecionada.fotos.length === 0) ? (
                      <View style={styles.vazioFotosBox}>
                        <View style={styles.vazioIconeCamera}>
                          <Ionicons name="camera-outline" size={48} color="#94a3b8" />
                        </View>
                        <Text style={styles.vazioTitulo}>Nenhuma foto cadastrada ainda</Text>
                        <Text style={styles.vazioTexto}>
                          A captura de fotografias reais de alta resolução (Fachada, Vitrine, Interior e Exposição de Produtos) será realizada pelas equipes em campo durante o levantamento de rotas.
                        </Text>
                        <View style={styles.diretrizGateBadge}>
                          <Ionicons name="shield-checkmark-outline" size={14} color="#10b981" />
                          <Text style={styles.diretrizGateText}>
                            Diretriz L2.2: Sem links falsos ou placeholders quebrados
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.fotosGrid}>
                        {lojaSelecionada.fotos.map((foto) => (
                          <View key={foto.id} style={styles.fotoCard}>
                            <Text style={styles.fotoCardTipo}>{foto.tipo}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                )}

                {abaAtiva === 'contatos' && (
                  <View style={styles.contatosLista}>
                    {lojaSelecionada.contatos.map((contato) => (
                      <View key={contato.id} style={styles.contatoCard}>
                        <View style={styles.contatoHeader}>
                          <View>
                            <View style={styles.contatoNomeRow}>
                              <Text style={styles.contatoNome}>{contato.nome}</Text>
                              {contato.principal && (
                                <View style={styles.badgePrincipal}>
                                  <Text style={styles.badgePrincipalText}>Principal</Text>
                                </View>
                              )}
                            </View>
                            <Text style={styles.contatoFuncao}>{contato.funcao}</Text>
                          </View>
                        </View>

                        <View style={styles.contatoDetalhes}>
                          <View style={styles.contatoDado}>
                            <Ionicons name="call-outline" size={16} color="#38bdf8" />
                            <Text style={styles.contatoDadoText}>{contato.telefone}</Text>
                          </View>
                          <View style={styles.contatoDado}>
                            <Ionicons name="mail-outline" size={16} color="#94a3b8" />
                            <Text style={styles.contatoDadoText}>{contato.email}</Text>
                          </View>
                        </View>

                        {contato.whatsapp && (
                          <TouchableOpacity
                            style={styles.btnWhatsapp}
                            onPress={() => abrirWhatsApp(contato.whatsapp, lojaSelecionada.nomeLoja)}
                          >
                            <Ionicons name="logo-whatsapp" size={18} color="#fff" />
                            <Text style={styles.btnWhatsappText}>Conversar no WhatsApp</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    ))}
                  </View>
                )}

                {abaAtiva === 'ocorrencias' && (
                  <View style={styles.ocorrenciasLista}>
                    {lojaSelecionada.ocorrencias.length === 0 ? (
                      <View style={styles.vazioBox}>
                        <Ionicons name="checkmark-circle" size={44} color="#10b981" />
                        <Text style={styles.vazioTitulo}>Nenhuma ocorrência em aberto</Text>
                        <Text style={styles.vazioTexto}>
                          Esta unidade está em conformidade total com os padrões do mall.
                        </Text>
                      </View>
                    ) : (
                      lojaSelecionada.ocorrencias.map((oc) => (
                        <View key={oc.id} style={styles.ocorrenciaItem}>
                          <View style={styles.ocorrenciaItemHeader}>
                            <Text style={styles.ocorrenciaProtocolo}>{oc.protocolo}</Text>
                            <View
                              style={[
                                styles.badgePrioridade,
                                { backgroundColor: getPrioridadeBadge(oc.prioridade).bg },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.badgePrioridadeText,
                                  { color: getPrioridadeBadge(oc.prioridade).text },
                                ]}
                              >
                                {oc.prioridade}
                              </Text>
                            </View>
                          </View>
                          <Text style={styles.ocorrenciaTitulo}>{oc.titulo}</Text>
                          <Text style={styles.ocorrenciaDescricao}>{oc.descricao}</Text>
                          <View style={styles.ocorrenciaFooter}>
                            <Text style={styles.ocorrenciaSetor}>
                              Responsável: {oc.setorResponsavel}
                            </Text>
                            <Text style={styles.ocorrenciaData}>{oc.criadoEm}</Text>
                          </View>
                        </View>
                      ))
                    )}
                  </View>
                )}

                {abaAtiva === 'historico' && (
                  <View style={styles.historicoLista}>
                    {lojaSelecionada.historicoOcupacoes.map((item) => (
                      <View key={item.id} style={styles.historicoCard}>
                        <View style={styles.historicoHeader}>
                          <Ionicons name="business" size={20} color="#38bdf8" />
                          <Text style={styles.historicoResponsavel}>{item.responsavel}</Text>
                          {item.atual && (
                            <View style={styles.badgeAtual}>
                              <Text style={styles.badgeAtualText}>Ocupante Atual</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.historicoData}>
                          Início da Ocupação: {item.inicio} {item.fim ? `até ${item.fim}` : ''}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </ScrollView>
            </View>
          ) : (
            /* Lista / Busca de Boxes e Lojas */
            <View style={styles.listaWrapper}>
              {/* Barra de Filtro e Busca */}
              <View style={styles.buscaContainer}>
                <View style={styles.searchBar}>
                  <Ionicons name="search" size={20} color="#64748b" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar por número do box, nome da loja ou segmento..."
                    placeholderTextColor="#64748b"
                    value={termoBusca}
                    onChangeText={setTermoBusca}
                  />
                  {termoBusca ? (
                    <TouchableOpacity onPress={() => setTermoBusca('')}>
                      <Ionicons name="close-circle" size={18} color="#94a3b8" />
                    </TouchableOpacity>
                  ) : null}
                </View>

                {/* Filtros rápidos de Status */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
                  {['TODOS', 'ATIVA', 'REFORMA', 'DESOCUPADA'].map((st) => (
                    <TouchableOpacity
                      key={st}
                      style={[styles.chip, filtroStatus === st && styles.chipAtivo]}
                      onPress={() => setFiltroStatus(st)}
                    >
                      <Text
                        style={[styles.chipText, filtroStatus === st && styles.chipTextAtivo]}
                      >
                        {st}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Grid de Cards de Lojas */}
              <ScrollView style={styles.gridLojas}>
                <View style={styles.gridCardsContainer}>
                  {lojasEncontradas.map((loja) => {
                    const stBadge = getStatusBadge(loja.statusOperacao);
                    return (
                      <TouchableOpacity
                        key={loja.idLojaMapa}
                        style={styles.cardLojaItem}
                        onPress={() => setLojaSelecionada(loja)}
                      >
                        <View style={styles.cardLojaHeader}>
                          <View style={styles.boxTag}>
                            <Text style={styles.boxTagText}>Box {loja.numeroLoja}</Text>
                          </View>
                          <View style={[styles.badgePill, { backgroundColor: stBadge.bg }]}>
                            <Text style={[styles.badgePillText, { color: stBadge.text }]}>
                              {stBadge.label}
                            </Text>
                          </View>
                        </View>

                        <Text style={styles.cardLojaNome} numberOfLines={1}>
                          {loja.nomeLoja}
                        </Text>
                        <Text style={styles.cardLojaSegmento} numberOfLines={1}>
                          {loja.segmentoPrincipal}
                        </Text>
                        <Text style={styles.cardLojaSetor} numberOfLines={1}>
                          <Ionicons name="location-outline" size={13} color="#94a3b8" />{' '}
                          {loja.setor} • {loja.corredor}
                        </Text>

                        <View style={styles.cardLojaFooter}>
                          <View style={styles.contatosIndicador}>
                            <Ionicons name="person-outline" size={14} color="#38bdf8" />
                            <Text style={styles.contatosIndicadorText}>
                              {loja.contatos[0]?.nome || 'Sem contato'}
                            </Text>
                          </View>

                          {loja.indicadores.ocorrenciasAbertas > 0 ? (
                            <View style={styles.badgeAlertasAbertos}>
                              <Ionicons name="warning" size={12} color="#f97316" />
                              <Text style={styles.badgeAlertasText}>
                                {loja.indicadores.ocorrenciasAbertas}
                              </Text>
                            </View>
                          ) : (
                            <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: '100%',
    maxWidth: 950,
    height: '92%',
    backgroundColor: '#0f172a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    backgroundColor: '#1e293b',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#0369a1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  btnVoltarLista: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  btnVoltarListaText: {
    color: '#38bdf8',
    fontSize: 13,
    fontWeight: '600',
  },
  btnClose: {
    padding: 6,
  },
  /* Detalhes Wrapper */
  detalhesWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  resumoCard: {
    backgroundColor: '#1e293b',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  resumoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  resumoInfo: {
    flex: 1,
  },
  resumoNumero: {
    fontSize: 13,
    fontWeight: '700',
    color: '#38bdf8',
    textTransform: 'uppercase',
  },
  resumoNome: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f8fafc',
    marginVertical: 2,
  },
  resumoSegmento: {
    fontSize: 14,
    color: '#94a3b8',
  },
  resumoBadges: {
    alignItems: 'flex-end',
    gap: 6,
  },
  badgeStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeStatusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  badgeLuc: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeLucText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  metricasRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  metricaItem: {
    alignItems: 'center',
  },
  metricaValor: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f8fafc',
  },
  metricaRotulo: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  metricaDivisor: {
    width: 1,
    height: 24,
    backgroundColor: '#334155',
  },
  btnAcaoNovaOcorrencia: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0284c7',
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnAcaoNovaOcorrenciaText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingHorizontal: 16,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnAtivo: {
    borderBottomColor: '#38bdf8',
  },
  tabBtnText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  tabBtnTextAtivo: {
    color: '#38bdf8',
    fontWeight: '700',
  },
  abaConteudo: {
    flex: 1,
    padding: 16,
  },
  gridCards: {
    gap: 16,
  },
  cardInfo: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardInfoTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#38bdf8',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#243248',
  },
  infoLabel: {
    fontSize: 13,
    color: '#94a3b8',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#f8fafc',
  },
  contatosLista: {
    gap: 12,
  },
  contatoCard: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  contatoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contatoNomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contatoNome: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
  },
  badgePrincipal: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgePrincipalText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  contatoFuncao: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
  },
  contatoDetalhes: {
    marginVertical: 10,
    gap: 6,
  },
  contatoDado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contatoDadoText: {
    fontSize: 13,
    color: '#cbd5e1',
  },
  btnWhatsapp: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#16a34a',
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  btnWhatsappText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  ocorrenciasLista: {
    gap: 12,
  },
  vazioBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  vazioTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
    marginTop: 12,
  },
  vazioTexto: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
  },
  ocorrenciaItem: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  ocorrenciaItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ocorrenciaProtocolo: {
    fontSize: 12,
    fontWeight: '700',
    color: '#38bdf8',
  },
  badgePrioridade: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgePrioridadeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  ocorrenciaTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f8fafc',
    marginTop: 6,
  },
  ocorrenciaDescricao: {
    fontSize: 13,
    color: '#94a3b8',
    marginVertical: 4,
  },
  ocorrenciaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  ocorrenciaSetor: {
    fontSize: 12,
    color: '#64748b',
  },
  ocorrenciaData: {
    fontSize: 12,
    color: '#64748b',
  },
  historicoLista: {
    gap: 10,
  },
  historicoCard: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  historicoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historicoResponsavel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f8fafc',
    flex: 1,
  },
  badgeAtual: {
    backgroundColor: '#065f46',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeAtualText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#34d399',
  },
  historicoData: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 6,
  },
  /* Lista de Busca */
  listaWrapper: {
    flex: 1,
  },
  buscaContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#334155',
    height: 44,
  },
  searchInput: {
    flex: 1,
    color: '#f8fafc',
    fontSize: 14,
    marginLeft: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  chipAtivo: {
    backgroundColor: '#0284c7',
    borderColor: '#38bdf8',
  },
  chipText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  chipTextAtivo: {
    color: '#fff',
    fontWeight: '700',
  },
  gridLojas: {
    flex: 1,
    padding: 16,
  },
  gridCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cardLojaItem: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardLojaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  boxTag: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
  },
  boxTagText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#38bdf8',
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  cardLojaNome: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
  },
  cardLojaSegmento: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  cardLojaSetor: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 6,
  },
  cardLojaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  contatosIndicador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  contatosIndicadorText: {
    fontSize: 11,
    color: '#94a3b8',
  },
  badgeAlertasAbertos: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#7c2d12',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeAlertasText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fdba74',
  },
  badgeMultiEspaco: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  badgeMultiEspacoText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38bdf8',
  },
  produtosWrapper: {
    paddingBottom: 24,
  },
  produtosHeaderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  produtosHeaderTitulo: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f8fafc',
  },
  produtosHeaderSubtitulo: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
  },
  produtosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  produtoCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  produtoCardTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  produtoCategorias: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  badgeCategoria: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#475569',
  },
  badgeCategoriaText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
  },
  produtoSubcategoria: {
    fontSize: 11,
    color: '#64748b',
  },
  badgeDestaque: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  badgeDestaqueText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#f59e0b',
  },
  produtoNome: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  produtoDescricao: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 16,
    marginBottom: 12,
  },
  produtoPrecosBloco: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  produtoDePorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  precoDeText: {
    fontSize: 12,
    color: '#64748b',
    textDecorationLine: 'line-through',
  },
  badgePromocaoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgePromocaoPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ef4444',
  },
  precoPorText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#10b981',
  },
  precoUnicoLabel: {
    fontSize: 11,
    color: '#64748b',
  },
  precoUnicoValor: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f8fafc',
  },
  atacadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  atacadoBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#38bdf8',
  },
  promocoesWrapper: {
    paddingBottom: 24,
  },
  promocoesLista: {
    gap: 12,
  },
  promoCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  promoCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  promoTituloRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  promoTitulo: {
    fontSize: 16,
    fontWeight: '800',
    color: '#f8fafc',
  },
  badgePromoAtiva: {
    backgroundColor: '#065f46',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  badgePromoAtivaText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#34d399',
  },
  promoVigenciaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  promoVigenciaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  promoDescricao: {
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 18,
    marginBottom: 12,
  },
  promoProdutosVinculados: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  promoProdutosTitulo: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    marginBottom: 8,
  },
  promoProdutosChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  promoProdChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  promoProdChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f8fafc',
  },
  fotosWrapper: {
    paddingBottom: 24,
  },
  fotosHeader: {
    marginBottom: 12,
  },
  fotosCategoriasRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  fotoCategoriaChip: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  fotoCategoriaChipAtivo: {
    backgroundColor: '#0284c7',
    borderColor: '#38bdf8',
  },
  fotoCategoriaChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  fotoCategoriaChipTextAtivo: {
    color: '#fff',
    fontWeight: '700',
  },
  vazioFotosBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginVertical: 12,
  },
  vazioIconeCamera: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  diretrizGateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  diretrizGateText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#34d399',
  },
  fotosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  fotoCard: {
    width: '48%',
    height: 140,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
    justifyContent: 'flex-end',
  },
  fotoCardTipo: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
});
