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

function isBase64(str) {
    try {
        return btoa(atob(str)) === str;
    } catch (err) {
        return false;
    }
}

async function decrypt(cipherText, key, iv) {
    if (!cipherText || !isBase64(cipherText)) throw new Error("cipherText is not valid Base64.");
    if (!key || !isBase64(key)) throw new Error("key is not valid Base64.");
    if (!iv || !isBase64(iv)) throw new Error("iv is not valid Base64.");

    // Decodifica a string Base64 para bytes
    const cipherTextBytes = Uint8Array.from(atob(cipherText), c => c.charCodeAt(0));
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


    public string EncryptAndConvertToBase64(string plainText)
{
    byte[] plainTextBytes = Encoding.UTF8.GetBytes(plainText);

    using(Aes aesAlg = Aes.Create())
    {
        aesAlg.Key = _key;
        aesAlg.IV = _iv;
        aesAlg.Mode = CipherMode.CBC;
        aesAlg.Padding = PaddingMode.Zeros;

        using(ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV))
        using(MemoryStream msEncrypt = new MemoryStream())
        using(CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
        {
            csEncrypt.Write(plainTextBytes, 0, plainTextBytes.Length);
            csEncrypt.FlushFinalBlock();
            return Convert.ToBase64String(msEncrypt.ToArray());
        }
    }
}