"use client";

import { Button, EmptyState, SegmentedControl, Select } from "@whitekiwi/ui";
import { useRef, useState } from "react";

export function SelectionExamples() {
  const cycleRef = useRef<HTMLSelectElement>(null);
  const [period, setPeriod] = useState("month");
  const [submitted, setSubmitted] = useState("");
  return (
    <div className="docs-component-block" id="selection-examples">
      <div className="docs-component-title">
        <span>SELECTION & EMPTY STATES</span>
        <code>NATIVE INPUT · ONE CHOICE · CLEAR NEXT STEP</code>
      </div>
      <div className="docs-field-grid">
        <Select
          ref={cycleRef}
          label="납부 주기"
          name="cycle"
          hint="월별·연간 내역을 같은 기준으로 봅니다."
          defaultValue="monthly"
        >
          <option value="monthly">매월</option>
          <option value="yearly">매년</option>
        </Select>
        <Select
          label="확인할 기간"
          name="invalid-period"
          error="기간을 선택해 주세요."
          defaultValue=""
        >
          <option value="">선택하세요</option>
          <option value="month">이번 달</option>
        </Select>
        <Select
          label="비활성 선택"
          name="disabled-choice"
          disabled
          defaultValue="pending"
        >
          <option value="pending">자료 확인 중</option>
        </Select>
        <Select label="긴 선택값" name="long-choice" defaultValue="long">
          <option value="long">
            여러 서비스와 길게 설명된 한국어 분류를 함께 표시하는 선택값
          </option>
        </Select>
      </div>
      <Button variant="secondary" onClick={() => cycleRef.current?.focus()}>
        납부 주기로 이동
      </Button>
      <SegmentedControl
        label="조회 기간"
        value={period}
        onValueChange={setPeriod}
        options={[
          { value: "month", label: "이번 달" },
          { value: "year", label: "올해" },
          { value: "future", label: "준비 중", disabled: true },
        ]}
      />
      <p aria-live="polite">
        {period === "month" ? "이번 달" : "올해"} 내역을 보고 있습니다.
      </p>
      <SegmentedControl
        label="비활성 그룹"
        disabled
        defaultValue="light"
        options={[
          { value: "light", label: "밝게" },
          { value: "dark", label: "어둡게" },
        ]}
      />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setSubmitted(`${data.get("scope")} / ${data.get("frequency")}`);
        }}
      >
        <div className="docs-field-grid">
          <SegmentedControl
            label="내보낼 범위"
            name="scope"
            defaultValue="current"
            options={[
              { value: "current", label: "선택 기간" },
              { value: "all", label: "전체 기간" },
            ]}
          />
          <Select label="내보낼 주기" name="frequency" defaultValue="monthly">
            <option value="monthly">월별</option>
            <option value="yearly">연간</option>
          </Select>
        </div>
        <div className="docs-button-row">
          <Button type="submit">선택 확인</Button>
          <Button type="reset" variant="secondary">
            초기화
          </Button>
        </div>
        <output>{submitted}</output>
      </form>
      <EmptyState
        title="조건에 맞는 내역이 없습니다."
        description="아직 수집하지 않은 자료와 검색 결과 없음은 제품에서 구분합니다."
      >
        <Button variant="secondary" onClick={() => setPeriod("year")}>
          조회 기간 넓히기
        </Button>
      </EmptyState>
    </div>
  );
}
