using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Newtonsoft.Json;
using ExcelDataWriter;  // Biblioteca ExcelDataWriter

namespace CriptografiaEAS.Rotina
{
    public class ConsultaService
    {
        private readonly HttpClient _httpClient;

        public ConsultaService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<Documento> ConsultarCpfCnpjAsync(string cpfOuCnpj)
        {
            // Remove caracteres especiais antes de consultar a API
            string cpfCnpjLimpo = RemoverCaracteresEspeciais(cpfOuCnpj);

            // Determina o endpoint com base no tamanho do número (11 dígitos para CPF e 14 para CNPJ)
            string apiUrl = cpfCnpjLimpo.Length == 11
                ? $"https://api.externa.com/consulta-cpf/{cpfCnpjLimpo}"  // Endpoint de CPF
                : $"https://api.externa.com/consulta-cnpj/{cpfCnpjLimpo}"; // Endpoint de CNPJ

            // Faz a requisição GET para a API externa
            HttpResponseMessage response = await _httpClient.GetAsync(apiUrl);

            if (response.IsSuccessStatusCode)
            {
                string conteudoResposta = await response.Content.ReadAsStringAsync();

                // Parseia o JSON da resposta e retorna a instância apropriada (Cpf ou Cnpj)
                return _ = ParseResponse(cpfCnpjLimpo.Length, conteudoResposta);
            }
            else
            {
                throw new Exception($"Erro na consulta: {response.StatusCode}");
            }
        }

        private Documento ParseResponse(int length, string json)
        {
            // Verifica se é CPF ou CNPJ e popula os dados adequados
            if (length == 11)
            {
                return JsonConvert.DeserializeObject<Cpf>(json);
            }
            else
            {
                return JsonConvert.DeserializeObject<Cnpj>(json);
            }
        }

        private string RemoverCaracteresEspeciais(string input)
        {
            return Regex.Replace(input, @"[^\d]", ""); // Remove tudo que não for dígito
        }
    }

    public class Program
    {
        public static async Task Main(string[] args)
        {
            string caminhoArquivoTxt = "dados.txt";  // Caminho do arquivo .txt de entrada
            string caminhoArquivoExcel = "resultado.xlsx"; // Caminho do arquivo Excel de saída

            // Instancia o serviço de consulta
            var consultaService = new ConsultaService(new HttpClient());

            // Ler o arquivo .txt
            var cpfsCnpjs = LerArquivoTxt(caminhoArquivoTxt);

            // Cria uma lista para armazenar os resultados
            var resultados = new List<Documento>();

            // Faz a consulta para cada CPF ou CNPJ
            foreach (var cpfCnpj in cpfsCnpjs)
            {
                try
                {
                    var resultado = await consultaService.ConsultarCpfCnpjAsync(cpfCnpj);
                    resultados.Add(resultado);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Erro ao consultar {cpfCnpj}: {ex.Message}");
                }
            }

            // Grava os resultados em um arquivo Excel usando ExcelDataWriter
            GravarEmExcel(caminhoArquivoExcel, resultados);
        }

        private static List<string> LerArquivoTxt(string caminhoArquivoTxt)
        {
            // Lê o arquivo .txt e retorna uma lista de CPFs/CNPJs
            return File.ReadAllLines(caminhoArquivoTxt).ToList();
        }

        private static void GravarEmExcel(string caminhoArquivoExcel, List<Documento> resultados)
        {
            using (var fileStream = new FileStream(caminhoArquivoExcel, FileMode.Create, FileAccess.Write))
            using (var writer = ExcelWriterFactory.CreateWriter(fileStream))
            {
                // Cria uma nova planilha
                var sheet = writer.CreateSheet("Resultados");

                // Cabeçalhos
                var headerRow = sheet.CreateRow();
                headerRow.CreateCell(0).SetValue("CPF/CNPJ");
                headerRow.CreateCell(1).SetValue("Código");
                headerRow.CreateCell(2).SetValue("Descrição/Motivo");
                headerRow.CreateCell(3).SetValue("Data");

                // Preenche os dados
                int rowIndex = 1;
                foreach (var resultado in resultados)
                {
                    var row = sheet.CreateRow(rowIndex);

                    // Verifica se o documento é Cpf ou Cnpj para preencher corretamente
                    if (resultado is Cpf cpf)
                    {
                        row.CreateCell(0).SetValue(cpf.Ni);            // CPF
                        row.CreateCell(1).SetValue(cpf.Codigo);        // Código
                        row.CreateCell(2).SetValue(cpf.Descricao);     // Descrição
                        row.CreateCell(3).SetValue(string.Empty);      // Sem data para CPF
                    }
                    else if (resultado is Cnpj cnpj)
                    {
                        row.CreateCell(0).SetValue(cnpj.Ni);           // CNPJ
                        row.CreateCell(1).SetValue(cnpj.Codigo);       // Código
                        row.CreateCell(2).SetValue(cnpj.Motivo);       // Motivo
                        row.CreateCell(3).SetValue(cnpj.Data);         // Data
                    }

                    rowIndex++;
                }

                // Finaliza a escrita e salva o arquivo
                writer.Flush();
            }
        }
    }
}
