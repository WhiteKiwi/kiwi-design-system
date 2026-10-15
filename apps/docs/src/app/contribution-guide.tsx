import { TextLink } from "@whitekiwi/ui";

export function ContributionGuide() {
  return (
    <article className="docs-contribution" id="contribute">
      <span className="docs-label">PROPOSE → CONTRIBUTE → ADOPT</span>
      <h3>쓰다가 필요한 개선은 함께 반영합니다.</h3>
      <p>
        작업 중 공통 개선이 유용하다면 필요성과 최소 범위를 사용자에게
        제안합니다. 사용처 수는 조건이 아닙니다. 합의한 개선은 디자인 시스템에
        먼저 기여하고 앱에 적용합니다. 이미 요청하거나 승인한 범위는 다시 묻지
        않습니다.
      </p>
      <ol>
        <li>
          기존 API를 확인하고 공통화의 이점과 최소 변경 범위를 제안합니다.
        </li>
        <li>
          합의한 개선을 이 저장소에 구현하고 문서·예제·테스트를 함께 담습니다.
        </li>
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
