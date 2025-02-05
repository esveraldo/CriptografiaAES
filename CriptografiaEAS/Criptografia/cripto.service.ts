<!-- Modal de Visualização -->
<div class="modal fade" id="modalVisualizacao" tabindex="-1" aria-labelledby="modalVisualizacaoLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalVisualizacaoLabel">Detalhes da Versão</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p><strong>Versão:</strong> {{ itemSelecionado?.versao }}</p>
                <p><strong>Nome:</strong> {{ itemSelecionado?.nome }}</p>
                <p><strong>Tipo:</strong> {{ itemSelecionado?.tipo }}</p>
                <p><strong>Descrição:</strong> {{ itemSelecionado?.descricao }}</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal de Exclusão -->
<div class="modal fade" id="modalExclusao" tabindex="-1" aria-labelledby="modalExclusaoLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalExclusaoLabel">Confirmar Exclusão</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p>Tem certeza de que deseja excluir o item <strong>{{ itemSelecionado?.nome }}</strong>?</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-danger" (click)="confirmarExclusao()">Excluir</button>
            </div>
        </div>
    </div>
</div>