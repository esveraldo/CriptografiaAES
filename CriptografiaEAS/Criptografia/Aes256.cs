using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

public class CriptografiaAES
{
    private readonly byte[] _key;

    public CriptografiaAES(string key)
    {
        if (key == null)
            throw new ArgumentNullException("A chave não pode ser nula");

        if (key.Length != 32)
            throw new ArgumentException("A chave tem que ter 32 bytes (256 bits)");

        _key = Encoding.UTF8.GetBytes(key);
    }

    public (string CipherText, string IV) Encrypt(string plainText)
    {
        if (string.IsNullOrEmpty(plainText))
            throw new ArgumentNullException(nameof(plainText));

        using (Aes aesAlg = Aes.Create())
        {
            aesAlg.Key = _key;
            aesAlg.GenerateIV();  // Gerar automaticamente um IV
            aesAlg.Mode = CipherMode.CBC;
            aesAlg.Padding = PaddingMode.PKCS7;

            using (ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV))
            using (MemoryStream msEncrypt = new MemoryStream())
            {
                using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                {
                    swEncrypt.Write(plainText);
                }
                byte[] encrypted = msEncrypt.ToArray();
                return (Convert.ToBase64String(encrypted), Convert.ToBase64String(aesAlg.IV));
            }
        }
    }

    public string Decrypt(string cipherText, string iv)
    {
        if (string.IsNullOrEmpty(cipherText))
            throw new ArgumentNullException(nameof(cipherText));
        if (string.IsNullOrEmpty(iv))
            throw new ArgumentNullException(nameof(iv));

        byte[] cipherTextBytes = Convert.FromBase64String(cipherText);
        byte[] ivBytes = Convert.FromBase64String(iv);

        using (Aes aesAlg = Aes.Create())
        {
            aesAlg.Key = _key;
            aesAlg.IV = ivBytes;
            aesAlg.Mode = CipherMode.CBC;
            aesAlg.Padding = PaddingMode.PKCS7;

            using (ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV))
            using (MemoryStream msDecrypt = new MemoryStream(cipherTextBytes))
            using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
            using (StreamReader srDecrypt = new StreamReader(csDecrypt))
            {
                return srDecrypt.ReadToEnd();
            }
        }
    }
}