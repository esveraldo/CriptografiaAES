async function decrypt(cipherText, key, iv) {
    if (!cipherText) throw new Error("cipherText cannot be null or empty.");

    // Decodifica a string Base64 para bytes
    const cipherTextBytes = Uint8Array.from(atob(cipherText), c => c.charCodeAt(0));

    // Converte a chave e o IV para arrays de bytes
    const keyBytes = Uint8Array.from(atob(key), c => c.charCodeAt(0));
    const ivBytes = Uint8Array.from(atob(iv), c => c.charCodeAt(0));

    // Configura o algoritmo AES-CBC
    const algorithm = { name: "AES-CBC", iv: ivBytes };

    // Importa a chave criptográfica
    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyBytes,
        algorithm,
        false,
        ["decrypt"]
    );

    // Desencripta o texto cifrado
    const decryptedBytes = await crypto.subtle.decrypt(
        algorithm,
        cryptoKey,
        cipherTextBytes
    );

    // Converte o resultado de volta para uma string UTF-8
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBytes);
}