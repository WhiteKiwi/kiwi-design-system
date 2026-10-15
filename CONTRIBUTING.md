# Contribute to PIP

제품에서 발견한 공통 개선을 이 저장소에 반영합니다. 작은 버그 수정은 재현 사례를 포함한 PR로 바로 진행할 수 있습니다. 새 컴포넌트나 호환성을 깨는 변경은 issue 또는 draft PR에 사용 사례와 API 제안을 먼저 적고, 구현·검증 근거를 같은 흐름에서 보완합니다.

사용법은 [Usage](docs/usage.md), 디자인 계약은 [DESIGN.md](DESIGN.md), 배포는 [npm release](docs/npm-release.md)를 참조합니다.

## Decide where the change belongs

| 발견한 요구 | 기본 변경 위치 | 판단 기준 |
| --- | --- | --- |
| 기존 컴포넌트의 버그·접근성·공통 상태 문제 | `packages/ui` | 현재 계약을 바로잡고 재현·회귀 검증 추가 |
| 범용 컴포넌트·variant·API 부족 | `packages/ui` | 구체적인 제품 사용 사례와 기존 조합으로 부족한 이유 제시 |
| 공통 색·간격·상태 역할 부족 | `packages/tokens` | 기존 역할로 표현 가능한지 먼저 확인하고 theme·사용처 영향 검토 |
| 제품의 데이터·업무 로직·일회성 화면 구성 | 소비 프로젝트 | 공통 UI를 조합하고 제품 맥락은 앱에 유지 |
| 제품 전용 구성을 공통 Pattern으로 승격 | 반복을 확인한 뒤 이 저장소 | 두 번째 실제 소비 프로젝트에서 같은 결정이 반복되는 근거 필요 |

**두 번째 consumer 조건은 Pattern 승격에만 적용합니다.** 버그·접근성 수정과 실제 필요가 확인된 범용 컴포넌트는 첫 소비 프로젝트에서도 기여할 수 있습니다. 예상만으로 추상화를 추가하거나 제품 전용 props를 공통 API로 옮기지는 않습니다.

## Start with a concrete case

설치한 PIP 버전, 소비 프로젝트, 기대 동작과 현재 동작, 최소 재현 코드 또는 화면을 준비합니다. 기존 API·token·issue·PR을 확인하고, 새 API라면 사용 예시와 기존 API에 미치는 영향을 적습니다. 소비 프로젝트와 이 저장소의 PR이 따로 있으면 서로 연결합니다.

큰 변경은 독립적으로 검증 가능한 단위로 나눕니다. 예를 들어 필요한 token 추가 → 하나의 component family → 소비 프로젝트 적용 순으로 진행합니다. 선행 PR을 명시하고 각 PR이 단독으로 빌드되게 합니다. **동작 변경과 그 문서·테스트는 같은 PR에 유지합니다.** 관련 없는 컴포넌트나 전면 refactor를 함께 묶지 않습니다.

## Implement

Node.js 24+와 pnpm 10.33.0에서 저장소를 준비합니다.

```sh
git clone https://github.com/WhiteKiwi/kiwi-design-system.git
cd kiwi-design-system
pnpm install --frozen-lockfile
git switch -c feat/describe-the-change
pnpm dev
```

| 바꾸는 것 | 함께 확인할 파일 |
| --- | --- |
| 토큰·테마·상태 역할 | `packages/tokens/src/theme.css`, `docs/guidelines.md`, 필요 시 `scripts/check-design.mjs`의 검증 pair |
| 컴포넌트 API·동작 | `packages/ui/src/`의 적절한 family, `styles.css`, 공개 export인 `index.ts` |
| 공개 사용법·제약 | 해당 패키지의 `README.md` |
| 컴포넌트 추가·상태 변경 | `apps/docs/src/app/page.tsx`의 specimen·inventory, `docs/guidelines.md`의 해당 계약 |
| 소비 프로젝트의 적용 | 앱의 import·의존성·lockfile과 관련 화면 검증 |

