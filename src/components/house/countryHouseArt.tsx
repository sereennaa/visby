import React from 'react';
import { G, Rect, Circle, Ellipse, Line, Path, Polygon, Text as SvgText } from 'react-native-svg';
import Animated from 'react-native-reanimated';
import {
  COUNTRY_SIGNATURE_COMPLEXITY,
  getCountryStyleProfile,
  type PathStyle,
  type SignatureLevel,
  type WindowStyle,
} from '../../config/countryArchitecture';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

type Token =
  | 'torii' | 'noren' | 'stone_lantern'
  | 'dancheong' | 'onggi' | 'ondol'
  | 'couplets' | 'fu' | 'lion'
  | 'bubble_tea' | 'market_lights' | 'conical_hat'
  | 'bistro' | 'cat_window' | 'balcony'
  | 'phone_box' | 'mailbox' | 'ivy'
  | 'bicycle' | 'tulip_box' | 'tiny_windmill'
  | 'waffle_awning' | 'choco_box' | 'dormer'
  | 'pretzel_sign' | 'grapevine' | 'fan_tile'
  | 'azulejo_band' | 'sardine' | 'surfboard'
  | 'blue_table' | 'puffin' | 'sauna_steam'
  | 'cowbell' | 'folk_heart' | 'stork'
  | 'anchor' | 'race_flag' | 'eagle'
  | 'vintage_car' | 'reggae_band' | 'flying_fish'
  | 'merengue_note' | 'willemstad' | 'piton'
  | 'papel_picado' | 'sombrero' | 'mask'
  | 'llama' | 'equator_line' | 'mate'
  | 'moai' | 'drum' | 'coffee_sack'
  | 'zellige' | 'cedar' | 'barjeel'
  | 'fatima' | 'nazar' | 'pyramid'
  | 'ankh' | 'papyrus_reed' | 'rangoli'
  | 'maasai_shield' | 'kilimanjaro' | 'baobab'
  | 'lemur' | 'protea' | 'ndebele_band'
  | 'table_mountain' | 'picket_fence' | 'moose'
  | 'kangaroo' | 'southern_cross' | 'kiwi'
  | 'koru' | 'papal_keys' | 'palm_tree' | 'acacia_tree' | 'maple_leaf';

const COUNTRY_SIGNATURES: Record<string, Token[]> = {
  jp: ['torii', 'noren', 'stone_lantern'],
  kr: ['dancheong', 'onggi', 'ondol'],
  cn: ['couplets', 'fu', 'lion'],
  tw: ['bubble_tea', 'market_lights', 'fan_tile'],
  vn: ['conical_hat', 'market_lights', 'fan_tile'],
  fr: ['balcony', 'bistro', 'cat_window'],
  be: ['waffle_awning', 'choco_box', 'dormer'],
  mc: ['race_flag', 'balcony', 'palm_tree'],
  gr: ['blue_table', 'cat_window', 'fan_tile'],
  it: ['grapevine', 'bistro', 'fan_tile'],
  hr: ['folk_heart', 'blue_table', 'fan_tile'],
  me: ['anchor', 'stone_lantern', 'fan_tile'],
  es: ['balcony', 'fan_tile', 'bistro'],
  pt: ['azulejo_band', 'sardine', 'surfboard'],
  tr: ['nazar', 'fan_tile', 'bistro'],
  gb: ['phone_box', 'mailbox', 'ivy'],
  nl: ['bicycle', 'tulip_box', 'tiny_windmill'],
  de: ['pretzel_sign', 'tulip_box', 'dormer'],
  cu: ['vintage_car', 'merengue_note', 'balcony'],
  jm: ['reggae_band', 'mask', 'palm_tree'],
  bb: ['flying_fish', 'surfboard', 'blue_table'],
  do: ['merengue_note', 'balcony', 'blue_table'],
  cw: ['willemstad', 'sardine', 'blue_table'],
  lc: ['piton', 'merengue_note', 'palm_tree'],
  mx: ['papel_picado', 'sombrero', 'azulejo_band'],
  br: ['mask', 'surfboard', 'palm_tree'],
  pe: ['llama', 'fan_tile', 'rangoli'],
  ec: ['equator_line', 'sombrero', 'fan_tile'],
  ar: ['mate', 'balcony', 'fan_tile'],
  cl: ['moai', 'fan_tile', 'surfboard'],
  uy: ['mate', 'drum', 'surfboard'],
  co: ['coffee_sack', 'sombrero', 'mask'],
  ma: ['zellige', 'fatima', 'fan_tile'],
  lb: ['cedar', 'balcony', 'blue_table'],
  ae: ['barjeel', 'nazar', 'palm_tree'],
  tn: ['fatima', 'azulejo_band', 'fan_tile'],
  in: ['rangoli', 'mask', 'fan_tile'],
  ke: ['maasai_shield', 'acacia_tree', 'fan_tile'],
  tz: ['kilimanjaro', 'maasai_shield', 'fan_tile'],
  mg: ['baobab', 'lemur', 'fan_tile'],
  eg: ['pyramid', 'ankh', 'papyrus_reed'],
  za: ['protea', 'ndebele_band', 'table_mountain'],
  no: ['stork', 'anchor', 'fan_tile'],
  se: ['folk_heart', 'tiny_windmill', 'tulip_box'],
  fi: ['sauna_steam', 'cat_window', 'fan_tile'],
  is: ['puffin', 'sauna_steam', 'fan_tile'],
  ch: ['cowbell', 'tulip_box', 'fan_tile'],
  at: ['pretzel_sign', 'tulip_box', 'fan_tile'],
  sk: ['folk_heart', 'fan_tile', 'sauna_steam'],
  si: ['cowbell', 'fan_tile', 'tulip_box'],
  pl: ['stork', 'fan_tile', 'tulip_box'],
  hu: ['folk_heart', 'fan_tile', 'pretzel_sign'],
  bg: ['fan_tile', 'tulip_box', 'merengue_note'],
  ro: ['stork', 'fan_tile', 'eagle'],
  ba: ['coffee_sack', 'fan_tile', 'balcony'],
  cz: ['dormer', 'fan_tile', 'cat_window'],
  al: ['eagle', 'fan_tile', 'anchor'],
  th: ['market_lights', 'fan_tile', 'stone_lantern'],
  id: ['market_lights', 'surfboard', 'fan_tile'],
  us: ['mailbox', 'picket_fence', 'balcony'],
  ca: ['moose', 'picket_fence', 'maple_leaf'],
  au: ['kangaroo', 'surfboard', 'southern_cross'],
  nz: ['kiwi', 'koru', 'southern_cross'],
  va: ['papal_keys', 'balcony', 'dormer'],
};

interface SignaturePiece {
  token: Token;
  tx: number;
  ty: number;
  scale: number;
  rotate: number;
}

const hashCountry = (countryId: string) => {
  let h = 0;
  for (let i = 0; i < countryId.length; i += 1) h = (h * 33 + countryId.charCodeAt(i)) % 997;
  return h;
};

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

