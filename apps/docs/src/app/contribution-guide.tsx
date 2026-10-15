import { TextLink } from "@whitekiwi/ui";

export function ContributionGuide() {
  return (
    <article className="docs-contribution" id="contribute">
      <span className="docs-label">USE → IMPROVE → ADOPT</span>
      <h3>쓰다가 필요한 개선은 함께 반영합니다.</h3>
      <p>
        공통 결함·접근성 문제·범용 기능 부족은 디자인 시스템에서 개선합니다.
        제품 전용 데이터와 화면 구성은 앱에 둡니다. 두 번째 consumer 조건은 제품
        전용 구성을 공통 Pattern으로 승격할 때만 적용합니다.
      </p>
      <ol>
        <li>설치 버전과 기존 API를 확인하고 실제 사용 사례를 정리합니다.</li>
        <li>공통 개선을 구현하고 문서·예제·테스트를 같은 PR에 담습니다.</li>
        <li>
          소비 앱에서 패키지를 검증하고 공개 버전 적용 시 임시 우회를
          제거합니다.
        </li>
      </ol>
      <nav
        aria-label="Usage and contribution guides"
        className="docs-guide-links"
      >
        <TextLink href="https://github.com/WhiteKiwi/kiwi-design-system/blob/main/docs/usage.md">
          사용 가이드
        </TextLink>
        <TextLink href="https://github.com/WhiteKiwi/kiwi-design-system/blob/main/CONTRIBUTING.md">
          기여 가이드
        </TextLink>
        <TextLink href="https://github.com/WhiteKiwi/kiwi-design-system/blob/main/docs/usage.md#agent-setup">
          소비 프로젝트의 에이전트 설정
        </TextLink>
      </nav>
    </article>
  );
}
