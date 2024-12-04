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
