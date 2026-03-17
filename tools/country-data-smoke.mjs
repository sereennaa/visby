#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const knowledgePath = resolve(process.cwd(), 'src/config/countryKnowledge.ts');
const gamePath = resolve(process.cwd(), 'src/config/countryGameContent.ts');

const knowledgeText = readFileSync(knowledgePath, 'utf8');
const gameText = readFileSync(gamePath, 'utf8');

function parseCoreCountries(sourceText) {
  const match = sourceText.match(/const CORE_COUNTRIES = \[([^\]]+)\]/);
  if (!match) return [];
  return match[1]
    .split(',')
    .map((chunk) => chunk.trim().replace(/['"]/g, ''))
    .filter(Boolean);
}

const knowledgeCore = parseCoreCountries(knowledgeText);
const gameCore = parseCoreCountries(gameText);
const coreCountryIds = knowledgeCore.length > 0 ? knowledgeCore : gameCore;

const missingKnowledge = coreCountryIds.filter((id) => !knowledgeText.includes(`${id}: [`));
const missingGameMappings = coreCountryIds.filter((id) => !gameText.includes(`${id}: '`));
const coreMismatch = knowledgeCore.join(',') !== gameCore.join(',');

if (coreCountryIds.length === 0) {
  console.error('Could not parse CORE_COUNTRIES from country content config.');
  process.exit(1);
}

if (coreMismatch || missingKnowledge.length > 0 || missingGameMappings.length > 0) {
  if (coreMismatch) {
    console.error('CORE_COUNTRIES mismatch between countryKnowledge and countryGameContent.');
    console.error(`knowledge: ${knowledgeCore.join(', ')}`);
    console.error(`game: ${gameCore.join(', ')}`);
  }
  if (missingKnowledge.length > 0) {
    console.error(`Missing knowledge mappings: ${missingKnowledge.join(', ')}`);
  }
  if (missingGameMappings.length > 0) {
    console.error(`Missing game mappings: ${missingGameMappings.join(', ')}`);
  }
  process.exit(1);
}

console.log('country-data-smoke passed.');
