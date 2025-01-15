declare module '../js/chart.umd.js' {
    export const Chart: any;
}

// declare module '../js/chart.umd.js' {
//     export class Chart {
//         constructor(context: CanvasRenderingContext2D | null, config: any);
//         static getChart(id: string): Chart | undefined;
//         data: {
//             labels: string[];
//             datasets: { data: number[]; backgroundColor: string[] }[];
//         };
//         update(): void;
//         destroy(): void;
//     }
// }