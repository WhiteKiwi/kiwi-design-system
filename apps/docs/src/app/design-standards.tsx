import { SectionHeading } from "@whitekiwi/ui";

const contracts = [
  ["ROLE", "색과 간격은 값보다 역할을 먼저 정의합니다."],
  ["SEMANTICS", "읽는 표면과 행동하는 요소를 구분합니다."],
  ["STATE", "두 테마에서 같은 행동과 상태를 일관되게 표현합니다."],
  ["CONTEXT", "제품의 콘텐츠와 정보 우선순위에 맞춰 화면을 구성합니다."],
] as const;

export function DesignStandards() {
  return (
    <>
      <SectionHeading
        description="PIP의 구성요소는 공통된 기준 위에 놓입니다. 시각적 역할과 의미, 상호작용 상태를 함께 설계해 화면이 달라도 같은 방식으로 읽히게 합니다."
        eyebrow="08 · STANDARDS"
        id="governance-title"
        title={
          <>
            Clear roles.
            <br />
            Consistent behavior.
          </>
        }
      />
      <div className="docs-governance-grid">
        <article>
          <span>DESIGN CONTRACTS</span>
          <ol>
            {contracts.map(([role, description]) => (
              <li key={role}>
                <strong>{role}</strong>
                <small>{description}</small>
              </li>
            ))}
          </ol>
        </article>
        <article>
          <span>QUALITY BASELINE</span>
          <ul>
            <li>일반 텍스트 4.5:1, 큰 텍스트와 필수 UI 경계 3:1</li>
            <li>키보드로 접근할 수 있는 동작과 눈에 보이는 포커스</li>
            <li>색에만 의존하지 않는 상태와 의미</li>
            <li>Light·dark에서 유지되는 전경과 배경의 관계</li>
            <li>작은 화면의 정보 우선순위와 reduced motion</li>
          </ul>
        </article>
      </div>
    </>
  );
}
