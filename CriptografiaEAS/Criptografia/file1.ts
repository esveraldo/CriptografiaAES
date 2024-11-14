//npm install @azure/msal-angular @azure/msal - browser

//Configurar o MSAL no Angular

import { MsalModule, MsalService, MSAL_INSTANCE, MsalInterceptor, MsalGuard } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType, BrowserCacheLocation } from '@azure/msal-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

function MSALInstanceFactory(): PublicClientApplication {
    return new PublicClientApplication({
        auth: {
            clientId: 'YOUR_CLIENT_ID', // substitua pelo seu Client ID
            authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID', // substitua pelo seu Tenant ID
            redirectUri: 'http://localhost:4200', // substitua pela URL de redirecionamento
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
        // Outros componentes
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        MsalModule.forRoot({
            instance: MSALInstanceFactory(),
            interactionType: InteractionType.Redirect, // Define se será popup ou redirecionamento
            authRequest: {
                scopes: ['User.Read'] // Scopes para autorização
            }
        }),
        // Outros módulos
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
    bootstrap: [AppComponent]
})
export class AppModule { }

//Adicionar Rotas Protegidas com MsalGuard

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

const routes: Routes = [
    { path: 'perfil', component: ProfileComponent, canActivate: [MsalGuard] },
    // Outras rotas
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

//Autenticar o Usuário no Componente

import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'angular-msal';
    profile: any;

    constructor(private msalService: MsalService, private http: HttpClient) { }

    ngOnInit() {
        this.msalService.instance.handleRedirectPromise().then((response) => {
            if (response) {
                this.getProfile();
            } else if (this.msalService.instance.getAllAccounts().length > 0) {
                this.getProfile();
            }
        });
    }

    login() {
        this.msalService.loginRedirect();
    }

    logout() {
        this.msalService.logoutRedirect();
    }

    getProfile() {
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.msalService.instance.getActiveAccount()?.idToken}`
        };

        this.http.get('https://graph.microsoft.com/v1.0/me', { headers }).subscribe((profile) => {
            this.profile = profile;
        });
    }
}

//Interface de Autenticação no HTML

<div * ngIf="profile; else loggedOut" >
    <h2>Welcome, {{ profile.displayName }}</h2>
        < button(click)="logout()" > Logout < /button>
            < /div>
            < ng - template #loggedOut >
                <button (click)="login()" > Login with Microsoft < /button>
                < /ng-template>








