import React, { Suspense } from "react";
import { PlannerFeature } from "../../presentation/features/planner";

export default function PlannerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading AI Travel Studio...</div>}>
      <PlannerFeature />
    </Suspense>
  );
}
