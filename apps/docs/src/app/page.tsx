import {
  Badge,
  Button,
  Callout,
  CollectionHeading,
  Disclosure,
  LinkedCard,
  SectionHeading,
  StaticCard,
  TextField,
  TextLink,
} from "@whitekiwi/ui";
import { ThemeToggle } from "./theme-toggle";

const palette = [
  {
    name: "NEUTRAL",
    swatches: [
      ["PAPER", "#F4F5EF"],
      ["MILK", "#FBFCF8"],
      ["ASH", "#62685E"],
      ["FOG", "#A5AB9F"],
      ["INK", "#11140F"],
      ["CARBON", "#0E100E"],
    ],
  },
  {
    name: "KIWI",
    swatches: [
      ["SOFT", "#E9F8C9"],
      ["SIGNAL", "#C6FF4A"],
      ["LINE", "#668B15"],
      ["DEEP", "#3C6000"],
    ],
  },
  {
    name: "SEMANTIC",
    swatches: [
      ["SUCCESS", "#16794F"],
      ["INFO", "#1769AA"],
      ["WARNING", "#7A5300"],
      ["ERROR", "#B42318"],
    ],
  },
] as const;

const semanticRoles = [
  ["CANVAS", "--kiwi-color-canvas", "페이지의 가장 낮은 바탕"],
  ["SURFACE", "--kiwi-color-surface", "정보를 묶는 조용한 면"],
  ["TEXT", "--kiwi-color-text", "본문과 핵심 정보"],
  ["MUTED", "--kiwi-color-text-muted", "보조 설명과 metadata"],
  ["BRAND FIELD", "--kiwi-color-brand-field", "제한적으로 쓰는 signature 면"],
  ["INTERACTIVE", "--kiwi-color-interactive", "링크와 행동의 신호"],
  ["FOCUS", "--kiwi-color-focus", "키보드 focus boundary"],
  ["HOVER", "--kiwi-color-brand-field-hover", "primary action hover"],
  ["DISABLED", "--kiwi-color-disabled-surface", "비활성 control surface"],
] as const;

const inventory = [
  ["Button", "CONTROL", "primary · secondary · ghost · danger"],
  ["TextField", "CONTROL", "hint · invalid · disabled"],
  ["TextLink", "CONTROL", "inline navigation"],
  ["Badge", "FEEDBACK", "6 semantic tones"],
  ["Callout", "FEEDBACK", "5 semantic tones"],
  ["StaticCard", "EDITORIAL", "4 surface tones"],
  ["LinkedCard", "EDITORIAL", "hover · focus · pressed"],
  ["SectionHeading", "EDITORIAL", "responsive content hierarchy"],
  ["CollectionHeading", "EDITORIAL", "collection boundary"],
  ["Disclosure", "DISCLOSURE", "Radix Collapsible"],
] as const;

const principles = [
  ["01", "QUIET CANVAS", "Neutral이 구조와 읽기 흐름을 맡습니다."],
  ["02", "ONE SIGNAL", "Kiwi는 한 장면의 한 가지 기억에만 씁니다."],
  ["03", "HONEST AFFORDANCE", "움직이는 것과 읽는 것을 명확히 구분합니다."],
  ["04", "HUMAN EVIDENCE", "장식보다 실제 결과와 맥락을 먼저 보여줍니다."],
] as const;

const systemLayers = [
  ["FOUNDATION", "roles", "color · type · space · motion"],
  ["PRIMITIVE", "behavior", "focus · keyboard · disclosure"],
  ["COMPONENT", "contract", "state · semantics · API"],
  ["PATTERN", "composition", "repeated product decisions"],
  ["PAGE", "context", "evidence · task · audience"],
] as const;

