// 결과 화면에 *, **, __, 전각＊ 같은 강조 기호가 안 보이게 제거합니다
export function cleanSajuMarkdown(text) {
  let out = String(text ?? '')

  // 목록의 "* " / "• "는 "- "로 바꿔 유지
  out = out.replace(/^(\s*)[*•]\s+/gm, '$1- ')

  // 짝이 있는 강조 문법 제거 (여러 번 돌려 중첩도 처리)
  for (let i = 0; i < 5; i += 1) {
    const next = out
      .replace(/\*\*([\s\S]*?)\*\*/g, '$1')
      .replace(/__([\s\S]*?)__/g, '$1')
      .replace(/(?<!\*)\*(?!\*)([^*\n]+)\*(?!\*)/g, '$1')
      .replace(/(?<!_)_(?!_)([^_\n]+)_(?!_)/g, '$1')
    if (next === out) break
    out = next
  }

  // 남은 별표/밑줄/전각 별표는 전부 삭제
  out = out
    .replace(/\\([*_])/g, '$1')
    .replace(/\*+/g, '')
    .replace(/＿+/g, '')
    .replace(/_+/g, '')
    .replace(/＊+/g, '')
    .replace(/•/g, '-')

  return out
}
