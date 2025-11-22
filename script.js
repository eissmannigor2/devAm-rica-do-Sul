document.addEventListener('DOMContentLoaded', () => {
    const cardContainer = document.querySelector('.card-container');
    const inputBusca = document.getElementById('input-busca');
    const botaoBusca = document.getElementById('botao-busca');
    const ctaButton = document.querySelector('.cta-button');
    let destinos = [];

    // Função para buscar os dados do JSON
    async function carregarDestinos() {
        // Mostra a mensagem de carregamento
        cardContainer.innerHTML = '<p style="text-align: center; width: 100%;">Carregando destinos...</p>';

        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            destinos = await response.json();
            await new Promise(resolve => setTimeout(resolve, 500)); // Simula um pequeno delay
            exibirDestinos(destinos);
        } catch (error) {
            console.error("Não foi possível carregar os destinos:", error);
            cardContainer.innerHTML = '<p style="text-align: center; width: 100%; color: var(--accent-color);">Erro ao carregar os destinos. Tente novamente mais tarde.</p>';
        }
    }

    // Função para exibir os cards na tela
    function exibirDestinos(listaDestinos) {
        cardContainer.innerHTML = ''; // Limpa o container antes de adicionar novos cards

        if (listaDestinos.length === 0) {
            cardContainer.innerHTML = '<p style="text-align: center; width: 100%;">Nenhum destino encontrado.</p>';
            return;
        }

        listaDestinos.forEach((destino, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.style.animationDelay = `${index * 0.05}s`; // Adiciona um pequeno delay para cada card
            card.innerHTML = `
                <img src="${destino.imagem}" alt="Imagem de ${destino.local}, ${destino.pais}">
                <h2>${destino.pais}</h2>
                <p><strong>Destino:</strong> ${destino.local}</p>
                <p><strong>Tipo:</strong> ${destino.tipo}</p>
                <p>${destino.descricao}</p>
                <a href="${destino.link}" target="_blank" rel="noopener noreferrer">Saiba Mais</a>
            `;
            cardContainer.appendChild(card);
        });
    }

    // Função para filtrar os destinos
    function filtrarDestinos() {
        const termoBusca = inputBusca.value.toLowerCase().trim();
        const destinosFiltrados = destinos.filter(destino => {
            return (
                destino.pais.toLowerCase().includes(termoBusca) ||
                destino.local.toLowerCase().includes(termoBusca) ||
                destino.tipo.toLowerCase().includes(termoBusca)
            );
        });
        exibirDestinos(destinosFiltrados);
    }

    // Função Debounce para otimizar a busca
    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Cria uma versão "debounced" da função de filtro
    const debouncedFiltrarDestinos = debounce(filtrarDestinos, 300);

    // Adiciona os eventos
    botaoBusca.addEventListener('click', filtrarDestinos);
    // Usa a versão debounced para o evento de digitação
    inputBusca.addEventListener('keyup', debouncedFiltrarDestinos);
    ctaButton.addEventListener('click', (event) => {
        event.preventDefault(); // Previne o comportamento padrão do link
        const secaoDestinos = document.querySelector(ctaButton.getAttribute('href'));
        if (secaoDestinos) {
            secaoDestinos.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    // Carrega os destinos ao iniciar a página
    carregarDestinos();
});