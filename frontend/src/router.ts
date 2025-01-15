import {Main} from "./components/main";
import {LogIn} from "./components/Auth/login";
import {SignUp} from "./components/Auth/signup";
import {Logout} from "./components/Auth/logout";
import {Operations} from "./components/Operations/incExp";
import {OperationEdit} from "./components/Operations/editIncExp";
import {OperationCreate} from "./components/Operations/createIncExp";
import {OperationDelete} from "./components/Operations/deleteIncExp";
import {Incomes} from "./components/Incomes/incomes";
import {IncomeEdit} from "./components/Incomes/editInc";
import {IncomeCreate} from "./components/Incomes/createInc";
import {IncomeDelete} from "./components/Incomes/deleteInc";
import {Expenses} from "./components/Expenses/expenses";
import {ExpenseDelete} from "./components/Expenses/deleteExp";
import {ExpenseCreate} from "./components/Expenses/createExp";
import {ExpenseEdit} from "./components/Expenses/editExp";
import {Layout} from "./components/layout";
import {Route} from "./types/route.type";

export class Router {
    readonly titlePageElement: HTMLElement | null;
    readonly contentPageElement: HTMLElement | null;

    private routes: Route[];

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
                load: (): void => {
                    new LogIn(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/signup',
                title: 'Регистрация',
                filePathTemplate: '/templates/signup.html',
                useLayout: false,
                load: (): void => {
                    new SignUp(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/logout',
                load: (): void => {
                    new Logout(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/main.html',
                useLayout: '/templates/layout.html',
                load: async (): Promise<void> => {
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
                load: (): void => {
                    new Operations(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/operation/edit',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/Operations/edit-incExp.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new OperationEdit(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/operation/create',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/Operations/create-incExp.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new OperationCreate(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/operation/delete',
                load: (): void => {
                    new OperationDelete(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/incomes',
                title: 'Доходы',
                filePathTemplate: '/templates/Incomes/incomes.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new Incomes(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/incomes/edit',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/Incomes/edit-incomes.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new IncomeEdit(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/incomes/create',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/Incomes/create-incomes.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new IncomeCreate(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income/delete',
                load: (): void => {
                    new IncomeDelete(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expenses',
                title: 'Расходы',
                filePathTemplate: '/templates/Expenses/expenses.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new Expenses(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expenses/edit',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/Expenses/edit-expenses.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new ExpenseEdit(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expenses/create',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/Expenses/create-expenses.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new ExpenseCreate(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expenses/delete',
                load: (): void => {
                    new ExpenseDelete(this.openNewRoute.bind(this));
                },
            },
        ];
        this.openNewRoute('/login').then();
    };

    initEvents(): void {
        window.addEventListener('DOMContentLoaded', (e) => this.activateRoute(e, 'oldRoute'));
        window.addEventListener('popstate', (e) => this.activateRoute(e, 'oldRoute'));
        document.addEventListener('click', this.clickHandler.bind(this));
    };

    public async openNewRoute(url: string): Promise<void> {
        const currentRoute: string = window.location.pathname;
        history.pushState(null, '', url);
        await this.activateRoute(null, currentRoute);
    };

    private async clickHandler(e: any): Promise<void> {
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

            const currentRoute: string = window.location.pathname;
            const url: string = element.href.replace(window.location.origin, '');
            if (!url || (currentRoute === url.replace('#', '')) || url.startsWith('javascript:void(0)')) {
                return;
            }
            await this.openNewRoute(url);
        }
    };

    private async activateRoute(e: Event | null, oldRoute: string): Promise<void> {
        if (oldRoute) {
            const currentRoute: Route | undefined = this.routes.find(item => item.route === oldRoute);
            if (currentRoute) {
                if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                    currentRoute.scripts.forEach(script => {
                        const scriptElement = document.querySelector(`script[src='/js/${script}']`);
                        if (scriptElement) {
                            scriptElement.remove();
                        }
                    });
                }
            }
        }

        const urlRoute: string = window.location.pathname;
        const newRoute: Route | undefined = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            if (newRoute.scripts && newRoute.scripts.length > 0) {
                newRoute.scripts.forEach(file => {
                    const script = document.createElement('script');
                    script.src = `/js/${file}`;
                    document.body.appendChild(script);
                })
            }
            if (newRoute.title && this.titlePageElement) {
                this.titlePageElement.innerText = `${newRoute.title} | LF`;
            }
            if (newRoute.filePathTemplate) {
                let contentBlock: HTMLElement | null = this.contentPageElement;
                if (newRoute.useLayout && typeof newRoute.useLayout === 'string') {
                    contentBlock = await Layout.loadLayout(newRoute.useLayout);
                    Layout.setUserName();
                    await Layout.getBalance();
                    Layout.activateMenu(newRoute);
                }
                if (contentBlock) {
                    contentBlock.innerHTML = await fetch(newRoute.filePathTemplate)
                        .then(response => response.text());
                }
            }
            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            history.pushState(null, '', '/404');
            await this.activateRoute(null, '');
        }
    };
}