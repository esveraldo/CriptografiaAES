//npm install @azure/msal-angular @azure/msal - browser


//MODULE

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MsalModule, MsalService, MSAL_INSTANCE, MsalInterceptor, MsalGuard, MsalBroadcastService } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType, BrowserCacheLocation } from '@azure/msal-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

function MSALInstanceFactory(): PublicClientApplication {
    return new PublicClientApplication({
        auth: {
            clientId: 'YOUR_CLIENT_ID', // Substitua pelo seu Client ID do Azure AD
            authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID', // Substitua pelo Tenant ID
            redirectUri: 'http://localhost:4200' // URL de redirecionamento
        },
        cache: {
            cacheLocation: BrowserCacheLocation.LocalStorage,
            storeAuthStateInCookie: true,
        }
    });
}

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        MsalModule.forRoot(
            MSALInstanceFactory(), // Instância da fábrica
            {
                interactionType: InteractionType.Redirect, // Ou Popup, dependendo da preferência
                authRequest: {
                    scopes: ['User.Read'] // Scopes do Microsoft Graph
                }
            },
            {
                interactionType: InteractionType.Redirect, // Ou Popup
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
        MsalBroadcastService,
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

//SERVICE

import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo } from '@azure/msal-browser';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private msalService: MsalService) { }

    // Método para login
    login(): void {
        this.msalService.loginRedirect({
            scopes: ['User.Read'], // Escopos de acesso
        });
    }

    // Método para logout
    logout(): void {
        this.msalService.logoutRedirect();
    }

    // Método para obter informações do usuário autenticado
    getUserInfo(): AccountInfo | null {
        const accounts = this.msalService.instance.getAllAccounts();
        return accounts.length > 0 ? accounts[0] : null;
    }

    // Método para obter o token de acesso
    async getAccessToken(): Promise<string | null> {
        const account = this.getUserInfo(); // Verifica se há um usuário autenticado

        if (!account) {
            console.warn('Nenhum usuário autenticado. É necessário fazer login.');
            return null; // Retorna null se não houver usuário
        }

        try {
            const response = await this.msalService.instance.acquireTokenSilent({
                scopes: ['User.Read'], // Substitua pelos escopos necessários
                account: account, // Passa o objeto account agora verificado
            });
            return response.accessToken;
        } catch (error) {
            console.error('Erro ao adquirir token', error);
            return null;
        }
    }

}


//COMPONENT

import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    userInfo: any;

    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        this.userInfo = this.authService.getUserInfo();
    }

    login(): void {
        this.authService.login();
    }

    logout(): void {
        this.authService.logout();
    }

    async getToken(): Promise<void> {
        const token = await this.authService.getAccessToken();
        console.log('Token de acesso:', token);
    }
}

//ROUTING

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
    { path: 'profile', component: ProfileComponent, canActivate: [MsalGuard] },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '/home' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }

//HTML

<div * ngIf="userInfo; else loggedOut" >
    <h2>Bem - vindo, {{ userInfo?.name }}</h2>
        < button(click)="logout()" > Logout < /button>
            < /div>

            < ng - template #loggedOut >
                <button (click)="login()" > Login com Microsoft < /button>
                    < /ng-template>





    /**
     * 
     * production: false,
  azureAd: {
    instance: 'https://login.microsoftonline.com/',
    tenant: 'your-tenant-id',
    clientId: 'your-client-id',
    redirectUri: 'http://localhost:4200',
    scope: 'openid profile email',
    responseType: 'token'
  }
     */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class GraphService {
    private graphUrl = 'https://graph.microsoft.com/v1.0/me';

    constructor(private http: HttpClient) { }

    getUserProfile() {
        return this.http.get(this.graphUrl);
    }
}
Chame o serviço no componente para buscar mais dados do usuário:

    typescript
Copiar código
import { GraphService } from './graph.service';

constructor(private graphService: GraphService) { }

getUserDetails() {
    this.graphService.getUserProfile().subscribe(data => {
        console.log(data);
    });
}
Adicione um botão para chamar o método no HTML, se necessário:

html
Copiar código
    < button(click)="getUserDetails()" > Carregar Dados do Perfil < /button>
