
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MsalModule, MsalService, MSAL_INSTANCE, MsalInterceptor, MsalGuard, MsalRedirectComponent } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType, BrowserCacheLocation } from '@azure/msal-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/home/navbar/navbar.component';
import { AppRoutingModule } from './app.routing';
import { ObterTodosComponent } from './components/admin/obter-todos/obter-todos.component';
import { CadastrarVersaoComponent } from './components/admin/cadastrar-versao/cadastrar-versao.component';
import { EditarVersaoComponent } from './components/admin/editar-versao/editar-versao.component';
import { LoginComponent } from './components/admin/login/login.component';

import { environment } from 'src/environments/environment';

function MSALInstanceFactory(): PublicClientApplication {
  return new PublicClientApplication({
      auth: {
          clientId: environment.azureAd.clientId,
          authority: environment.azureAd.instance + environment.azureAd.tenant,
          redirectUri: environment.azureAd.redirectUri
      },
      cache: {
          cacheLocation: BrowserCacheLocation.LocalStorage,
          storeAuthStateInCookie: true,
      }
  });
}


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ObterTodosComponent,
    CadastrarVersaoComponent,
    EditarVersaoComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MsalModule.forRoot(
      MSALInstanceFactory(), 
      {
          interactionType: InteractionType.Redirect, 
          authRequest: {
              scopes: ['User.Read']
          }
      },
      {
          interactionType: InteractionType.Redirect, 
          protectedResourceMap: new Map([
              ['https://graph.microsoft.com/v1.0/me', ['User.Read']]
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
  },
  MsalGuard
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }


//INDEX

<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Segurancaapp</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root></app-root>
</body>
</html>

    //ERRO COMPLETO

    main.ts:6 ERROR Error: The selector "app-redirect" did not match any elements
    at DefaultDomRenderer2.selectRootElement (platform-browser.mjs:576:19)
    at locateHostElement (core.mjs:10590:21)
    at ComponentFactory.create (core.mjs:12134:13)
    at ApplicationRef.bootstrap (core.mjs:25276:42)
    at core.mjs:24936:64
    at Array.forEach (<anonymous>)
    at PlatformRef._moduleDoBootstrap (core.mjs:24936:44)
    at core.mjs:24906:26
    at _ZoneDelegate.invoke (zone.js:375:26)
    at Object.onInvoke (core.mjs:24210:33)

main.ts:7 Error: The selector "app-redirect" did not match any elements
    at DefaultDomRenderer2.selectRootElement (platform-browser.mjs:576:19)
    at locateHostElement (core.mjs:10590:21)
    at ComponentFactory.create (core.mjs:12134:13)
    at ApplicationRef.bootstrap (core.mjs:25276:42)
    at core.mjs:24936:64
    at Array.forEach (<anonymous>)
    at PlatformRef._moduleDoBootstrap (core.mjs:24936:44)
    at core.mjs:24906:26
    at _ZoneDelegate.invoke (zone.js:375:26)
    at Object.onInvoke (core.mjs:24210:33)
app.component.ts:17 Inicializando MSAL...

    core.mjs:8400 ERROR Error: Uncaught (in promise): BrowserAuthError: interaction_in_progress: Interaction is currently in progress. Please ensure that this interaction has been completed before calling an interactive API.   For more visit: aka.ms/msaljs/browser-errors
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
    at StandardController.loginRedirect(StandardController.mjs: 1171: 12)

import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    constructor(private msalService: MsalService) { }

    ngOnInit(): void {
        // Processa o redirecionamento antes de qualquer outra interação
        this.msalService.instance.handleRedirectPromise().then((response) => {
            if (response) {
                console.log('Redirecionamento processado:', response);
            }
        }).catch((error) => {
            console.error('Erro ao processar redirecionamento:', error);
        });

        // Monitora o estado de interação para evitar chamadas concorrentes
        this.msalService.inProgress$.subscribe((status: InteractionStatus) => {
            console.log('Estado de interação:', status);
        });
    }
}

import { Component } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    interactionInProgress = false;

    constructor(private msalService: MsalService) { }

    login(): void {
        if (!this.interactionInProgress) {
            this.interactionInProgress = true; // Marca interação como em andamento
            this.msalService.loginRedirect().finally(() => {
                this.interactionInProgress = false; // Libera interação após conclusão
            });
        } else {
            console.log('Interação já está em andamento.');
        }
    }
}


﻿


export function MSALInstanceFactory(): PublicClientApplication {
    console.log('Inicializando PublicClientApplication...');
    return new PublicClientApplication({
        auth: {
            clientId: environment.azureAd.clientId,
            authority: environment.azureAd.instance + environment.azureAd.tenant,
            redirectUri: environment.azureAd.redirectUri
        },
        cache: {
            cacheLocation: BrowserCacheLocation.LocalStorage,
            storeAuthStateInCookie: true,
        }
    });
}


ngOnInit(): void {
    console.log('MSAL Instance:', this.msalService.instance);
}


import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    constructor(private msalService: MsalService) { }

    ngOnInit(): void {
        this.msalService.inProgress$.subscribe((status: InteractionStatus) => {
            console.log('Estado de interação atual:', status);
        });

        this.msalService.instance.handleRedirectPromise()
            .then((response) => {
                if (response) {
                    console.log('Redirecionamento processado:', response);
                }
            })
            .catch((error) => {
                console.error('Erro ao processar redirecionamento:', error);
            });
    }
}

./src/app/services/auth.service.ts:2:0-93 - Error: Module not found: Error: Package path ./dist/error/Bro
wserAuthErrorCodes is not exported from package D:\front-seguranca-app\segurancaapp\node_modules\@azure\m
sal-browser (see exports field in D:\front-seguranca-app\segurancaapp\node_modules\@azure\msal-browser\pa
ckage.json)



** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:
4200/ **


  Entrar
Estamos com problemas para fazer com que você entre.

AADSTS900023: Specified tenant identifier 'loc8q~1ncgbgtkx5ootq2jr.jvvq28pathncdbfi' is neither a valid DNS name, nor a valid external domain.
    
