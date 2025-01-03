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

 idOrigemEnvio: string = '';
    baseUrl: string = '';
    versao: string = '';
    nome: string = '';
    appStoreUrl: {
        defaultValue: string = '';
        ios: string = '';
        android: string = '';
    };
    "buildMinimumRequired": {
        "defaultValue": "CsQsJQ1VYii4vV5V4wSahw==";
        "ios": "EBcfbc2QOZG0XG8dGpQqpQ==";
        "android": "Tmwz4fhGIPdsfWhosKDvGA=="
    };
    "homeList": {
        "defaultValue": "seZMSJS+wxuXx6DE5IRvbcOYfRM9O2zxHrZY99Zm2MaEuKBFbgDlAgDIigLvkNGJhaie/LWGoeakUyTjxqpi4qK4DpfmkoBs+3oxaFDvtn3CAwrij7YiTGn+sHpYlrCF+gXVtVBslbM/7DP7YQrehsERrK6YO6GXCFa6aoyYZ9Lka23wtTwPRrT//7Ls9efQ23Q7Ny4pUkHHwFX5YPu2nHa2ZD+hcYjGLoQYOGChmRAwEAWCt96KGMeG0xPy+im1b0WpSORwoEg96sGcJIBT31rWIEbKGGYS1PejF6hcX3i9v0hUsxGOD/FDfMolckCByiBI9btSabbEybGyCts8n7tW+QmTSrMOJtLTa6+D/IHMtM+w0fuI+pWLNEGy9egKXlCfN6eQG7dFBs5Jb9IwG/SFfnVyLX+JhpA3FyNsQTyXNVLcSoXBpRLXjZ4hIZNJEgD+bix2imuZss0QNSjLSuFwDHO1oLEIGAGlUlQ8rbSega6mYzSi8oxfZxrRnlaXEpzRZBCcJiQ6K2yOZQ68wNmI7uUXqRX+UFRd6pxcrsQIG/D15w7x0kU71Qf8gyhD8j+Y3wiNqDZEZUNx1K8lOloPTwxhx8rPWwdIwrlANF9R70sOG5wFjDY4LdkI5jNKPeLunHEcbmH42Rd1f/fQnLohEhZgbaT6yfKDb+HSWHwE+h+EvRbvEPp6oQJbGOiraD29tsDy6MC3LyAUrxRTKbmQqd7H3v0a6fGBy6wK/HI7sWENIGVpt6v1aQJwcI1CpyashKnITpFM8zohin8iiESsNSpMaAlfx4WzgpnndI/lU4/hGFv3oXM3bOLl5JsPhqlwzESyCI/aJsd3AZujfMvErbGVThTt9hvFWSX5Ihid2dVSZqEzCTU53upBoTuaP6o9dOy5N9yHYrVxRTIn3IS6n/NR3pYel4gnFhQeaTsNXYy0ace45xA5vkfVcFpSJ3ZPKOrh4HETdxS61vDoWD1nE/qmOxMviBnBsIKqpMjtrYDDSqODrqiyMXjDSUMD8jy3ZtB1HycyF4H3BbJaBUn9FBHBVIIN8jEg25lfyr999O7K+tZY7Y+akmGqYXtTXCtAKyTe0r5rC3G+Co28eElx6yqlc9/9f47GpF1o1YiEoulxw9D+t0fSxFki1jpm8zGo7WtcRymagl/7YXNA60UFrDlsrqU0f/erqPUTOJX1rUiK+3HSxNtiR67S9xVJZEHB9W3wxvNvKKAm3IWQjlEiAChFOXcdKlUeSGMjL+d+KROIYO/bqBAy9DaCiiJeTQCk5lsAWGma9KLBmCKADG8U6G7kh+fJ3V5Aj75TS0NTgV9PzNmVBwbXOp/bF0IGhUDuAeIzhLf6IBfATLmva52zya8kGXnlRmJpDdbBL7uh6V5msO6dlFDuj9+7MQHJHMPPcaSSOuih+NW7XSx4TLQxYmAnwtryujoU609Kzl4=";
        "web": "4p2TcbHZL33Xjgtr4OMEv6L7I59bmTBV3HBb0R0ROfPMwY0r74/ZiZ4WIdWxEK411pREKbAMu/stCW6geCiqjB7HWWauW6EF/CF+w/IirjvfUwIJ6ZoDxbZDSdUr4E/BfU0WZnilmF/E6bHKainLIAOvXYvy3tVVDWGSKPck7oeV2CH2FbMjjUp9Aw4rV3PH4E3o6lQ5oDpyMdY0GRKQRDCfVXLAOa+zfiQZeTs5e+1gAJmJzBOzWVoLIsBJN6Qm08TwU0HzgpFiWJr1S1oZ8oahA9pGH5H3n+OhJkfSFfBkTrQxT+j5mQcEWjTBTF+/pakIK8D/ewN+ZIGBmHk+hgd1QcwParZda1Lzoh52dQhbXWwtXCM2ucMWpWiQrZaw+qGqcpmB973rTm5uCXqhawoVZuZghgikytIE00d/XzqXuvTwljHTfpaIB1s5n3102PXAOIejjUzibfMK1XnHscBohZNB47eLn77Jly3UfRArRowOajW7sH0KL/Br/KqB0mryNVL0bOGHVFhwi1CUx5/EgaePSwIueZchzOxZvRAj2AcZmLPXW0ShbSBV7cwpPrjjrxNYAt0f3uL0YV62Mn1Nr9mckmOAbn+b49DqHw2BCfPj42P3CQcll2FJ0mTufBUa3Yol4YMDMvH/ZY71TxXFjkLu5zWq6LsYZcF3OWYND5c92nQsrK7vI0PhOFXijcSWpB3tByIfFFx8n8W6ATwXy1/K/rS+V30abhRQuaaxngOgPxITpgdkP3eFqZKhA88iWDyf3JdW/6bmCMZ3WoSiFMI0TQLrDTW1Guz1vUKiyVDZ1b+KjsTl9yNCPfBjSBX6D92cMTUIiCF3toKD/Wct/Z/ALGS1p5yrCS0DEfdRf3XQ7JS8KsrfRmaRvPY4Iyf6FKVXCxKDeBye1bMZUh4cHNEk7WW4TQuGilX92TUetOfJrudKpKgzloiBE05meNiJuo+3vS0m22IOn7IM7f/RGyBN6CqWqnGWVEyHdWv7cuqwn/L0H4HpACoOxFR7g4iizyQ0Zexw45wVd64t6XdKXWfsABXRC1vw87vgh0IIiHu1R3RYKjR8ejBhQSpjuBPRX+33fYCXsoDNBXYm7Gw04pPXO9kjzohu7BcoTCSL2VgdMUeTHLO6l7x0U2jPrU2K+85wTLF+Ri07UxZIrxiYbiyZ1a2J92gsKjM5ovGs+h6Hzz5l3dkvHgz01a18ynGwDu1HxMAl08D2Cz41yOYU8Me9v2Uwp9h0x6enf8gN2jlKEinsz4qLk0BltizW+GhO9R/wpAY23l8+Sd8YQO8HBATsC9y8R3AehnekAoleSH3D8SmekO294N/ClNPK+ePvDr7Vj2IbefVp3PCalg==";
        "description": "dKdWZfNO1+V+0UNFFRg5C3N1IknNvxr0u1B6VnjoOjlaVUKDvrYJpaXyms3AML5W8U7ZlooUbEFSFHRl1ILnO0EZABJdSaQh+8qd+okIC46AAALq3p9seSosLQm6oUDPcJpuQiZM+oRVdLBlDp74C4CAbgL+TxrhUUfyLgvxT9c66lsV0HlMOMBLTqo0h1Rd"
    };
    "myCardList": {
        "defaultValue": "grpjAac90Zrjcf9LLSauP8dcxDX04rkNPq9SIi8v1tuQLkrebfuVLiZDIwaQGHmeP8P2QWGxd0sZoSriO+4sKca2xIqNMDMVwVBHVbwq66PzZ0TJnB+QIstZdul873ZcSVCmwswLxE6Zk50Mrm54V3rHKgLjWGft02QFDy+vQVpFoDSO4yHa1M0BNpor3pvj4FjgSG6SRorzx79vGyiJWyew3AFBzsBC3+bs9YC1REJqpQ+gbYwfmSQuDEADcPY4Eh50yPwg3gUFEFPCTrnMCETmIGcRGcJ0xzDXK9qAcdBzSebNv212bDpp/Oc2Ius0MLTCqayzEPcDVF2on+p+ZtjQj3PnfSEoJDmoZ80+rrMzdEDtvRYfQtO+/SPelSLtKQGtMXDamQSgNXHXKwSUDhlr/7B+r4wmaVrXFZvUCuL2R0VFL8VL8Wxk0ZBsR6WfY/PiY4KjoTLCDFheebnXnPQDKK3emmpRrP/mdsA8XJfjrUVJf5hKcHhZjVAsqDjYl8xb3ZTKaMvk0CXyP7+WmSbA8Mrnub1FEJCqd4hmV65e7Qd8pzG5oNtOdxyGRlrj6AHiusTbc8qt7dtdycU1/GrWxhfylo92OXgwFn+mhe1S+xqz5k0uhz6dC4nIYOYa4Zw/LICQ0+7zJjhjoXyKjhQV4XfzUo5a+PfAbfriudcC+bdBFk6s/q/CQrCd/IBcD7k95us+pADAAx0b6rvM2FLVMrkx2kZiIbKkHIQ98DhacQ8GTQgqcJ0ZgsmjdoQW3JEQVUEigrLtqNw0w7IcUQpwrFRlW+yKNYXnghhK4hqP7vgBnVQh1USS056Psh+jx24ljI0qJsILXXXYwU2k1iaqlkqyjYU25sNw2TJlJIxQKRCgzitg5J8zGKSn/FbnHBGP4LMBWKwRRViKXniUzA==";
        "web": "4p2TcbHZL33Xjgtr4OMEv6N1PHmnC6dU+y+QlPWkkE+xRqk7OKlQReMDOn8K9t2Pao/g3u6R2owp+70xIhGUChnCuUY/2TP38CXjgV2coM99/al0XsvyXl4BCfrAylRJSFm+6CiZJZTv4OO0IR5ADbYLWw9Loxe7XOHPq/TqAZtjPjSB8KcJ6821DwlBxELBtH9x5EVfoSNZHc5z+5cCcOpM+u/LCO/Vc8e/zlyGBxpmyzcZ3IRy+V08fGCedCcGEBSnk4v/qoI/ISLG1i31Yh1VO8Acdyp8ncmOanYyywRYnt4AW8Z4y0pC9cb/gBzndXyZhkgI0AH2mR6IaUn3gXqVlG+H1aNTXixmSd4x1b9YD/JfUVs/hbg7RhxofUzJ6dHV7H9CzFw96Ldvqp4/P7w8WB1zMMod/72QR/LAj4679/Std2LtzsYXtCsDuGksllvEgnwjTHRmFu1ITgkEqgc784shJVGROisEOzL+hrAM2pVcR7fES+k+5FEUkqJEjTaoVF7GEJkwMxhTSx003uS3oqTN095L3kxRAcQDFY5FUIorPYdcQe1cs18dW9P5C/Gm3iu5J4baVYG8ulysgVX84O/C6sBnoTF+G6t4hBpg5CHixwVXY9Q6T37DweGnVPTan0UBbZXX1150NWTxKkoh+0reJJ39i1gxjKYvYxo2ECbCpGEoBlwygYKuNHvIXcHlGLzvQhvomHvkk5IemUjAlC6rppjaDXtjZszhnehJpC9oBtWLMiPGbCzY9AUkDhsKUnX6PImPWCyeFx9DAKOQGhiczg0e7l33cBkOxpVRujJ72a8itoYXjiZZCGPyvUSzd0AHPgw//8m/C1W87BohcnHmK4p8n4Ar8YRBcWFYpXRz/Z8s4WJT9WPgO2C1SbOncpbgy7MsmN8xCwyoAXUIXOl61HMTW7o+Up02tBt2awFYjn9+fLHWbpcz3WwLqBBXCHoezuNxtrV8BO8sP977ZDa5PoYAY9T5WXruTvACIfZ/OY6AZdn2ABf2HzeAcUsgIQ0O+q4k75vPl3H1H8z7xI5hgVFuHaFSDnbX3+mHbCtw1ckRassAbprIJj3JjHhGdKhvO2a7XvqZKnTG2R/qt32CrkyVi/9097cU4Us="
    };
    "outOfService": {
        "defaultValue": "yUkwwLNLNaK/zI9gEU203Q==";
        "ios": "yUkwwLNLNaK/zI9gEU203Q==";
        "android": "yUkwwLNLNaK/zI9gEU203Q=="
    };
    "version": {
        "versionNumber": "G283ggt+PsbRckh4hSCCEw==";
        "updateTime": "ri50QM1OK0SUjccCPNrfLdkyle7zcvp0zKTO70J4Vdg=";
        "email": "qkpulNyzluPLnTCBBuvdA0dVnDndtt6/3i4eCx8+ZTE=";
        "updateOrigin": "uJy4fWbeM5irU2/tZ4cNGA==";
        "updateType": "WpykgLOsNZAUCFu13u7doR/K44IQF7pDc4d9ArrwcOs="
    };
    "condition": {
        "defaultValue": "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"
}

*/
