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


import { IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
import { MsalModule, MsalService, MsalRedirectComponent, MsalInterceptor } from '@azure/msal-angular';

export const msalConfig = {
    auth: {
        clientId: '<YOUR_CLIENT_ID>', // Substitua pelo ID do aplicativo
        authority: 'https://login.microsoftonline.com/<YOUR_TENANT_ID>', // Substitua pelo ID do locatário
        redirectUri: 'http://localhost:4200', // Deve ser o mesmo do portal do Azure
    },
    cache: {
        cacheLocation: 'localStorage', // Use localStorage para persistir entre sessões
        storeAuthStateInCookie: false, // Ative se necessário para navegadores antigos
    },
};

@NgModule({
    declarations: [...],
    imports: [
        MsalModule.forRoot(new PublicClientApplication(msalConfig), null, null),
    ],
    providers: [...],
    bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule { }

