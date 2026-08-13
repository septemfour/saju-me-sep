# 사주 웹 (saju-me-sep)

이름·생년월일·출생 시간·성별·양력/음력을 입력하면 Gemini로 사주 해석을 받아보는 React 웹 앱입니다.

## 기능

- 사주 정보 입력 폼 (이름, 생년월일, 시간, 성별, 양력/음력)
- Gemini (`gemini-3.6-flash`) 기반 사주 해석
- 마크다운 결과 렌더링 및 강조 기호(`**` 등) 정리
- 지정 컬러 팔레트 UI (`#9FA1FF`, `#B5BAFF`, `#AEE2FF`, `#D9F9DF`)

## 기술 스택

- React 19 + Vite 8
- Gemini Interactions API
- react-markdown

## 시작하기

앱 코드는 `saju-me-sep/` 폴더에 있습니다.

```bash
cd saju-me-sep
npm install
```

### 환경 변수

`saju-me-sep/.env` 파일을 만들고 API 키를 넣습니다. (이 파일은 Git에 올라가지 않습니다.)

```env
VITE_GEMINI_API_KEY=여기에_Gemini_API_키
```

키는 [Google AI Studio](https://aistudio.google.com/apikey)에서 발급할 수 있습니다.

### 실행

```bash
npm run dev
```

기본 주소: [http://localhost:5188](http://localhost:5188)

> `index.html`을 Live Server(5500)로 열면 앱이 동작하지 않습니다. 반드시 `npm run dev`로 실행하세요.

### 빌드

```bash
npm run build
npm run preview
```

## 프로젝트 구조

```text
saju-me-sep/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── App.jsx              # 입력 폼 + 결과 화면
    ├── App.css              # UI 스타일
    ├── lib/
    │   ├── gemini.js        # Gemini API 호출
    │   └── cleanText.js     # 결과 텍스트 정리
    └── prompts/
        └── sajuPrompt.js    # 사주 해석 시스템 프롬프트
```

## 주의

- `VITE_GEMINI_API_KEY`는 프론트엔드에 노출됩니다. 학습/개인용으로만 사용하고, 키가 유출되면 즉시 재발급하세요.
- `.env`는 `.gitignore`에 포함되어 있어 GitHub에 푸시되지 않습니다.

## Netlify 배포

저장소에 `netlify.toml`이 포함되어 있습니다.

- Base directory: `saju-me-sep`
- Build command: `npm run build`
- Publish directory: `dist`

Netlify Site settings에서 **Site configuration → General → Privacy** 를 Public으로 바꿔야 다른 사람도 링크로 접속할 수 있습니다.

환경 변수는 Netlify UI에서 추가하세요.

- Key: `VITE_GEMINI_API_KEY`
- Value: Gemini API 키
