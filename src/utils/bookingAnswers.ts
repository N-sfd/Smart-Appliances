/** Format camelCase question keys for admin display. */
export function formatQuestionLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
}

export function formatAnswerValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.map((v) => formatAnswerValue(v)).join(', ');
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

export interface ConditionalLogicRule {
  field: string;
  operator: 'equals' | 'not_equals' | 'truthy' | 'falsy';
  value?: unknown;
}

export function shouldShowQuestion(
  logic: ConditionalLogicRule | Record<string, unknown> | null | undefined,
  answers: Record<string, unknown>,
): boolean {
  if (!logic || typeof logic !== 'object' || !('field' in logic)) return true;
  const rule = logic as ConditionalLogicRule;
  const current = answers[rule.field];
  switch (rule.operator) {
    case 'equals':
      return current === rule.value;
    case 'not_equals':
      return current !== rule.value;
    case 'truthy':
      return Boolean(current);
    case 'falsy':
      return !current;
    default:
      return true;
  }
}

export function validateRequiredQuestions(
  questions: { question_key: string; label: string; is_required: boolean; conditional_logic?: unknown }[],
  answers: Record<string, unknown>,
): string | null {
  for (const q of questions) {
    if (!q.is_required) continue;
    if (!shouldShowQuestion(q.conditional_logic as ConditionalLogicRule, answers)) continue;
    const val = answers[q.question_key];
    if (val === undefined || val === null || val === '') {
      return `${q.label} is required`;
    }
    if (Array.isArray(val) && val.length === 0) {
      return `${q.label} is required`;
    }
  }
  return null;
}

export function answersToDescriptionLines(answers: Record<string, unknown>): string[] {
  return Object.entries(answers)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([key, value]) => `${formatQuestionLabel(key)}: ${formatAnswerValue(value)}`);
}
