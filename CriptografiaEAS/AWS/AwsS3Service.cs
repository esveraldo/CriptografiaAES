using Amazon.S3;
using Amazon.S3.Model;
using System.Net.Http;
using System.Text;
using System.IO;
using System.Globalization;
using CsvHelper;
using CsvHelper.Configuration;
using Amazon;
using System.Formats.Asn1;

public class AwsS3Service
{
    private readonly IAmazonS3 _s3Client;
    private readonly HttpClient _httpClient;

    public AwsS3Service(IAmazonS3 s3Client, HttpClient httpClient)
    {
        _s3Client = s3Client;
        _httpClient = httpClient;
    }

    // Método principal
    public async Task ProcessFileFromS3(string bucketName, string inputFileKey, string outputFileKey)
    {
        // 1. Ler o arquivo .txt do S3
        var fileContent = await ReadTextFileFromS3(bucketName, inputFileKey);
        if (string.IsNullOrEmpty(fileContent))
        {
            Console.WriteLine("O arquivo .txt está vazio.");
            return;
        }

        // 2. Fazer consultas e gerar arquivo CSV
        var csvData = await ProcessFileContentAndQueryApi(fileContent);

        // 3. Gravar arquivo CSV no S3
        await WriteCsvToS3(bucketName, outputFileKey, csvData);
    }

    // Leitura do arquivo .txt do S3
    private async Task<string> ReadTextFileFromS3(string bucketName, string fileKey)
    {
        var request = new GetObjectRequest
        {
            BucketName = bucketName,
            Key = fileKey
        };

        using (var response = await _s3Client.GetObjectAsync(request))
        using (var reader = new StreamReader(response.ResponseStream))
        {
            return await reader.ReadToEndAsync();
        }
    }

    // Processamento do conteúdo do arquivo e consulta na API
    private async Task<List<ResultDto>> ProcessFileContentAndQueryApi(string fileContent)
    {
        var lines = fileContent.Split(new[] { "\r\n", "\r", "\n" }, StringSplitOptions.None);
        var results = new List<ResultDto>();

        foreach (var line in lines)
        {
            if (!string.IsNullOrWhiteSpace(line))
            {
                var cleanedDocument = CleanSpecialCharacters(line);

                // Faz consulta na API
                var result = await ConsultarApi(cleanedDocument);

                if (result != null)
                {
                    results.Add(result);
                }
            }
        }

        return results;
    }

    // Limpar caracteres especiais do CPF/CNPJ
    private string CleanSpecialCharacters(string document)
    {
        return new string(document.Where(c => char.IsDigit(c)).ToArray());
    }

    // Consulta na API externa
    private async Task<ResultDto> ConsultarApi(string document)
    {
        var url = $"https://api.externa.com/consultar?document={document}";
        var response = await _httpClient.GetAsync(url);

        if (response.IsSuccessStatusCode)
        {
            var jsonResult = await response.Content.ReadAsStringAsync();
            return Newtonsoft.Json.JsonConvert.DeserializeObject<ResultDto>(jsonResult);
        }

        return null;
    }

    // Gravação do arquivo CSV no S3
    private async Task WriteCsvToS3(string bucketName, string fileKey, List<ResultDto> csvData)
    {
        using (var memoryStream = new MemoryStream())
        using (var streamWriter = new StreamWriter(memoryStream))
        using (var csvWriter = new CsvWriter(streamWriter, new CsvConfiguration(CultureInfo.InvariantCulture)))
        {
            csvWriter.WriteRecords(csvData);
            streamWriter.Flush();
            memoryStream.Position = 0;

            var putRequest = new PutObjectRequest
            {
                BucketName = bucketName,
                Key = fileKey,
                InputStream = memoryStream,
                ContentType = "text/csv"
            };

            await _s3Client.PutObjectAsync(putRequest);
        }
    }

    //COMO USAR
    public static async Task Main(string[] args)
    {
        var s3Client = new AmazonS3Client(RegionEndpoint.USEast1); // Região do seu bucket
        var httpClient = new HttpClient();

        var service = new AwsS3Service(s3Client, httpClient);

        // Nome do bucket, chave do arquivo .txt e nome do arquivo .csv de saída
        await service.ProcessFileFromS3("meu-bucket", "input/arquivo.txt", "output/resultado.csv");
    }
}

// DTO para os resultados da consulta
public class ResultDto
{
    public string Codigo { get; set; }
    public string Descricao { get; set; }
    public string Motivo { get; set; }
    public string Data { get; set; }
}
