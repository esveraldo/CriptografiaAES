

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

ngOnInit(): void {
    console.log('Inicializando MSAL e processando redirecionamento...');
    this.msalService.instance.initialize()
        .then(() => {
            console.log('MSAL inicializado com sucesso.');
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
                console.log('Usuário autenticado:', response.account.username);
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
console.log('Contas disponíveis:', this.msalService.instance.getAllAccounts());


1. Verifique as Configurações no Azure AD
Certifique - se de que o aplicativo está configurado corretamente no Azure Active Directory(Azure AD) para permitir a persistência do cache.

1.1.Redirect URI
No portal do Azure, vá para Azure Active Directory > App registrations > Selecione seu aplicativo.
Na aba Authentication:
Verifique se o Redirect URI está configurado e corresponde exatamente ao que está no código:
Para desenvolvimento: http://localhost:4200.
Para produção: https://seu-dominio.com.
Certifique - se de que o tipo de plataforma está definido como Single Page Application(SPA).
1.2.Tipos de Contas Suportadas
No registro do aplicativo, confira os tipos de contas suportadas:

Single tenant(Accounts in this organizational directory only): Permite apenas contas da organização do diretório.
    Multi - tenant(Accounts in any organizational directory): Permite contas de múltiplos diretórios do Azure AD.
        Multi - tenant + Personal Microsoft Accounts: Permite contas de múltiplos diretórios e contas pessoais(ex.: @outlook.com, @hotmail.com).
1.3.Permissões de API
Certifique - se de que as permissões necessárias foram adicionadas:

Na aba API Permissions, adicione as seguintes permissões:
Microsoft Graph > Delegated permissions:
User.Read(necessário para acessar informações do usuário).
email, profile(se precisar de mais informações do usuário).
Após adicionar as permissões, clique em Grant admin consent para garantir que os usuários tenham acesso.
1.4.Configuração de Tokens
Na aba Token configuration:

Adicione os claims opcionais:
email
given_name
family_name
Certifique - se de que os ID Tokens estão habilitados:
No arquivo Manifest, verifique se idToken está configurado como true.


     ! [rejected]        feature/v1.0.0 -> feature/v1.0.0 (non-fast-forward)
error: failed to push some refs to 'https://github.com/Org-Banco-Master/seguranca-app.git'


ERROR: failed to solve: process "/bin/sh -c npm run build:${EKS_ENV}" did not complete successfully: exit code: 127




Configurar um HttpInterceptor para Capturar o Token:
Crie um interceptor para capturar o header de autenticação.

Exemplo de Interceptor:

import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            tap((event) => {
                if (event instanceof HttpResponse) {
                    // Capturar o header com o token ou informações de autenticação
                    const authHeader = event.headers.get('Authorization');
                    if (authHeader) {
                        const token = authHeader.split(' ')[1]; // Assumindo o formato "Bearer <token>"
                        sessionStorage.setItem('accessToken', token); // Armazenar o token
                    }
                }
            })
        );
    }
}

No app.module.ts, adicione o interceptor como provedor:


import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';

@NgModule({
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
    ],
})
export class AppModule { }

2. Exibir o Usuário Logado
Depois de capturar e armazenar o token, use o MsalService para obter os dados do usuário.

    Exemplo:


import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Component({
    selector: 'app-root',
    template: `
    <div *ngIf="isLoggedIn">
      <p>Bem-vindo, {{ userName }}</p>
      <button (click)="logout()">Logout</button>
    </div>
    <div *ngIf="!isLoggedIn">
      <button (click)="login()">Login</button>
    </div>
  `,
})
export class AppComponent implements OnInit {
    isLoggedIn = false;
    userName = '';

    constructor(private authService: MsalService) { }

    ngOnInit() {
        this.authService.instance.handleRedirectPromise().then(() => {
            const account = this.authService.instance.getActiveAccount();
            if (account) {
                this.isLoggedIn = true;
                this.userName = account.name || account.username; // Nome do usuário
            }
        });
    }

    login() {
        this.authService.loginRedirect();
    }

    logout() {
        this.authService.logoutRedirect();
    }
}


Importar e Configurar MsalGuard no Módulo:

import { MsalGuardConfiguration, MSAL_GUARD_CONFIG, MsalGuard } from '@azure/msal-angular';

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
    return {
        interactionType: InteractionType.Redirect, // Tipo de interação
        authRequest: {
            scopes: ['user.read'], // Escopos necessários
        },
    };
}

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    providers: [
        {
            provide: MSAL_GUARD_CONFIG,
            useFactory: MSALGuardConfigFactory,
        },
    ],
})
export class AppRoutingModule { }


4. Validação do Token
Antes de liberar as rotas protegidas, você pode validar o token armazenado no sessionStorage.

Validação Simples:

import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    isAuthenticated(): boolean {
        const token = sessionStorage.getItem('accessToken');
        if (!token) return false;

        // Opcional: Decodificar e validar o token (expiração, etc.)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isTokenValid = payload && new Date(payload.exp * 1000) > new Date();

        return isTokenValid;
    }
}

Usar o Serviço no Guard:


import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService) { }

    canActivate(): boolean {
        return this.authService.isAuthenticated();
    }
}

5. Armazenar e Gerenciar Sessão
Certifique - se de que:

O accessToken está armazenado no sessionStorage:
typescript
Copiar código
sessionStorage.setItem('accessToken', token);
O logout limpa o sessionStorage:
typescript
Copiar código
sessionStorage.clear();




