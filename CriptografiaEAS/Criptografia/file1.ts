

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





3. Configuração no AppModule
Certifique - se de que o AppModule está configurado corretamente para usar o MSAL Angular:

typescript
Copiar código
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
Crie o componente de login com a lógica para gerenciar login e logout:

Arquivo login.component.ts
typescript
Copiar código
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
Copiar código
    < div * ngIf="isLoggedIn; else notLoggedIn" >
        <h2>Bem - vindo, {{ userName }}</h2>
            < button class="btn btn-danger"(click) = "logout()" > Logout < /button>
                < /div>

                < ng - template #notLoggedIn >
                    <button class="btn btn-primary"(click) = "login()" > Login com Microsoft < /button>
                        < /ng-template>
5. Processar Redirecionamento no AppComponent
No AppComponent, processaremos o redirecionamento e garantiremos que a aplicação está pronta para login:

Arquivo app.component.ts
typescript
Copiar código
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
                    console.log('Usuário logado:', response.account.username);
                }
            })
            .catch((error) => {
                console.error('Erro ao processar redirecionamento:', error);
            });
    }
}
6. Configuração de Rotas
Adicione as rotas para o LoginComponent no AppRoutingModule:

Arquivo app - routing.module.ts
typescript
Copiar código
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