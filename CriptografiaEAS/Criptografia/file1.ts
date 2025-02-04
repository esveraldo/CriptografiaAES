import { Component, OnInit } from '@angular/core';

import { ObterCredCestaResponse } from "src/app/models/responses/credcesta/obter-credcesta-get.response.model";
import { ObterTodosCredCestaService } from "src/app/services/credcesta.service";

@Component({
  selector: 'app-obter',
  templateUrl: './obter-registros.component.html',
  styleUrls: ['./obter-registros.component.css']
})
export class ObterRegistrosComponent implements OnInit {

  obterTodos: ObterCredCestaResponse[] = []; 
  obterVersao: ObterCredCestaResponse | null = null;
  obterTodosNumber: number = this.obterTodos.length;
  mensagem: string = '';

  visaoObterTodos: ObterCredCestaResponse[] = [];
  pagina: number = 0;
  tamanho: number = 10;
  totalDePaginas!: number;

  termoDePesquisa: string = '';

  constructor(
    private obterTodosService: ObterTodosCredCestaService
  ) {
  }

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.obterTodosService.getAllCredCesta().subscribe({
        next : (data) => {
          this.obterTodos = data;
          this.aplicarFiltroEPaginacao();
        }, 
        error: (e) =>{
          console.log(e);
        }
    });
  }

  aplicarFiltroEPaginacao(): void {
    const filtered = this.obterTodos.filter(obter =>
        obter.nome.toLowerCase().includes(this.termoDePesquisa.toLowerCase())
    );

    this.totalDePaginas = filtered.length;

    const inicio = this.pagina * this.tamanho;
    this.visaoObterTodos = filtered.slice(inicio, inicio + this.tamanho);
}

get totalPaginas(): number {
    return Math.ceil(this.totalDePaginas / this.tamanho);
}

pesquisarTermo(): void {
    this.pagina = 0; 
    this.aplicarFiltroEPaginacao();
}

mudancaDePagina(newPage: number): void {
    this.pagina = newPage;
    this.aplicarFiltroEPaginacao();
}

setContato(obterVersao: ObterCredCestaResponse): void {
  this.obterVersao = obterVersao;
}

onDelete() : void {
  this.obterTodosService.deleteCredCesta(this.obterVersao?.id as string)
    .subscribe({
      next: (data) => {
        this.mensagem = `Versão excluida com sucesso.`;
        this.ngOnInit(); 
      },
      error: (e) => {
        this.mensagem = "Falha ao excluir o versão";
        console.log(e.error);
      }
    })
}

onGetById(id: string): void {
  this.obterTodosService.getByIdCredCesta(id)
  .subscribe({
    next: (data) => {
      this.obterVersao = data;
    },
    error: (e) => {
      this.mensagem = "Erro ao buscar os dados.";
    }
  })
}
}


