# House Wow Acceptance Checklist

## Scope

- Renderer files:
  - `src/components/house/HouseExterior.tsx`
  - `src/components/house/countryHouseArt.tsx`
  - `src/config/countryArchitecture.ts`

## Distinctness Criteria

- [x] Each country has a unique signature composition seed (position, scale, and rotation vary by `countryId`).
- [x] Each country has an exclusive crest marker rendered from its two-letter code.
- [x] Signature detail density is controlled by per-country complexity (`COUNTRY_SIGNATURE_COMPLEXITY`).
- [x] Country-specific windows/path style remain active and combine with signature composition.

## Readability Criteria (130px target)

- [x] Signature overlays stay within facade visual bounds.
- [x] Door + welcome mat + path remain legible after depth overlays.
- [x] Contrast-safe regional cue line and crest keep visibility without overpowering facade.

## Performance Criteria (balanced target)

- [x] Heavy micro-animations are gated (`size >= 140` and `animated` enabled).
- [x] Detail tiering scales visual density by component size.
- [x] Backdrop and texture overlays are simple SVG primitives (low overdraw risk).

## Verification Notes

- Lint diagnostics on edited files: no errors.
- TypeScript full-project check still reports existing repository-wide errors unrelated to this house pass.
- Country config count and signature map count are aligned, with full fallback coverage from `COUNTRY_SIGNATURES`.
