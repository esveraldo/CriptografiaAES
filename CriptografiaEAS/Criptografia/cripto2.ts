import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CryptoService {
    private key: ArrayBuffer;
    private iv: ArrayBuffer;

    constructor() {
        // Configure sua chave AES-256 e IV corretamente como ArrayBuffer
        const keyBase64 = 'base64_encoded_key_here';  // Insira a chave em Base64 aqui.
        const ivBase64 = 'base64_encoded_iv_here';    // Insira o IV em Base64 aqui.

        this.key = this.base64ToArrayBuffer(keyBase64);
        this.iv = this.base64ToArrayBuffer(ivBase64);
    }

    async decrypt(cipherText: string): Promise<string> {
        if (!cipherText) {
            throw new Error('O texto cifrado não pode ser nulo ou vazio');
        }

        const cipherTextBytes = this.base64ToArrayBuffer(cipherText);

        try {
            // Log para depuração
            console.log('Importando a chave AES...');
            const aesKey = await crypto.subtle.importKey(
                'raw',
                this.key, // Chave AES-256
                { name: 'AES-CBC' },
                false,
                ['decrypt']
            );

            // Log para depuração
            console.log('Descriptografando...');
            const decrypted = await crypto.subtle.decrypt(
                {
                    name: 'AES-CBC',
                    iv: this.iv
                },
                aesKey,
                cipherTextBytes
            );

            // Converte o ArrayBuffer para string
            const decryptedText = new TextDecoder().decode(decrypted);

            // Remove o padding de zeros do texto decriptado
            return this.removeZeroPadding(decryptedText);
        } catch (error) {
            console.error('Erro ao decriptar:', error);
            throw new Error('Falha na decriptação. Verifique a chave, o IV, e os dados cifrados.');
        }
    }

    private removeZeroPadding(text: string): string {
        return text.replace(/\0+$/, ''); // Remove todos os zeros no final
    }

    private base64ToArrayBuffer(base64: string): ArrayBuffer {
        try {
            const binaryString = window.atob(base64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes.buffer;
        } catch (error) {
            console.error('Erro ao converter Base64 para ArrayBuffer:', error);
            throw new Error('O texto cifrado não está em formato Base64 válido.');
        }
    }

    //Hexadecimal para ArrayBuffer(se necessário):
    private hexToArrayBuffer(hex: string): ArrayBuffer {
        const length = hex.length / 2;
        const result = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
            result[i] = parseInt(hex.substr(i * 2, 2), 16);
        }
        return result.buffer;
    }
}
