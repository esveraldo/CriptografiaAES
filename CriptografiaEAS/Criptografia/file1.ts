async login(): Promise < void> {
    try {
        const response = await this.authService.loginPopup();
        if(response) {
            console.log('Login bem-sucedido:', response);
            this.authService.instance.setActiveAccount(response.account); // Define a conta ativa
            this.updateUserStatus();
        } else {
            console.error('Nenhuma resposta retornada do login.');
        }
    } catch(error) {
        console.error('Erro durante o login:', error);
    }
}
