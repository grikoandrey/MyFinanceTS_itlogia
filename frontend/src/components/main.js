import {Chart} from "../js/chart.umd.js";
import {OperationsService} from "../services/operations-service";

export class Main {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.defaultPeriod = 'all';

        this.colorMap = {}; // Хранит соответствие категорий и цветов
        this.colors = ['red', 'yellow', 'green', 'blue', 'purple', 'orange', 'rose',
            'cyan', 'saddlebrown', 'wheat']; // Базовые цвета

        this.initPeriodButtons(this.defaultPeriod);

    };

    initPeriodButtons(period) {
        const buttons = document.querySelectorAll('.period-button'); // Кнопки с классом 'period-button'
        if (buttons.length === 0) {
            console.log('Кнопки периода не найдены. Не победил их');
            return;
        }

        let activeButton = null;
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
                activeButton = button;

                this.period = button.dataset.period; // Получаем период из data-атрибута
                this.listOperations(this.period).then(); // Загружаем операции для нового периода
            });
        });
        // Обработка выбранного периода из input
        const applyButton = document.getElementById('applyPeriod');

        applyButton.addEventListener('click', () => {
            const fromDate = document.getElementById('dateStartInput').value;
            const toDate = document.getElementById('dateEndInput').value;

            if (fromDate && toDate) {
                this.period = `interval&dateFrom=${fromDate}&dateTo=${toDate}`;
                this.listOperations(this.period).then();
            } else {
                alert('Укажите оба значения: начальную и конечную дату.');
            }
        });
        this.listOperations(this.defaultPeriod).then();
    };

    async listOperations(period) {

        const result = await OperationsService.getOperations(period);
        if (result.error) {
            alert('Выход из кабинета. Пожалуйста перезайдите.');
            return result.redirect ? this.openNewRoute(result.redirect) : null;
        }

        const {incomes, expenses} = this.processOperationsForChart(result.response);

        if (this.incomeChart && this.expenseChart) {
            const incomeChartData = this.prepareChartData(incomes);
            const expenseChartData = this.prepareChartData(expenses);

            this.updateChart(this.incomeChart, incomeChartData.labels, incomeChartData.data, incomeChartData.colors);
            this.updateChart(this.expenseChart, expenseChartData.labels, expenseChartData.data, expenseChartData.colors);
        } else {

            await this.getDiagram(result.response); // Если диаграммы еще не созданы
        }
    };

    async getDiagram(operations) {

        if (!Array.isArray(operations) || operations.length === 0) {
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

        const ctxIncomesElement = document.getElementById('myChartIncomes');
        const ctxExpensesElement = document.getElementById('myChartExpenses');

        if (!ctxIncomesElement || !ctxExpensesElement) {
            console.error('Элементы для диаграмм не найдены.');
            return;
        }

        const ctxIncomes = ctxIncomesElement.getContext('2d');
        const ctxExpenses = ctxExpensesElement.getContext('2d');

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

    processOperationsForChart(operations) {
        const incomeData = {};
        const expenseData = {};

        operations.forEach(operation => {
            const {type, amount, category} = operation;
            // Суммируем по категориям
            if (type === 'income') {
                incomeData[category] = (incomeData[category] || 0) + amount;
            } else if (type === 'expense') {
                expenseData[category] = (expenseData[category] || 0) + amount;
            }
        });

        return {
            incomes: incomeData,
            expenses: expenseData
        };
    };

    prepareChartData(data) {
        const labels = Object.keys(data);
        const values = Object.values(data);
        const colors = [];
        // Присваиваем цвет каждой категории по порядку
        labels.forEach((label, index) => {
            colors.push(this.getCategoryColor(label, index));
        });

        return {
            labels,
            data: values,
            colors
        };
    };

    getCategoryColor(category, index) {
        if (!this.colorMap[category]) {
            this.colorMap[category] = this.colors[index % this.colors.length];
        }
        return this.colorMap[category];
    };

    updateChart(chart, labels, data, colors) {
        chart.data.labels = labels;
        chart.data.datasets[0].data = data;
        chart.data.datasets[0].backgroundColor = colors;
        chart.update();
    };
}