const primaryReferences = [
  {
    name: "SEED",
    type: "SYSTEM",
    use: "semantic token과 foundation 구조",
    limit: "브랜드 값과 제품 문법은 복사하지 않음",
    url: "https://seed-design.io/",
  },
  {
    name: "RADIX",
    type: "PRIMITIVE",
    use: "focus·keyboard behavior",
    limit: "시각 접근성은 제품이 별도로 책임짐",
    url: "https://www.radix-ui.com/primitives",
  },
  {
    name: "SHADCN/UI",
    type: "OWNERSHIP",
    use: "open-code component ownership",
    limit: "복사한 source와 upgrade 비용은 제품 소유",
    url: "https://ui.shadcn.com/",
  },
  {
    name: "GOV.UK",
    type: "GOVERNANCE",
    use: "근거와 maturity를 공개하는 방식",
    limit: "공공 서비스의 시각 문법은 맥락 전용",
    url: "https://design-system.service.gov.uk/",
  },
  {
    name: "STORYBOOK",
    type: "WORKFLOW",
    use: "격리된 상태와 반복 가능한 review",
    limit: "통합 page와 실제 data QA를 대신하지 않음",
    url: "https://storybook.js.org/",
  },
] as const;

const curatedIndexes = [
  {
    name: "AWESOME",
    coverage: "CURATION",
    use: "scope·분류·기여 규칙의 기준",
    limit: "디자인 결정의 authority는 아님",
    url: "https://github.com/sindresorhus/awesome",
  },
  {
    name: "DESIGN SYSTEMS · ALEX PATE",
    coverage: "SYSTEMS",
    use: "공개 시스템과 capability tag 비교",
    limit: "개별 링크의 현재 상태를 재확인",
    url: "https://github.com/alexpate/awesome-design-systems",
  },
  {
    name: "DESIGN SYSTEMS · KLAUFEL",
    coverage: "OPERATIONS",
    use: "token·testing·talk·tool까지 탐색",
    limit: "canonical source로 다시 검증",
    url: "https://github.com/klaufel/awesome-design-systems",
  },
  {
    name: "AWESOME DESIGN TOOLS",
    coverage: "TOOLS",
    use: "job 중심 도구와 workflow 탐색",
    limit: "목록 포함이 품질 보증은 아님",
    url: "https://github.com/goabstract/Awesome-Design-Tools",
  },
  {
    name: "DESIGN RESOURCES FOR DEVELOPERS",
    coverage: "IMPLEMENTATION",
    use: "UI library·asset·template 폭넓게 탐색",
    limit: "항목별 license와 접근성 확인",
    url: "https://github.com/bradtraversy/design-resources-for-developers",
  },
  {
    name: "AWESOME STYLEGUIDES",
    coverage: "DOCUMENTATION",
    use: "styleguide와 workbench 구조 비교",
    limit: "legacy·중단된 링크가 섞일 수 있음",
    url: "https://github.com/streamich/awesome-styleguides",
  },
  {
    name: "AWESOME TAILWIND CSS",
    coverage: "TAILWIND",
    use: "현재 Tailwind UI 생태계 지도",
    limit: "PIP token·a11y 적합성은 별도",
    url: "https://github.com/aniftyco/awesome-tailwindcss",
  },
  {
    name: "AWESOME REACT COMPONENTS",
    coverage: "REACT",
    use: "interaction job별 구현 후보 탐색",
    limit: "component별 유지보수·license 확인",
    url: "https://github.com/brillout/awesome-react-components",
  },
  {
    name: "AWESOME STORYBOOK",
    coverage: "WORKFLOW",
    use: "addon·문서·visual QA workflow 탐색",
    limit: "설치된 major version 호환성 확인",
    url: "https://github.com/lauthieb/awesome-storybook",
  },
] as const;

