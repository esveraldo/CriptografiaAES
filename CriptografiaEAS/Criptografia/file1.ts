import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    template: `
    <div class="login-container">
      <button (click)="login()">Login com Microsoft</button>
    </div>
  `,
})
export class LoginComponent {
    constructor(private http: HttpClient, private router: Router) { }

    login() {
        // URL da sua API de autenticação
        const authUrl = 'https://login.microsoftonline.com/SEU_TENANT_ID/oauth2/v2.0/token';

        // Corpo da requisição (ajustar conforme necessário)
        const body = new URLSearchParams();
        body.set('client_id', 'SEU_CLIENT_ID');
        body.set('scope', 'user.read openid profile email');
        body.set('redirect_uri', 'http://localhost:4200');
        body.set('grant_type', 'authorization_code');
        body.set('code', 'SEU_AUTHORIZATION_CODE'); // Isso vem do fluxo de autorização.

        // Cabeçalhos
        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
        });

        // Faz a requisição para obter os tokens
        this.http.post(authUrl, body.toString(), { headers, observe: 'response' }).subscribe(
            (response) => {
                // Extrair o header da resposta
                const accessToken = response.headers.get('Authorization');
                const idToken = response.headers.get('ID-Token'); // Exemplo, ajustar conforme sua API

                if (accessToken && idToken) {
                    // Armazenar os tokens no sessionStorage
                    sessionStorage.setItem('accessToken', accessToken);
                    sessionStorage.setItem('idToken', idToken);

                    // Redirecionar para uma rota protegida ou página inicial
                    this.router.navigate(['/dashboard']);
                }
            },
            (error) => {
                console.error('Erro ao autenticar:', error);
            }
        );
    }
}


import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    getAccessToken(): string | null {
        return sessionStorage.getItem('accessToken');
    }

    getIdToken(): string | null {
        return sessionStorage.getItem('idToken');
    }

    isLoggedIn(): boolean {
        return !!this.getAccessToken();
    }
}


import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
    selector: 'app-root',
    template: `
    <div *ngIf="isLoggedIn; else notLoggedIn">
      <p>Bem-vindo, {{ userName }}</p>
      <button (click)="logout()">Logout</button>
    </div>
    <ng-template #notLoggedIn>
      <button (click)="login()">Login</button>
    </ng-template>
  `,
})
export class AppComponent implements OnInit {
    isLoggedIn = false;
    userName: string | undefined;

    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.isLoggedIn = this.authService.isLoggedIn();

        if (this.isLoggedIn) {
            const idToken = this.authService.getIdToken();
            if (idToken) {
                // Decodifique o token para extrair informações do usuário
                const payload = JSON.parse(atob(idToken.split('.')[1]));
                this.userName = payload.name || payload.preferred_username;
            }
        }
    }

    login() {
        // Redirecionar para a página de login
    }

    logout() {
        sessionStorage.clear(); // Limpar a sessão
        this.isLoggedIn = false;
    }
}

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(): boolean {
        if (this.authService.isLoggedIn()) {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}

import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
];


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-callback',
    template: `<p>Autenticando...</p>`,
})
export class CallbackComponent implements OnInit {
    constructor(private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            const code = params['code']; // Captura o código de autorização
            if (code) {
                console.log('Authorization Code:', code);

                // Armazene ou use o código para solicitar o token
                this.exchangeCodeForToken(code);
            } else {
                console.error('Authorization code not found!');
            }
        });
    }

    exchangeCodeForToken(code: string) {
        // Fazer a troca pelo token usando o código de autorização
        console.log('Trocar o código por um token:', code);
    }
}


const base64Url = idToken.split('.')[1]; // Obtém o payload do JWT
const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
const jsonPayload = decodeURIComponent(
    atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
);
const decoded = JSON.parse(jsonPayload);