import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WeeklyReview from "@/components/reviews/WeeklyReview";
import MonthlyReview from "@/components/reviews/MonthlyReview";
import YearlyGoals from "@/components/reviews/YearlyGoals";
import CleanupPostponed from "@/components/reviews/CleanupPostponed";

export default function Reviews() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-lg p-4 space-y-4">
      <Tabs defaultValue="weekly">
        <TabsList className="w-full">
          <TabsTrigger value="weekly" className="flex-1 text-xs">C1</TabsTrigger>
          <TabsTrigger value="monthly" className="flex-1 text-xs">B1</TabsTrigger>
          <TabsTrigger value="goals" className="flex-1 text-xs">A1</TabsTrigger>
          <TabsTrigger value="cleanup" className="flex-1 text-xs">A2</TabsTrigger>
        </TabsList>
        <TabsContent value="weekly"><WeeklyReview /></TabsContent>
        <TabsContent value="monthly"><MonthlyReview /></TabsContent>
        <TabsContent value="goals"><YearlyGoals /></TabsContent>
        <TabsContent value="cleanup"><CleanupPostponed /></TabsContent>
      </Tabs>
    </div>
  );
}
