using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace CriptografiaEAS.Criptografia
{
    internal class CriptografiaAESComIv
    {
        private readonly byte[] _key;
        private readonly byte[] _iv;

        public CriptografiaAESComIv(string key, string iv)
        {
            if (key == null || iv == null)
                throw new ArgumentNullException("Key and IV cannot be null");

            if (key.Length != 32)
                throw new ArgumentException("Key length must be 32 bytes (256 bits)");

            if (iv.Length != 16)
                throw new ArgumentException("IV length must be 16 bytes (128 bits)");

            _key = Encoding.UTF8.GetBytes(key);
            _iv = Encoding.UTF8.GetBytes(iv);
        }

        public string Encrypt(string plainText)
        {
            if (string.IsNullOrEmpty(plainText))
                throw new ArgumentNullException(nameof(plainText));

            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = _key;
                aesAlg.IV = _iv;
                aesAlg.Mode = CipherMode.CBC;
                aesAlg.Padding = PaddingMode.Zeros;

                using (ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV))
                using (MemoryStream msEncrypt = new MemoryStream())
                {
                    using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    using (StreamWriter swEncrypt = new StreamWriter(csEncrypt, Encoding.UTF8))
                    {
                        swEncrypt.Write(plainText);
                    }
                    byte[] encrypted = msEncrypt.ToArray();
                    return Convert.ToBase64String(encrypted);
                }
            }
        }

        public string Decrypt(string cipherText)
        {
            if (string.IsNullOrEmpty(cipherText))
                throw new ArgumentNullException(nameof(cipherText));

            byte[] cipherTextBytes = Convert.FromBase64String(cipherText);

            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = _key;
                aesAlg.IV = _iv;
                aesAlg.Mode = CipherMode.CBC;
                aesAlg.Padding = PaddingMode.Zeros;

                using (ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV))
                using (MemoryStream msDecrypt = new MemoryStream(cipherTextBytes))
                using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                using (StreamReader srDecrypt = new StreamReader(csDecrypt, Encoding.UTF8))
                {
                    return srDecrypt.ReadToEnd();
                }
            }
        }
    }
}


//public async Task<List<Produto>> BuscarPorNomeEVersaoAsync(string nome, string versao)
//{
//    var queryRequest = new QueryRequest
//    {
//        TableName = "NomeDaTabela",
//        KeyConditionExpression = "Nome = :nome AND Versao = :versao",
//        ExpressionAttributeValues = new Dictionary<string, AttributeValue>
//        {
//            { ":nome", new AttributeValue { S = nome } },
//            { ":versao", new AttributeValue { S = versao } }
//        },
//        IndexName = "NomeVersaoIndex" // Se estiver usando um GSI
//    };

//    var response = await _dynamoDBClient.QueryAsync(queryRequest);

//    return response.Items.Select(item => new Produto
//    {
//        Nome = item["Nome"].S,
//        Versao = item["Versao"].S,
//        Descricao = item["Descricao"].S,
//        Preco = decimal.Parse(item["Preco"].N)
//    }).ToList();
//}





// Configura as expressões de condição para a consulta
//var keyConditionExpression = "Nome = :nome and Versao = :versao";
//var expressionAttributeValues = new Dictionary<string, AttributeValue>
//        {
//            { ":nome", new AttributeValue { S = nome } },
//            { ":versao", new AttributeValue { S = versao } }
//        };

//var queryRequest = new QueryRequest
//{
//    TableName = "NomeDaTabela",
//    KeyConditionExpression = keyConditionExpression,
//    ExpressionAttributeValues = expressionAttributeValues
//};

//var result = await _principal.QueryAsync(queryRequest);

//return result;




//public string Decrypt(string cipherText)
//{
//    if (string.IsNullOrEmpty(cipherText))
//        throw new ArgumentNullException(nameof(cipherText));

//    // Converter a string de Base64 para bytes
//    byte[] cipherTextBytes = Convert.FromBase64String(cipherText);

//    // Verifique se a chave e o IV têm o tamanho correto
//    if (_key == null || _key.Length != 16)  // 16 bytes para AES-128, ajustar se necessário
//        throw new ArgumentException("A chave AES deve ter 16 bytes (128 bits).");

//    if (_iv == null || _iv.Length != 16)  // O IV deve ter 16 bytes
//        throw new ArgumentException("O vetor de inicialização (IV) deve ter 16 bytes (128 bits).");

//    using (Aes aesAlg = Aes.Create())
//    {
//        aesAlg.Key = _key;
//        aesAlg.IV = _iv;
//        aesAlg.Mode = CipherMode.CBC;
//        aesAlg.Padding = PaddingMode.Zeros;  // Continuar com PaddingMode.Zeros

//        using (ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV))
//        using (MemoryStream msDecrypt = new MemoryStream(cipherTextBytes))
//        using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
//        {
//            byte[] decryptedBytes = new byte[cipherTextBytes.Length];
//            int decryptedByteCount = csDecrypt.Read(decryptedBytes, 0, decryptedBytes.Length);

//            // Convertendo os bytes descriptografados de volta para string UTF-8
//            string decryptedText = Encoding.UTF8.GetString(decryptedBytes, 0, decryptedByteCount);

//            // Retornando a string após remover qualquer padding adicional
//            return decryptedText.TrimEnd('\0');
//        }
//    }
//}