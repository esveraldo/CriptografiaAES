

ERROR Error: Uncaught (in promise): BrowserAuthError: interaction_in_progress: Interaction is currently in progress. Please ensure that this interaction has been completed before calling an interactive API.   For more visit: aka.ms/msaljs/browser-errors
BrowserAuthError: interaction_in_progress: Interaction is currently in progress. Please ensure that this interaction has been completed before calling an interactive API.   For more visit: aka.ms/msaljs/browser-errors
    at createBrowserAuthError (BrowserAuthError.mjs:271:12)
    at BrowserCacheManager.setInteractionInProgress (BrowserCacheManager.mjs:1176:45)
    at StandardController.mjs:337:33
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (asyncToGenerator.js:3:1)
    at _next (asyncToGenerator.js:22:1)
    at asyncToGenerator.js:27:1
    at new ZoneAwarePromise (zone.js:1432:21)
    at asyncToGenerator.js:19:1
    at StandardController.acquireTokenRedirect (StandardController.mjs:380:10)
    at createBrowserAuthError (BrowserAuthError.mjs:271:12)
    at BrowserCacheManager.setInteractionInProgress (BrowserCacheManager.mjs:1176:45)
    at StandardController.mjs:337:33
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (asyncToGenerator.js:3:1)
    at _next (asyncToGenerator.js:22:1)
    at asyncToGenerator.js:27:1
    at new ZoneAwarePromise (zone.js:1432:21)
    at asyncToGenerator.js:19:1
    at StandardController.acquireTokenRedirect (StandardController.mjs:380:10)
    at resolvePromise (zone.js:1214:31)
    at resolvePromise (zone.js:1168:17)
    at zone.js:1121:17
    at zone.js:1137:33
    at asyncGeneratorStep (asyncToGenerator.js:10:1)
    at _next (asyncToGenerator.js:22:1)
    at asyncToGenerator.js:27:1
    at new ZoneAwarePromise (zone.js:1432:21)
    at asyncToGenerator.js:19:1
    at StandardController.loginRedirect (StandardController.mjs:1171:12)


Erro ao processar redirecionamento: BrowserAuthError: uninitialized_public_client_application: You must call and await the initialize function before attempting to call any other MSAL API.  For more visit: aka.ms/msaljs/browser-errors
    at createBrowserAuthError (BrowserAuthError.mjs:271:12)
    at blockAPICallsBeforeInitialize (BrowserUtils.mjs:112:37)
    at StandardController.mjs:185:38
    at Generator.next (<anonymous>)
    at asyncGeneratorStep (asyncToGenerator.js:3:1)
    at _next (asyncToGenerator.js:22:1)
    at asyncToGenerator.js:27:1
    at new ZoneAwarePromise (zone.js:1432:21)
    at asyncToGenerator.js:19:1
    at StandardController.handleRedirectPromise(StandardController.mjs: 205: 21)





3. Configura��o no AppModule
Certifique - se de que o AppModule est� configurado corretamente para usar o MSAL Angular:

typescript
Copiar c�digo
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';

import { MsalModule, MsalService, MSAL_INSTANCE, MsalInterceptor } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType, BrowserCacheLocation } from '@azure/msal-browser';

import { environment } from '../environments/environment';

export function MSALInstanceFactory(): PublicClientApplication {
    return new PublicClientApplication({
        auth: {
            clientId: environment.azureAd.clientId,
            authority: `${environment.azureAd.instance}${environment.azureAd.tenant}`,
            redirectUri: environment.azureAd.redirectUri
        },
        cache: {
            cacheLocation: BrowserCacheLocation.LocalStorage,
            storeAuthStateInCookie: true
        }
    });
}

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        MsalModule.forRoot(
            MSALInstanceFactory(),
            {
                interactionType: InteractionType.Redirect,
                authRequest: {
                    scopes: environment.azureAd.scopes
                }
            },
            {
                interactionType: InteractionType.Redirect,
                protectedResourceMap: new Map([
                    ['https://graph.microsoft.com/v1.0/me', environment.azureAd.scopes]
                ])
            }
        )
    ],
    providers: [
        {
            provide: MSAL_INSTANCE,
            useFactory: MSALInstanceFactory
        },
        MsalService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: MsalInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
4. Componente de Login
LoginComponent
Crie o componente de login com a l�gica para gerenciar login e logout:

Arquivo login.component.ts
typescript
Copiar c�digo
import { Component } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    isLoggedIn = false;
    userName: string | null = null;

    constructor(private msalService: MsalService) { }

    ngOnInit(): void {
        const account = this.msalService.instance.getActiveAccount();
        this.isLoggedIn = !!account;
        this.userName = account?.username || null;
    }

    login(): void {
        this.msalService.loginRedirect();
    }

    logout(): void {
        this.msalService.logoutRedirect();
    }
}
HTML para LoginComponent
Crie o arquivo login.component.html:

