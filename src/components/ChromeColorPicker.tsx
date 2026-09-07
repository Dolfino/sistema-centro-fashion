import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';

interface ChromeColorPickerProps {
  color: string; // HEX ex: "#D97706"
  onChange: (hex: string) => void;
  onClose?: () => void;
}

// Helpers de Conversão de Cores
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return { r: 217, g: 119, b: 6 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s, v };
}

export function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  h = ((h % 360) + 360) % 360;
  h /= 360;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  let r = 0;
  let g = 0;
  let b = 0;

  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export const ChromeColorPicker: React.FC<ChromeColorPickerProps> = ({
  color,
  onChange,
  onClose,
}) => {
  const initialRgb = hexToRgb(color);
  const initialHsv = rgbToHsv(initialRgb.r, initialRgb.g, initialRgb.b);

  const [hsv, setHsv] = useState(initialHsv);
  const [format, setFormat] = useState<'RGB' | 'HEX'>('RGB');

  // Input strings controlados para digitação fluida
  const currentRgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
  const currentHex = rgbToHex(currentRgb.r, currentRgb.g, currentRgb.b);

  const [inputR, setInputR] = useState(String(currentRgb.r));
  const [inputG, setInputG] = useState(String(currentRgb.g));
  const [inputB, setInputB] = useState(String(currentRgb.b));
  const [inputHex, setInputHex] = useState(currentHex);

  const satValRef = useRef<any>(null);
  const hueRef = useRef<any>(null);

  // Sincroniza inputs quando HSV muda
  useEffect(() => {
    const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
    setInputR(String(rgb.r));
    setInputG(String(rgb.g));
    setInputB(String(rgb.b));
    setInputHex(rgbToHex(rgb.r, rgb.g, rgb.b));
  }, [hsv]);

  // Atualiza pai com a cor HEX
  const emitColorChange = useCallback(
    (newHsv: { h: number; s: number; v: number }) => {
      setHsv(newHsv);
      const rgb = hsvToRgb(newHsv.h, newHsv.s, newHsv.v);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      onChange(hex);
    },
    [onChange]
  );

  // Interação no painel de Saturação / Brilho (SatVal)
  const handleSatValMove = (e: any) => {
    if (!satValRef.current || Platform.OS !== 'web') return;
    const rect = satValRef.current.getBoundingClientRect();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;

    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

    const s = x / rect.width;
    const v = 1 - y / rect.height;

    emitColorChange({ ...hsv, s, v });
  };

  // Interação na barra de Matiz (Hue)
  const handleHueMove = (e: any) => {
    if (!hueRef.current || Platform.OS !== 'web') return;
    const rect = hueRef.current.getBoundingClientRect();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;

    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const h = (x / rect.width) * 360;

    emitColorChange({ ...hsv, h });
  };

  // Conta-gotas nativo (EyeDropper API)
  const handleEyeDropper = async () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          const rgb = hexToRgb(result.sRGBHex);
          const newHsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
          emitColorChange(newHsv);
        }
      } catch {
        // Usuário cancelou
      }
    }
  };

  // Alteração manual nos inputs numéricos
  const handleRgbInputChange = (key: 'r' | 'g' | 'b', val: string) => {
    if (key === 'r') setInputR(val);
    if (key === 'g') setInputG(val);
    if (key === 'b') setInputB(val);

    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      const clampNum = Math.max(0, Math.min(255, num));
      const rgb = {
        r: key === 'r' ? clampNum : currentRgb.r,
        g: key === 'g' ? clampNum : currentRgb.g,
        b: key === 'b' ? clampNum : currentRgb.b,
      };
      const newHsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      emitColorChange(newHsv);
    }
  };

  const handleHexInputChange = (val: string) => {
    setInputHex(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      const rgb = hexToRgb(val);
      const newHsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      emitColorChange(newHsv);
    }
  };

  const pureHueColor = `hsl(${Math.round(hsv.h)}, 100%, 50%)`;

  return (
    <View style={styles.pickerContainer}>
      {/* 1. Painel de Saturação e Brilho (Gradiente HSV 2D) */}
      <View
        ref={satValRef}
        id="chromeSatValArea"
        style={[styles.satValArea, { backgroundColor: pureHueColor }]}
        {...({
          onMouseDown: (e: any) => {
            handleSatValMove(e);
            const onMouseMove = (moveEvent: any) => handleSatValMove(moveEvent);
            const onMouseUp = () => {
              window.removeEventListener('mousemove', onMouseMove);
              window.removeEventListener('mouseup', onMouseUp);
            };
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
          },
          onTouchStart: (e: any) => handleSatValMove(e),
          onTouchMove: (e: any) => handleSatValMove(e),
        } as any)}
      >
        {/* Camada branca gradiente horizontal */}
        <View
          style={[
            styles.satValWhiteOverlay,
            Platform.OS === 'web'
              ? ({
                  backgroundImage: 'linear-gradient(to right, #ffffff, rgba(255, 255, 255, 0))',
                } as any)
              : null,
          ]}
          pointerEvents="none"
        />
        {/* Camada preta gradiente vertical */}
        <View
          style={[
            styles.satValBlackOverlay,
            Platform.OS === 'web'
              ? ({
                  backgroundImage: 'linear-gradient(to top, #000000, rgba(0, 0, 0, 0))',
                } as any)
              : null,
          ]}
          pointerEvents="none"
        />

        {/* Anel indicador de seleção */}
        <View
          pointerEvents="none"
          style={[
            styles.satValPointer,
            {
              left: `${hsv.s * 100}%`,
              top: `${(1 - hsv.v) * 100}%`,
            },
          ]}
        />
      </View>

      {/* 2. Barra de Controle: Conta-gotas, Círculo de Preview e Slider de Hue */}
      <View style={styles.controlsRow}>
        {/* Botão de Conta-Gotas */}
        <TouchableOpacity
          id="eyeDropperBtn"
          style={styles.eyeDropperBtn}
          onPress={handleEyeDropper}
          activeOpacity={0.7}
        >
          <Text style={styles.eyeDropperIcon}>✑</Text>
        </TouchableOpacity>

        {/* Círculo com a cor atual */}
        <View style={[styles.colorPreviewCircle, { backgroundColor: currentHex }]} />

        {/* Barra de Hue (Arco-Íris) */}
        <View
          ref={hueRef}
          id="chromeHueSlider"
          style={styles.hueBarContainer}
          {...({
            onMouseDown: (e: any) => {
              handleHueMove(e);
              const onMouseMove = (moveEvent: any) => handleHueMove(moveEvent);
              const onMouseUp = () => {
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
              };
              window.addEventListener('mousemove', onMouseMove);
              window.addEventListener('mouseup', onMouseUp);
            },
            onTouchStart: (e: any) => handleHueMove(e),
            onTouchMove: (e: any) => handleHueMove(e),
          } as any)}
        >
          <View
            style={[
              styles.hueBarGradient,
              Platform.OS === 'web'
                ? ({
                    backgroundImage:
                      'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
                  } as any)
                : null,
            ]}
            pointerEvents="none"
          />
          <View
            pointerEvents="none"
            style={[
              styles.huePointer,
              {
                left: `${(hsv.h / 360) * 100}%`,
              },
            ]}
          />
        </View>
      </View>

      {/* 3. Inputs Numéricos e Botão de Alternância de Formato */}
      <View style={styles.inputsRow}>
        {format === 'RGB' ? (
          <View style={styles.rgbFieldsContainer}>
            <View style={styles.inputCol}>
              <TextInput
                style={styles.numInput}
                value={inputR}
                keyboardType="numeric"
                maxLength={3}
                onChangeText={(t) => handleRgbInputChange('r', t)}
              />
              <Text style={styles.inputLabel}>R</Text>
            </View>
            <View style={styles.inputCol}>
              <TextInput
                style={styles.numInput}
                value={inputG}
                keyboardType="numeric"
                maxLength={3}
                onChangeText={(t) => handleRgbInputChange('g', t)}
              />
              <Text style={styles.inputLabel}>G</Text>
            </View>
            <View style={styles.inputCol}>
              <TextInput
                style={styles.numInput}
                value={inputB}
                keyboardType="numeric"
                maxLength={3}
                onChangeText={(t) => handleRgbInputChange('b', t)}
              />
              <Text style={styles.inputLabel}>B</Text>
            </View>
          </View>
        ) : (
          <View style={styles.hexFieldContainer}>
            <TextInput
              style={styles.hexInput}
              value={inputHex}
              autoCapitalize="characters"
              maxLength={7}
              onChangeText={handleHexInputChange}
            />
            <Text style={styles.inputLabel}>HEX</Text>
          </View>
        )}

        {/* Botão de Alternância RGB / HEX */}
        <TouchableOpacity
          id="toggleColorFormatBtn"
          style={styles.formatToggleBtn}
          onPress={() => setFormat(format === 'RGB' ? 'HEX' : 'RGB')}
          activeOpacity={0.7}
        >
          <Text style={styles.formatToggleIcon}>⇅</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    width: 236,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 30,
    zIndex: 999999,
  },
  satValArea: {
    width: '100%',
    height: 125,
    borderRadius: 4,
    position: 'relative',
    overflow: 'hidden',
    cursor: 'crosshair' as any,
  },
  satValWhiteOverlay: {
    ...StyleSheet.absoluteFillObject,
    // @ts-ignore
    background: 'linear-gradient(to right, #ffffff, rgba(255, 255, 255, 0))',
  },
  satValBlackOverlay: {
    ...StyleSheet.absoluteFillObject,
    // @ts-ignore
    background: 'linear-gradient(to top, #000000, rgba(0, 0, 0, 0))',
  },
  satValPointer: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
    marginLeft: -6,
    marginTop: -6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 3,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  eyeDropperBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  eyeDropperIcon: {
    fontSize: 12,
    color: '#475569',
    transform: [{ rotate: '45deg' }],
  },
  colorPreviewCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.15)',
  },
  hueBarContainer: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    position: 'relative',
    justifyContent: 'center',
    cursor: 'pointer' as any,
  },
  hueBarGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 5,
    // @ts-ignore
    background:
      'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
  },
  huePointer: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    marginLeft: -6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 3,
  },
  inputsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 6,
  },
  rgbFieldsContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 5,
  },
  hexFieldContainer: {
    flex: 1,
    alignItems: 'center',
  },
  inputCol: {
    flex: 1,
    alignItems: 'center',
  },
  numInput: {
    width: '100%',
    height: 24,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 4,
    fontSize: 11,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
    paddingVertical: 0,
    paddingHorizontal: 2,
    backgroundColor: '#ffffff',
  },
  hexInput: {
    width: '100%',
    height: 24,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 4,
    fontSize: 11,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
    paddingVertical: 0,
    paddingHorizontal: 2,
    backgroundColor: '#ffffff',
  },
  inputLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94a3b8',
    marginTop: 2,
  },
  formatToggleBtn: {
    width: 22,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  formatToggleIcon: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748b',
  },
});
