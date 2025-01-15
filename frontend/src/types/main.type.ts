export type Operation = {
    type: "income" | "expense";
    amount: number;
    category: string;
};