using System;
using System.Text;
using System.Security.Cryptography;

namespace HL
{
    public class Aes256 : IDisposable
    {
        private RijndaelManaged Engine;
        private SHA256CryptoServiceProvider HashProvider;
        private byte[] HashBytes;

        private string _Password;

        /// <summary>
        /// Retorna ou modifica a senha usada por esta instância para opções de criptografia e descriptografia
        /// </summary>
        public string Password
        {
            get { return _Password; }
            set
            {
                _Password = value;
                HashBytes = HashProvider.ComputeHash(Encoding.UTF8.GetBytes(value));
                Engine.Key = HashBytes;
            }
        }

        /// <summary>
        /// Cria uma nova instância
        /// </summary>
        /// <param name="Password">Senha utilizada para criptografar e descriptografar</param>
        public Aes256(string Password)
        {
            _Password = Password;
            Engine = new RijndaelManaged();
            HashProvider = new SHA256CryptoServiceProvider();
            HashBytes = HashProvider.ComputeHash(Encoding.UTF8.GetBytes(Password));
            Engine.Mode = CipherMode.CBC;
            Engine.Key = HashBytes;
        }

        /// <summary>
        /// Criptografa um buffer de bytes
        /// </summary>
        /// <param name="Buffer"></param>
        /// <returns></returns>
        public byte[] Encrypt(byte[] Buffer)
        {
            using (ICryptoTransform Encryptor = Engine.CreateEncryptor())
                return Encryptor.TransformFinalBlock(Buffer, 0, Buffer.Length);

        }

        /// <summary>
        /// Descriptografa um buffer de bytes
        /// </summary>
        /// <param name="Buffer"></param>
        /// <returns></returns>
        public byte[] Decrypt(byte[] Buffer)
        {
            using (ICryptoTransform Decryptor = Engine.CreateDecryptor())
                return Decryptor.TransformFinalBlock(Buffer, 0, Buffer.Length);
        }

        /// <summary>
        /// Criptografa um texto
        /// </summary>
        /// <param name="Str"></param>
        /// <returns></returns>
        public string Encrypt(string Str)
        {
            return Convert.ToBase64String(Encrypt(Encoding.UTF8.GetBytes(Str)));
        }

        /// <summary>
        /// Descriptografa um texto
        /// </summary>
        /// <param name="Str"></param>
        /// <returns></returns>
        public string Decrypt(string Str)
        {
            return Encoding.UTF8.GetString(Decrypt(Convert.FromBase64String(Str)));
        }

        public void Dispose()
        {
            Engine.Dispose();
            HashProvider.Dispose();
            HashBytes = null;
            _Password = null;
        }

    }
}