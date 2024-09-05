using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CriptografiaEAS.Rotina
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // Caminhos para os arquivos CSV
            string caminhoArquivoCpf = "resultadoCpf.csv";
            string caminhoArquivoCnpj = "resultadoCnpj.csv";

            // Dados de exemplo para serem gravados nos arquivos (simula os dados consultados na API)
            var dados = new List<Documento>
        {
            new Cpf { Ni = "12345678901", Codigo = "001", Descricao = "CPF válido" },
            new Cnpj { Ni = "12345678000199", Codigo = "002", Motivo = "Empresa ativa", Data = "2024-01-01" },
            new Cpf { Ni = "98765432100", Codigo = "003", Descricao = "CPF inválido" },
            new Cnpj { Ni = "98765432000188", Codigo = "004", Motivo = "Empresa inativa", Data = "2024-06-15" }
        };

            // Separar os dados em CPFs e CNPJs
            var dadosCpf = dados.OfType<Cpf>().ToList();
            var dadosCnpj = dados.OfType<Cnpj>().ToList();

            // Escreve os dados nos arquivos separados
            if (dadosCpf.Any())
            {
                GravarEmCsv(caminhoArquivoCpf, dadosCpf);
                Console.WriteLine($"Arquivo CSV de CPF gerado com sucesso em: {caminhoArquivoCpf}");
            }

            if (dadosCnpj.Any())
            {
                GravarEmCsv(caminhoArquivoCnpj, dadosCnpj);
                Console.WriteLine($"Arquivo CSV de CNPJ gerado com sucesso em: {caminhoArquivoCnpj}");
            }
        }

        // Método genérico para gravar dados em CSV
        public static void GravarEmCsv<T>(string caminhoArquivo, List<T> dados) where T : Documento
        {
            StringBuilder csv = new StringBuilder();

            if (typeof(T) == typeof(Cpf))
            {
                // Cabeçalho para CPF
                csv.AppendLine("Tipo;CPF;Código;Descrição");
                foreach (var item in dados.Cast<Cpf>())
                {
                    csv.AppendLine($"CPF;{item.Ni};{item.Codigo};{item.Descricao}");
                }
            }
            else if (typeof(T) == typeof(Cnpj))
            {
                // Cabeçalho para CNPJ
                csv.AppendLine("Tipo;CNPJ;Código;Motivo;Data");
                foreach (var item in dados.Cast<Cnpj>())
                {
                    csv.AppendLine($"CNPJ;{item.Ni};{item.Codigo};{item.Motivo};{item.Data}");
                }
            }

            // Escreve o conteúdo no arquivo
            File.WriteAllText(caminhoArquivo, csv.ToString(), Encoding.UTF8);
        }
    }

    // Classes de exemplo para Cpf, Cnpj e Documento
    public class Documento
    {
        public string Ni { get; set; } // Número de Identificação (CPF ou CNPJ)
    }

    public class Cpf : Documento
    {
        public string Codigo { get; set; }
        public string Descricao { get; set; }
    }

    public class Cnpj : Documento
    {
        public string Codigo { get; set; }
        public string Motivo { get; set; }
        public string Data { get; set; }
    }
}
