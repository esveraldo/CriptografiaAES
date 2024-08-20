using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
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
