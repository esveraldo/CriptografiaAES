import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CryptoService {
    private key: Uint8Array = new Uint8Array([...]); // Substitua pela sua chave de 32 bytes (AES-256)
    private iv: Uint8Array = new Uint8Array([...]);  // Substitua pelo seu IV de 16 bytes (tamanho de bloco AES)

    constructor() { }

    // Método para encriptar com padding zeros
    async encrypt(plainText: string): Promise<string> {
        if (!plainText) {
            throw new Error('O texto em claro não pode ser nulo ou vazio');
        }

        try {
            // Aplica padding de zeros ao plainText
            const paddedText = this.applyZeroPadding(plainText);

            // Importa a chave de encriptação AES-256
            const aesKey = await crypto.subtle.importKey(
                'raw',
                this.key,  // Chave AES-256 (32 bytes)
                { name: 'AES-CBC' },
                false,
                ['encrypt']
            );

            // Codifica a string para ArrayBuffer (bytes)
            const plainTextBytes = new TextEncoder().encode(paddedText);

            // Criptografa os dados
            const encrypted = await crypto.subtle.encrypt(
                {
                    name: 'AES-CBC',
                    iv: this.iv  // Vetor de inicialização de 16 bytes
                },
                aesKey,
                plainTextBytes
            );

            // Converte para base64 para retornar como string
            return this.arrayBufferToBase64(encrypted);
        } catch (error) {
            console.error('Erro ao encriptar:', error);
            throw new Error('Falha na encriptação');
        }
    }

    // Método para decriptar com remoção do padding zeros
    async decrypt(cipherText: string): Promise<string> {
        if (!cipherText) {
            throw new Error('O texto cifrado não pode ser nulo ou vazio');
        }

        const cipherTextBytes = this.base64ToArrayBuffer(cipherText);

        try {
            const aesKey = await crypto.subtle.importKey(
                'raw',
                this.key,  // Chave AES-256
                { name: 'AES-CBC' },
                false,
                ['decrypt']
            );

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
            throw new Error('Falha na decriptação');
        }
    }

    // Função auxiliar para aplicar padding de zeros
    private applyZeroPadding(text: string): string {
        const blockSize = 16;  // Tamanho do bloco AES
        const textLength = text.length;
        const paddingLength = blockSize - (textLength % blockSize);

        // Adiciona padding de zeros
        const paddedText = text + '\0'.repeat(paddingLength);
        return paddedText;
    }

    // Função auxiliar para remover padding de zeros
    private removeZeroPadding(text: string): string {
        return text.replace(/\0+$/, '');  // Remove todos os zeros no final
    }

    // Função auxiliar para converter ArrayBuffer para Base64 encript
    private arrayBufferToBase64(buffer: ArrayBuffer): string {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);  // Converte a string para base64
    }

    // Função auxiliar para converter base64 para ArrayBuffer decript
    private base64ToArrayBuffer(base64: string): ArrayBuffer {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }
}
