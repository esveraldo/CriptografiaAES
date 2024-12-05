import { Component } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';

@Component({
    selector: 'app-login',
    template: `
    <div *ngIf="isLoggedIn; else notLoggedIn">
      <h1>Bem-vindo, {{ userName }}</h1>
      <button (click)="logout()">Logout</button>
    </div>

    <ng-template #notLoggedIn>
      <h1>Você não está logado</h1>
      <button (click)="login()">Login</button>
    </ng-template>
  `,
})
export class LoginComponent {
    isLoggedIn = false;
    userName: string | undefined;

    constructor(private authService: MsalService) { }

    login(): void {
        this.authService.loginPopup().then((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account); // Define a conta ativa
            this.updateUserStatus();
        }).catch(error => {
            console.error('Erro ao realizar login:', error);
        });
    }

    logout(): void {
        this.authService.logoutPopup().then(() => {
            this.isLoggedIn = false;
            this.userName = undefined;
        }).catch(error => {
            console.error('Erro ao realizar logout:', error);
        });
    }

    private updateUserStatus(): void {
        const account = this.authService.instance.getActiveAccount();
        if (account) {
            this.isLoggedIn = true;
            this.userName = account.name || account.username;
        }
    }
}
