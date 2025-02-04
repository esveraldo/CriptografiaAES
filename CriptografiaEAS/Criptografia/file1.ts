import { Component, OnInit } from '@angular/core';

import { ObterCredCestaResponse } from 'src/app/models/responses/credcesta/obter-credcesta-get.response.model';
import { ObterTodosMFacilResponse } from 'src/app/models/responses/mfacil/obter-mfacil-get.response.model';

import { ObterTodosCredCestaService } from 'src/app/services/credcesta.service';
import { ObterTodosMFacilService } from 'src/app/services/mfacil.service';

@Component({
    selector: 'app-obter',
    templateUrl: './obter-registros.component.html',
    styleUrls: ['./obter-registros.component.css']
})
export class ObterRegistrosComponent implements OnInit {

    // Dados de ambas as fontes
    obterTodos: Array<{ id: string; nome: string; tipo: string }> = [];
    visaoObterTodos: Array<{ id: string; nome: string; tipo: string }> = [];
    obterVersao: { id: string; nome: string; tipo: string } | null = null;

    // Controle de paginação e filtros
    pagina: number = 0;
    tamanho: number = 10;
    totalDePaginas!: number;
    termoDePesquisa: string = '';
    mensagem: string = '';

    constructor(
        private obterTodosCredCestaService: ObterTodosCredCestaService,
        private obterTodosMFacilService: ObterTodosMFacilService
    ) { }

    ngOnInit(): void {
        this.carregarDados();
    }

    carregarDados(): void {
        const credCesta$ = this.obterTodosCredCestaService.getAllCredCesta();
        const mFacil$ = this.obterTodosMFacilService.getAllMFacil();

        forkJoin([credCesta$, mFacil$]).subscribe({
            next: ([credCestaData, mFacilData]) => {
                // Adapte os dados de ambas as fontes para a estrutura unificada
                this.obterTodos = [
                    ...credCestaData.map(data => ({ id: data.id, nome: data.nome, tipo: 'CredCesta' })),
                    ...mFacilData.map(data => ({ id: data.id, nome: data.nome, tipo: 'MFacil' }))
                ];
                this.aplicarFiltroEPaginacao();
            },
            error: (e) => {
                console.log('Erro ao carregar dados:', e);
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

    setContato(obterVersao: { id: string; nome: string; tipo: string }): void {
        this.obterVersao = obterVersao;
    }

    onDelete(): void {
        if (this.obterVersao) {
            if (this.obterVersao.tipo === 'CredCesta') {
                this.obterTodosCredCestaService.deleteCredCesta(this.obterVersao.id)
                    .subscribe({
                        next: () => {
                            this.mensagem = `Versão excluída com sucesso.`;
                            this.ngOnInit();
                        },
                        error: (e) => {
                            this.mensagem = "Falha ao excluir a versão.";
                            console.log(e.error);
                        }
                    });
            } else if (this.obterVersao.tipo === 'MFacil') {
                this.obterTodosMFacilService.deleteMFacil(this.obterVersao.id)
                    .subscribe({
                        next: () => {
                            this.mensagem = `Versão excluída com sucesso.`;
                            this.ngOnInit();
                        },
                        error: (e) => {
                            this.mensagem = "Falha ao excluir a versão.";
                            console.log(e.error);
                        }
                    });
            }
        } else {
            this.mensagem = "Nenhuma versão selecionada.";
        }
    }

    onGetById(id: string, tipo: string): void {
        if (tipo === 'CredCesta') {
            this.obterTodosCredCestaService.getByIdCredCesta(id)
                .subscribe({
                    next: (data) => {
                        this.obterVersao = { id: data.id, nome: data.nome, tipo: 'CredCesta' };
                    },
                    error: (e) => {
                        this.mensagem = "Erro ao buscar os dados.";
                        console.log(e);
                    }
                });
        } else if (tipo === 'MFacil') {
            this.obterTodosMFacilService.getByIdMFacil(id)
                .subscribe({
                    next: (data) => {
                        this.obterVersao = { id: data.id, nome: data.nome, tipo: 'MFacil' };
                    },
                    error: (e) => {
                        this.mensagem = "Erro ao buscar os dados.";
                        console.log(e);
                    }
                });
        }
    }
}