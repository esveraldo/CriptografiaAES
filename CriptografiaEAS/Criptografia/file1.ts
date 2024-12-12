import { Component, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';

@Component({
  selector: 'app-root',
  template: `
    <app-navbar></app-navbar>
    <div *ngIf="isLoggedIn; else notLoggedIn">
      <button class="btn no-color" (click)="logout()">Sair do sistema</button>
    </div>

    <ng-template #notLoggedIn>
        <div class="d-flex justify-content-center align-items-center" style="height: 100vh;">
            <button class="btn btn-primary btn-lg" style="background-color: #00305B;" (click)="login()"> Entrar no sistema Segurança App. </button>
        </div>
    </ng-template>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    isLoggedIn = false;
    userName: string | undefined;

    constructor(private authService: MsalService) { }

    ngOnInit(): void {
        this.authService.instance.initialize();
        this.authService.instance.handleRedirectPromise().then((response: AuthenticationResult | null) => {
            if (response) {
                this.authService.instance.setActiveAccount(response.account);
                console.log('Autenticação concluída:', response);
                this.isLoggedIn = true;
                this.userName = response.account.name || response.account.username;
            } else {
                const account = this.authService.instance.getActiveAccount();
                this.isLoggedIn = !!account;
            }
        }).catch(error => {
            console.error('Erro ao processar o redirecionamento:', error);
        });
    }

    login(): void {
      
        this.authService.loginRedirect({
          scopes: ['User.Read'],
        });
                            
      }
    
        logout(): void {
            this.authService.logoutRedirect();
        }
}
