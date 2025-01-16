https://localhost:44354/api/v1/principal/buscarporversaoenome?versao=mlb2aKRaLFXH11OpaPZtkQ%3D%3D&nome=PU1tRihimpTjpJeDI%2BhKzw%3D%3D

https://localhost:44354/api/v1/principal/buscarporversaoenome?versao=mlb2aKRaLFXH11OpaPZtkQ==&nome=PU1tRihimpTjpJeDI+hKzw==

use percent_encoding:: { utf8_percent_encode, NON_ALPHANUMERIC };

fn main() {
    let base_url = "https://localhost:44354/api/v1/principal/buscarporversaoenome";
    let versao = "mlb2aKRaLFXH11OpaPZtkQ==";
    let nome = "PU1tRihimpTjpJeDI+hKzw==";

    // Codificar os parâmetros
    let versao_encoded = utf8_percent_encode(versao, NON_ALPHANUMERIC).to_string();
    let nome_encoded = utf8_percent_encode(nome, NON_ALPHANUMERIC).to_string();

    // Construir a URL
    let full_url = format!(
        "{}?versao={}&nome={}",
        base_url, versao_encoded, nome_encoded
    );

    println!("Full URL: {}", full_url);
}

