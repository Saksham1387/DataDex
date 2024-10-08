"use client";
import { useState, useEffect } from "react";
import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../packages/ui/src/@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartLegendContent,
  ChartTooltipContent,
} from "../../../../packages/ui/src/@/components/ui/chart";

interface ChartData {
  status: string;
  count: number;
  fill: string;
}

const chartConfig: ChartConfig = {
  solved: {
    label: "Solved",
    color: "hsl(var(--chart-1))",
  },
  unsolved: {
    label: "Unsolved",
    color: "hsl(var(--chart-2))",
  },
};

export function Piechart({ chartData }: any) {
  return (
    <Card className="bg-lightgray border-none text-white flex flex-col h-[400px] w-[300px]">
      <CardHeader className="items-center pb-0 text-center">
        <CardTitle>Problem Solving Stats</CardTitle>
        <CardDescription>Showing solved and unsolved problems</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={chartData} dataKey="count" nameKey="status" />
            <ChartLegend
              content={<ChartLegendContent nameKey="status" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center "
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
