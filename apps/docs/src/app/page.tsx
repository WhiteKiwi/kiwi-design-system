import {
  CollectionHeading,
  Disclosure,
  LinkedCard,
  SectionHeading,
  StaticCard,
} from "@whitekiwi/ui";
import { ThemeToggle } from "./theme-toggle";

const swatches = [
  ["PAPER", "#F4F5EF"],
  ["INK", "#11140F"],
  ["CARBON", "#0E100E"],
  ["CHALK", "#F1F4EB"],
  ["KIWI SIGNAL", "#C6FF4A"],
  ["KIWI INK", "#3C6000"],
] as const;

export default function Home() {
  return (
    <main>
      <header className="docs-header">
        <strong>KIWI DESIGN SYSTEM</strong>
        <span>V0.1 · PRIVATE</span>
        <ThemeToggle />
      </header>

      <section className="docs-hero">
        <span>WHITEKIWI · FOUNDATION</span>
        <h1>
          QUIET CANVAS.
          <br />
          <em>ELECTRIC KIWI.</em>
        </h1>
        <p>
          사람과 evidence가 먼저 보이도록 만드는 작은 디자인 시스템.
          <br />
          매번 새로 그리지 않고, 같은 계약을 조합합니다.
        </p>
      </section>

      <section className="docs-section" id="foundation">
        <SectionHeading
          description="Raw value를 page에서 직접 고르지 않습니다. Scale은 선택지를 제한하고 semantic token은 의도를 공유합니다."
          eyebrow="01 · FOUNDATION"
          id="foundation-title"
          title={
            <>
              색이 아니라
              <br />
              역할을 고릅니다.
            </>
          }
        />
        <div className="docs-swatches">
          {swatches.map(([name, value]) => (
            <div key={name} style={{ background: value }}>
              <span>{name}</span>
              <code>{value}</code>
            </div>
          ))}
        </div>
      </section>

      <section className="docs-section" id="components">
        <CollectionHeading end="04 PRIMITIVES" start="02 · COMPONENTS" />
        <div className="docs-component-grid">
          <StaticCard tone="raised">
            <span className="docs-label">STATIC CARD</span>
            <strong>움직이지 않습니다.</strong>
            <p>정보 표면에는 lift, pointer와 가짜 화살표를 두지 않습니다.</p>
          </StaticCard>
          <LinkedCard href="#contracts" tone="raised">
            <span className="docs-label">LINKED CARD</span>
            <strong>전체가 이동합니다.</strong>
            <p>방향 표시와 hover·focus·pressed 상태를 함께 제공합니다.</p>
          </LinkedCard>
          <StaticCard tone="brand">
            <span className="docs-label">BRAND FIELD</span>
            <strong>한 화면에 하나.</strong>
            <p>큰 초록 면, 글자와 수치가 서로 경쟁하지 않습니다.</p>
          </StaticCard>
          <StaticCard tone="inverse">
            <span className="docs-label">INVERSE</span>
            <strong>Neutral이 지배합니다.</strong>
            <p>강조하지 않는 영역이 있어야 signal이 기억됩니다.</p>
          </StaticCard>
        </div>
      </section>

      <section className="docs-section" id="contracts">
        <SectionHeading
          description="컴포넌트의 모양보다 행동과 상태를 먼저 고정합니다. Mobile은 desktop을 줄이지 않고 우선순위를 유지한 채 재구성합니다."
          eyebrow="03 · CONTRACTS"
          id="contracts-title"
          title={
            <>
              Compose.
              <br />
              Don’t redraw.
            </>
          }
        />
        <div className="docs-disclosures">
          <Disclosure
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
