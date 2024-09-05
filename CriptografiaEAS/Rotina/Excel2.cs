using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CriptografiaEAS.Rotina
{
    public class Excel2
    {
        public static void GravarDadosEmCsv(string caminhoArquivo, List<string[]> dados)
        {
            // Usando StreamWriter para gravar em um arquivo
            using (StreamWriter writer = new StreamWriter(caminhoArquivo))
            {
                foreach (var linha in dados)
                {
                    // Converte cada linha de dados em um formato CSV com ; como separador
                    string linhaCsv = string.Join(";", linha);

                    // Escreve a linha no arquivo
                    writer.WriteLine(linhaCsv);
                }
            }
        }
    }
}
