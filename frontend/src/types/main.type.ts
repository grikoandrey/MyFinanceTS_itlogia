export type Operation = {
    type: "income" | "expense";
    amount: number;
    category: string;
};

export type ChartData = {
    labels: string[];
    data: number[];
    colors: string[];
};