import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  ScrollView,
  Platform,
  useWindowDimensions,
  Image,
} from 'react-native';
import { SignagePin } from './InteractiveMallMap';
import { CapturedPhoto, mediaService } from '../services/mediaService';
import {
  PontoReferenciaOficial,
  CartografiaService,
  CORES_PADRAO_TIPOS_REFERENCIA,
  NOMES_PADRAO_TIPOS_REFERENCIA,
} from '../services/cartografiaService';

interface FormPanelModalProps {
  visible: boolean;
  mode: 'NOVO' | 'EDITAR';
  initialPin?: SignagePin | null;
  initialReferencia?: PontoReferenciaOficial | null;
  initialEntityType?: 'SINALIZACAO' | 'OCORRENCIA' | 'REFERENCIA';
  confirmedSector: string;
  normalizedX: number;
  normalizedY: number;
  identifiedLocationText?: string;
  onClose: () => void;
  onSave: (savedPinData: Partial<SignagePin>) => void;
  onSaveReferencia?: (savedRefData: PontoReferenciaOficial) => void;
  onDeleteReferencia?: (id: string) => void;
  onDeletePin?: (id: string) => void;
}

export const FormPanelModal: React.FC<FormPanelModalProps> = ({
  visible,
  mode,
  initialPin,
  initialReferencia,
  initialEntityType = 'SINALIZACAO',
  confirmedSector,
  normalizedX,
  normalizedY,
  identifiedLocationText,
  onClose,
  onSave,
  onSaveReferencia,
  onDeleteReferencia,
  onDeletePin,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 700;

  const [entityType, setEntityType] = useState<'SINALIZACAO' | 'OCORRENCIA' | 'REFERENCIA'>(initialEntityType);
  const [categoriaOcorrencia, setCategoriaOcorrencia] = useState<string>('Manutenção');
  const [prioridade, setPrioridade] = useState<'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA'>('MEDIA');
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);

  // Campos de Referência Cartográfica
  const [nomeReferencia, setNomeReferencia] = useState<string>('');
  const [tipoReferencia, setTipoReferencia] = useState<string>('QUIOSQUE');
  const [subtipoReferencia, setSubtipoReferencia] = useState<string>('QUIOSQUE');
  const [descricaoReferencia, setDescricaoReferencia] = useState<string>('');
  const [statusReferencia, setStatusReferencia] = useState<string>('VALIDADO');
  const [ativoReferencia, setAtivoReferencia] = useState<boolean>(true);

  const [tipo, setTipo] = useState<string>('Placa informativa');
  const [finalidade, setFinalidade] = useState<string>('Orientação');
  const [titulo, setTitulo] = useState<string>('');
  const [textoSinalizacao, setTextoSinalizacao] = useState<string>('');
  const [descricao, setDescricao] = useState<string>('');
  const [material, setMaterial] = useState<string>('Alumínio');
  const [dimensoes, setDimensoes] = useState<string>('80 x 30 cm');
  const [cor, setCor] = useState<string>('Azul');
  const [fixacao, setFixacao] = useState<string>('Parede');
  const [estadoConservacao, setEstadoConservacao] = useState<string>('Boa');
  const [condicao, setCondicao] = useState<string>('Adequada');
  const [responsavel, setResponsavel] = useState<string>('Davidsilva • Operações');
  const [dataInstalacao, setDataInstalacao] = useState<string>('2026-08-23');
  const [validade, setValidade] = useState<string>('');

  // Checkboxes
  const [iluminada, setIluminada] = useState<boolean>(false);
  const [duplaFace, setDuplaFace] = useState<boolean>(false);
  const [qrCode, setQrCode] = useState<boolean>(false);
  const [braille, setBraille] = useState<boolean>(false);
  const [pictograma, setPictograma] = useState<boolean>(false);

  // Fotos Anexadas
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const fileInputRef = useRef<any>(null);

  useEffect(() => {
    if (initialReferencia) {
      setEntityType('REFERENCIA');
      setNomeReferencia(initialReferencia.nome || '');
      setTipoReferencia(initialReferencia.tipo || 'QUIOSQUE');
      setSubtipoReferencia(initialReferencia.subtipo || 'QUIOSQUE');
      setDescricaoReferencia(initialReferencia.descricao || '');
      setStatusReferencia(initialReferencia.status || 'VALIDADO');
      setAtivoReferencia(initialReferencia.ativo !== false);
    } else if (initialEntityType === 'REFERENCIA') {
      setEntityType('REFERENCIA');
      setNomeReferencia(
        identifiedLocationText
          ? identifiedLocationText.split('—')[1]?.trim() || 'Nova Referência'
          : 'Novo Ponto de Referência'
      );
      setTipoReferencia('QUIOSQUE');
      setSubtipoReferencia('QUIOSQUE');
      setDescricaoReferencia(identifiedLocationText || 'Ponto de referência cartográfica');
      setStatusReferencia('VALIDADO');
      setAtivoReferencia(true);
    } else if (mode === 'EDITAR' && initialPin) {
      setEntityType(initialPin.entityType || 'SINALIZACAO');
      if (initialPin.entityType === 'OCORRENCIA') {
        setCategoriaOcorrencia(initialPin.category || 'Manutenção');
        setPrioridade(initialPin.priority || 'MEDIA');
      } else {
        setTipo(initialPin.category || 'Placa informativa');
      }
      setTitulo(initialPin.notes || initialPin.category || 'Registro');
      setDescricao(initialPin.humanLocation || 'Localizado no setor');
      setEstadoConservacao(initialPin.conservationState || 'Boa');
      setResponsavel(initialPin.responsible || 'Davidsilva • Operações');
      setPhotos(initialPin.photos || []);
    } else {
      setEntityType(initialEntityType);
      setCategoriaOcorrencia('Manutenção');
      setPrioridade('MEDIA');
      setTitulo(
        identifiedLocationText
          ? `Registro — ${identifiedLocationText.split('—')[1]?.trim() || confirmedSector}`
          : 'Placa Direcional — Setor Azul'
      );
      setDescricao(identifiedLocationText || 'Placa informativa de orientação para visitantes no corredor principal.');
      setPhotos([]);
    }
  }, [mode, initialPin, initialReferencia, initialEntityType, visible, identifiedLocationText]);

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

  const handleAddPhotoPress = () => {
    if (Platform.OS === 'web' && fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      const simulated = mediaService.createPhotoFromData(
        `CAM_${Date.now()}.jpg`,
        'image/jpeg',
        1850000,
        'https://images.unsplash.com/photo-1572945553229-8cb3149a46a6?w=600&auto=format&fit=crop&q=60'
      );
      setPhotos((prev) => [...prev, simulated]);
    }
  };

  const handleWebFileSelected = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const newPhoto = mediaService.createPhotoFromData(
        file.name,
        file.type || 'image/jpeg',
        file.size,
        dataUrl
      );
      setPhotos((prev) => [...prev, newPhoto]);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemovePhoto = (photoId: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  const CATEGORIAS_OCORRENCIA = [
    { id: 'CAT-MANUTENCAO', nome: 'Manutenção', cor: '#F59E0B', slaHoras: 72, equipe: 'CEOP' },
    { id: 'CAT-LIMPEZA', nome: 'Limpeza', cor: '#10B981', slaHoras: 24, equipe: 'Limpeza' },
    { id: 'CAT-SEGURANCA', nome: 'Segurança', cor: '#DC2626', slaHoras: 2, equipe: 'Segurança' },
    { id: 'CAT-ILUMINACAO', nome: 'Iluminação', cor: '#EAB308', slaHoras: 24, equipe: 'CEOP' },
    { id: 'CAT-COM-VISUAL', nome: 'Comunicação Visual', cor: '#EF4444', slaHoras: 72, equipe: 'Marketing' },
  ];

  const currentCatObj = CATEGORIAS_OCORRENCIA.find((c) => c.nome === categoriaOcorrencia) || CATEGORIAS_OCORRENCIA[0];

  const handleSubmit = () => {
    if (entityType === 'REFERENCIA') {
      if (onSaveReferencia) {
        const idSetorNormalizado = CartografiaService.normalizarIdMapaSetor(
          initialReferencia?.idMapaSetor || confirmedSector
        );
        onSaveReferencia({
          id: initialReferencia?.id || `REF-${Date.now()}`,
          idMapaSetor: idSetorNormalizado,
          nome: nomeReferencia.trim() || 'Ponto de Referência',
          tipo: tipoReferencia,
          subtipo: subtipoReferencia,
          x: normalizedX,
          y: normalizedY,
          descricao: descricaoReferencia || 'Ponto de referência cartográfica',
          status: statusReferencia,
          ativo: ativoReferencia,
        });
        onClose();
      }
      return;
    }

    const isOcorrencia = entityType === 'OCORRENCIA';
    onSave({
      entityType,
      category: isOcorrencia ? currentCatObj.nome : tipo,
      categoryColor: isOcorrencia ? currentCatObj.cor : undefined,
      priority: isOcorrencia ? prioridade : undefined,
      prazoHoras: isOcorrencia ? currentCatObj.slaHoras : undefined,
      notes: titulo,
      humanLocation: descricao,
      sector: confirmedSector || 'SETOR_AZUL',
      status: isOcorrencia ? 'EM_ANDAMENTO' : 'ATIVA',
      conservationState: isOcorrencia ? prioridade : estadoConservacao,
      responsible: isOcorrencia ? `${currentCatObj.equipe} • Operações` : responsavel,
      normalizedX,
      normalizedY,
      photos,
    });
    onClose();
  };

  const pctX = (normalizedX * 100).toFixed(1);
  const pctY = (normalizedY * 100).toFixed(1);

  if (!visible) return null;

  return (
    <View style={styles.overlayContainer}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>
      <View id="formPanel" style={[styles.panelBox, isMobile && styles.panelBoxMobile]}>
        {/* Head (.form-head) */}
        <View style={styles.formHead}>
          <View>
            <Text id="formEyebrowS237" style={styles.eyebrowText}>
              {mode === 'EDITAR' ? 'Edição de registro' : 'Novo registro'}
            </Text>
            <Text id="formTituloS237" style={styles.headTitle}>
              {mode === 'EDITAR'
                ? entityType === 'REFERENCIA'
                  ? 'Editar referência cartográfica'
                  : entityType === 'OCORRENCIA' ? 'Editar ocorrência' : 'Editar sinalização'
                : entityType === 'REFERENCIA'
                  ? 'Novo ponto de referência'
                  : entityType === 'OCORRENCIA' ? 'Nova ocorrência operacional' : 'Cadastro de sinalização'}
            </Text>
          </View>

          <TouchableOpacity id="fecharForm" style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>×</Text>
          </TouchableOpacity>
        </View>

        {/* Localização confirmada (.location-box) */}
        <View style={styles.locationBox}>
          <Text style={styles.locationTitle}>Localização confirmada</Text>
          <Text id="formLocalResumo" style={styles.locationResumo}>
            {identifiedLocationText || `${confirmedSector} • Posição (X: ${pctX}%, Y: ${pctY}%)`}
          </Text>
          <Text id="formCoords" style={styles.locationCoords}>
            Coordenadas espaciais salvas no viewport cartográfico
          </Text>
        </View>

        {/* Seletor de Tipo de Entidade (Sinalização vs Ocorrência vs Referência) */}
        <View style={styles.entitySelectorWrap}>
          <TouchableOpacity
            style={[styles.entityTypeBtn, entityType === 'SINALIZACAO' && styles.entityTypeBtnActive]}
            onPress={() => setEntityType('SINALIZACAO')}
          >
            <Text style={[styles.entityTypeBtnText, entityType === 'SINALIZACAO' && styles.entityTypeBtnTextActive]}>
              🏷️ Sinalização Física
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.entityTypeBtn, entityType === 'OCORRENCIA' && styles.entityTypeBtnActive]}
            onPress={() => setEntityType('OCORRENCIA')}
          >
            <Text style={[styles.entityTypeBtnText, entityType === 'OCORRENCIA' && styles.entityTypeBtnTextActive]}>
              ⚠️ Ocorrência Operacional
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            id="btnTipoReferencia"
            style={[styles.entityTypeBtn, entityType === 'REFERENCIA' && styles.entityTypeBtnActive]}
            onPress={() => {
              setEntityType('REFERENCIA');
              if (!nomeReferencia) {
                setNomeReferencia(
                  identifiedLocationText
                    ? identifiedLocationText.split('—')[1]?.trim() || 'Nova Referência'
                    : 'Ponto de Referência'
                );
              }
            }}
          >
            <Text style={[styles.entityTypeBtnText, entityType === 'REFERENCIA' && styles.entityTypeBtnTextActive]}>
              📍 Referência Cartográfica
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.formBody} contentContainerStyle={styles.formBodyContent}>
          <input id="editModeS237" type="hidden" value={mode} />
          <input id="editIdRegistroS237" type="hidden" value={initialPin?.id || ''} />
          <input id="editProtocoloS237" type="hidden" value={initialPin?.assetCode || ''} />

          {/* Se for REFERÊNCIA CARTOGRÁFICA */}
          {entityType === 'REFERENCIA' ? (
            <View style={styles.fieldGrid}>
              <View
                style={{
                  width: '100%',
                  backgroundColor: '#f8fafc',
                  borderColor: '#cbd5e1',
                  borderWidth: 1,
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: '#10144d',
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: CORES_PADRAO_TIPOS_REFERENCIA[tipoReferencia] || '#38bdf8',
                    }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#0f172a' }}>
                    Símbolo Oficial: {NOMES_PADRAO_TIPOS_REFERENCIA[tipoReferencia] || tipoReferencia}
                  </Text>
                  <Text style={{ fontSize: 11.5, color: '#64748b' }}>
                    Marcador com miolo na cor temática configurada no mapa e na Central de Camadas.
                  </Text>
                </View>
              </View>

              <View style={styles.fieldGroupFull}>
                <Text style={styles.label}>Nome do Ponto de Referência *</Text>
                <TextInput
                  id="inputNomeReferencia"
                  style={styles.textInput}
                  value={nomeReferencia}
                  onChangeText={setNomeReferencia}
                  placeholder="Ex.: Quiosque 3, Elevador Torre 2, Restaurante..."
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Tipo da Referência *</Text>
                {Platform.OS === 'web' ? (
                  <select
                    id="selectTipoReferencia"
                    value={tipoReferencia}
                    onChange={(e) => {
                      const novo = e.target.value;
                      setTipoReferencia(novo);
                      if (novo === 'QUIOSQUE') setSubtipoReferencia('QUIOSQUE');
                      else if (novo === 'CIRCULACAO') setSubtipoReferencia('ELEVADOR');
                      else if (novo === 'ALIMENTACAO') setSubtipoReferencia('RESTAURANTE');
                      else if (novo === 'SERVICO') setSubtipoReferencia('SANITARIOS');
                      else if (novo === 'AREA_ESPECIAL') setSubtipoReferencia('EVENTOS');
                      else if (novo === 'ADMINISTRATIVO') setSubtipoReferencia('GERENCIA_COMERCIAL');
                      else if (novo === 'APOIO') setSubtipoReferencia('DEPOSITO');
                    }}
                    style={webSelectStyle}
                  >
                    {Object.entries(NOMES_PADRAO_TIPOS_REFERENCIA).map(([chave, label]) => (
                      <option key={chave} value={chave}>
                        {label} ({chave})
                      </option>
                    ))}
                  </select>
                ) : (
                  <Text style={styles.fallbackValue}>{tipoReferencia}</Text>
                )}
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Subtipo / Detalhamento</Text>
                <TextInput
                  id="inputSubtipoReferencia"
                  style={styles.textInput}
                  value={subtipoReferencia}
                  onChangeText={setSubtipoReferencia}
                  placeholder="Ex.: QUIOSQUE, ELEVADOR, RESTAURANTE..."
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View style={styles.fieldGroupFull}>
                <Text style={styles.label}>Descrição / Ponto Notável</Text>
                <TextInput
                  id="inputDescricaoReferencia"
                  style={[styles.textInput, { height: 70, textAlignVertical: 'top' }]}
                  value={descricaoReferencia}
                  onChangeText={setDescricaoReferencia}
                  placeholder="Ex.: Em frente à esteira rolante, próximo aos sanitários centrais."
                  placeholderTextColor="#94a3b8"
                  multiline
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Status de Homologação</Text>
                {Platform.OS === 'web' ? (
                  <select
                    id="selectStatusReferencia"
                    value={statusReferencia}
                    onChange={(e) => setStatusReferencia(e.target.value)}
                    style={webSelectStyle}
                  >
                    <option value="VALIDADO">VALIDADO (Homologado)</option>
                    <option value="SUGERIDO">SUGERIDO (Levantamento)</option>
                    <option value="PENDENTE">PENDENTE (Aguardando Calibração)</option>
                  </select>
                ) : (
                  <Text style={styles.fallbackValue}>{statusReferencia}</Text>
                )}
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Visibilidade no Mapa</Text>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}
                  onPress={() => setAtivoReferencia(!ativoReferencia)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.checkbox,
                      ativoReferencia && { backgroundColor: '#10b981', borderColor: '#10b981' },
                    ]}
                  >
                    {ativoReferencia && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={[styles.checkLabel, { fontWeight: '600' }]}>
                    {ativoReferencia ? 'Ponto Ativo no Mapa' : 'Ponto Inativo (Oculto)'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : entityType === 'OCORRENCIA' ? (
            <View style={styles.fieldGrid}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Categoria da Ocorrência *</Text>
                {Platform.OS === 'web' ? (
                  <select
                    id="categoriaOcorrenciaSelect"
                    value={categoriaOcorrencia}
                    onChange={(e) => setCategoriaOcorrencia(e.target.value)}
                    style={webSelectStyle}
                  >
                    {CATEGORIAS_OCORRENCIA.map((cat) => (
                      <option key={cat.id} value={cat.nome}>
                        {cat.nome} ({cat.equipe})
                      </option>
                    ))}
                  </select>
                ) : (
                  <Text style={styles.fallbackValue}>{categoriaOcorrencia}</Text>
                )}
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Prioridade (SLA) *</Text>
                {Platform.OS === 'web' ? (
                  <select
                    id="prioridadeSelect"
                    value={prioridade}
                    onChange={(e) => setPrioridade(e.target.value as any)}
                    style={webSelectStyle}
                  >
                    <option value="BAIXA">Baixa (Até 72h)</option>
                    <option value="MEDIA">Média (Até 24h)</option>
                    <option value="ALTA">Alta (Até 8h)</option>
                    <option value="CRITICA">Crítica (Até 2h)</option>
                  </select>
                ) : (
                  <Text style={styles.fallbackValue}>{prioridade}</Text>
                )}
              </View>

              <View style={styles.fieldGroupFull}>
                <View style={[styles.slaBanner, { borderColor: currentCatObj.cor }]}>
                  <Text style={styles.slaBannerTitle}>
                    ⏱️ SLA de Resolução: <Text style={{ fontWeight: '700', color: currentCatObj.cor }}>{currentCatObj.slaHoras} horas</Text>
                  </Text>
                  <Text style={styles.slaBannerSub}>
                    Equipe responsável padrão: {currentCatObj.equipe} • Prioridade selecionada: {prioridade}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            /* Se for SINALIZAÇÃO FÍSICA */
            <View style={styles.fieldGrid}>
              {/* Tipo */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Tipo *</Text>
                {Platform.OS === 'web' ? (
                  <select
                    id="tipo"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    style={webSelectStyle}
                  >
                    <option value="Placa informativa">Placa informativa</option>
                    <option value="Placa de emergência">Placa de emergência</option>
                    <option value="Adesivo de piso">Adesivo de piso</option>
                    <option value="Totem">Totem</option>
                  </select>
                ) : (
                  <Text style={styles.fallbackValue}>{tipo}</Text>
                )}
              </View>

              {/* Finalidade */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Finalidade *</Text>
                {Platform.OS === 'web' ? (
                  <select
                    id="finalidade"
                    value={finalidade}
                    onChange={(e) => setFinalidade(e.target.value)}
                    style={webSelectStyle}
                  >
                    <option value="Orientação">Orientação</option>
                    <option value="Segurança">Segurança</option>
                    <option value="Comercial">Comercial</option>
                  </select>
                ) : (
                  <Text style={styles.fallbackValue}>{finalidade}</Text>
                )}
              </View>
            </View>
          )}

          <View style={styles.fieldGrid}>

            {/* Título */}
            <View style={styles.fieldGroupFull}>
              <Text style={styles.label}>Título *</Text>
              <TextInput
                id="titulo"
                style={styles.textInput}
                placeholder="Ex.: Placa Direcional — Rua José Avelino"
                value={titulo}
                onChangeText={setTitulo}
              />
            </View>

            {/* Texto da sinalização */}
            <View style={styles.fieldGroupFull}>
              <Text style={styles.label}>Texto da sinalização</Text>
              <TextInput
                id="textoSinalizacao"
                style={[styles.textInput, { height: 60 }]}
                multiline
                numberOfLines={2}
                placeholder="Ex.: Praça de Alimentação →"
                value={textoSinalizacao}
                onChangeText={setTextoSinalizacao}
              />
            </View>

            {/* Descrição */}
            <View style={styles.fieldGroupFull}>
              <Text style={styles.label}>Descrição *</Text>
              <TextInput
                id="descricao"
                style={[styles.textInput, { height: 80 }]}
                multiline
                numberOfLines={3}
                placeholder="Descreva a peça, posição e características observadas"
                value={descricao}
                onChangeText={setDescricao}
              />
            </View>

            {/* Material */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Material</Text>
              {Platform.OS === 'web' ? (
                <select
                  id="material"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  style={webSelectStyle}
                >
                  <option value="Alumínio">Alumínio</option>
                  <option value="Acrílico">Acrílico</option>
                  <option value="Vinil">Vinil</option>
                </select>
              ) : (
                <Text style={styles.fallbackValue}>{material}</Text>
              )}
            </View>

            {/* Dimensões */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Dimensões</Text>
              <TextInput
                id="dimensoes"
                style={styles.textInput}
                placeholder="Ex.: 80 x 30 cm"
                value={dimensoes}
                onChangeText={setDimensoes}
              />
            </View>

            {/* Cor */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Cor predominante</Text>
              <TextInput
                id="cor"
                style={styles.textInput}
                placeholder="Ex.: Azul"
                value={cor}
                onChangeText={setCor}
              />
            </View>

            {/* Fixação */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Fixação</Text>
              <TextInput
                id="fixacao"
                style={styles.textInput}
                placeholder="Ex.: Parede"
                value={fixacao}
                onChangeText={setFixacao}
              />
            </View>

            {/* Estado de conservação */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Estado de conservação *</Text>
              {Platform.OS === 'web' ? (
                <select
                  id="estadoConservacao"
                  value={estadoConservacao}
                  onChange={(e) => setEstadoConservacao(e.target.value)}
                  style={webSelectStyle}
                >
                  <option value="Boa">Boa</option>
                  <option value="Ótima">Ótima</option>
                  <option value="Regular">Regular</option>
                  <option value="Danificada">Danificada</option>
                </select>
              ) : (
                <Text style={styles.fallbackValue}>{estadoConservacao}</Text>
              )}
            </View>

            {/* Condição */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Condição *</Text>
              {Platform.OS === 'web' ? (
                <select
                  id="condicao"
                  value={condicao}
                  onChange={(e) => setCondicao(e.target.value)}
                  style={webSelectStyle}
                >
                  <option value="Adequada">Adequada</option>
                  <option value="Irregular">Irregular</option>
                </select>
              ) : (
                <Text style={styles.fallbackValue}>{condicao}</Text>
              )}
            </View>

            {/* Responsável */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Responsável *</Text>
              {Platform.OS === 'web' ? (
                <select
                  id="responsavel"
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                  style={webSelectStyle}
                >
                  <option value="Davidsilva • Operações">Davidsilva • Operações</option>
                  <option value="Manutenção">Manutenção</option>
                </select>
              ) : (
                <Text style={styles.fallbackValue}>{responsavel}</Text>
              )}
            </View>
          </View>

          {/* Seção de Fotos (.photo-section) */}
          <View style={styles.photoSection}>
            <Text style={styles.label}>Fotos</Text>
            {Platform.OS === 'web' && (
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleWebFileSelected}
              />
            )}
            <View style={styles.photoActions}>
              <TouchableOpacity
                id="fotoInput"
                style={styles.photoBtn}
                onPress={handleAddPhotoPress}
              >
                <Text style={styles.photoBtnText}>Adicionar foto</Text>
              </TouchableOpacity>
              <Text id="fotoResumo" style={styles.photoSummary}>
                {photos.length === 0
                  ? 'Nenhuma foto anexada'
                  : `${photos.length} foto${photos.length > 1 ? 's' : ''} anexada${photos.length > 1 ? 's' : ''}`}
              </Text>
            </View>
            <View id="fotoPreview" style={styles.photoPreview}>
              {photos.map((photo) => (
                <View key={photo.id} style={styles.previewThumbContainer}>
                  <Image source={{ uri: photo.localUri }} style={styles.previewThumb} />
                  <TouchableOpacity
                    style={styles.removePhotoBtn}
                    onPress={() => handleRemovePhoto(photo.id)}
                    aria-label="Remover foto"
                  >
                    <Text style={styles.removePhotoBtnText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* Checkboxes */}
          <View style={styles.checkboxGrid}>
            <TouchableOpacity style={styles.checkRow} onPress={() => setIluminada(!iluminada)}>
              <View style={[styles.checkbox, iluminada && styles.checkboxChecked]}>
                {iluminada && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkLabel}>Iluminada</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.checkRow} onPress={() => setDuplaFace(!duplaFace)}>
              <View style={[styles.checkbox, duplaFace && styles.checkboxChecked]}>
                {duplaFace && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkLabel}>Dupla face</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.checkRow} onPress={() => setQrCode(!qrCode)}>
              <View style={[styles.checkbox, qrCode && styles.checkboxChecked]}>
                {qrCode && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkLabel}>Possui QR Code</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.checkRow} onPress={() => setBraille(!braille)}>
              <View style={[styles.checkbox, braille && styles.checkboxChecked]}>
                {braille && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkLabel}>Possui Braille</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.checkRow} onPress={() => setPictograma(!pictograma)}>
              <View style={[styles.checkbox, pictograma && styles.checkboxChecked]}>
                {pictograma && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkLabel}>Possui pictograma</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Footer Actions */}
        <View style={styles.formActions}>
          {/* Botão de Excluir Sinalização com confirmação inline */}
          {mode === 'EDITAR' && entityType !== 'REFERENCIA' && initialPin && onDeletePin && (
            !showConfirmDelete ? (
              <TouchableOpacity
                id="excluirPinBtn"
                style={[
                  styles.btnCancel,
                  {
                    borderColor: '#ef4444',
                    backgroundColor: '#fef2f2',
                    marginRight: 'auto',
                  },
                ]}
                onPress={() => setShowConfirmDelete(true)}
              >
                <Text style={{ color: '#dc2626', fontWeight: '700', fontSize: 13 }}>
                  🗑️ Excluir Registro
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginRight: 'auto' }}>
                <TouchableOpacity
                  id="confirmarExclusaoPinBtn"
                  style={[
                    styles.btnCancel,
                    {
                      borderColor: '#dc2626',
                      backgroundColor: '#dc2626',
                    },
                  ]}
                  onPress={() => {
                    onDeletePin(initialPin.id);
                    setShowConfirmDelete(false);
                    onClose();
                  }}
                >
                  <Text style={{ color: '#ffffff', fontWeight: '800', fontSize: 12 }}>
                    ✓ Confirmar Exclusão
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btnCancel, { paddingHorizontal: 8 }]}
                  onPress={() => setShowConfirmDelete(false)}
                >
                  <Text style={{ color: '#64748b', fontSize: 12 }}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            )
          )}

          {/* Botão de Excluir Referência */}
          {mode === 'EDITAR' && entityType === 'REFERENCIA' && initialReferencia && onDeleteReferencia && (
            !showConfirmDelete ? (
              <TouchableOpacity
                id="excluirReferenciaBtn"
                style={[
                  styles.btnCancel,
                  {
                    borderColor: '#ef4444',
                    backgroundColor: '#fef2f2',
                    marginRight: 'auto',
                  },
                ]}
                onPress={() => setShowConfirmDelete(true)}
              >
                <Text style={{ color: '#dc2626', fontWeight: '700', fontSize: 13 }}>
                  🗑️ Excluir Referência
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginRight: 'auto' }}>
                <TouchableOpacity
                  id="confirmarExclusaoRefBtn"
                  style={[
                    styles.btnCancel,
                    {
                      borderColor: '#dc2626',
                      backgroundColor: '#dc2626',
                    },
                  ]}
                  onPress={() => {
                    onDeleteReferencia(initialReferencia.id);
                    setShowConfirmDelete(false);
                    onClose();
                  }}
                >
                  <Text style={{ color: '#ffffff', fontWeight: '800', fontSize: 12 }}>
                    ✓ Confirmar Exclusão
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btnCancel, { paddingHorizontal: 8 }]}
                  onPress={() => setShowConfirmDelete(false)}
                >
                  <Text style={{ color: '#64748b', fontSize: 12 }}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            )
          )}

          <TouchableOpacity id="cancelarForm" style={styles.btnCancel} onPress={onClose}>
            <Text style={styles.btnCancelText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity id="salvar" style={styles.btnSave} onPress={handleSubmit}>
            <Text style={styles.btnSaveText}>
              {mode === 'EDITAR'
                ? entityType === 'REFERENCIA' ? 'Salvar referência' : 'Salvar alterações'
                : entityType === 'REFERENCIA' ? 'Criar referência' : 'Salvar registro'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const webSelectStyle = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: '8px',
  border: '1px solid #DFE2EA',
  fontSize: '13px',
  backgroundColor: '#FFFFFF',
};

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 300,
    backgroundColor: 'rgba(16, 18, 40, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  panelBox: {
    width: 720,
    maxWidth: '92%',
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.28,
    shadowRadius: 40,
    elevation: 10,
  },
  panelBoxMobile: {
    width: '96%',
    padding: 14,
  },
  formHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F7',
  },
  eyebrowText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#F50087',
  },
  headTitle: {
    fontSize: 18,
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
  locationBox: {
    backgroundColor: '#F8F9FC',
    borderWidth: 1,
    borderColor: '#E8EBF2',
    borderRadius: 10,
    padding: 10,
    marginVertical: 12,
  },
  locationTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#171B68',
  },
  locationResumo: {
    fontSize: 13,
    fontWeight: '600',
    color: '#20233A',
    marginTop: 2,
  },
  locationCoords: {
    fontSize: 11,
    color: '#676A7A',
    marginTop: 1,
  },
  formBody: {
    maxHeight: 460,
  },
  formBodyContent: {
    gap: 14,
    paddingBottom: 10,
  },
  fieldGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  fieldGroup: {
    width: '48%',
  },
  fieldGroupFull: {
    width: '100%',
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#20233A',
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#DFE2EA',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: '#20233A',
    backgroundColor: '#FFFFFF',
  },
  fallbackValue: {
    fontSize: 13,
    color: '#20233A',
    paddingVertical: 6,
  },
  photoSection: {
    borderTopWidth: 1,
    borderTopColor: '#F0F2F7',
    paddingTop: 12,
  },
  photoActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  photoBtn: {
    backgroundColor: '#F4F5F8',
    borderWidth: 1,
    borderColor: '#DFE2EA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  photoBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#171B68',
  },
  photoSummary: {
    fontSize: 12,
    color: '#676A7A',
  },
  photoPreview: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  previewThumbContainer: {
    position: 'relative',
    width: 64,
    height: 64,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#DFE2EA',
    marginRight: 8,
    marginBottom: 8,
  },
  previewThumb: {
    width: '100%',
    height: '100%',
  },
  removePhotoBtn: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 18,
    height: 18,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removePhotoBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 14,
  },
  checkboxGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F2F7',
    paddingTop: 12,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#CFD4DF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#171B68',
    borderColor: '#171B68',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: -2,
  },
  checkLabel: {
    fontSize: 12,
    color: '#20233A',
    fontWeight: '600',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F2F7',
  },
  btnCancel: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE2EA',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  btnCancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#20233A',
  },
  btnSave: {
    backgroundColor: '#F50087',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  btnSaveText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  entitySelectorWrap: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 6,
    backgroundColor: '#F0F2F7',
    padding: 4,
    borderRadius: 10,
  },
  entityTypeBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  entityTypeBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  entityTypeBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#676A7A',
  },
  entityTypeBtnTextActive: {
    color: '#171B68',
    fontWeight: '700',
  },
  slaBanner: {
    backgroundColor: '#F9FAFC',
    borderLeftWidth: 4,
    borderRadius: 6,
    padding: 10,
    marginBottom: 4,
  },
  slaBannerTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  slaBannerSub: {
    fontSize: 11,
    color: '#64748B',
  },
});
