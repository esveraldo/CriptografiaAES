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

        public async Task<(bool IsValid, DateTime ValidationDate)> ConsultarCpfCnpjAsync(string cpfOuCnpj)
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

                // Parseia o JSON da resposta (exemplo fictício)
                var resultado = ParseResponse(conteudoResposta);
                return (resultado.IsValid, resultado.ValidationDate);
            }
            else
            {
                throw new Exception($"Erro na consulta: {response.StatusCode}");
            }
        }

        private (bool IsValid, DateTime ValidationDate) ParseResponse(string json)
        {
            dynamic jsonResponse = JsonConvert.DeserializeObject(json);
            bool isValid = jsonResponse.valid;
            DateTime validationDate = jsonResponse.validationDate;

            return (isValid, validationDate);
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
            var resultados = new List<(string CpfCnpj, bool IsValid, DateTime ValidationDate)>();

            // Faz a consulta para cada CPF ou CNPJ
            foreach (var cpfCnpj in cpfsCnpjs)
            {
                try
                {
                    var resultado = await consultaService.ConsultarCpfCnpjAsync(cpfCnpj);
                    resultados.Add((cpfCnpj, resultado.IsValid, resultado.ValidationDate));
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

        private static void GravarEmExcel(string caminhoArquivoExcel, List<(string CpfCnpj, bool IsValid, DateTime ValidationDate)> resultados)
        {
            using (var fileStream = new FileStream(caminhoArquivoExcel, FileMode.Create, FileAccess.Write))
            using (var writer = ExcelWriterFactory.CreateWriter(fileStream))
            {
                // Cria uma nova planilha
                var sheet = writer.CreateSheet("Resultados");

                // Cabeçalhos
                var headerRow = sheet.CreateRow();
                headerRow.CreateCell(0).SetValue("CPF/CNPJ");
                headerRow.CreateCell(1).SetValue("Válido");
                headerRow.CreateCell(2).SetValue("Data de Validação");

                // Preenche os dados
                int rowIndex = 1;
                foreach (var resultado in resultados)
                {
                    var row = sheet.CreateRow(rowIndex);
                    row.CreateCell(0).SetValue(resultado.CpfCnpj);
                    row.CreateCell(1).SetValue(resultado.IsValid ? "Sim" : "Não");
                    row.CreateCell(2).SetValue(resultado.ValidationDate.ToString("dd/MM/yyyy"));
                    rowIndex++;
                }

                // Finaliza a escrita e salva o arquivo
                writer.Flush();
            }
        }
    }

}
