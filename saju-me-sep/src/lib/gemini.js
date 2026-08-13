import {
  SAJU_SYSTEM_INSTRUCTION,
  buildSajuUserPrompt,
} from '../prompts/sajuPrompt.js'
import { cleanSajuMarkdown } from './cleanText.js'

// Vite에서는 VITE_ 로 시작하는 환경변수만 프론트에서 읽을 수 있습니다
const apiKey = import.meta.env.VITE_GEMINI_API_KEY

/**
 * 입력 폼 값으로 Gemini에게 사주 해석을 요청합니다.
 * (브라우저에서 바로 호출 가능한 REST API 사용)
 * @returns {Promise<string>} 해석 결과 텍스트
 */
export async function analyzeSaju(formData) {
  if (!apiKey) {
    throw new Error(
      'VITE_GEMINI_API_KEY가 없습니다. saju-me-sep/.env 파일을 확인해 주세요.',
    )
  }

  const age = calcKoreanAge(formData.birthDate)
  const userPrompt = buildSajuUserPrompt({ ...formData, age })

  // Interactions API (권장)
  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/interactions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        model: 'gemini-3.6-flash',
        system_instruction: SAJU_SYSTEM_INSTRUCTION,
        input: userPrompt,
      }),
    },
  )

  const data = await response.json()

  if (!response.ok) {
    const message =
      data?.error?.message || `Gemini 요청 실패 (HTTP ${response.status})`
    throw new Error(message)
  }

  // 응답 형식: output_text 또는 steps 안의 text
  const text =
    data.output_text ||
    data.outputs?.[0]?.text ||
    collectTextFromSteps(data.steps)

  if (!text) {
    throw new Error('Gemini 응답이 비어 있습니다. 잠시 후 다시 시도해 주세요.')
  }

  // API에서 받자마자 **, * 같은 강조 기호를 제거합니다
  return cleanSajuMarkdown(text)
}

function collectTextFromSteps(steps) {
  if (!Array.isArray(steps)) return ''
  const parts = []
  for (const step of steps) {
    if (step?.type !== 'model_output' || !Array.isArray(step.content)) continue
    for (const item of step.content) {
      if (item?.type === 'text' && item.text) parts.push(item.text)
    }
  }
  return parts.join('\n').trim()
}

function calcKoreanAge(birthDate) {
  if (!birthDate) return null

  const birth = new Date(birthDate)
  if (Number.isNaN(birth.getTime())) return null

  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  const dayDiff = today.getDate() - birth.getDate()

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1
  }

  return age
}
