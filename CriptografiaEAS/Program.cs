﻿string key = "12345678901234567890123456789012"; // 32 caracteres = 256 bits
var aes = new CriptografiaAES(key);

string originalText = "Hello, World!";

var (encryptedText, iv) = aes.Encrypt(originalText);
string decryptedText = aes.Decrypt(encryptedText, iv);

Console.WriteLine($"Original: {originalText}");
Console.WriteLine($"Criptografado: {encryptedText}");
Console.WriteLine($"Decriptografado: {decryptedText}");
Console.WriteLine($"IV: {iv}");

//CHAMADA COM IV RETIRADO DA MONTAGEM DA CRIPTOGRAFIA
//string key = "12345678901234567890123456789012"; // 32 caracteres = 256 bits
//var aes = new AesEncryption(key);

//string originalText = "Olá, Mundo! 😀🚀"; // Texto com caracteres especiais

//string encryptedText = aes.Encrypt(originalText);
//string decryptedText = aes.Decrypt(encryptedText);

//Console.WriteLine($"Original: {originalText}");
//Console.WriteLine($"Encrypted: {encryptedText}");
//Console.WriteLine($"Decrypted: {decryptedText}");