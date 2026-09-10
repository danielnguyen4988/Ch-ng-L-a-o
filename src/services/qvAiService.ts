import {
  FraudIntelligenceEntry,
  QVAIInput,
  QVAIResult,
  QVAIEvidence,
  ForensicReport,
} from '../types';
import { queryIntelligence } from './intelligenceService';
import { analyzePhone } from './analyzePhone';
import { analyzeBank } from './analyzeBank';
import { analyzeSms } from './analyzeSms';

interface QVAIContext {
  intelligence: Record<string, FraudIntelligenceEntry>;
  bankName?: string;
}

const levelFromScore = (
  score: number,
  hasEvidence: boolean
): QVAIResult['threatLevel'] => {
  if (!hasEvidence) return 'UNKNOWN';

  if (score >= 90) return 'CRITICAL';
  if (score >= 70) return 'HIGH';
  if (score >= 40) return 'SUSPICIOUS';

  return 'SAFE';
};

const clampScore = (score: number): number =>
  Math.max(0, Math.min(100, Math.round(score)));

const evidenceFromIntelligence = (
  matches: ReturnType<typeof queryIntelligence>
): QVAIEvidence[] => {
  return matches.slice(0, 5).map((match) => ({
    source: 'VERAFENSE Intelligence',
    label: `${match.entry.category} — ${match.reason}`,
    detail:
      `${match.entry.reportsCount} báo cáo, ` +
      `thiệt hại ghi nhận ${match.entry.totalLossReported.toLocaleString('vi-VN')} VNĐ. ` +
      `${match.entry.advice}`,
    status:
      match.entry.threatLevel === 'CRITICAL' ||
      match.entry.threatLevel === 'HIGH'
        ? 'danger'
        : match.entry.threatLevel === 'SUSPICIOUS'
          ? 'warning'
          : 'safe',
    score: match.entry.threatScore,
  }));
};

const evidenceFromSms = (
  report: ForensicReport
): QVAIEvidence[] => {
  return report.evidenceMatrix.map((item) => ({
    source: 'QV SMS Analysis',
    label: item.label,
    detail: `${item.value}. ${item.detail}`,
    status: item.status,
  }));
};

export const analyzeQVAI = (
  input: QVAIInput,
  context: QVAIContext
): QVAIResult => {
  const value = input.value.trim();

  if (!value) {
    return {
      inputType: input.type,
      threatLevel: 'UNKNOWN',
      threatScore: 0,
      summary: 'Chưa có dữ liệu để phân tích.',
      evidence: [],
      recommendedActions: ['Nhập dữ liệu cần kiểm tra.'],
      engineSources: [],
    };
  }

  let score = 0;
  let summary = 'Chưa phát hiện dấu hiệu rủi ro từ các engine hiện có.';
  const evidence: QVAIEvidence[] = [];
  const engineSources: string[] = [];
  const recommendedActions: string[] = [];

  const targetType =
    input.type === 'url'
      ? 'link'
      : input.type === 'text'
        ? 'sms'
        : input.type;

  const matches = queryIntelligence(
    context.intelligence,
    targetType,
    value
  );

  if (matches.length > 0) {
    const strongestMatch = matches[0];
    const strongest = strongestMatch.entry;

    if (strongestMatch.reason === 'exact') {
        score = strongest.threatScore;
    } else if (strongestMatch.reason === 'normalized') {
        score = strongest.threatScore;
    } else {
        score = Math.min(
        strongest.threatScore,
        69
        );
    }

    evidence.push(...evidenceFromIntelligence(matches));
    engineSources.push('VERAFENSE Intelligence');

    if (strongest.advice) {
        recommendedActions.push(strongest.advice);
    }

    if (strongest.legalBasis) {
        recommendedActions.push(
            `Căn cứ/cảnh báo pháp lý: ${strongest.legalBasis}`
        );
    }
}

  if (input.type === 'phone') {
    const result = analyzePhone(value, matches[0]?.entry ?? null);

    if (result) {
      engineSources.push('QV Phone Analysis');

      if (result.status.includes('WANGIRI')) {
        score = Math.max(score, 85);
      } else if (result.status.includes('VOIP')) {
        score = Math.max(score, 75);
      }

      evidence.push({
        source: 'QV Phone Analysis',
        label: result.status,
        detail: result.type,
        status:
          result.status.includes('WANGIRI') ||
          result.status.includes('VOIP')
          ? 'danger'
          : 'safe',
        });

      if (result.advice) {
        recommendedActions.push(result.advice);
      }
    }
  }

  if (input.type === 'bank') {
    const result = analyzeBank(
      value,
      context.bankName || 'Chưa xác định',
      matches[0]?.entry ?? null
    );

    if (result) {
      engineSources.push('QV Bank Analysis');

      score = Math.max(score, result.threatScore);

      evidence.push({
        source: 'QV Bank Analysis',
        label: result.riskLevel,
        detail: result.pattern,
        status:
          result.threatScore >= 70
            ? 'danger'
            : result.threatScore > 0
              ? 'warning'
              : 'safe',
        score: result.threatScore,
      });

      if (result.action) {
        recommendedActions.push(result.action);
      }
    }
  }

  if (input.type === 'sms' || input.type === 'text') {
    const report = analyzeSms(value);

    if (report) {
      engineSources.push('QV SMS Analysis');

      score = Math.max(score, report.threatScore);
      evidence.push(...evidenceFromSms(report));

      if (report.actionPlan.length > 0) {
        recommendedActions.push(...report.actionPlan);
      }

      summary = report.elderlySummary || report.youthSummary || summary;
    }
  }

  if (matches.length > 0) {
    const strongest = matches[0].entry;

    summary =
      strongest.threatLevel === 'CRITICAL'
        ? `CẢNH BÁO NGHIÊM TRỌNG: dữ liệu trùng với tình báo gian lận đã ghi nhận.`
        : strongest.threatLevel === 'HIGH'
          ? `CẢNH BÁO: phát hiện dữ liệu có mức rủi ro cao.`
          : `Phát hiện dữ liệu có dấu hiệu cần kiểm tra thêm.`;
  }

  const finalScore = clampScore(score);
  const hasEvidence = evidence.length > 0;

  const threatLevel = levelFromScore(
    finalScore,
    hasEvidence
  );

  if (recommendedActions.length === 0) {
    recommendedActions.push(
        threatLevel === 'UNKNOWN'
            ? 'Chưa có đủ dữ liệu để kết luận. Không chuyển tiền hoặc cung cấp thông tin xác thực cho đến khi xác minh được nguồn.'
            : 'Không chuyển tiền, không cung cấp OTP hoặc thông tin xác thực khi chưa xác minh.'
    );
 }

 return {
    inputType: input.type,
    threatLevel,
    threatScore: finalScore,
    summary,
    evidence,
    recommendedActions: [...new Set(recommendedActions)],
    engineSources: [...new Set(engineSources)],
 };
};