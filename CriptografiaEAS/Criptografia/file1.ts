import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';

@Component({
    selector: 'app-root',
    template: `
    <button *ngIf="!isLoggedIn" (click)="login()">Entrar</button>
    <button *ngIf="isLoggedIn" (click)="logout()">Sair</button>
    <p *ngIf="isLoggedIn">Bem-vindo, {{ userName }}</p>
  `,
})
export class AppComponent implements OnInit {
    isLoggedIn = false;
    userName: string | undefined;

    constructor(private authService: MsalService) { }

    ngOnInit(): void {
        this.authService.instance.handleRedirectPromise().then((response: AuthenticationResult | null) => {
            if (response) {
                this.authService.instance.setActiveAccount(response.account);
            }
            this.setLoginState();
        });
    }

    login(): void {
        this.authService.loginRedirect({
            scopes: ['User.Read'], // Substitua pelos escopos necessários
        });
    }

    logout(): void {
        this.authService.logoutRedirect();
    }

    private setLoginState(): void {
        const account = this.authService.instance.getActiveAccount();
        this.isLoggedIn = !!account;
        if (account) {
            this.userName = account.name || account.username;
        }
    }
}
