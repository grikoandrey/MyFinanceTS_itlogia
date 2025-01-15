import {AuthUtils} from "../utils/auth-utils";
import {HttpUtils} from "../utils/http-utils";
import {RequestType} from "../types/request.type";

export class Layout {
    public static async loadLayout(layoutPath: string, contentSelector: string = 'content-layout'): Promise<HTMLElement | null> {
        const contentElement: HTMLElement | null = document.getElementById('content');
        if (contentElement) {
            contentElement.innerHTML = await fetch(layoutPath).then(response => response.text());
            return document.getElementById(contentSelector);
        }
        return null;
    };

    public static setUserName(): void {
        const userInfo: string | null = AuthUtils.getAuthInfo(AuthUtils.userInfoKey);
        if (!userInfo) return;

        const parsedInfo = JSON.parse(userInfo);
        const fullName: string = `${parsedInfo.name} ${parsedInfo.lastName}`;

        const profileName: HTMLElement | null = document.getElementById('profileName');
        const profileNameMob: HTMLElement | null = document.getElementById('profileName-mob');

        if (profileName) profileName.innerText = fullName;
        if (profileNameMob) profileNameMob.innerText = fullName;
    };

    public static async getBalance(): Promise<void> {
        const balance: HTMLElement | null = document.getElementById('balance');
        const balanceMob: HTMLElement | null = document.getElementById('balance-mob');

        const result: RequestType = await HttpUtils.request(`/balance`);
        if (!result || !result.response || !result.response.balance) return;

        if (balance && balanceMob) {
            balance.textContent = `${result.response.balance} $`;
            balanceMob.textContent = `${result.response.balance} $`;
        }
    };

    static activateMenu(route: { route: string }): void {
        const selectors = ['.nav-link', '.btn.nav-link', '.dropdown-item', '.btn-toggle'];
        const sidebarLinks = document.querySelectorAll(selectors
            .map(sel => `.sidebar ${sel}`).join(', '));
        const canvasLinks = document.querySelectorAll(selectors
            .map(sel => `.offcanvas ${sel}`).join(', '));

        const allLinks = Array.from(sidebarLinks).concat(Array.from(canvasLinks));

        allLinks.forEach(link => {
            const href: string | null = link.getAttribute('href');
            if (href) {
                const isActive: boolean = (route.route.includes(href) && href !== '/') ||
                    (route.route === '/' && href === '/');
                link.classList.toggle('active', isActive);

                if (route.route === '/incomes' || route.route === '/expenses') {
                    if (link.classList.contains('btn-toggle')) {
                        link.classList.add('active');
                    }
                } else {
                    link.classList.toggle('active', isActive);
                }
            }
        });
    };
}