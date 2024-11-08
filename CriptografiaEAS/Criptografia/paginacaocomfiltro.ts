import { Component, OnInit } from '@angular/core';
import { ContatoService } from '../contato.service';

@Component({
    selector: 'app-contato-search',
    templateUrl: './contato-search.component.html',
    styleUrls: ['./contato-search.component.css']
})
export class ContatoSearchComponent implements OnInit {
    contatos: any[] = []; // Armazena todos os contatos carregados da API
    contatosFiltrados: any[] = []; // Lista exibida com filtro e paginação aplicados
    searchTerm: string = ''; // Termo de pesquisa
    page: number = 0; // Página atual
    pageSize: number = 10; // Tamanho da página
    totalItems: number = 0; // Total de itens filtrados

    constructor(private contatoService: ContatoService) { }

    ngOnInit(): void {
        this.carregarContatos();
    }

    // Método para buscar todos os contatos uma vez
    carregarContatos(): void {
        this.contatoService.getContatos().subscribe(
            (data) => {
                this.contatos = data;
                this.aplicarFiltroEPaginacao(); // Aplica o filtro e a paginação iniciais
            },
            (error) => {
                console.error('Erro ao carregar contatos:', error);
            }
        );
    }

    // Método para aplicar filtro e paginação à lista de contatos
    aplicarFiltroEPaginacao(): void {
        const filtered = this.contatos.filter(contato =>
            contato.nome.toLowerCase().includes(this.searchTerm.toLowerCase())
        );

        this.totalItems = filtered.length;

        // Paginação: obtém os contatos da página atual
        const startIndex = this.page * this.pageSize;
        this.contatosFiltrados = filtered.slice(startIndex, startIndex + this.pageSize);
    }

    // Propriedade para calcular o número total de páginas
    get totalPages(): number {
        return Math.ceil(this.totalItems / this.pageSize);
    }

    // Atualiza a lista ao alterar o termo de pesquisa
    onSearchTermChange(): void {
        this.page = 0; // Reinicia para a primeira página
        this.aplicarFiltroEPaginacao();
    }

    // Navega para uma página diferente
    onPageChange(newPage: number): void {
        this.page = newPage;
        this.aplicarFiltroEPaginacao();
    }
}

   /* <div class="search-container">
  <!-- Campo de pesquisa -->
  <input
    type="text"
    placeholder="Pesquisar contato"
    [(ngModel)]="searchTerm"
    (ngModelChange)="onSearchTermChange()"
  />

  <!-- Lista de contatos paginada -->
  <ul>
    <li *ngFor="let contato of contatosFiltrados">
      {{ contato.nome }}
    </li>
  </ul>

  <!-- Controles de paginação -->
  <div class="pagination-controls">
    <button (click)="onPageChange(page - 1)" [disabled]="page === 0">Anterior</button>
    <span>Página {{ page + 1 }} de {{ totalPages }}</span>
    <button (click)="onPageChange(page + 1)" [disabled]="page >= totalPages - 1">Próxima</button>
  </div>
</div>*/
