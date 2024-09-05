using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CriptografiaEAS.Rotina
{
    public static void Main(string[] args)
    {
        // Caminho onde o arquivo será salvo
        string caminhoArquivo = "resultado.csv";

        // Dados de exemplo para serem gravados no arquivo (simula os dados consultados na API)
        var dados = new List<Documento>
        {
            new Cpf { Ni = "12345678901", Codigo = "001", Descricao = "CPF válido" },
            new Cnpj { Ni = "12345678000199", Codigo = "002", Motivo = "Empresa ativa", Data = "2024-01-01" }
        };

        // Escreve os dados no arquivo CSV
        GravarEmCsv(caminhoArquivo, dados);

        Console.WriteLine($"Arquivo CSV gerado com sucesso em: {caminhoArquivo}");
    }
    public class Excel
    {
        public static void GravarEmCsv(string caminhoArquivo, List<Documento> dados)
        {
            // Usa StringBuilder para montar o conteúdo do CSV
            StringBuilder csv = new StringBuilder();

            // Cabeçalhos do CSV
            csv.AppendLine("Tipo;CPF/CNPJ;Código;Descrição/Motivo;Data");

            // Para cada item nos dados, escreve uma linha no CSV
            foreach (var item in dados)
            {
                if (item is Cpf cpf)
                {
                    // Para CPF, gravamos os valores relevantes
                    csv.AppendLine($"CPF;{cpf.Ni};{cpf.Codigo};{cpf.Descricao};");
                }
                else if (item is Cnpj cnpj)
                {
                    // Para CNPJ, gravamos os valores relevantes
                    csv.AppendLine($"CNPJ;{cnpj.Ni};{cnpj.Codigo};{cnpj.Motivo};{cnpj.Data}");
                }
            }

            // Escreve o conteúdo do StringBuilder no arquivo
            File.WriteAllText(caminhoArquivo, csv.ToString(), Encoding.UTF8);
        }

    }
}
