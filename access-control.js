/**
 * access-control.js
 * Gerencia a autenticação e o armazenamento/busca de posts no localStorage
 */

const STORAGE_KEY = 'tvpesqueira_posts'; // Chave para armazenar os posts
const AUTH_KEY = 'isAuthenticated';
const ROLE_KEY = 'userRole'; // 'admin' ou 'reporter'

// =========================================================================
// FUNÇÕES DE MANIPULAÇÃO DE DADOS (POSTS)
// =========================================================================

/**
 * Carrega todos os posts do localStorage.
 * @returns {Array} Uma lista de objetos post.
 */
function loadPosts() {
    const savedPosts = localStorage.getItem(STORAGE_KEY);
    // Simula alguns posts se o localStorage estiver vazio
    if (!savedPosts) {
        return initialPosts();
    }
    try {
        return JSON.parse(savedPosts);
    } catch (e) {
        console.error("Erro ao carregar posts do localStorage:", e);
        return [];
    }
}

/**
 * Salva a lista completa de posts no localStorage.
 * @param {Array} posts - A lista de posts a ser salva.
 */
function savePosts(posts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

/**
 * Encontra um post pelo seu ID.
 * @param {number} postId - O ID do post.
 * @returns {Object|null} O objeto post ou null se não for encontrado.
 */
function getPostById(postId) {
    const posts = loadPosts();
    return posts.find(p => p.id === postId) || null;
}

/**
 * Define a notícia mais recente como destaque principal e desativa o destaque anterior.
 * @param {Array} posts - A lista de posts.
 * @param {number} postId - O ID do post a ser promovido.
 */
function promoteToDestaque(posts, postId) {
    // 1. Remove destaque 'main' de qualquer outro post
    posts.forEach(p => {
        if (p.destaque === 'main') {
            p.destaque = null;
        }
    });
    // 2. Define o novo destaque
    const postToPromote = posts.find(p => p.id === postId);
    if (postToPromote) {
        postToPromote.destaque = 'main';
    }
}


// Mock de posts iniciais para garantir que a aplicação não comece vazia
function initialPosts() {
    const posts = [
        { 
            id: 1, 
            title: "Pesqueira Inova com Novo Parque Ecológico: Detalhes e Fotos", 
            category: "Cidade", 
            author: "Admin", 
            time: "2 horas", 
            img: "https://via.placeholder.com/800x450?text=Parque+Ecologico", 
            description: "A prefeitura de Pesqueira inaugurou um novo espaço verde, prometendo lazer e qualidade de vida para a população.", 
            content: "O projeto do novo parque ecológico foi desenvolvido ao longo de dois anos e finalmente aberto ao público nesta manhã. Ele conta com trilhas, áreas de piquenique e um lago artificial. A expectativa é que o local se torne um ponto turístico importante na região, atraindo visitantes de cidades vizinhas e promovendo a conscientização ambiental. \n\nDetalhes sobre os horários de funcionamento e regras de visitação serão divulgados em breve.",
            isVideo: false, 
            status: 'published',
            destaque: 'main', // Destaque principal
            createdAt: Date.now() - 3600000 
        },
        { 
            id: 2, 
            title: "Entrevista Exclusiva com o Secretário de Saúde sobre a Campanha de Vacinação", 
            category: "Política", 
            author: "Maria Repórter", 
            time: "1 dia", 
            img: "https://via.placeholder.com/400x225?text=Vacinacao", 
            description: "O secretário detalhou o plano de imunização e respondeu às dúvidas da população em um bate-papo exclusivo com a TvPesqueira.", 
            content: "Durante a entrevista, o Secretário reforçou a importância da vacinação para a saúde pública. Ele garantiu que há doses suficientes e incentivou a todos a comparecerem aos postos de saúde. \n\nA campanha será dividida em fases, priorizando idosos e grupos de risco, conforme as diretrizes do Ministério da Saúde. Mais informações podem ser encontradas no site oficial da prefeitura.",
            isVideo: true, 
            status: 'published',
            destaque: 'sub', // Sub-destaque
            createdAt: Date.now() - 86400000 
        },
        { 
            id: 3, 
            title: "Grande Final do Campeonato de Futsal Termina em Festa na Cidade", 
            category: "Esportes", 
            author: "João Repórter", 
            time: "2 dias", 
            img: "https://via.placeholder.com/800x450?text=Futsal", 
            description: "O time local levou a taça após uma partida emocionante. Veja os melhores momentos e o depoimento dos campeões.", 
            content: "A final do campeonato municipal de futsal atraiu uma multidão ao ginásio da cidade. A equipe 'Os Gaviões' venceu por 3x2 em uma disputa acirrada que só foi decidida nos minutos finais. O capitão do time campeão agradeceu o apoio da torcida e prometeu ainda mais títulos para o próximo ano. \n\nO evento foi um sucesso de organização e público.",
            isVideo: false, 
            status: 'published',
            destaque: '', 
            createdAt: Date.now() - (2 * 86400000) 
        },
        { 
            id: 4, 
            title: "Agricultores Locais Reportam Perdas Devido à Seca Prolongada", 
            category: "Economia", 
            author: "Redação", 
            time: "3 dias", 
            img: "https://via.placeholder.com/400x225?text=Seca", 
            description: "A falta de chuva afeta lavouras e pecuária, exigindo medidas emergenciais por parte do governo estadual.", 
            content: "A seca tem sido um desafio persistente na região, e os agricultores estão pedindo socorro. O governo estadual prometeu auxílio emergencial e a distribuição de cestas básicas para as famílias mais atingidas. \n\nLíderes comunitários se reuniram para discutir a criação de um sistema de irrigação mais resiliente para o futuro.",
            isVideo: false, 
            status: 'draft', // Rascunho, não aparece no front-end
            destaque: '', 
            createdAt: Date.now() - (3 * 86400000) 
        },
        { 
            id: 5, 
            title: "Novo Ponto Turístico Inaugurado na Cidade", 
            category: "Cidade", 
            author: "Redação", 
            time: "5 horas", 
            img: "https://via.placeholder.com/240x150?text=Ponto+Turistico", 
            description: "Visitantes já podem apreciar a nova atração local.", 
            content: "A cidade agora conta com um novo mirante no topo da Serra da Aldeia. O local oferece uma vista panorâmica de tirar o fôlego e deve atrair muitos turistas nos próximos meses. \n\nA inauguração contou com a presença de autoridades locais e shows musicais.",
            isVideo: false, 
            status: 'published',
            destaque: '', 
            createdAt: Date.now() - 18000000 
        }
    ];

    savePosts(posts); // Salva os posts iniciais no localStorage
    return posts;
}


// =========================================================================
// FUNÇÕES DE AUTENTICAÇÃO
// =========================================================================

/**
 * Verifica se o usuário está logado.
 * @returns {boolean}
 */
function isLoggedIn() {
    return localStorage.getItem(AUTH_KEY) === 'true';
}

/**
 * Obtém a função do usuário logado.
 * @returns {string|null} 'admin', 'reporter' ou null.
 */
function getUserRole() {
    return localStorage.getItem(ROLE_KEY);
}

/**
 * Define o nome do usuário logado no topo da barra lateral.
 */
function setDisplayName() {
    const displayNameElement = document.getElementById('user-display-name');
    const role = getUserRole();
    if (displayNameElement && role) {
        displayNameElement.textContent = role.charAt(0).toUpperCase() + role.slice(1);
    }
}

/**
 * Verifica o login e a função (role). Redireciona para o login se falhar.
 * Assume que apenas 'admin' e 'reporter' podem acessar as páginas do Admin.
 * @returns {boolean} Se o acesso for permitido.
 */
function checkLoginAndRole() {
    if (!isLoggedIn()) {
        alert("Acesso negado. Por favor, faça login.");
        window.location.href = 'login.html';
        return false;
    }
    setDisplayName();
    return true;
}

/**
 * Tenta simular o login.
 * @param {string} username - Nome de usuário.
 * @param {string} password - Senha (ignorado na simulação).
 * @returns {boolean} Sucesso do login.
 */
function attemptLogin(username, password) {
    // 🚨 SIMULAÇÃO DE BANCO DE DADOS/USUÁRIOS 🚨
    const users = {
        'admin@tvp.com': { role: 'admin' },
        'reporter1@tvp.com': { role: 'reporter' },
        'reporter2@tvp.com': { role: 'reporter' },
        // Adicione mais usuários se necessário.
    };
    
    // A senha é ignorada nesta simulação simples, mas o login é verificado pelo e-mail
    if (users[username]) {
        localStorage.setItem(AUTH_KEY, 'true');
        localStorage.setItem(ROLE_KEY, users[username].role);
        return true;
    }

    return false;
}

/**
 * Executa o logout e redireciona.
 */
function logout() {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(ROLE_KEY);
    alert("Sessão encerrada.");
    window.location.href = 'index.html';
}

// Expõe as funções essenciais globalmente
window.loadPosts = loadPosts;
window.savePosts = savePosts;
window.getPostById = getPostById;
window.isLoggedIn = isLoggedIn;
window.getUserRole = getUserRole;
window.attemptLogin = attemptLogin;
window.checkLoginAndRole = checkLoginAndRole;
window.logout = logout;
window.promoteToDestaque = promoteToDestaque;