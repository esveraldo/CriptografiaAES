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



import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { MsalRedirectComponent, MsalModule, provideMsal } from '@azure/msal-angular';
import { PublicClientApplication } from '@azure/msal-browser';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule.forRoot([]), // Adicione suas rotas
        MsalModule, // Adiciona o MSAL Angular ao projeto
    ],
    providers: [
        provideMsal({
            config: {
                auth: {
                    clientId: '<YOUR_CLIENT_ID>', // Substitua pelo ID do cliente registrado no Azure AD
                    authority: 'https://login.microsoftonline.com/<YOUR_TENANT_ID>', // Substitua pelo locatário ou use "common" para multi-tenant
                    redirectUri: 'http://localhost:4200', // Certifique-se de que está registrado no Azure AD
                },
                cache: {
                    cacheLocation: 'localStorage', // Armazena tokens no localStorage
                    storeAuthStateInCookie: true, // Necessário para navegadores antigos
                },
            },
        }),
    ],
    bootstrap: [AppComponent, MsalRedirectComponent], // Adicione o MsalRedirectComponent ao bootstrap
})
export class AppModule { }

/*

 <div class="col-md-3">
                    <div formGroupName="outOfService">
                      <label class="form-label">OutOfService. DefaultValue:</label>
                      <textarea formControlName="defaultValue" class="form-control" rows="3"></textarea>
                      <div *ngIf="formCadastroVersao.get('outOfService.defaultValue')?.touched && formCadastroVersao.get('outOfService.defaultValue')?.invalid">
                        <small class="text-danger" *ngIf="formCadastroVersao.get('outOfService.defaultValue')?.hasError('required')">
                          O campo OutOfService DefaultValue é requerido.
                        </small>
                      </div>
                    </div>
                  </div>


*/