function createSignatureComposition(countryId: string, tokens: Token[], level: SignatureLevel): SignaturePiece[] {
  const seed = hashCountry(countryId);
  const maxPieces = level === 1 ? 2 : 3;
  const selected = tokens.slice(0, maxPieces);
  const minScale = 0.92;
  return selected.map((token, i) => {
    const n = (seed + i * 47) % 100;
    const tx = (n % 3 === 0 ? -1 : 1) * (6 + (n % 7));
    const ty = -2 - ((n + i * 7) % 8);
    const scale = clamp(0.85 + ((seed + i * 13) % 35) / 100, minScale, 1.2);
    const rotate = ((seed + i * 23) % 11) - 5;
    return { token, tx, ty, scale, rotate };
  });
}

function drawToken(token: Token, w: number, wallY: number, wallH: number, accent: string, trim: string) {
  const gy = wallY + wallH;
  switch (token) {
    case 'torii':
      return <G><Line x1={w * 0.04} y1={gy - 2} x2={w * 0.04} y2={gy - 18} stroke={accent} strokeWidth={2} /><Line x1={w * 0.1} y1={gy - 2} x2={w * 0.1} y2={gy - 18} stroke={accent} strokeWidth={2} /><Line x1={w * 0.02} y1={gy - 18} x2={w * 0.12} y2={gy - 18} stroke={accent} strokeWidth={2.5} /></G>;
    case 'noren':
      return <Rect x={w * 0.45} y={wallY + wallH * 0.36} width={w * 0.1} height={5} fill={accent} rx={1} />;
    case 'stone_lantern':
      return <G><Rect x={w * 0.87} y={gy - 8} width={6} height={8} fill={trim} rx={1} /><Rect x={w * 0.865} y={gy - 10} width={8} height={2} fill={accent} rx={1} /></G>;
    case 'dancheong':
      return <Line x1={w * 0.14} y1={wallY + 4} x2={w * 0.86} y2={wallY + 4} stroke={accent} strokeWidth={1.5} />;
    case 'onggi':
      return <Ellipse cx={w * 0.82} cy={gy - 4} rx={5} ry={4} fill="#8D6E63" />;
    case 'ondol':
      return <Rect x={w * 0.73} y={wallY - 8} width={w * 0.05} height={6} fill="#795548" rx={1} />;
    case 'couplets':
      return <G><Rect x={w * 0.36} y={wallY + wallH * 0.35} width={3} height={wallH * 0.42} fill="#C62828" /><Rect x={w * 0.61} y={wallY + wallH * 0.35} width={3} height={wallH * 0.42} fill="#C62828" /></G>;
    case 'fu':
      return <Rect x={w * 0.48} y={wallY + wallH * 0.3} width={w * 0.04} height={w * 0.04} fill={accent} transform={`rotate(45 ${w * 0.5} ${wallY + wallH * 0.32})`} />;
    case 'lion':
      return <Circle cx={w * 0.85} cy={gy - 5} r={3} fill={trim} />;
    case 'bubble_tea':
      return <G><Rect x={w * 0.18} y={gy - 8} width={6} height={8} fill="#8D6E63" rx={1} /><Line x1={w * 0.21} y1={gy - 8} x2={w * 0.21} y2={gy - 12} stroke={accent} strokeWidth={1} /></G>;
    case 'market_lights':
      return <G>{[0.2, 0.35, 0.5, 0.65, 0.8].map((p, i) => <Circle key={i} cx={w * p} cy={wallY + 2} r={1.3} fill={i % 2 ? trim : accent} />)}</G>;
    case 'conical_hat':
      return <Polygon points={`${w * 0.15},${gy - 3} ${w * 0.22},${gy - 3} ${w * 0.185},${gy - 11}`} fill="#D7A86E" />;
    case 'balcony':
      return <Line x1={w * 0.32} y1={wallY + wallH * 0.2} x2={w * 0.68} y2={wallY + wallH * 0.2} stroke={trim} strokeWidth={2} />;
    case 'bistro':
      return <G><Circle cx={w * 0.22} cy={gy - 9} r={3} fill={trim} /><Line x1={w * 0.22} y1={gy - 6} x2={w * 0.22} y2={gy - 1} stroke={trim} strokeWidth={1.2} /></G>;
    case 'cat_window':
      return <Circle cx={w * 0.73} cy={wallY + wallH * 0.25} r={2} fill="#455A64" />;
    case 'phone_box':
      return <Rect x={w * 0.02} y={gy - 16} width={w * 0.06} height={16} fill="#D32F2F" rx={1} />;
    case 'mailbox':
      return <G><Rect x={w * 0.85} y={gy - 8} width={8} height={5} fill="#455A64" rx={1} /><Line x1={w * 0.89} y1={gy - 3} x2={w * 0.89} y2={gy} stroke="#6D4C41" strokeWidth={1.2} /></G>;
    case 'ivy':
      return <Path d={`M ${w * 0.82} ${wallY + 2} Q ${w * 0.87} ${wallY + wallH * 0.4} ${w * 0.82} ${wallY + wallH * 0.8}`} stroke="#2E7D32" strokeWidth={1.3} fill="none" />;
    case 'bicycle':
      return <G><Circle cx={w * 0.16} cy={gy - 4} r={3} fill="none" stroke={accent} strokeWidth={1.2} /><Circle cx={w * 0.24} cy={gy - 4} r={3} fill="none" stroke={accent} strokeWidth={1.2} /><Line x1={w * 0.16} y1={gy - 4} x2={w * 0.21} y2={gy - 8} stroke={accent} strokeWidth={1.1} /></G>;
    case 'tulip_box':
      return <Rect x={w * 0.67} y={wallY + wallH * 0.33} width={w * 0.16} height={3} fill="#8D6E63" rx={1} />;
    case 'tiny_windmill':
      return <G><Line x1={w * 0.9} y1={gy - 10} x2={w * 0.9} y2={gy - 2} stroke="#8D6E63" strokeWidth={1} /><Line x1={w * 0.885} y1={gy - 8} x2={w * 0.915} y2={gy - 8} stroke={trim} strokeWidth={1} /><Line x1={w * 0.9} y1={gy - 9.5} x2={w * 0.9} y2={gy - 6.5} stroke={trim} strokeWidth={1} /></G>;
    case 'waffle_awning':
      return <Rect x={w * 0.36} y={wallY + wallH * 0.12} width={w * 0.28} height={4} fill="#C62828" rx={1} />;
    case 'choco_box':
      return <Rect x={w * 0.18} y={wallY + wallH * 0.25} width={w * 0.06} height={4} fill="#5D4037" rx={1} />;
    case 'dormer':
      return <Rect x={w * 0.46} y={wallY - 8} width={w * 0.08} height={6} fill={trim} rx={1} />;
    case 'pretzel_sign':
      return <Circle cx={w * 0.14} cy={wallY + wallH * 0.35} r={2.2} fill="none" stroke="#D6863D" strokeWidth={1.2} />;
    case 'grapevine':
      return <Path d={`M ${w * 0.3} ${wallY + 1} Q ${w * 0.5} ${wallY - 4} ${w * 0.7} ${wallY + 1}`} stroke="#558B2F" strokeWidth={1.2} fill="none" />;
    case 'fan_tile':
      return <Circle cx={w * 0.2} cy={gy - 5} r={2} fill={accent} opacity={0.7} />;
    case 'azulejo_band':
      return <Rect x={w * 0.14} y={wallY + wallH * 0.75} width={w * 0.72} height={4} fill="#1E88E5" opacity={0.35} />;
    case 'sardine':
      return <Ellipse cx={w * 0.84} cy={gy - 5} rx={4} ry={1.7} fill="#90A4AE" />;
    case 'surfboard':
      return <Ellipse cx={w * 0.92} cy={gy - 10} rx={2} ry={9} fill={accent} />;
    case 'blue_table':
      return <G><Rect x={w * 0.14} y={gy - 8} width={8} height={2} fill="#1E88E5" /><Line x1={w * 0.18} y1={gy - 6} x2={w * 0.18} y2={gy} stroke="#1E88E5" strokeWidth={1} /></G>;
    case 'puffin':
      return <Ellipse cx={w * 0.86} cy={wallY - 4} rx={4} ry={3} fill="#263238" />;
    case 'sauna_steam':
      return <Path d={`M ${w * 0.76} ${wallY - 5} Q ${w * 0.78} ${wallY - 12} ${w * 0.8} ${wallY - 7}`} stroke="#B0BEC5" strokeWidth={1} fill="none" />;
    case 'cowbell':
      return <Rect x={w * 0.49} y={wallY + wallH * 0.48} width={4} height={6} fill="#FBC02D" rx={1} />;
    case 'folk_heart':
      return <Path d={`M ${w * 0.14} ${gy - 7} C ${w * 0.12} ${gy - 11}, ${w * 0.08} ${gy - 10}, ${w * 0.14} ${gy - 3} C ${w * 0.2} ${gy - 10}, ${w * 0.16} ${gy - 11}, ${w * 0.14} ${gy - 7}`} fill="#E53935" />;
    case 'stork':
      return <G><Line x1={w * 0.86} y1={wallY - 2} x2={w * 0.89} y2={wallY - 10} stroke="#616161" strokeWidth={1} /><Circle cx={w * 0.89} cy={wallY - 12} r={2} fill="#ECEFF1" /></G>;
    case 'anchor':
      return <Path d={`M ${w * 0.87} ${gy - 13} L ${w * 0.87} ${gy - 4} M ${w * 0.83} ${gy - 6} Q ${w * 0.87} ${gy - 1} ${w * 0.91} ${gy - 6}`} stroke={accent} strokeWidth={1.2} fill="none" />;
    case 'race_flag':
      return <Polygon points={`${w * 0.12},${wallY + 2} ${w * 0.2},${wallY + 4} ${w * 0.12},${wallY + 6}`} fill="#263238" />;
    case 'eagle':
      return <Path d={`M ${w * 0.16} ${gy - 7} Q ${w * 0.2} ${gy - 12} ${w * 0.24} ${gy - 7}`} stroke="#212121" strokeWidth={1.2} fill="none" />;
    case 'vintage_car':
      return <G><Rect x={w * 0.08} y={gy - 8} width={12} height={4} fill={accent} rx={1} /><Circle cx={w * 0.11} cy={gy - 4} r={1.5} fill="#263238" /><Circle cx={w * 0.17} cy={gy - 4} r={1.5} fill="#263238" /></G>;
    case 'reggae_band':
      return <Rect x={w * 0.14} y={wallY + wallH * 0.72} width={w * 0.18} height={4} fill="#2E7D32" />;
    case 'flying_fish':
      return <Path d={`M ${w * 0.82} ${gy - 8} Q ${w * 0.88} ${gy - 12} ${w * 0.92} ${gy - 8} Q ${w * 0.88} ${gy - 6} ${w * 0.82} ${gy - 8}`} fill="#90CAF9" />;
    case 'merengue_note':
      return <G><Circle cx={w * 0.16} cy={gy - 8} r={1.5} fill={accent} /><Line x1={w * 0.16} y1={gy - 9.5} x2={w * 0.16} y2={gy - 14} stroke={accent} strokeWidth={1} /></G>;
    case 'willemstad':
      return <Rect x={w * 0.12} y={wallY + wallH * 0.7} width={w * 0.22} height={4} fill={accent} opacity={0.5} />;
    case 'piton':
      return <Polygon points={`${w * 0.83},${gy} ${w * 0.9},${gy - 10} ${w * 0.97},${gy}`} fill="#8D6E63" opacity={0.8} />;
    case 'papel_picado':
      return <Rect x={w * 0.22} y={wallY + 1} width={w * 0.56} height={2.5} fill="#F06292" />;
    case 'sombrero':
      return <Ellipse cx={w * 0.14} cy={gy - 5} rx={5} ry={2} fill="#D4A373" />;
    case 'mask':
      return <Ellipse cx={w * 0.86} cy={gy - 7} rx={4} ry={3} fill="#AB47BC" />;
    case 'llama':
      return <Rect x={w * 0.1} y={gy - 9} width={8} height={6} fill="#BCAAA4" rx={1} />;
    case 'equator_line':
      return <Line x1={w * 0.14} y1={wallY + wallH * 0.55} x2={w * 0.86} y2={wallY + wallH * 0.55} stroke={accent} strokeWidth={1} />;
    case 'mate':
      return <G><Ellipse cx={w * 0.14} cy={gy - 5} rx={3} ry={3.5} fill="#795548" /><Line x1={w * 0.15} y1={gy - 8} x2={w * 0.16} y2={gy - 12} stroke="#B0BEC5" strokeWidth={1} /></G>;
    case 'moai':
      return <Rect x={w * 0.84} y={gy - 12} width={6} height={12} fill="#9E9E9E" rx={1} />;
    case 'drum':
      return <Ellipse cx={w * 0.84} cy={gy - 6} rx={4} ry={3} fill="#D84315" />;
    case 'coffee_sack':
      return <Rect x={w * 0.1} y={gy - 10} width={7} height={10} fill="#8D6E63" rx={1} />;
    case 'zellige':
      return <Rect x={w * 0.14} y={wallY + wallH * 0.22} width={w * 0.72} height={3} fill="#0288D1" opacity={0.5} />;
    case 'cedar':
      return <Polygon points={`${w * 0.88},${gy - 14} ${w * 0.84},${gy - 2} ${w * 0.92},${gy - 2}`} fill="#2E7D32" />;
    case 'barjeel':
      return <Rect x={w * 0.78} y={wallY - 8} width={8} height={8} fill="#A1887F" />;
    case 'fatima':
      return <Path d={`M ${w * 0.16} ${gy - 6} Q ${w * 0.14} ${gy - 12} ${w * 0.2} ${gy - 12} Q ${w * 0.26} ${gy - 12} ${w * 0.24} ${gy - 6} Z`} fill={accent} opacity={0.7} />;
    case 'nazar':
      return <Circle cx={w * 0.85} cy={gy - 7} r={3} fill="#1E88E5" />;
    case 'pyramid':
      return <Polygon points={`${w * 0.8},${gy} ${w * 0.9},${gy - 12} ${w * 1.0},${gy}`} fill="#D7B98E" />;
    case 'ankh':
      return <G><Circle cx={w * 0.16} cy={gy - 10} r={2.5} fill="none" stroke={accent} strokeWidth={1.2} /><Line x1={w * 0.16} y1={gy - 7.5} x2={w * 0.16} y2={gy - 2} stroke={accent} strokeWidth={1.2} /><Line x1={w * 0.13} y1={gy - 5} x2={w * 0.19} y2={gy - 5} stroke={accent} strokeWidth={1.2} /></G>;
    case 'papyrus_reed':
      return <Line x1={w * 0.92} y1={gy} x2={w * 0.92} y2={gy - 14} stroke="#7CB342" strokeWidth={1.2} />;
    case 'rangoli':
      return <Path d={`M ${w * 0.5} ${gy - 2} l 4 -4 l 4 4 l -4 4 Z`} fill="#F06292" opacity={0.75} />;
    case 'maasai_shield':
      return <Ellipse cx={w * 0.15} cy={gy - 8} rx={3.5} ry={6} fill="#C62828" />;
    case 'kilimanjaro':
      return <Polygon points={`${w * 0.76},${gy} ${w * 0.86},${gy - 10} ${w * 0.96},${gy}`} fill="#90A4AE" />;
    case 'baobab':
      return <G><Rect x={w * 0.86} y={gy - 11} width={4} height={11} fill="#6D4C41" /><Ellipse cx={w * 0.88} cy={gy - 13} rx={8} ry={4} fill="#558B2F" /></G>;
    case 'lemur':
      return <Circle cx={w * 0.15} cy={gy - 8} r={2.5} fill="#424242" />;
    case 'protea':
      return <Circle cx={w * 0.14} cy={gy - 8} r={3.5} fill="#EC407A" />;
    case 'ndebele_band':
      return <Rect x={w * 0.14} y={wallY + wallH * 0.7} width={w * 0.72} height={4} fill={accent} />;
    case 'table_mountain':
      return <Rect x={w * 0.78} y={gy - 8} width={w * 0.18} height={4} fill="#78909C" rx={1} />;
    case 'picket_fence':
      return <G>{[0.13, 0.17, 0.21, 0.25].map((p, i) => <Rect key={i} x={w * p} y={gy - 8} width={2} height={8} fill="#ECEFF1" />)}</G>;
    case 'moose':
      return <Rect x={w * 0.82} y={gy - 8} width={8} height={5} fill="#6D4C41" rx={1} />;
    case 'kangaroo':
      return <Path d={`M ${w * 0.12} ${gy - 4} Q ${w * 0.15} ${gy - 10} ${w * 0.19} ${gy - 4}`} fill="#8D6E63" />;
    case 'southern_cross':
      return <G><Circle cx={w * 0.78} cy={wallY - 4} r={1} fill="#FFFFFF" /><Circle cx={w * 0.82} cy={wallY - 7} r={1} fill="#FFFFFF" /><Circle cx={w * 0.86} cy={wallY - 5} r={1} fill="#FFFFFF" /></G>;
    case 'kiwi':
      return <Ellipse cx={w * 0.12} cy={gy - 5} rx={4} ry={2.5} fill="#6D4C41" />;
    case 'koru':
      return <Path d={`M ${w * 0.86} ${gy - 8} Q ${w * 0.9} ${gy - 12} ${w * 0.86} ${gy - 14} Q ${w * 0.82} ${gy - 12} ${w * 0.86} ${gy - 8}`} stroke="#66BB6A" strokeWidth={1.2} fill="none" />;
    case 'papal_keys':
      return <G><Circle cx={w * 0.18} cy={gy - 10} r={2} fill="none" stroke="#FBC02D" strokeWidth={1} /><Line x1={w * 0.18} y1={gy - 8} x2={w * 0.22} y2={gy - 2} stroke="#FBC02D" strokeWidth={1} /></G>;
    case 'palm_tree':
      return <G><Line x1={w * 0.9} y1={gy} x2={w * 0.92} y2={gy - 16} stroke="#8D6E63" strokeWidth={1.8} /><Path d={`M ${w * 0.92} ${gy - 16} Q ${w * 0.98} ${gy - 20} ${w * 1.02} ${gy - 14}`} stroke="#4CAF50" strokeWidth={1.5} fill="none" /><Path d={`M ${w * 0.92} ${gy - 16} Q ${w * 0.85} ${gy - 20} ${w * 0.82} ${gy - 14}`} stroke="#4CAF50" strokeWidth={1.5} fill="none" /></G>;
    case 'acacia_tree':
      return <G><Line x1={w * 0.9} y1={gy} x2={w * 0.91} y2={gy - 15} stroke="#6D4C41" strokeWidth={1.6} /><Ellipse cx={w * 0.91} cy={gy - 17} rx={8} ry={3} fill="#558B2F" opacity={0.85} /></G>;
    case 'maple_leaf':
      return <Path d={`M ${w * 0.88} ${gy - 9} L ${w * 0.9} ${gy - 13} L ${w * 0.92} ${gy - 9} L ${w * 0.95} ${gy - 11} L ${w * 0.93} ${gy - 7} L ${w * 0.95} ${gy - 5} L ${w * 0.91} ${gy - 6} L ${w * 0.9} ${gy - 2} L ${w * 0.89} ${gy - 6} L ${w * 0.85} ${gy - 5} L ${w * 0.87} ${gy - 7} L ${w * 0.85} ${gy - 11} Z`} fill="#E53935" />;
    default:
      return null;
  }
}