export default function Home() {
  return (
    <main>
      <header className="docs-header">
        <a href="#top">PIP · WHITEKIWI</a>
        <nav aria-label="Design system sections">
          <a href="#principles">SYSTEM</a>
          <a href="#components">COMPONENTS</a>
          <a href="#governance">GOVERNANCE</a>
        </nav>
        <ThemeToggle />
      </header>

      <section className="docs-hero" id="top">
        <div>
          <span>PIP · V0.3 · IMPLEMENTED</span>
          <h1>
            SMALL PARTS.
            <br />
            <em>ONE CLEAR SYSTEM.</em>
          </h1>
        </div>
        <p>
          WhiteKiwi가 더 빠르게 같은 결정을 내리기 위한 공개 설계 언어입니다.
          보이는 모양뿐 아니라 token, behavior, pattern과 adoption gate를 함께
          관리합니다.
        </p>
        <ol className="docs-system-flow" aria-label="System architecture">
          {systemLayers.map(([name, role, description], index) => (
            <li key={name}>
              <code>{String(index + 1).padStart(2, "0")}</code>
              <strong>{name}</strong>
              <span>{role}</span>
              <small>{description}</small>
            </li>
          ))}
        </ol>
      </section>

      <section className="docs-section docs-principles" id="principles">
        <SectionHeading
          description="유행하는 UI를 모으는 대신, 다음 화면에서도 같은 판단을 재현할 수 있는 원칙을 먼저 둡니다."
          eyebrow="01 · PRINCIPLES"
          id="principles-title"
          title={
            <>
              Quiet canvas.
              <br />
              Electric kiwi.
            </>
          }
        />
        <div className="docs-principle-grid">
          {principles.map(([number, name, description]) => (
            <article key={name}>
              <code>{number}</code>
              <strong>{name}</strong>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="docs-section docs-color-section" id="colors">
        <SectionHeading
          description="Neutral이 대부분을 차지하고 kiwi는 신호로만 씁니다. 브랜드와 success는 같은 초록으로 처리하지 않습니다."
          eyebrow="02 · COLOR"
          id="colors-title"
          title={<>색을 숨기지 않습니다.</>}
        />
        <div className="docs-palette">
          {palette.map((group) => (
            <article className="docs-palette-group" key={group.name}>
              <h3>{group.name}</h3>
              <div className="docs-swatch-row">
                {group.swatches.map(([name, value]) => (
                  <div className="docs-swatch" key={name}>
                    <span className="docs-swatch__color" data-color={name} />
                    <strong>{name}</strong>
                    <code>{value}</code>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="docs-role-grid">
          <article className="docs-role-scene docs-role-scene--light">
            <span>LIGHT THEME · SEMANTIC ROLES</span>
            {semanticRoles.map(([name, token, description]) => (
              <div key={name}>
                <i data-role={name} />
                <strong>{name}</strong>
                <code>{token}</code>
                <small>{description}</small>
              </div>
            ))}
          </article>
          <article
            className="docs-role-scene docs-role-scene--dark"
            data-theme="dark"
          >
            <span>DARK THEME · SAME ROLES</span>
            {semanticRoles.map(([name, token, description]) => (
              <div key={name}>
                <i data-role={name} />
                <strong>{name}</strong>
                <code>{token}</code>
                <small>{description}</small>
              </div>
            ))}
          </article>
        </div>
      </section>

      <section className="docs-section" id="foundations">
        <CollectionHeading
          end="TYPE · SPACE · MATERIAL"
          start="03 · FOUNDATIONS"
        />
        <div className="docs-foundation-grid">
          <article className="docs-type-specimen">
            <span>DISPLAY / SANS / 620</span>
            <strong>문제를 크게 보고, 답은 정확하게.</strong>
            <p>
              Body는 긴 문장에서도 읽히는 리듬과 60ch 안쪽의 행 길이를 지킵니다.
            </p>
          </article>
          <article className="docs-mono-specimen">
            <span>MONO / METADATA</span>
            <strong>26,779 ACTIVITIES</strong>
            <code>--kiwi-font-mono · 0.62REM · 0.08EM</code>
          </article>
          <article className="docs-space-specimen">
            <span>SPACE / 4PX BASE</span>
            {[1, 2, 3, 4, 6, 8, 12, 16].map((step) => (
              <div key={step}>
                <code>{step}</code>
                <i data-space={step} />
              </div>
            ))}
          </article>
        </div>
      </section>

      <section className="docs-section" id="components">
        <SectionHeading
          description="Radix behavior, shadcn 방식의 조합 가능한 API, Tailwind-compatible semantic token을 사용합니다. 화면별 새 UI보다 공통 contract를 우선합니다."
          eyebrow="04 · COMPONENTS"
          id="components-title"
          title={<>상태까지 보여줍니다.</>}
        />

        <div className="docs-component-block">
          <div className="docs-component-title">
            <span>CONTROLS</span>
            <code>REST · HOVER · FOCUS · DISABLED</code>
          </div>
          <div className="docs-button-row">
            <Button>PRIMARY ACTION</Button>
            <Button variant="secondary">SECONDARY</Button>
            <Button variant="ghost">GHOST</Button>
            <Button variant="danger">DANGER</Button>
            <Button disabled>DISABLED</Button>
          </div>
          <div className="docs-field-grid">
            <TextField
              defaultValue="whitekiwi"
              hint="보조 설명은 control 아래에 붙습니다."
              label="ACCESS KEY"
              name="access-key-preview"
              readOnly
            />
            <TextField
              error="유효한 key를 입력해 주세요."
              label="INVALID STATE"
              name="invalid-preview"
              placeholder="Enter key"
              readOnly
            />
          </div>
          <TextLink href="#contracts">INTERACTION CONTRACT 보기</TextLink>
        </div>

        <div className="docs-component-block">
          <div className="docs-component-title">
            <span>FEEDBACK</span>
            <code>COLOR IS NEVER THE ONLY SIGNAL</code>
          </div>
          <div className="docs-badge-row">
            <Badge>NEUTRAL</Badge>
            <Badge tone="brand">BRAND</Badge>
            <Badge tone="success">SUCCESS</Badge>
            <Badge tone="info">INFO</Badge>
            <Badge tone="warning">WARNING</Badge>
            <Badge tone="danger">ERROR</Badge>
          </div>
          <div className="docs-callout-grid">
            <Callout tone="success">
              <strong>SUCCESS</strong>
              <p>처리가 완료되었습니다.</p>
            </Callout>
            <Callout tone="info">
              <strong>INFO</strong>
              <p>추가 맥락을 확인해 주세요.</p>
            </Callout>
            <Callout tone="warning">
              <strong>WARNING</strong>
              <p>다음 단계 전에 검토가 필요합니다.</p>
            </Callout>
            <Callout tone="danger">
              <strong>ERROR</strong>
              <p>문제를 해결하고 다시 시도해 주세요.</p>
            </Callout>
          </div>
        </div>

        <div className="docs-component-block">
          <div className="docs-component-title">
            <span>EDITORIAL SURFACES</span>
            <code>STATIC ≠ INTERACTIVE</code>
          </div>
          <div className="docs-component-grid">
            <StaticCard tone="raised">
              <span className="docs-label">STATIC CARD</span>
              <strong>정보는 움직이지 않습니다.</strong>
              <p>
                정보 표면에는 pointer, 가짜 화살표와 hover lift를 두지 않습니다.
              </p>
            </StaticCard>
            <LinkedCard href="#contracts" tone="raised">
              <span className="docs-label">LINKED CARD</span>
              <strong>이동은 전체가 책임집니다.</strong>
              <p>
                카드 전체가 하나의 link이며 keyboard focus와 방향을 제공합니다.
              </p>
            </LinkedCard>
            <StaticCard tone="brand">
              <span className="docs-label">BRAND FIELD</span>
              <strong>한 viewport에 하나.</strong>
              <p>Kiwi signal은 기억할 장면에만 넓게 사용합니다.</p>
            </StaticCard>
            <StaticCard tone="inverse">
              <span className="docs-label">INVERSE</span>
              <strong>Neutral이 지배합니다.</strong>
              <p>강조하지 않는 영역이 있어야 signal이 선명합니다.</p>
            </StaticCard>
          </div>
        </div>
      </section>

      <section className="docs-section" id="patterns">
        <SectionHeading
          description="Pattern은 예쁜 블록이 아니라 반복해서 나타난 제품 결정입니다. 두 번째 consumer가 생기기 전에는 core component로 성급히 승격하지 않습니다."
          eyebrow="05 · PATTERNS"
          id="patterns-title"
          title={
            <>
              Repeat decisions,
              <br />
              not decoration.
            </>
          }
        />
        <div className="docs-pattern-grid">
          <article className="docs-pattern-scene">
            <div className="docs-pattern-scene__header">
              <span>DECISION ROW · IMPLEMENTED</span>
              <Badge tone="success">READY</Badge>
            </div>
            <div className="docs-decision-row">
              <code>01</code>
              <div>
                <strong>상태를 문장으로 설명합니다.</strong>
                <p>
                  Color token 하나가 아니라 rest부터 disabled까지의 행동을
                  기록합니다.
                </p>
              </div>
              <TextLink href="#state-matrix">STATE MATRIX</TextLink>
            </div>
          </article>
          <article className="docs-pattern-scene docs-pattern-scene--inverse">
            <span>EVIDENCE FIRST · CANDIDATE</span>
            <blockquote>“UI는 evidence보다 먼저 보이지 않는다.”</blockquote>
            <p>
              실제 수치, 작업 결과, 출처가 장식과 인터랙션보다 먼저 읽혀야
              합니다.
            </p>
          </article>
        </div>
      </section>

      <section className="docs-section" id="inventory">
        <CollectionHeading
          end={`${inventory.length} COMPONENTS`}
          start="06 · INVENTORY"
        />
        <div className="docs-inventory">
          {inventory.map(([name, family, states], index) => (
            <div key={name}>
              <code>{String(index + 1).padStart(2, "0")}</code>
              <strong>{name}</strong>
              <span>{family}</span>
              <small>{states}</small>
              <Badge tone="success">READY</Badge>
            </div>
          ))}
        </div>
      </section>

      <section className="docs-section" id="contracts">
        <SectionHeading
          description="컴포넌트의 모양보다 행동과 상태를 먼저 고정합니다. Mobile은 desktop을 줄이지 않고 정보 우선순위를 유지한 채 재구성합니다."
          eyebrow="07 · CONTRACTS"
          id="contracts-title"
          title={<>Compose. Don’t redraw.</>}
        />
        <div className="docs-disclosures">
          <Disclosure
            defaultOpen
            label="STATIC / INTERACTIVE"
            summary="AFFORDANCE CONTRACT"
          >
            <p>
              Static surface에는 hover motion이 없습니다. 이동하는 card는 전체
              영역이 하나의 link이며 keyboard focus가 보입니다.
            </p>
          </Disclosure>
          <Disclosure label="ONE VIEWPORT / ONE SIGNAL" summary="ACCENT BUDGET">
            <p>
              Signature scene을 제외한 viewport의 약 90%는 neutral입니다. Data
              visualization이 초록이면 주변 headline은 neutral로 둡니다.
            </p>
          </Disclosure>
          <Disclosure label="SEPARATE, DON’T BOX" summary="BOUNDARY CONTRACT">
            <p>
              Border는 section 시작, 필수 control boundary와 state에만 씁니다.
              일반 grouping은 gap과 surface로 해결합니다.
            </p>
          </Disclosure>
        </div>

        <div className="docs-state-matrix" id="state-matrix">
          <CollectionHeading
            end="LIGHT · DARK"
            start="INTERACTION STATE MATRIX"
          />
          <div className="docs-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>THEME</th>
                  <th>REST</th>
                  <th>HOVER</th>
                  <th>ACTIVE</th>
                  <th>FOCUS</th>
                  <th>DISABLED</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>LIGHT</th>
                  <td>signal / ink</td>
                  <td>brand-hover</td>
                  <td>brand-active</td>
                  <td>2px kiwi-line</td>
                  <td>disabled pair</td>
                </tr>
                <tr>
                  <th>DARK</th>
                  <td>signal / ink</td>
                  <td>bright hover</td>
                  <td>brand-active</td>
                  <td>2px kiwi-line</td>
                  <td>disabled pair</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="docs-section docs-governance" id="governance">
        <SectionHeading
          description="좋아 보인다는 이유만으로 도입하지 않습니다. 출처, license, behavior, dependency와 실제 product fit을 검토하고 상태를 명확히 기록합니다."
          eyebrow="08 · GOVERNANCE"
          id="governance-title"
          title={
            <>
              Reference is
              <br />
              not approval.
            </>
          }
        />
        <div className="docs-governance-grid">
          <article>
            <span>ADOPTION STATES</span>
            <ol>
              <li>
                <strong>REFERENCE</strong>
                <small>배울 가치가 확인된 자료</small>
              </li>
              <li>
                <strong>CANDIDATE</strong>
                <small>제품 맥락에서 검토 중</small>
              </li>
              <li>
                <strong>APPROVED</strong>
                <small>도입 결정과 범위가 합의됨</small>
              </li>
              <li>
                <strong>IMPLEMENTED</strong>
                <small>코드·문서·QA가 함께 완료됨</small>
              </li>
            </ol>
          </article>
          <article>
            <span>ADOPTION GATE</span>
            <ul>
              <li>Canonical source와 license를 확인했는가?</li>
              <li>Keyboard, focus, reduced motion을 검증했는가?</li>
              <li>기존 semantic token으로 표현 가능한가?</li>
              <li>두 번째 consumer가 존재하는가?</li>
              <li>320px·390px과 두 theme에서 확인했는가?</li>
            </ul>
          </article>
        </div>
        <div className="docs-reference-collection" id="reference-base">
          <CollectionHeading
            end={`${primaryReferences.length} PRIMARY SOURCES`}
            start="REFERENCE BASE"
          />
          <div className="docs-table-wrap">
            <table className="docs-reference-table">
              <caption className="docs-sr-only">
                PIP 설계 결정에 직접 사용하는 주요 출처
              </caption>
              <thead>
                <tr>
                  <th>SOURCE</th>
                  <th>ROLE</th>
                  <th>USE</th>
                  <th>LIMIT</th>
                  <th>STATE</th>
                </tr>
              </thead>
              <tbody>
                {primaryReferences.map((reference) => (
                  <tr key={reference.name}>
                    <th scope="row">
                      <a href={reference.url} rel="noreferrer" target="_blank">
                        {reference.name} <span aria-hidden="true">↗</span>
                      </a>
                    </th>
                    <td>{reference.type}</td>
                    <td>{reference.use}</td>
                    <td>{reference.limit}</td>
                    <td>
                      <Badge>REFERENCE</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="docs-reference-collection" id="curated-indexes">
          <CollectionHeading
            end={`${curatedIndexes.length} DISCOVERY MAPS`}
            start="CURATED INDEXES"
          />
          <p className="docs-reference-note">
            묶음 repository는 후보를 찾는 지도입니다. 실제 채택 판단은 각 항목의
            canonical source와 license, behavior를 다시 확인합니다.
          </p>
          <div className="docs-table-wrap">
            <table className="docs-reference-table docs-reference-table--indexes">
              <caption className="docs-sr-only">
                디자인 시스템과 UI 구현 자료를 찾기 위한 공개 큐레이션 저장소
              </caption>
              <thead>
                <tr>
                  <th>INDEX</th>
                  <th>LANE</th>
                  <th>BEST FOR</th>
                  <th>USE WITH CAUTION</th>
                </tr>
              </thead>
              <tbody>
                {curatedIndexes.map((reference) => (
                  <tr key={reference.name}>
                    <th scope="row">
                      <a href={reference.url} rel="noreferrer" target="_blank">
                        {reference.name} <span aria-hidden="true">↗</span>
                      </a>
                    </th>
                    <td>{reference.coverage}</td>
                    <td>{reference.use}</td>
                    <td>{reference.limit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <footer className="docs-footer">
        <div>
          <strong>PIP</strong>
          <span>WHITEKIWI DESIGN SYSTEM</span>
        </div>
        <p>Quiet canvas. Electric kiwi. Human evidence.</p>
        <div>
          <span>V0.3 · IMPLEMENTED</span>
          <a href="#top">BACK TO TOP ↑</a>
        </div>
      </footer>
    </main>
  );
}
