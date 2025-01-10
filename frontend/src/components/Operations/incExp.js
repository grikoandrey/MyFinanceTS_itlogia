import {OperationsService} from "../../services/operations-service.js";
import {DateUtils} from "../../utils/date-utils.js";

export class Operations {

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.defaultPeriod = 'all';
        this.initPeriodButtons(this.defaultPeriod);
        this.listOperations(this.defaultPeriod).then();
    };

    initPeriodButtons(period) {
        const buttons = document.querySelectorAll('.period-button'); // Кнопки с классом 'period-button'
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
    };

    async listOperations(period) {
        this.clearTable();

        const result = await OperationsService.getOperations(period);
        if (result.error) {
            alert('Выход из кабинета. Пожалуйста перезайдите.');
            return result.redirect ? this.openNewRoute(result.redirect) : null;
        }

        this.showOperations(result.response);
    };

    showOperations(operations) {
        operations.sort((a, b) => a.id - b.id);

        const recordsElement = document.getElementById('operationsRecords');
        for (let i = 0; i < operations.length; i++) {
            const trElement = document.createElement('tr');

            const idCell = trElement.insertCell();
            idCell.innerText = operations[i].id;
            idCell.setAttribute('data-label', '№ операции');

            const typeCell = trElement.insertCell();
            if (operations[i].type === 'income') {
                typeCell.innerText = 'Доход';
                typeCell.style.color = 'green';
            } else if (operations[i].type === 'expense') {
                typeCell.innerText = 'Расход';
                typeCell.style.color = 'red';
            }
            typeCell.setAttribute('data-label', 'Тип');

            const categoryCell = trElement.insertCell();
            categoryCell.innerText = operations[i].category;
            categoryCell.setAttribute('data-label', 'Категория');

            const amountCell = trElement.insertCell();
            amountCell.innerText = operations[i].amount;
            amountCell.setAttribute('data-label', 'Сумма');

            const dateCell = trElement.insertCell();
            dateCell.innerText = DateUtils.formatDateToDisplay(operations[i].date);
            dateCell.setAttribute('data-label', 'Дата');

            const commentCell = trElement.insertCell();
            commentCell.innerText = operations[i].comment;
            commentCell.setAttribute('data-label', 'Комментарий');

            const actionCell = trElement.insertCell();
            actionCell.innerHTML = `<div class="tbl-action d-flex">
                        <a href="javascript:void(0)" onclick="sessionStorage.setItem('id', '${operations[i].id}')">
                            <svg data-bs-toggle="modal" data-bs-target="#exampleModal" class="me-2" width="14"
                                 height="15" viewBox="0 0 14 15" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.5 5.5C4.77614 5.5 5 5.72386 5 6V12C5 12.2761 4.77614 12.5 4.5 12.5C4.22386 12.5 4 12.2761 4 12V6C4 5.72386 4.22386 5.5 4.5 5.5Z"
                                      fill="black"/>
                                <path d="M7 5.5C7.27614 5.5 7.5 5.72386 7.5 6V12C7.5 12.2761 7.27614 12.5 7 12.5C6.72386 12.5 6.5 12.2761 6.5 12V6C6.5 5.72386 6.72386 5.5 7 5.5Z"
                                      fill="black"/>
                                <path d="M10 6C10 5.72386 9.77614 5.5 9.5 5.5C9.22386 5.5 9 5.72386 9 6V12C9 12.2761 9.22386 12.5 9.5 12.5C9.77614 12.5 10 12.2761 10 12V6Z"
                                      fill="black"/>
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                      d="M13.5 3C13.5 3.55228 13.0523 4 12.5 4H12V13C12 14.1046 11.1046 15 10 15H4C2.89543 15 2 14.1046 2 13V4H1.5C0.947715 4 0.5 3.55228 0.5 3V2C0.5 1.44772 0.947715 1 1.5 1H5C5 0.447715 5.44772 0 6 0H8C8.55229 0 9 0.447715 9 1H12.5C13.0523 1 13.5 1.44772 13.5 2V3ZM3.11803 4L3 4.05902V13C3 13.5523 3.44772 14 4 14H10C10.5523 14 11 13.5523 11 13V4.05902L10.882 4H3.11803ZM1.5 3V2H12.5V3H1.5Z"
                                      fill="black"/>
                            </svg>
                        </a>
                        <a href="/operation/edit" onclick="sessionStorage.setItem('id', '${operations[i].id}')">
                            <svg cursor="pointer" width="16" height="16" viewBox="0 0 16 16" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.1465 0.146447C12.3417 -0.0488155 12.6583 -0.0488155 12.8536 0.146447L15.8536 3.14645C16.0488 3.34171 16.0488 3.65829 15.8536 3.85355L5.85357 13.8536C5.80569 13.9014 5.74858 13.9391 5.68571 13.9642L0.68571 15.9642C0.500001 16.0385 0.287892 15.995 0.146461 15.8536C0.00502989 15.7121 -0.0385071 15.5 0.0357762 15.3143L2.03578 10.3143C2.06092 10.2514 2.09858 10.1943 2.14646 10.1464L12.1465 0.146447ZM11.2071 2.5L13.5 4.79289L14.7929 3.5L12.5 1.20711L11.2071 2.5ZM12.7929 5.5L10.5 3.20711L4.00001 9.70711V10H4.50001C4.77616 10 5.00001 10.2239 5.00001 10.5V11H5.50001C5.77616 11 6.00001 11.2239 6.00001 11.5V12H6.29291L12.7929 5.5ZM3.03167 10.6755L2.92614 10.781L1.39754 14.6025L5.21903 13.0739L5.32456 12.9683C5.13496 12.8973 5.00001 12.7144 5.00001 12.5V12H4.50001C4.22387 12 4.00001 11.7761 4.00001 11.5V11H3.50001C3.28561 11 3.10272 10.865 3.03167 10.6755Z"
                                      fill="black"/>
                            </svg>
                        </a>
                    </div>`;
            actionCell.setAttribute('data-label', 'Действия');

            recordsElement.appendChild(trElement);
        }
    };
    clearTable() {
        const recordsElement = document.getElementById('operationsRecords');
        recordsElement.innerHTML = ''; // Очищаем содержимое таблицы
    };
}