Native semantic HTML을 우선하고, 복잡한 focus·keyboard behavior가 필요할 때 primitive를 도입합니다. 외부 소스의 license·dependency·동작 검토는 [adoption gate](DESIGN.md#adoption-gate)와 [reference base](references/README.md)를 따릅니다.

컴포넌트는 semantic token을 사용합니다. 새 interactive family는 light/dark의 rest, hover, active, focus-visible, disabled 계약을 기록합니다. 지원하지 않는 상태는 해당 없음과 이유를 명시합니다. 제품의 요청 처리·라우팅·데이터 취득은 소비 프로젝트에 둡니다.

파일이 커지면 component family나 책임별로 나누고 공개 export 경로는 유지합니다. 문서는 사용, 기여, 디자인 기준, 배포 중 해당 문서 한 곳에서 상세 절차를 관리합니다. README와 카탈로그에는 요약과 링크를 두고 같은 절차를 복제하지 않습니다.

## Verify the change

저장소 루트에서 CI와 같은 검증을 실행합니다.

```sh
pnpm check
pnpm release:check
pnpm release:pack
```

`pnpm check`는 lint·타입·UI/문서 빌드·semantic color pair·정적 렌더링 계약·릴리스 로직 테스트를 실행합니다. `release:pack`은 실제 tarball의 export·의존성·README·license를 검사합니다. 세 명령 모두 npm에 게시하지 않습니다.

UI나 토큰을 변경하면 카탈로그와 실제 소비 화면에서 다음을 확인하고 PR에 결과를 남깁니다.

- Light/dark와 변경한 상태: hover, active, focus-visible, disabled, invalid 등
- 키보드 조작·focus 순서·label/description·필요한 동적 알림
- 320px·390px과 desktop의 overflow·줄바꿈·touch target
- Reduced motion과 사용자 정의 스타일을 적용한 실제 contrast

자동 검사는 브라우저 상호작용이나 앱 전체 접근성을 보장하지 않습니다. 회귀 검증은 실패했던 동작을 재현하도록 추가합니다. 문자열 존재만 확인하는 테스트로 동작 검증을 대체하지 않습니다. 문서만 바꾼 경우에는 링크·예시·영향받은 페이지를 확인하고 해당하지 않는 검증은 이유와 함께 표시합니다.

## Test in a consumer

`release:pack`의 `dist/npm/release-plan.json`에서 **이번 소스로 만든 두 tarball**의 파일명과 버전을 확인합니다. 소비 프로젝트의 임시 브랜치나 격리한 checkout에서 아래 변수에 실제 절대 경로를 넣고 설치합니다. 앱의 패키지 매니저가 다르면 같은 로컬 tarball을 지원하는 명령을 사용합니다.

```sh
PIP_TOKENS_TGZ=/absolute/path/to/whitekiwi-tokens-VERSION.tgz
PIP_UI_TGZ=/absolute/path/to/whitekiwi-ui-VERSION.tgz
npm install "$PIP_TOKENS_TGZ" "$PIP_UI_TGZ"
```

토큰 전용 앱은 tokens만 설치합니다. React 앱에서는 두 tarball을 함께 설치해 registry의 예전 tokens가 섞이지 않게 합니다. 앱의 타입 검사·production build·관련 테스트와 실제 화면 QA를 실행합니다. 테스트한 PIP commit, tarball 버전, 소비 프로젝트 revision과 결과를 PR에 남깁니다. 로컬 경로 의존성을 최종 소비 프로젝트 변경에 남기지 않습니다.

소비 프로젝트 접근이 없다면 최소 재현과 카탈로그 검증 결과를 남기고, 실제 앱 검증은 미완료로 표시해 담당자에게 인계합니다. 확인하지 않은 앱의 결과를 통과로 기록하지 않습니다.

## Review and deliver

PR에는 문제·변경 후 동작·소비 사례, 변경한 API/token과 호환성 영향, 실행한 검증, 관련 소비 PR, 남은 적용 작업을 기록합니다. [PR template](.github/pull_request_template.md)를 사용하고, 커밋 메시지는 `{type}: {imperative summary}` 형식을 따릅니다.

일반 기여 PR에서는 배포를 위해 임의로 버전이나 태그를 만들 필요가 없습니다. 릴리스 담당자가 두 공개 패키지의 버전을 함께 올리고 소비자용 변경 내역·migration을 준비합니다. 패키지 README만 바뀌어도 npm에 반영하려면 새 릴리스가 필요합니다. 상세 순서는 [npm release](docs/npm-release.md)를 따릅니다. 새 `v*` 태그 push는 실제 게시를 시작하므로 CI 시험용으로 만들지 않습니다.

소비 프로젝트 적용은 공개 버전 설치 → lockfile 갱신 → 실제 앱 검증 → 임시 우회 제거까지 포함합니다. 디자인 시스템 merge, npm 게시, 소비 프로젝트 적용은 각각의 상태로 기록합니다. 배포나 앱 적용이 남았다면 관련 PR 또는 담당자를 남겨 추적할 수 있게 합니다.
