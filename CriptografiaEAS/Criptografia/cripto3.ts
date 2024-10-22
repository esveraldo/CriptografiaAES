async decrypt(cipherText: string): Promise < string > {
    if(!cipherText) {
        throw new Error('O texto cifrado não pode ser nulo ou vazio');
    }

  // Verifica se a string está em formato Base64 válido
  if(!isValidBase64(cipherText)) {
    throw new Error('Texto cifrado não está em formato Base64 válido');
}

// Corrige o padding da string Base64 se necessário
const cipherTextBase64 = fixBase64Padding(cipherText);

// Converte a string Base64 para ArrayBuffer
const cipherTextBytes = this.base64ToArrayBuffer(cipherTextBase64);

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

    const decryptedText = new TextDecoder().decode(decrypted);
    return this.removeZeroPadding(decryptedText);
} catch (error) {
    console.error('Erro ao decriptar:', error);
    throw new Error('Falha na decriptação');
}
}

// Função para validar Base64
function isValidBase64(str: string): boolean {
    const base64Regex = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
    return base64Regex.test(str);
}

// Função para corrigir o padding do Base64
function fixBase64Padding(base64: string): string {
    while (base64.length % 4 !== 0) {
        base64 += '=';
    }
    return base64;
}

// Função para converter Base64 para ArrayBuffer
private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}


private hexToUint8Array(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
}