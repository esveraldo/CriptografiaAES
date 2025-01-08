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

 <form [formGroup]="formCadastroVersao" (ngSubmit)="onSubmit()">
  <div formGroupName="appStoreUrl">
    <label for="defaultValue">App Store URL (Default Value):</label>
    <input
      id="defaultValue"
      formControlName="defaultValue"
      class="form-control"
      placeholder="Digite o valor padrão"
    />
    <div *ngIf="formCadastroVersao.get('appStoreUrl.defaultValue')?.touched && formCadastroVersao.get('appStoreUrl.defaultValue')?.invalid">
      <small class="text-danger" *ngIf="formCadastroVersao.get('appStoreUrl.defaultValue')?.hasError('required')">
        Este campo é obrigatório.
      </small>
      <small class="text-danger" *ngIf="formCadastroVersao.get('appStoreUrl.defaultValue')?.hasError('minlength')">
        O valor deve ter no mínimo 5 caracteres.
      </small>
    </div>
  </div>

  <div>
    <label for="nome">Nome:</label>
    <input
      id="nome"
      formControlName="nome"
      class="form-control"
      placeholder="Digite o nome"
    />
    <div *ngIf="formCadastroVersao.get('nome')?.touched && formCadastroVersao.get('nome')?.invalid">
      <small class="text-danger" *ngIf="formCadastroVersao.get('nome')?.hasError('required')">
        O nome é obrigatório.
      </small>
    </div>
  </div>

  <div>
    <label for="versao">Versão:</label>
    <input
      id="versao"
      formControlName="versao"
      class="form-control"
      placeholder="Ex: 1.0.0"
    />
    <div *ngIf="formCadastroVersao.get('versao')?.touched && formCadastroVersao.get('versao')?.invalid">
      <small class="text-danger" *ngIf="formCadastroVersao.get('versao')?.hasError('required')">
        A versão é obrigatória.
      </small>
      <small class="text-danger" *ngIf="formCadastroVersao.get('versao')?.hasError('pattern')">
        A versão deve estar no formato 1.0.0.
      </small>
    </div>
  </div>

  <button type="submit" class="btn btn-primary" [disabled]="formCadastroVersao.invalid">
    Enviar
  </button>
</form>


*/
