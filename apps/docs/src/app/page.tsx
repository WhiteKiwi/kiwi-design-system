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

export default function Home() {
  return (
    <main>
      <header className="docs-header">
        <a href="#top">PIP · WHITEKIWI</a>
        <nav aria-label="Design system sections">
          <a href="#colors">COLORS</a>
          <a href="#foundations">FOUNDATIONS</a>
          <a href="#components">COMPONENTS</a>
        </nav>
        <ThemeToggle />
      </header>

      <section className="docs-hero" id="top">
        <div>
          <span>PIP · V0.2 · IMPLEMENTED</span>
          <h1>
            SMALL PARTS.
            <br />
            <em>ONE CLEAR SYSTEM.</em>
          </h1>
        </div>
        <p>
          WhiteKiwi의 color, type, component와 interaction contract를 한곳에서
          확인합니다. 설명보다 실제 토큰과 상태를 먼저 보여줍니다.
        </p>
      </section>

      <section className="docs-section docs-color-section" id="colors">
        <SectionHeading
          description="Neutral이 대부분을 차지하고 kiwi는 신호로만 씁니다. 브랜드와 success는 같은 초록으로 처리하지 않습니다."
          eyebrow="01 · COLOR"
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
          start="02 · FOUNDATIONS"
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
          eyebrow="03 · COMPONENTS"
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

      <section className="docs-section" id="inventory">
        <CollectionHeading
          end={`${inventory.length} COMPONENTS`}
          start="04 · INVENTORY"
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
          eyebrow="05 · CONTRACTS"
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
      </section>
    </main>
  );
}
