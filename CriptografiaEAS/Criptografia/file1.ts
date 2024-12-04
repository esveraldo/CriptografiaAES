[webpack-dev-server] Server started: Hot Module Replacement disabled, Live Reloading enabled, Progress disabled, Overlay enabled.
app.module.ts:34 MSAL Log [Verbose]: [Wed, 04 Dec 2024 16:22:55 GMT] : [] : @azure/msal-browser@3.27.0 : Verbose - Event callback registered with id: 0193927b-502b-7ea4-96c1-e0dce4eee54e
app.component.ts:16 Inicializando MSAL e processando redirecionamento...
app.module.ts:34 MSAL Log [Verbose]: [Wed, 04 Dec 2024 16:22:55 GMT] : [] : @azure/msal-browser@3.27.0 : Verbose - Emitting event to callback 0193927b-502b-7ea4-96c1-e0dce4eee54e: msal:initializeStart
app.module.ts:34 MSAL Log [Verbose]: [Wed, 04 Dec 2024 16:22:55 GMT] : [] : @azure/msal-browser@3.27.0 : Verbose - Claims-based caching is disabled. Clearing the previous cache with claims
app.module.ts:34 MSAL Log [Verbose]: [Wed, 04 Dec 2024 16:22:55 GMT] : [] : @azure/msal-browser@3.27.0 : Verbose - BrowserCacheManager.getTokenKeys - No token keys found
core.mjs:23480 Angular is running in development mode. Call enableProdMode() to enable production mode.
app.module.ts:34 MSAL Log [Verbose]: [Wed, 04 Dec 2024 16:22:55 GMT] : [] : @azure/msal-browser@3.27.0 : Verbose - Emitting event to callback 0193927b-502b-7ea4-96c1-e0dce4eee54e: msal:initializeEnd
app.component.ts:19 MSAL inicializado com sucesso.
app.module.ts:34 MSAL Log [Verbose]: [Wed, 04 Dec 2024 16:22:55 GMT] : [] : @azure/msal-browser@3.27.0 : Verbose - handleRedirectPromise called
app.module.ts:34 MSAL Log [Verbose]: [Wed, 04 Dec 2024 16:22:55 GMT] : [] : @azure/msal-browser@3.27.0 : Verbose - getAllAccounts called
app.module.ts:34 MSAL Log [Verbose]: [Wed, 04 Dec 2024 16:22:55 GMT] : [] : @azure/msal-browser@3.27.0 : Verbose - BrowserCacheManager.getAccountKeys - No account keys found
app.module.ts:34 MSAL Log [Verbose]: [Wed, 04 Dec 2024 16:22:55 GMT] : [] : @azure/msal-browser@3.27.0 : Verbose - Emitting event to callback 0193927b-502b-7ea4-96c1-e0dce4eee54e: msal:handleRedirectStart
app.module.ts:34 MSAL Log [Verbose]: [Wed, 04 Dec 2024 16:22:55 GMT] : [] : @azure/msal-angular@3.1.0 : Verbose - BroadcastService - msal:handleRedirectStart results in setting inProgress from startup to handleRedirect
app.module.ts:34 MSAL Log [Verbose]: [Wed, 04 Dec 2024 16:22:55 GMT] : [0193927b-5047-7de1-a5be-ea0f3a7604e5] : msal.js.browser@3.27.0 : Verbose - initializeServerTelemetryManager called
app.module.ts:34 MSAL Log [Info]: [Wed, 04 Dec 2024 16:22:55 GMT] : [0193927b-5047-7de1-a5be-ea0f3a7604e5] : msal.js.browser@3.27.0 : Info - handleRedirectPromise called but there is no interaction in progress, returning null.
app.module.ts:34 MSAL Log [Verbose]: [Wed, 04 Dec 2024 16:22:55 GMT] : [] : @azure/msal-browser@3.27.0 : Verbose - handleRedirectPromise has been called for the first time, storing the promise
app.module.ts:34 MSAL Log [Verbose]: [Wed, 04 Dec 2024 16:22:55 GMT] : [] : @azure/msal-browser@3.27.0 : Verbose - Emitting event to callback 0193927b-502b-7ea4-96c1-e0dce4eee54e: msal:handleRedirectEnd
app.module.ts:34 MSAL Log [Verbose]: [Wed, 04 Dec 2024 16:22:55 GMT] : [] : @azure/msal-angular@3.1.0 : Verbose - BroadcastService - msal:handleRedirectEnd results in setting inProgress from handleRedirect to none
app.module.ts:34 MSAL Log [Verbose]: [Wed, 04 Dec 2024 16:22:55 GMT] : [] : @azure/msal-browser@3.27.0 : Verbose - getAllAccounts called
app.module.ts: 34 MSAL Log[Verbose]: [Wed, 04 Dec 2024 16: 22: 55 GMT] : [] : @azure/msal-browser@3.27.0 : Verbose - BrowserCacheManager.getAccountKeys - No account keys found

import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    isLoggedIn = false;

    constructor(private authService: MsalService) { }

    ngOnInit(): void {
        this.authService.instance.handleRedirectPromise().then((response: AuthenticationResult | null) => {
            if (response) {
                this.authService.instance.setActiveAccount(response.account);
                console.log('Autenticação concluída:', response);
                this.isLoggedIn = true;
            } else {
                const account = this.authService.instance.getActiveAccount();
                this.isLoggedIn = !!account;
            }
        }).catch(error => {
            console.error('Erro ao processar o redirecionamento:', error);
        });
    }
}

app.component.ts: 31 Nenhuma conta encontrada no cache.

`
    <div *ngIf="isLoggedIn; else loginTemplate">
      <h1>Bem-vindo, {{ userName }}</h1>
      <button (click)="logout()">Logout</button>
    </div>

    <ng-template #loginTemplate>
      <h1>Você não está logado</h1>
      <button (click)="login()">Login</button>
    </ng-template>
  `,


    login() {
    this.authService.loginRedirect();
}

logout() {
    this.authService.logoutRedirect();
    this.isLoggedIn = false;
}

  private updateUserStatus() {
    const account = this.authService.instance.getActiveAccount();
    if (account) {
        this.isLoggedIn = true;
        this.userName = account.name || account.username;
    }
}
}




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
        this.authService.loginPopup().toPromise().then((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account); // Define a conta ativa
            this.updateUserStatus();
        }).catch(error => {
            console.error('Erro ao realizar login:', error);
        });
    }

    logout(): void {
        this.authService.logoutPopup().toPromise().then(() => {
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





Argument of type '(response: AuthenticationResult) => void' is not assignable to parameter of type '(value: AuthenticationResult | undefined) => void | PromiseLike<void>'.
  Types of parameters 'response' and 'value' are incompatible.
    Type 'AuthenticationResult | undefined' is not assignable to type 'AuthenticationResult'.
      Type 'undefined' is not assignable to type 'AuthenticationResult'.
        Type 'undefined' is not assignable to type 'AuthenticationResult'.ts(2345)
