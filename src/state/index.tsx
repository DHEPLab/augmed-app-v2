import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type AnswerFormData = Record<string, string | string[]>;

export type CaseState = {
  personName?: string;
  caseNumber?: string; // raw case number from backend
};

export const answerFormAtom = atom<AnswerFormData>({});
export const caseAtom = atom<CaseState>({});

// ─────────────────────────────────────────────────────────────────────────────
// Persisted sequence of visited caseConfigIds in localStorage["caseSequence"]
export const caseSequenceAtom = atomWithStorage<string[]>("caseSequence", []);

// Holds the current route's caseConfigId so we can compute index
export const currentRouteAtom = atom<{ caseConfigId?: string }>({});

// Derived: 1-based index of the current case in the visited sequence
export const caseIndexAtom = atom((get) => {
  const seq = get(caseSequenceAtom);
  const { caseConfigId } = get(currentRouteAtom);
  const idx = caseConfigId ? seq.findIndex((id) => id === caseConfigId) : -1;
  return idx >= 0 ? idx + 1 : undefined;
});

// Derived: total number of distinct cases visited so far
export const totalCasesAtom = atom((get) => get(caseSequenceAtom).length);
