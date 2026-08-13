// useState: 화면에 보이는 값이 바뀔 때마다 React가 다시 그려주게 해주는 Hook
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { analyzeSaju } from './lib/gemini.js'
import { cleanSajuMarkdown } from './lib/cleanText.js'
import './App.css'

function App() {
  // ---- 입력값을 저장하는 상태들 ----
  const [name, setName] = useState('') // 이름
  const [birthDate, setBirthDate] = useState('') // 생년월일 (예: 1990-01-01)
  const [birthTime, setBirthTime] = useState('') // 태어난 시간 (예: 14:30)
  const [gender, setGender] = useState('') // 성별: 'male' | 'female' | ''
  const [calendarType, setCalendarType] = useState('solar') // 양력/음력

  // ---- Gemini 요청/결과 상태 ----
  const [loading, setLoading] = useState(false) // true면 "해석 중..." 표시
  const [result, setResult] = useState('') // 성공 시 해석 텍스트
  const [error, setError] = useState('') // 실패 시 에러 메시지

  const handleNameChange = (e) => setName(e.target.value)
  const handleBirthDateChange = (e) => setBirthDate(e.target.value)
  const handleBirthTimeChange = (e) => setBirthTime(e.target.value)
  const handleGenderChange = (e) => setGender(e.target.value)
  const handleCalendarTypeChange = (e) => setCalendarType(e.target.value)

  // 미리보기용 한글 라벨
  const genderLabel =
    gender === 'male' ? '남자' : gender === 'female' ? '여자' : '(아직 없음)'
  const calendarLabel = calendarType === 'solar' ? '양력' : '음력'

  // 필수 값이 비어 있으면 버튼을 비활성화합니다
  const canSubmit = name && birthDate && birthTime && gender && !loading

  // 폼 제출 → Gemini에게 사주 해석 요청
  const handleSubmit = async (e) => {
    e.preventDefault() // 페이지가 새로고침되지 않게 막기
    if (!canSubmit) return

    setLoading(true)
    setError('')
    setResult('')

    try {
      const text = await analyzeSaju({
        name,
        birthDate,
        birthTime,
        gender,
        calendarType,
      })
      // 저장할 때부터 강조 기호(*, **)를 제거합니다
      setResult(cleanSajuMarkdown(text))
    } catch (err) {
      setError(err?.message || '사주 해석 요청에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <h1>사주 입력</h1>
      <p className="guide">
        {name
          ? `${name}님의 사주 정보를 입력해 주세요.`
          : '사주 정보를 입력해 주세요.'}
      </p>

      <form onSubmit={handleSubmit}>
        {/* ---- 이름 ---- */}
        <div className="field">
          {/* htmlFor와 id를 같게 하면, 라벨을 눌러도 input에 포커스가 갑니다 */}
          <label htmlFor="name">이름</label>
          <input
            id="name"
            type="text"
            placeholder="예: 홍길동"
            value={name} // 상태와 input 값을 연결 (controlled input)
            onChange={handleNameChange}
          />
        </div>

        {/* ---- 생년월일 ---- */}
        <div className="field">
          <label htmlFor="birthDate">생년월일</label>
          <input
            id="birthDate"
            type="date"
            value={birthDate}
            onChange={handleBirthDateChange}
          />
        </div>

        {/* ---- 태어난 시간 ---- */}
        <div className="field">
          <label htmlFor="birthTime">태어난 시간</label>
          <input
            id="birthTime"
            type="time"
            value={birthTime}
            onChange={handleBirthTimeChange}
          />
        </div>

        {/* ---- 성별 ---- */}
        <div className="field">
          <span className="field-label">성별</span>
          <div className="options">
            <label className="option">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={gender === 'male'}
                onChange={handleGenderChange}
              />
              남자
            </label>
            <label className="option">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={gender === 'female'}
                onChange={handleGenderChange}
              />
              여자
            </label>
          </div>
        </div>

        {/* ---- 양력 / 음력 ---- */}
        <div className="field">
          <span className="field-label">양력 / 음력</span>
          <div className="options">
            <label className="option">
              <input
                type="radio"
                name="calendarType"
                value="solar"
                checked={calendarType === 'solar'}
                onChange={handleCalendarTypeChange}
              />
              양력
            </label>
            <label className="option">
              <input
                type="radio"
                name="calendarType"
                value="lunar"
                checked={calendarType === 'lunar'}
                onChange={handleCalendarTypeChange}
              />
              음력
            </label>
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={!canSubmit}>
          {loading ? '해석 중...' : '사주 해석 받기'}
        </button>
      </form>

      <div className="preview">
        <p>입력한 이름: {name || '(아직 없음)'}</p>
        <p>생년월일: {birthDate || '(아직 없음)'}</p>
        <p>태어난 시간: {birthTime || '(아직 없음)'}</p>
        <p>성별: {genderLabel}</p>
        <p>양력/음력: {calendarLabel}</p>
      </div>

      {error && (
        <div className="error-box" role="alert">
          {error}
        </div>
      )}

      {/* Gemini 해석 결과 (마크다운 → 예쁜 HTML로 렌더링) */}
      {result && (
        <div className="result-box">
          <h2>사주 해석</h2>
          <div className="result-markdown">
            <ReactMarkdown
              components={{
                // 혹시 남은 강조 태그는 일반 텍스트처럼만 보이게
                strong: ({ children }) => <>{children}</>,
                em: ({ children }) => <>{children}</>,
              }}
            >
              {cleanSajuMarkdown(result)}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