export function renderCountryWindows(
  windowStyle: WindowStyle | undefined,
  w: number,
  wallH: number,
  baseY: number,
  isNight: boolean,
  trim: string,
  accent: string,
  windowGlowProps: any,
) {
  return [{ x: 0.17, y: 0.18 }, { x: 0.67, y: 0.18 }].map((win, i) => {
    const wx = w * win.x;
    const wy = baseY + wallH * win.y;
    const ww = windowStyle === 'tall' ? w * 0.12 : w * 0.15;
    const wh = windowStyle === 'tall' ? w * 0.18 : w * 0.13;
    const fill = isNight ? '#2C3E6B' : '#B3E5FC';
    const key = `win-${windowStyle ?? 'square'}-${i}`;

    if (windowStyle === 'round' || windowStyle === 'porthole') {
      const r = ww * 0.45;
      return (
        <G key={key}>
          <Circle cx={wx + ww * 0.5} cy={wy + wh * 0.5} r={r + 1} fill={trim} />
          <Circle cx={wx + ww * 0.5} cy={wy + wh * 0.5} r={r} fill={fill} />
          {isNight && <Circle cx={wx + ww * 0.5} cy={wy + wh * 0.5} r={r} fill="#FFD700" opacity={0.3} />}
          <Line x1={wx + ww * 0.5} y1={wy + 2} x2={wx + ww * 0.5} y2={wy + wh - 2} stroke="white" strokeWidth={1} />
          <Line x1={wx + 2} y1={wy + wh * 0.5} x2={wx + ww - 2} y2={wy + wh * 0.5} stroke="white" strokeWidth={1} />
        </G>
      );
    }

    if (windowStyle === 'arched') {
      return (
        <G key={key}>
          <Path d={`M ${wx - 1} ${wy + wh} L ${wx - 1} ${wy + wh * 0.35} A ${(ww + 2) / 2} ${wh * 0.35} 0 0 1 ${wx + ww + 1} ${wy + wh * 0.35} L ${wx + ww + 1} ${wy + wh} Z`} fill={trim} />
          <Path d={`M ${wx} ${wy + wh} L ${wx} ${wy + wh * 0.35} A ${ww / 2} ${wh * 0.35} 0 0 1 ${wx + ww} ${wy + wh * 0.35} L ${wx + ww} ${wy + wh} Z`} fill={fill} />
          {isNight && <Path d={`M ${wx} ${wy + wh} L ${wx} ${wy + wh * 0.35} A ${ww / 2} ${wh * 0.35} 0 0 1 ${wx + ww} ${wy + wh * 0.35} L ${wx + ww} ${wy + wh} Z`} fill="#FFD700" opacity={0.3} />}
          <Line x1={wx + ww / 2} y1={wy + wh * 0.35} x2={wx + ww / 2} y2={wy + wh} stroke="white" strokeWidth={1} />
        </G>
      );
    }

    return (
      <G key={key}>
        <Rect x={wx - 1} y={wy - 1} width={ww + 2} height={wh + 2} fill={trim} rx={2} />
        <Rect x={wx} y={wy} width={ww} height={wh} fill={fill} rx={1.5} />
        {isNight && <AnimatedRect x={wx} y={wy} width={ww} height={wh} fill="#FFD700" rx={1.5} animatedProps={windowGlowProps} />}
        {windowStyle === 'shuttered' && (
          <G>
            <Rect x={wx - 4} y={wy + 1} width={3} height={wh - 2} fill={accent} rx={1} />
            <Rect x={wx + ww + 1} y={wy + 1} width={3} height={wh - 2} fill={accent} rx={1} />
          </G>
        )}
        <Line x1={wx + ww / 2} y1={wy} x2={wx + ww / 2} y2={wy + wh} stroke="white" strokeWidth={1.2} />
        <Line x1={wx} y1={wy + wh / 2} x2={wx + ww} y2={wy + wh / 2} stroke="white" strokeWidth={1.2} />
        {windowStyle === 'lattice' && (
          <G>
            <Line x1={wx} y1={wy} x2={wx + ww} y2={wy + wh} stroke="white" strokeWidth={0.8} opacity={0.6} />
            <Line x1={wx + ww} y1={wy} x2={wx} y2={wy + wh} stroke="white" strokeWidth={0.8} opacity={0.6} />
          </G>
        )}
        <Rect x={wx - 2} y={wy + wh} width={ww + 4} height={2.5} fill={trim} rx={1} />
      </G>
    );
  });
}

