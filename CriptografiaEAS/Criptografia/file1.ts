import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    isLoggedIn: boolean = false; // Estado de autenticação
    userName: string | undefined; // Nome do usuário autenticado

    constructor(private authService: MsalService) { }

    ngOnInit(): void {
        this.updateUserStatus(); // Atualiza o estado do usuário ao iniciar o componente
    }

    login(): void {
        this.authService.loginPopup()
            .then((response: AuthenticationResult) => {
                if (response?.account) {
                    this.authService.instance.setActiveAccount(response.account); // Define a conta ativa
                    this.updateUserStatus(); // Atualiza o estado do usuário
                }
            })
            .catch((error) => {
                console.error('Erro ao realizar login:', error);
            });
    }

    logout(): void {
        this.authService.logoutPopup()
            .then(() => {
                this.isLoggedIn = false; // Atualiza o estado para deslogado
                this.userName = undefined;
            })
            .catch((error) => {
                console.error('Erro ao realizar logout:', error);
            });
    }

    private updateUserStatus(): void {
        const account = this.authService.instance.getActiveAccount();
        if (account) {
            this.isLoggedIn = true;
            this.userName = account.name || account.username; // Define o nome do usuário logado
        } else {
            this.isLoggedIn = false;
        }
    }
}

loginPopup(request ?: PopupRequest): Promise<AuthenticationResult | undefined>;
logoutPopup(request ?: EndSessionPopupRequest): Promise<void>;

import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private msalService: MsalService) { }

    login(): Promise<AuthenticationResult | undefined> {
        return this.msalService.loginPopup();
    }

    logout(): Promise<void> {
        return this.msalService.logoutPopup();
    }

    getActiveAccount() {
        return this.msalService.instance.getActiveAccount();
    }
}


constructor(private authService: AuthService) { }

login(): void {
    this.authService.login().then((response) => {
        if (response?.account) {
            this.authService.setActiveAccount(response.account);
        }
    });
}

logout(): void {
    this.authService.logout();
}

    < div >
    <ng-container * ngIf="isLoggedIn; else loginTemplate" >
        <h1>Bem - vindo, {{ userName }}</h1>
            < button(click)="logout()" > Logout < /button>
                < /ng-container>

                < ng - template #loginTemplate >
                    <h1>Você não está logado < /h1>
                        < button(click)="login()" > Login com a Microsoft < /button>
                            < /ng-template>
                            < /div>


