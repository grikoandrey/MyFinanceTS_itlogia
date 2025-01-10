import {AuthUtils} from "../utils/auth-utils.js";
import {HttpUtils} from "../utils/http-utils.js";

export class Layout {
    static async loadLayout(layoutPath, contentSelector = 'content-layout') {
        document.getElementById('content').innerHTML = await fetch(layoutPath)
            .then(response => response.text());
        return document.getElementById(contentSelector);
    };

    static setUserName() {
        const userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoKey);
        if (!userInfo) return;

        const parsedInfo = JSON.parse(userInfo);
        const fullName = `${parsedInfo.name} ${parsedInfo.lastName}`;

        const profileName = document.getElementById('profileName');
        const profileNameMob = document.getElementById('profileName-mob');

        if (profileName) profileName.innerText = fullName;
        if (profileNameMob) profileNameMob.innerText = fullName;
    };

    static async getBalance() {
        const balance = document.getElementById('balance');
        const balanceMob = document.getElementById('balance-mob');

        const result = await HttpUtils.request(`/balance`);
        if (!result || !result.response || !result.response.balance) return;

        balance.textContent = `${result.response.balance} $`;
        balanceMob.textContent = `${result.response.balance} $`;

    };

    static activateMenu(route) {
        const selectors = ['.nav-link', '.btn.nav-link', '.dropdown-item', '.btn-toggle'];
        const sidebarLinks = document.querySelectorAll(selectors
            .map(sel => `.sidebar ${sel}`).join(', '));
        const canvasLinks = document.querySelectorAll(selectors
            .map(sel => `.offcanvas ${sel}`).join(', '));

        const allLinks = [...sidebarLinks, ...canvasLinks];

        allLinks.forEach(link => {
            const href = link.getAttribute('href');
            const isActive = (route.route.includes(href) && href !== '/') ||
                (route.route === '/' && href === '/');
            link.classList.toggle('active', isActive);

            if (route.route === '/incomes' || route.route === '/expenses') {
                if (link.classList.contains('btn-toggle')) {
                    link.classList.add('active');
                }
            } else {
                link.classList.toggle('active', isActive);
            }
        });
    };
}