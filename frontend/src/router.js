import {Main} from "./components/main.js";
import {LogIn} from "./components/Auth/login.js";
import {SignUp} from "./components/Auth/signup.js";
import {Logout} from "./components/Auth/logout.js";
import {Operations} from "./components/Operations/incExp.js";
import {OperationEdit} from "./components/Operations/editIncExp.js";
import {OperationCreate} from "./components/Operations/createIncExp.js";
import {OperationDelete} from "./components/Operations/deleteIncExp.js";
import {Incomes} from "./components/Incomes/incomes.js";
import {IncomeEdit} from "./components/Incomes/editInc.js";
import {IncomeCreate} from "./components/Incomes/createInc.js";
import {IncomeDelete} from "./components/Incomes/deleteInc.js";
import {Expenses} from "./components/Expenses/expenses.js";
import {ExpenseDelete} from "./components/Expenses/deleteExp.js";
import {ExpenseCreate} from "./components/Expenses/createExp.js";
import {ExpenseEdit} from "./components/Expenses/editExp.js";
import {Layout} from "./components/layout";

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title-page');
        this.contentPageElement = document.getElementById('content');

        this.initEvents();
        this.routes = [
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/login.html',
                useLayout: false,
                load: () => {
                    new LogIn(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/signup',
                title: 'Регистрация',
                filePathTemplate: '/templates/signup.html',
                useLayout: false,
                load: () => {
                    new SignUp(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/main.html',
                useLayout: '/templates/layout.html',
                load: async () => {
                    new Main(this.openNewRoute.bind(this));
                },
                scripts: ['chart.umd.js'],
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/404.html',
                useLayout: false,
            },
            {
                route: '/operations',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/Operations/incExp.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Operations(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/operation/edit',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/Operations/edit-incExp.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationEdit(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/operation/create',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/Operations/create-incExp.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationCreate(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/operation/delete',
                load: () => {
                    new OperationDelete(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/incomes',
                title: 'Доходы',
                filePathTemplate: '/templates/Incomes/incomes.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Incomes(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/incomes/edit',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/Incomes/edit-incomes.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeEdit(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/incomes/create',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/Incomes/create-incomes.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeCreate(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income/delete',
                load: () => {
                    new IncomeDelete(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expenses',
                title: 'Расходы',
                filePathTemplate: '/templates/Expenses/expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Expenses(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expenses/edit',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/Expenses/edit-expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpenseEdit(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expenses/create',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/Expenses/create-expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpenseCreate(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expenses/delete',
                load: () => {
                    new ExpenseDelete(this.openNewRoute.bind(this));
                },
            },
        ];
        this.openNewRoute('/login').then();
    };

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    };

    async openNewRoute(url) {
        const currentRoute = window.location.pathname;
        history.pushState(null, '', url);
        await this.activateRoute(null, currentRoute);
    };

    async clickHandler(e) {
        let element = null;

        if (e.target.dataset.bsToggle === 'offcanvas') {
            return;
        }
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }
        if (element) {
            e.preventDefault();

            const currentRoute = window.location.pathname;
            const url = element.href.replace(window.location.origin, '');
            if (!url || (currentRoute === url.replace('#', '')) || url.startsWith('javascript:void(0)')) {
                return;
            }
            await this.openNewRoute(url);
        }
    };

    async activateRoute(e, oldRoute) {
        if (oldRoute) {
            const currentRoute = this.routes.find(item => item.route === oldRoute);

            if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                currentRoute.scripts.forEach(script => {
                    const scriptElement = document.querySelector(`script[src='/js/${script}']`);
                    if (scriptElement) {
                        scriptElement.remove();
                    }
                });
            }
        }

        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            if (newRoute.scripts && newRoute.scripts.length > 0) {
                newRoute.scripts.forEach(file => {
                    const script = document.createElement('script');
                    script.src = `/js/${file}`;
                    document.body.appendChild(script);
                })
            }
            if (newRoute.title) {
                this.titlePageElement.innerText = `${newRoute.title} | LF`;
            }
            if (newRoute.filePathTemplate) {
                let contentBlock = this.contentPageElement;
                if (newRoute.useLayout) {
                    contentBlock = await Layout.loadLayout(newRoute.useLayout);
                    Layout.setUserName();
                    await Layout.getBalance();
                    Layout.activateMenu(newRoute);
                }
                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate)
                    .then(response => response.text());
            }
            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            history.pushState(null, '', '/404');
            await this.activateRoute(null, '', '/404');
        }
    };
}