html
Copiar c�digo
    < div * ngIf="isLoggedIn; else notLoggedIn" >
        <h2>Bem - vindo, {{ userName }}</h2>
            < button class="btn btn-danger"(click) = "logout()" > Logout < /button>
                < /div>

                < ng - template #notLoggedIn >
                    <button class="btn btn-primary"(click) = "login()" > Login com Microsoft < /button>
                        < /ng-template>
5. Processar Redirecionamento no AppComponent
No AppComponent, processaremos o redirecionamento e garantiremos que a aplica��o est� pronta para login:

Arquivo app.component.ts
typescript
Copiar c�digo
import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Component({
    selector: 'app-root',
    template: '<router-outlet></router-outlet>',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    constructor(private msalService: MsalService) { }

    ngOnInit(): void {
        console.log('Processando redirecionamento...');
        this.msalService.instance.handleRedirectPromise()
            .then((response) => {
                if (response?.account) {
                    this.msalService.instance.setActiveAccount(response.account);
                    console.log('Usu�rio logado:', response.account.username);
                }
            })
            .catch((error) => {
                console.error('Erro ao processar redirecionamento:', error);
            });
    }
}
6. Configura��o de Rotas
Adicione as rotas para o LoginComponent no AppRoutingModule:

Arquivo app - routing.module.ts
typescript
Copiar c�digo
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

ngOnInit(): void {
    console.log('Inicializando MSAL e processando redirecionamento...');
    this.msalService.instance.initialize()
        .then(() => {
            console.log('MSAL inicializado com sucesso.');
            this.msalService.instance.handleRedirectPromise()
                .then((response) => {
                    if (response?.account) {
                        this.msalService.instance.setActiveAccount(response.account);
                        console.log('Usu�rio logado:', response.account.username);
                    }
                })
                .catch((error) => {
                    console.error('Erro ao processar redirecionamento:', error);
                });
        })
        .catch((error) => {
            console.error('Erro ao inicializar MSAL:', error);
        });
}
}



                    ,
system: {
    loggerOptions: {
        loggerCallback: (level, message, containsPii) => {
            if (containsPii) return;
            console.log(`MSAL Log [${LogLevel[level]}]: ${message}`);
        },
            logLevel: LogLevel.Verbose,
                piiLoggingEnabled: false,
      }
}
  });
}

ngOnInit(): void {
    console.log('Inicializando MSAL e processando redirecionamento...');

    this.msalService.instance.handleRedirectPromise()
        .then((response) => {
            if (response?.account) {
                this.msalService.instance.setActiveAccount(response.account);
                console.log('Usu�rio autenticado:', response.account.username);
            } else {
                const cachedAccount = this.msalService.instance.getAllAccounts()[0];
                if (cachedAccount) {
                    this.msalService.instance.setActiveAccount(cachedAccount);
                    console.log('Conta restaurada do cache:', cachedAccount.username);
                } else {
                    console.log('Nenhuma conta encontrada no cache.');
                }
            }
        })
        .catch((error) => {
            console.error('Erro ao processar redirecionamento:', error);
        });
}
}

console.log('Estado do Cache:', this.msalService.instance.getActiveAccount());
console.log('Contas dispon�veis:', this.msalService.instance.getAllAccounts());


1. Verifique as Configura��es no Azure AD
Certifique - se de que o aplicativo est� configurado corretamente no Azure Active Directory(Azure AD) para permitir a persist�ncia do cache.

1.1.Redirect URI
No portal do Azure, v� para Azure Active Directory > App registrations > Selecione seu aplicativo.
Na aba Authentication:
Verifique se o Redirect URI est� configurado e corresponde exatamente ao que est� no c�digo:
Para desenvolvimento: http://localhost:4200.
Para produ��o: https://seu-dominio.com.
Certifique - se de que o tipo de plataforma est� definido como Single Page Application(SPA).
1.2.Tipos de Contas Suportadas
No registro do aplicativo, confira os tipos de contas suportadas:

Single tenant(Accounts in this organizational directory only): Permite apenas contas da organiza��o do diret�rio.
    Multi - tenant(Accounts in any organizational directory): Permite contas de m�ltiplos diret�rios do Azure AD.
        Multi - tenant + Personal Microsoft Accounts: Permite contas de m�ltiplos diret�rios e contas pessoais(ex.: @outlook.com, @hotmail.com).
1.3.Permiss�es de API
Certifique - se de que as permiss�es necess�rias foram adicionadas:

Na aba API Permissions, adicione as seguintes permiss�es:
Microsoft Graph > Delegated permissions:
User.Read(necess�rio para acessar informa��es do usu�rio).
email, profile(se precisar de mais informa��es do usu�rio).
Ap�s adicionar as permiss�es, clique em Grant admin consent para garantir que os usu�rios tenham acesso.
1.4.Configura��o de Tokens
Na aba Token configuration:

Adicione os claims opcionais:
email
given_name
family_name
Certifique - se de que os ID Tokens est�o habilitados:
No arquivo Manifest, verifique se idToken est� configurado como true.