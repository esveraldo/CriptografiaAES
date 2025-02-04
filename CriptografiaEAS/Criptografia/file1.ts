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






<div class="container mt-4" >

    <!--Título -->
        <h2 class="mb-4" > Lista de Registros < /h2>

            < !--Campo de pesquisa-- >
                <div class="input-group mb-3" >
                    <input 
      type="text"
class="form-control"
placeholder = "Pesquisar por nome..."
[(ngModel)] = "termoDePesquisa"
    (input) = "pesquisarTermo()"
    >
    </div>

    < !--Tabela de registros-- >
        <table class="table table-striped" >
            <thead>
            <tr>
            <th>ID < /th>
            < th > Nome < /th>
            < th > Tipo < /th>
            < th > Ações < /th>
            < /tr>
            < /thead>
            < tbody >
            <tr * ngFor="let item of visaoObterTodos" >
                <td>{{ item.id }}</td>
                    < td > {{ item.nome }}</td>
                        < td > {{ item.tipo }}</td>
                            < td >
                            <button class="btn btn-info btn-sm me-2"(click) = "onGetById(item.id, item.tipo)" >
                                Detalhes
                                < /button>
                                < button class="btn btn-danger btn-sm"(click) = "setContato(item); onDelete()" >
                                    Excluir
                                    < /button>
                                    < /td>
                                    < /tr>
                                    < /tbody>
                                    < /table>

                                    < !--Mensagem de feedback-- >
                                        <div * ngIf="mensagem" class="alert alert-info mt-3" > {{ mensagem }}</div>

                                            < !--Paginação -->
                                                <nav * ngIf="totalPaginas > 1" aria - label="Navegação de páginas" >
                                                    <ul class="pagination justify-content-center mt-4" >
                                                        <li class="page-item"[class.disabled] = "pagina === 0" >
                                                            <button class="page-link"(click) = "mudancaDePagina(pagina - 1)" > Anterior < /button>
                                                                < /li>
                                                                < li
class="page-item"
    * ngFor="let page of [].constructor(totalPaginas); let i = index"
    [class.active] = "pagina === i"
        >
        <button class="page-link"(click) = "mudancaDePagina(i)" > {{ i + 1 }}</button>
            < /li>
            < li class="page-item"[class.disabled] = "pagina === totalPaginas - 1" >
                <button class="page-link"(click) = "mudancaDePagina(pagina + 1)" > Próximo < /button>
                    < /li>
                    < /ul>
                    < /nav>
                    < /div>


src/app/components/admin/obter-registros/obter-registros.component.ts:12:18
    12     templateUrl: './obter-registros.component.html',
                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Error occurs in the template of component ObterRegistrosComponent.


Error: src/app/components/admin/obter-registros/obter-registros.component.html:24:85 - error TS23
39: Property 'item' does not exist on type 'ObterRegistrosComponent'.

24                         <button class="btn btn-info btn-sm me-2" (click)="onGetById(item.id, i
tem.tipo)">
                                                                                       ~~~~

  src/app/components/admin/obter-registros/obter-registros.component.ts:12:18
    12     templateUrl: './obter-registros.component.html',
                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Error occurs in the template of component ObterRegistrosComponent.


Error: src/app/components/admin/obter-registros/obter-registros.component.html:24:94 - error TS23
39: Property 'item' does not exist on type 'ObterRegistrosComponent'.

24                         <button class="btn btn-info btn-sm me-2" (click)="onGetById(item.id, i
tem.tipo)">
                                                                                                ~
~~~

  src/app/components/admin/obter-registros/obter-registros.component.ts:12:18
    12     templateUrl: './obter-registros.component.html',
                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Error occurs in the template of component ObterRegistrosComponent.


Error: src/app/components/admin/obter-registros/obter-registros.component.html:27:83 - error TS23
39: Property 'item' does not exist on type 'ObterRegistrosComponent'.

27                         <button class="btn btn-danger btn-sm" (click)="setContato(item); onDel
ete()">
                                                                                     ~~~~

  src/app/components/admin/obter-registros/obter-registros.component.ts:12:18
    12     templateUrl: './obter-registros.component.html',
                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Error occurs in the template of component ObterRegistrosComponent.


Error: src/app/components/admin/obter-registros/obter-registros.component.html:44:52 - error TS23
39: Property 'i' does not exist on type 'ObterRegistrosComponent'.

44                         [class.active]="pagina === i">
                                                      ~

  src/app/components/admin/obter-registros/obter-registros.component.ts:12:18
    12     templateUrl: './obter-registros.component.html',
                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Error occurs in the template of component ObterRegistrosComponent.


Error: src/app/components/admin/obter-registros/obter-registros.component.html:45:76 - error TS23
39: Property 'i' does not exist on type 'ObterRegistrosComponent'.

45                         <button class="page-link" (click)="mudancaDePagina(i)"> {{ i + 1 }}</b
utton>
                                                                              ~

  src/app/components/admin/obter-registros/obter-registros.component.ts:12:18
    12     templateUrl: './obter-registros.component.html',
                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Error occurs in the template of component ObterRegistrosComponent.


Error: src/app/components/admin/obter-registros/obter-registros.component.html:45:84 - error TS23
39: Property 'i' does not exist on type 'ObterRegistrosComponent'.

45                         <button class="page-link" (click)="mudancaDePagina(i)"> {{ i + 1 }}</b
utton>
                                                                                      ~

  src/app/components/admin/obter-registros/obter-registros.component.ts:12:18
    12     templateUrl: './obter-registros.component.html',
                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Error occurs in the template of component ObterRegistrosComponent.




× Failed to compile.