export function renderCountryPath(pathStyle: PathStyle | undefined, w: number, h: number, baseY: number, wallH: number, trim: string) {
  const d = `M ${w * 0.42} ${baseY + wallH} Q ${w * 0.45} ${baseY + wallH + 8} ${w * 0.4} ${h} L ${w * 0.6} ${h} Q ${w * 0.55} ${baseY + wallH + 8} ${w * 0.58} ${baseY + wallH}`;
  const fill = pathStyle === 'sand' ? '#D7B98E' : pathStyle === 'brick' ? '#B75D3A' : pathStyle === 'wood' ? '#8D6E63' : trim;
  return (
    <G>
      <Path d={d} fill={fill} opacity={0.55} />
      {pathStyle === 'cobble' && [0.05, 0.2, 0.35, 0.5, 0.7].map((p, i) => <Ellipse key={i} cx={w * (0.45 + (p - 0.35) * 0.15)} cy={baseY + wallH + 4 + i * 3} rx={3} ry={1.5} fill="#B0BEC5" opacity={0.5} />)}
      {pathStyle === 'tile' && [0.2, 0.45, 0.7].map((p, i) => <Line key={i} x1={w * 0.43} y1={baseY + wallH + p * 10} x2={w * 0.57} y2={baseY + wallH + p * 10} stroke="#ECEFF1" strokeWidth={0.8} opacity={0.5} />)}
      {pathStyle === 'wood' && [0.25, 0.5, 0.75].map((p, i) => <Line key={i} x1={w * 0.43} y1={baseY + wallH + p * 10} x2={w * 0.57} y2={baseY + wallH + p * 10} stroke="#6D4C41" strokeWidth={1} opacity={0.5} />)}
    </G>
  );
}

