import {OperationsService} from "../services/operations-service";
import {NewRoute} from "../types/newRoute.type";
import {Operation} from "../types/main.type";
import {ReturnObject} from "../types/responce.type";
import Chart from "chart.js/auto";


export class Main {

    readonly openNewRoute: NewRoute;
    readonly defaultPeriod: string
    readonly colorMap: Record<string, string> = {}
    readonly colors: string[];

    incomeChart: any;
    expenseChart: any;
    period: string = "";

    constructor(openNewRoute: NewRoute) {
        this.openNewRoute = openNewRoute;

        this.defaultPeriod = 'all';

        this.colorMap = {}; // Хранит соответствие категорий и цветов
        this.colors = ['red', 'yellow', 'green', 'blue', 'purple', 'orange', 'rose',
            'cyan', 'saddlebrown', 'wheat']; // Базовые цвета

        this.initPeriodButtons(this.defaultPeriod);

    };

    private initPeriodButtons(period: string): void {
        const buttons = document.querySelectorAll('.period-button') as NodeListOf<HTMLButtonElement>;
        if (buttons.length === 0) {
            console.log('Кнопки периода не найдены. Не победил их');
            return;
        }

        let activeButton: HTMLButtonElement | null = null;
        buttons.forEach((button) => {
            if (button.dataset.period === period) {
                button.classList.add('active');
                activeButton = button;
            } else {
                button.classList.remove('active');
            }
            button.addEventListener('click', () => {
                // Деактивируем предыдущую активную кнопку
                if (activeButton) {
                    activeButton.classList.remove('active');
                }
                // Устанавливаем новую активную кнопку
                button.classList.add('active');
                activeButton = button as HTMLButtonElement | null;

                if (button.dataset.period) {
                    this.period = button.dataset.period;
                }
                this.listOperations(this.period).then(); // Загружаем операции для нового периода
            });
        });
        // Обработка выбранного периода из input
        const applyButton = document.getElementById('applyPeriod') as HTMLButtonElement | null;

        if (applyButton) {
            applyButton.addEventListener('click', () => {
                const fromDate = (document.getElementById('dateStartInput') as HTMLInputElement)?.value;
                const toDate = (document.getElementById('dateEndInput') as HTMLInputElement)?.value;

                if (fromDate && toDate) {
                    this.period = `interval&dateFrom=${fromDate}&dateTo=${toDate}`;
                    this.listOperations(this.period).then();
                } else {
                    alert('Укажите оба значения: начальную и конечную дату.');
                }
            });
        }

        this.listOperations(this.defaultPeriod).then();
    };

    private async listOperations(period: string) {

        const result: ReturnObject<Operation[]> = await OperationsService.getOperations(period);
        if (result.error) {
            alert('Выход из кабинета. Пожалуйста перезайдите.');
            return result.redirect ? this.openNewRoute(result.redirect) : null;
        }

        if (!Array.isArray(result.response)) {
            console.error('Некорректный формат данных');
            return;
        }
        const {incomes, expenses} = this.processOperationsForChart(result.response);

        if (this.incomeChart && this.expenseChart) {
            const incomeChartData = this.prepareChartData(incomes);
            const expenseChartData = this.prepareChartData(expenses);

            this.updateChart(this.incomeChart, incomeChartData.labels, incomeChartData.data, incomeChartData.colors);
            this.updateChart(this.expenseChart, expenseChartData.labels, expenseChartData.data, expenseChartData.colors);
        } else {
            if (Array.isArray(result.response)) {
                await this.getDiagram(result.response);
            } else {
                console.error('Некорректный формат данных');
            }
        }
    };

    private async getDiagram(operations: Operation[]): Promise<void> {

        if (!operations || operations.length === 0) {
            console.warn('Нет данных для диаграмм.');
            return;
        }

        const existingIncomeChart = Chart.getChart('myChartIncomes');
        const existingExpenseChart = Chart.getChart('myChartExpenses');

        existingIncomeChart?.destroy();
        existingExpenseChart?.destroy();

        const {incomes, expenses} = this.processOperationsForChart(operations);

        const incomeChartData = this.prepareChartData(incomes);
        const expenseChartData = this.prepareChartData(expenses);

        const ctxIncomesElement = document.getElementById('myChartIncomes') as HTMLCanvasElement | null;
        const ctxExpensesElement = document.getElementById('myChartExpenses') as HTMLCanvasElement | null;

        if (!ctxIncomesElement || !ctxExpensesElement) {
            console.error('Элементы для диаграмм не найдены.');
            return;
        }

        const ctxIncomes = ctxIncomesElement.getContext('2d');
        const ctxExpenses = ctxExpensesElement.getContext('2d');

        if (!ctxIncomes || !ctxExpenses) {
            console.error('Не удалось получить контекст 2D для диаграмм.');
            return;
        }

        this.incomeChart = new Chart(ctxIncomes, {
            type: 'pie',
            data: {
                labels: incomeChartData.labels,
                datasets: [{
                    data: incomeChartData.data,
                    backgroundColor: incomeChartData.colors
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        });

        this.expenseChart = new Chart(ctxExpenses, {
            type: 'pie',
            data: {
                labels: expenseChartData.labels,
                datasets: [{
                    data: expenseChartData.data,
                    backgroundColor: expenseChartData.colors
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        });
    };

    private processOperationsForChart(operations: Operation[]) {
        const incomes: Record<string, number> = {};
        const expenses: Record<string, number> = {};

        operations.forEach(({type, amount, category}) => {
            if (type === "income") {
                incomes[category] = (incomes[category] || 0) + amount;
            } else if (type === "expense") {
                expenses[category] = (expenses[category] || 0) + amount;
            }
        });

        return {incomes, expenses};
    }

    private prepareChartData(data: Record<string, number>) {
        const labels = Object.keys(data);
        const values = Object.values(data);
        const colors = labels.map((label, index) => this.getCategoryColor(label, index));


        return {
            labels,
            data: values,
            colors
        };
    };

    getCategoryColor(category: string, index: number): string {
        if (!this.colorMap[category]) {
            this.colorMap[category] = this.colors[index % this.colors.length];
        }
        return this.colorMap[category];
    };

    updateChart(chart: Chart, labels: string[], data: number[], colors: string[]): void {
        chart.data.labels = labels;
        chart.data.datasets[0].data = data;
        chart.data.datasets[0].backgroundColor = colors;
        chart.update();
    };
}