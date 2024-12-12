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
        this.authService.instance.handleRedirectPromise()
            .then((response: AuthenticationResult | null) => {
                if (response) {
                    console.log('Autenticação concluída:', response);
                    this.authService.instance.setActiveAccount(response.account);
                    this.isLoggedIn = true;
                    this.userName = response.account?.name || response.account?.username;
                } else {
                    console.log('Nenhum resultado de redirecionamento, verificando contas ativas...');
                    const account = this.authService.instance.getActiveAccount();
                    if (account) {
                        console.log('Conta ativa encontrada:', account);
                        this.isLoggedIn = true;
                        this.userName = account.name || account.username;
                    } else {
                        console.log('Nenhuma conta ativa encontrada.');
                        this.isLoggedIn = false;
                    }
                }
            })
            .catch(error => {
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



import { MsalModule, MsalInterceptorConfiguration, MsalGuardConfiguration } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';

const msalConfig = {
    auth: {
        clientId: '<YOUR_CLIENT_ID>',
        authority: 'https://login.microsoftonline.com/<YOUR_TENANT_ID>',
        redirectUri: 'http://localhost:4200', // Certifique-se de que o redirectUri está correto
    }
};

@NgModule({
    imports: [
        MsalModule.forRoot(new PublicClientApplication(msalConfig), {
            interactionType: InteractionType.Redirect,
        })
    ],
    providers: [],
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MsalRedirectComponent, MsalModule, provideMsal } from '@azure/msal-angular';
import { PublicClientApplication } from '@azure/msal-browser';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot([]),
        HttpClientModule,
        MsalModule,
    ],
    providers: [
        provideMsal({
            config: {
                auth: {
                    clientId: '<YOUR_CLIENT_ID>', // Substitua pelo ID do cliente
                    authority: 'https://login.microsoftonline.com/<YOUR_TENANT_ID>', // Substitua pelo ID do locatário
                    redirectUri: 'http://localhost:4200', // Certifique-se de que este URI está registrado no Azure AD
                },
            },
        }),
    ],
    bootstrap: [AppComponent, MsalRedirectComponent], // MsalRedirectComponent é necessário para o redirecionamento
})
export class AppModule { }