export function renderCountryBackdrop(
  countryId: string | undefined,
  w: number,
  h: number,
  baseY: number,
  wallH: number,
  accent: string,
) {
  if (!countryId) return null;
  const profile = getCountryStyleProfile(countryId);
  const gy = baseY + wallH;
  const soft = `${accent}33`;

  // ─── COUNTRY-SPECIFIC BACKDROPS ───

  switch (countryId) {
    // France: lavender hillside
    case 'fr':
      return <G><Polygon points={`${w * 0.01},${gy} ${w * 0.14},${gy - 16} ${w * 0.27},${gy}`} fill="#E8D5F0" opacity={0.35} /><Polygon points={`${w * 0.73},${gy} ${w * 0.86},${gy - 14} ${w * 0.99},${gy}`} fill="#E8D5F0" opacity={0.35} />{[0.03, 0.08, 0.13, 0.87, 0.93].map((p, i) => <Line key={`lav-bg-${i}`} x1={w * p} y1={gy} x2={w * p} y2={gy - 6 - (i % 2) * 3} stroke="#C39BD3" strokeWidth={1} opacity={0.35} />)}</G>;
    // Japan: bamboo grove
    case 'jp':
      return <G>{[w * 0.02, w * 0.08].map((x, i) => <G key={`bam-bg-${i}`}><Line x1={x} y1={gy} x2={x} y2={gy - 18} stroke="#81C784" strokeWidth={1.5} opacity={0.3} /><Ellipse cx={x + 3} cy={gy - 16} rx={4} ry={2} fill="#A5D6A7" opacity={0.25} /></G>)}{[w * 0.92, w * 0.97].map((x, i) => <G key={`bam-bg2-${i}`}><Line x1={x} y1={gy} x2={x} y2={gy - 14} stroke="#81C784" strokeWidth={1.5} opacity={0.3} /><Ellipse cx={x - 2} cy={gy - 12} rx={3} ry={1.8} fill="#A5D6A7" opacity={0.25} /></G>)}</G>;
    // Italy: cypress + Tuscan hill
    case 'it':
      return <G><Ellipse cx={w * 0.06} cy={gy - 8} rx={3.5} ry={14} fill="#2E7D32" opacity={0.2} /><Ellipse cx={w * 0.94} cy={gy - 6} rx={3} ry={12} fill="#2E7D32" opacity={0.2} /><Polygon points={`${w * 0.7},${gy} ${w * 0.82},${gy - 10} ${w * 0.94},${gy}`} fill="#8D6E63" opacity={0.12} /></G>;
    // Mexico: desert cactus
    case 'mx':
      return <G><Rect x={w * 0.04} y={gy - 14} width={3} height={14} fill="#2E7D32" rx={1.5} opacity={0.3} /><Path d={`M ${w * 0.04} ${gy - 8} Q ${w * 0.0} ${gy - 8} ${w * 0.0} ${gy - 12}`} stroke="#2E7D32" strokeWidth={2.5} fill="none" opacity={0.3} strokeLinecap="round" /><Rect x={w * 0.93} y={gy - 12} width={3} height={12} fill="#2E7D32" rx={1.5} opacity={0.3} /><Path d={`M ${w * 0.95} ${gy - 6} Q ${w * 0.99} ${gy - 6} ${w * 0.99} ${gy - 10}`} stroke="#2E7D32" strokeWidth={2.5} fill="none" opacity={0.3} strokeLinecap="round" /></G>;
    // Brazil: palm + tropical wave
    case 'br':
      return <G><Line x1={w * 0.9} y1={gy} x2={w * 0.92} y2={gy - 20} stroke="#8D6E63" strokeWidth={2} opacity={0.25} /><Path d={`M ${w * 0.92} ${gy - 20} Q ${w * 1.02} ${gy - 24} ${w * 1.06} ${gy - 16}`} stroke="#4CAF50" strokeWidth={1.8} fill="none" opacity={0.2} /><Path d={`M ${w * 0.92} ${gy - 20} Q ${w * 0.82} ${gy - 26} ${w * 0.78} ${gy - 18}`} stroke="#4CAF50" strokeWidth={1.8} fill="none" opacity={0.2} /><Path d={`M ${w * 0.04} ${gy - 10} Q ${w * 0.24} ${gy - 16} ${w * 0.42} ${gy - 11}`} fill="none" stroke={soft} strokeWidth={2} /></G>;
    // Greece: Aegean blue sea horizon
    case 'gr':
      return <G><Path d={`M 0 ${gy + 2} Q ${w * 0.25} ${gy - 4} ${w * 0.5} ${gy + 2} Q ${w * 0.75} ${gy - 4} ${w} ${gy + 2}`} stroke="#64B5F6" strokeWidth={1.8} fill="none" opacity={0.3} /><Path d={`M 0 ${gy + 5} Q ${w * 0.3} ${gy - 1} ${w * 0.6} ${gy + 5} Q ${w * 0.8} ${gy} ${w} ${gy + 5}`} stroke="#90CAF9" strokeWidth={1.2} fill="none" opacity={0.2} /></G>;
    // Spain: warm terracotta hills
    case 'es':
      return <G><Polygon points={`${w * 0.0},${gy} ${w * 0.18},${gy - 12} ${w * 0.35},${gy}`} fill="#FFCC80" opacity={0.2} /><Polygon points={`${w * 0.65},${gy} ${w * 0.82},${gy - 10} ${w * 0.99},${gy}`} fill="#FFCC80" opacity={0.2} /></G>;
    // Portugal: coastal waves + azulejo hint
    case 'pt':
      return <G><Path d={`M 0 ${gy + 3} Q ${w * 0.25} ${gy - 3} ${w * 0.5} ${gy + 3} Q ${w * 0.75} ${gy - 3} ${w} ${gy + 3}`} stroke="#1E88E5" strokeWidth={1.5} fill="none" opacity={0.25} /><Rect x={w * 0.03} y={gy - 6} width={w * 0.08} height={4} fill="#1E88E5" opacity={0.15} rx={1} /></G>;
    // UK: rolling green hills
    case 'gb':
      return <G><Path d={`M 0 ${gy} Q ${w * 0.15} ${gy - 12} ${w * 0.3} ${gy - 4} Q ${w * 0.45} ${gy - 10} ${w * 0.6} ${gy - 2}`} fill="#81C784" opacity={0.15} /><Path d={`M ${w * 0.5} ${gy} Q ${w * 0.7} ${gy - 10} ${w * 0.85} ${gy - 3} Q ${w * 0.95} ${gy - 8} ${w} ${gy}`} fill="#A5D6A7" opacity={0.12} /></G>;
    // Netherlands: flat horizon with canal
    case 'nl':
      return <G><Line x1={0} y1={gy - 2} x2={w} y2={gy - 2} stroke="#90CAF9" strokeWidth={1.5} opacity={0.2} /><Line x1={0} y1={gy + 2} x2={w} y2={gy + 2} stroke="#64B5F6" strokeWidth={1} opacity={0.15} /></G>;
    // Germany: Bavarian hills
    case 'de':
      return <G><Polygon points={`${w * 0.0},${gy} ${w * 0.16},${gy - 14} ${w * 0.32},${gy}`} fill="#A5D6A7" opacity={0.18} /><Polygon points={`${w * 0.68},${gy} ${w * 0.84},${gy - 12} ${w * 1.0},${gy}`} fill="#81C784" opacity={0.15} /></G>;
    // Turkey: minaret silhouette
    case 'tr':
      return <G><Rect x={w * 0.88} y={gy - 18} width={2} height={18} fill={soft} /><Circle cx={w * 0.89} cy={gy - 20} r={2.5} fill={soft} /></G>;
    // Korea: temple ridge hills
    case 'kr':
      return <G><Path d={`M 0 ${gy} Q ${w * 0.12} ${gy - 10} ${w * 0.24} ${gy - 4} Q ${w * 0.36} ${gy - 12} ${w * 0.48} ${gy}`} fill="#81C784" opacity={0.12} /><Path d={`M ${w * 0.52} ${gy} Q ${w * 0.7} ${gy - 8} ${w * 0.88} ${gy - 2} L ${w} ${gy}`} fill="#A5D6A7" opacity={0.1} /></G>;
    // China: pagoda silhouette
    case 'cn':
      return <G><Rect x={w * 0.04} y={gy - 16} width={w * 0.06} height={16} fill={soft} /><Polygon points={`${w * 0.02},${gy - 16} ${w * 0.07},${gy - 20} ${w * 0.12},${gy - 16}`} fill={soft} /></G>;
    // Taiwan: night market lights
    case 'tw':
      return <G>{[0.06, 0.14, 0.86, 0.94].map((p, i) => <Circle key={`tw-${i}`} cx={w * p} cy={gy - 8 - (i % 2) * 3} r={2} fill={i % 2 ? '#FFD54F' : '#FF8A65'} opacity={0.2} />)}</G>;
    // Vietnam: conical hat + rice field
    case 'vn':
      return <G><Path d={`M 0 ${gy + 2} L ${w * 0.3} ${gy - 4} L ${w * 0.6} ${gy + 2} L ${w} ${gy - 2}`} fill="none" stroke="#81C784" strokeWidth={1.2} opacity={0.2} /></G>;
    // Norway: fjord blue
    case 'no':
      return <G><Path d={`M 0 ${gy} L ${w * 0.15} ${gy - 14} L ${w * 0.3} ${gy} L ${w * 0.5} ${gy - 10} L ${w * 0.7} ${gy} L ${w * 0.85} ${gy - 12} L ${w} ${gy}`} fill="#37474F" opacity={0.1} /><Line x1={0} y1={gy + 3} x2={w} y2={gy + 3} stroke="#1565C0" strokeWidth={1.5} opacity={0.15} /></G>;
    // Sweden: Dalarna red rolling hills
    case 'se':
      return <G><Path d={`M 0 ${gy} Q ${w * 0.2} ${gy - 10} ${w * 0.4} ${gy - 3} Q ${w * 0.6} ${gy - 12} ${w * 0.8} ${gy - 4} L ${w} ${gy}`} fill="#C62828" opacity={0.08} /></G>;
    // Finland: lake + forest horizon
    case 'fi':
      return <G><Line x1={0} y1={gy + 3} x2={w} y2={gy + 3} stroke="#546E7A" strokeWidth={1.2} opacity={0.15} />{[0.05, 0.12, 0.88, 0.95].map((p, i) => <Polygon key={`fi-${i}`} points={`${w * p},${gy} ${w * (p + 0.03)},${gy - 8} ${w * (p + 0.06)},${gy}`} fill="#2E7D32" opacity={0.12} />)}</G>;
    // Iceland: green grass roof hills + volcanic
    case 'is':
      return <G><Polygon points={`${w * 0.0},${gy} ${w * 0.2},${gy - 10} ${w * 0.4},${gy}`} fill="#558B2F" opacity={0.12} /><Polygon points={`${w * 0.6},${gy} ${w * 0.8},${gy - 8} ${w * 1.0},${gy}`} fill="#689F38" opacity={0.1} /></G>;
    // Switzerland: Alpine peaks
    case 'ch':
      return <G><Polygon points={`${w * 0.0},${gy} ${w * 0.15},${gy - 18} ${w * 0.3},${gy}`} fill="#78909C" opacity={0.15} /><Polygon points={`${w * 0.7},${gy} ${w * 0.85},${gy - 16} ${w * 1.0},${gy}`} fill="#90A4AE" opacity={0.12} /><Polygon points={`${w * 0.12},${gy - 12} ${w * 0.15},${gy - 18} ${w * 0.18},${gy - 12}`} fill="#FFFFFF" opacity={0.3} /></G>;
    // Austria: similar Alpine
    case 'at':
      return <G><Polygon points={`${w * 0.0},${gy} ${w * 0.18},${gy - 16} ${w * 0.36},${gy}`} fill="#8D6E63" opacity={0.12} /><Polygon points={`${w * 0.64},${gy} ${w * 0.82},${gy - 14} ${w * 1.0},${gy}`} fill="#795548" opacity={0.1} /></G>;
    // Egypt: desert dunes + pyramid
    case 'eg':
      return <G><Path d={`M 0 ${gy} Q ${w * 0.25} ${gy - 8} ${w * 0.5} ${gy - 2} Q ${w * 0.75} ${gy - 6} ${w} ${gy}`} fill="#D7B98E" opacity={0.2} /><Polygon points={`${w * 0.78},${gy} ${w * 0.88},${gy - 14} ${w * 0.98},${gy}`} fill="#C8A97E" opacity={0.18} /></G>;
    // Kenya: savanna with distant acacia
    case 'ke':
      return <G><Path d={`M 0 ${gy + 2} Q ${w * 0.3} ${gy - 4} ${w * 0.6} ${gy + 1} Q ${w * 0.8} ${gy - 2} ${w} ${gy + 2}`} fill="#C8B060" opacity={0.12} /><Line x1={w * 0.04} y1={gy} x2={w * 0.04} y2={gy - 10} stroke="#6D4C41" strokeWidth={1} opacity={0.2} /><Ellipse cx={w * 0.04} cy={gy - 11} rx={6} ry={2} fill="#558B2F" opacity={0.15} /></G>;
    // Tanzania: Kilimanjaro silhouette
    case 'tz':
      return <G><Polygon points={`${w * 0.6},${gy} ${w * 0.8},${gy - 16} ${w * 1.0},${gy}`} fill="#78909C" opacity={0.12} /><Polygon points={`${w * 0.75},${gy - 12} ${w * 0.8},${gy - 16} ${w * 0.85},${gy - 12}`} fill="#FFFFFF" opacity={0.2} /></G>;
    // South Africa: Table Mountain
    case 'za':
      return <G><Rect x={w * 0.7} y={gy - 10} width={w * 0.28} height={4} fill="#546E7A" opacity={0.15} rx={1} /><Polygon points={`${w * 0.68},${gy} ${w * 0.7},${gy - 10} ${w * 0.98},${gy - 10} ${w * 1.0},${gy}`} fill="#607D8B" opacity={0.1} /></G>;
    // Madagascar: baobab
    case 'mg':
      return <G><Line x1={w * 0.06} y1={gy} x2={w * 0.06} y2={gy - 12} stroke="#795548" strokeWidth={2.5} opacity={0.2} /><Ellipse cx={w * 0.06} cy={gy - 14} rx={8} ry={3} fill="#558B2F" opacity={0.15} /></G>;
    // India: dome silhouette
    case 'in':
      return <G><Ellipse cx={w * 0.88} cy={gy - 8} rx={w * 0.08} ry={8} fill={soft} /><Circle cx={w * 0.88} cy={gy - 17} r={1.5} fill={soft} /></G>;
    // Morocco: medina arch
    case 'ma':
      return <G><Path d={`M ${w * 0.02} ${gy} L ${w * 0.02} ${gy - 10} A ${w * 0.06} ${6} 0 0 1 ${w * 0.14} ${gy - 10} L ${w * 0.14} ${gy}`} fill="#D4956A" opacity={0.15} /></G>;
    // UAE: tower silhouette
    case 'ae':
      return <G><Rect x={w * 0.04} y={gy - 20} width={3} height={20} fill="#B8784E" opacity={0.15} /><Rect x={w * 0.03} y={gy - 22} width={5} height={3} fill="#B8784E" opacity={0.12} /></G>;
    // Tunisia: white + blue Sidi Bou Said
    case 'tn':
      return <G><Rect x={w * 0.88} y={gy - 12} width={w * 0.08} height={12} fill="#FFFFFF" opacity={0.15} rx={1} /><Rect x={w * 0.89} y={gy - 14} width={w * 0.06} height={3} fill="#1E88E5" opacity={0.2} rx={1} /></G>;
    // Lebanon: cedar mountain
    case 'lb':
      return <G><Polygon points={`${w * 0.0},${gy} ${w * 0.2},${gy - 12} ${w * 0.4},${gy}`} fill="#A1887F" opacity={0.12} /></G>;
    // Thailand: temple spire
    case 'th':
      return <G><Polygon points={`${w * 0.04},${gy} ${w * 0.07},${gy - 20} ${w * 0.1},${gy}`} fill="#B8860B" opacity={0.15} /><Circle cx={w * 0.07} cy={gy - 21} r={1.5} fill="#FFD700" opacity={0.2} /></G>;
    // Indonesia: temple terraces
    case 'id':
      return <G>{[0, 4, 8].map((off, i) => <Rect key={`id-${i}`} x={w * 0.02 + off} y={gy - 6 + i * 2} width={w * 0.1 - i * 2} height={2} fill="#795548" opacity={0.12} />)}</G>;
    // Cuba: Havana rooftops
    case 'cu':
      return <G>{[0.04, 0.12, 0.84, 0.92].map((p, i) => <Rect key={`cu-${i}`} x={w * p} y={gy - 10 - (i % 2) * 4} width={w * 0.06} height={8 + (i % 2) * 4} fill={soft} />)}</G>;
    // Colombia: mountain silhouette
    case 'co':
      return <G><Polygon points={`${w * 0.0},${gy} ${w * 0.18},${gy - 14} ${w * 0.36},${gy}`} fill="#2E7D32" opacity={0.12} /><Polygon points={`${w * 0.64},${gy} ${w * 0.82},${gy - 10} ${w * 1.0},${gy}`} fill="#388E3C" opacity={0.1} /></G>;
    // Peru: Andean peaks
    case 'pe':
      return <G><Polygon points={`${w * 0.0},${gy} ${w * 0.16},${gy - 16} ${w * 0.32},${gy}`} fill="#8D6E63" opacity={0.15} /><Polygon points={`${w * 0.68},${gy} ${w * 0.84},${gy - 14} ${w * 1.0},${gy}`} fill="#795548" opacity={0.12} /><Polygon points={`${w * 0.13},${gy - 12} ${w * 0.16},${gy - 16} ${w * 0.19},${gy - 12}`} fill="#ECEFF1" opacity={0.25} /></G>;
    // Argentina: pampas horizon
    case 'ar':
      return <G><Path d={`M 0 ${gy} Q ${w * 0.3} ${gy - 6} ${w * 0.6} ${gy - 2} Q ${w * 0.8} ${gy - 5} ${w} ${gy}`} fill="#A5D6A7" opacity={0.1} /></G>;
    // US: suburban oaks
    case 'us':
      return <G><Ellipse cx={w * 0.08} cy={gy - 8} rx={10} ry={8} fill="#66BB6A" opacity={0.12} /><Ellipse cx={w * 0.92} cy={gy - 6} rx={8} ry={7} fill="#81C784" opacity={0.1} /></G>;
    // Canada: wilderness pines
    case 'ca':
      return <G>{[0.03, 0.1, 0.88, 0.95].map((p, i) => <Polygon key={`ca-${i}`} points={`${w * p},${gy} ${w * (p + 0.03)},${gy - 12 - (i % 2) * 4} ${w * (p + 0.06)},${gy}`} fill="#2E7D32" opacity={0.12} />)}</G>;
    // Australia: outback red earth
    case 'au':
      return <G><Path d={`M 0 ${gy + 2} Q ${w * 0.3} ${gy - 4} ${w * 0.6} ${gy + 1} Q ${w * 0.85} ${gy - 3} ${w} ${gy + 2}`} fill="#D7B98E" opacity={0.15} /></G>;
    // New Zealand: rolling green hills
    case 'nz':
      return <G><Path d={`M 0 ${gy} Q ${w * 0.2} ${gy - 10} ${w * 0.4} ${gy - 3} Q ${w * 0.6} ${gy - 12} ${w * 0.8} ${gy - 4} L ${w} ${gy}`} fill="#66BB6A" opacity={0.12} /></G>;
    // Poland: sunflower field hint
    case 'pl':
      return <G><Path d={`M 0 ${gy} Q ${w * 0.25} ${gy - 8} ${w * 0.5} ${gy - 2} Q ${w * 0.75} ${gy - 6} ${w} ${gy}`} fill="#FFF59D" opacity={0.12} /></G>;
    // Czech Republic: red rooftop skyline
    case 'cz':
      return <G>{[0.04, 0.12, 0.84, 0.92].map((p, i) => <Polygon key={`cz-${i}`} points={`${w * p},${gy} ${w * (p + 0.03)},${gy - 8 - (i % 2) * 4} ${w * (p + 0.06)},${gy}`} fill="#C0392B" opacity={0.1} />)}</G>;
    // Croatia / Montenegro: Adriatic coast
    case 'hr':
    case 'me':
      return <G><Polygon points={`${w * 0.0},${gy} ${w * 0.15},${gy - 10} ${w * 0.3},${gy}`} fill="#90A4AE" opacity={0.12} /><Path d={`M 0 ${gy + 3} Q ${w * 0.3} ${gy - 1} ${w * 0.6} ${gy + 3} Q ${w * 0.8} ${gy} ${w} ${gy + 3}`} stroke="#42A5F5" strokeWidth={1.2} fill="none" opacity={0.15} /></G>;
    // Vatican: dome silhouette
    case 'va':
      return <G><Ellipse cx={w * 0.5} cy={gy - 10} rx={w * 0.15} ry={10} fill="#D4AF37" opacity={0.08} /><Circle cx={w * 0.5} cy={gy - 21} r={1.5} fill="#D4AF37" opacity={0.12} /></G>;
    default:
      break;
  }

  // ─── REGIONAL FALLBACKS ───

  if (profile.region === 'oceania' || profile.region === 'caribbean_latin') {
    return (
      <G>
        <Path d={`M ${w * 0.04} ${gy - 10} Q ${w * 0.24} ${gy - 16} ${w * 0.42} ${gy - 11}`} fill="none" stroke={soft} strokeWidth={2} />
        <Path d={`M ${w * 0.58} ${gy - 11} Q ${w * 0.76} ${gy - 17} ${w * 0.95} ${gy - 10}`} fill="none" stroke={soft} strokeWidth={2} />
      </G>
    );
  }
  if (profile.region === 'europe' || profile.region === 'mediterranean') {
    return (
      <G>
        <Polygon points={`${w * 0.03},${gy} ${w * 0.2},${gy - 14} ${w * 0.37},${gy}`} fill={soft} />
        <Polygon points={`${w * 0.63},${gy} ${w * 0.8},${gy - 12} ${w * 0.97},${gy}`} fill={soft} />
      </G>
    );
  }
  if (profile.region === 'mena' || profile.region === 'africa') {
    return (
      <G>
        <Path d={`M ${w * 0.05} ${gy - 6} Q ${w * 0.3} ${gy - 16} ${w * 0.55} ${gy - 8} Q ${w * 0.8} ${gy - 2} ${w * 0.96} ${gy - 9}`} fill="none" stroke={soft} strokeWidth={2.2} />
      </G>
    );
  }

  return (
    <G>
      {[0.12, 0.24, 0.76, 0.88].map((p, i) => (
        <Rect key={`skyline-${i}`} x={w * p} y={gy - 14 - (i % 2) * 4} width={w * 0.08} height={10 + (i % 2) * 4} fill={soft} rx={1} />
      ))}
    </G>
  );
}

export function renderCountrySignature(
  countryId: string | undefined,
  signature: string[] | undefined,
  signatureLevel: SignatureLevel | undefined,
  w: number,
  wallY: number,
  wallH: number,
  accent: string,
  trim: string,
) {
  if (!countryId) return null;
  const level = signatureLevel ?? COUNTRY_SIGNATURE_COMPLEXITY[countryId] ?? 2;
  const tokens = ((signature as Token[] | undefined) ?? COUNTRY_SIGNATURES[countryId] ?? []).slice(0, 3);
  const composition = createSignatureComposition(countryId, tokens, level);
  const crestX = w * 0.5 + ((hashCountry(countryId) % 9) - 4);
  const crestY = wallY + wallH * 0.2;
  return (
    <G>
      {composition.map((piece, i) => (
        <G
          key={`${countryId}-${piece.token}-${i}`}
          transform={`translate(${piece.tx} ${piece.ty}) scale(${piece.scale}) rotate(${piece.rotate} ${w * 0.5} ${wallY + wallH * 0.6})`}
        >
          {drawToken(piece.token, w, wallY, wallH, accent, trim)}
        </G>
      ))}
      <G>
        <Circle cx={crestX} cy={crestY} r={4.5} fill={trim} opacity={0.85} />
        <Circle cx={crestX} cy={crestY} r={3.4} fill={accent} opacity={0.85} />
        <SvgText x={crestX} y={crestY + 1.6} fontSize={3.4} textAnchor="middle" fill="#FFFFFF" fontWeight="700">
          {countryId.toUpperCase()}
        </SvgText>
      </G>
    </G>
  );
}
