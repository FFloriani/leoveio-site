# 🎮 LeoVeio - Site do Streamer

Um site moderno e interativo para o streamer LeoVeio, construído com as tecnologias mais avançadas para proporcionar uma experiência visual impressionante.

## ✨ Características

- **🎯 Hero Banner Impressionante**: Design futurista com gradientes, efeitos de blur e animações suaves
- **📺 Player Twitch Integrado**: Stream ao vivo incorporado diretamente no site
- **🎨 Animações Fluidas**: Powered by Framer Motion para transições cinematográficas  
- **⚡ Performance Otimizada**: Next.js 15 com App Router para carregamento ultra-rápido
- **📱 Design Responsivo**: Experiência perfeita em desktop, tablet e mobile
- **🌈 Visual Moderno**: Gradientes dinâmicos, glassmorphism e efeitos visuais avançados

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática para código mais robusto
- **Tailwind CSS** - Estilização utilitária para desenvolvimento rápido
- **Framer Motion** - Animações e transições suaves

### Design & UI
- **Lucide React** - Ícones modernos e consistentes
- **Geist Font** - Tipografia elegante do Vercel
- **Gradientes Dinâmicos** - Paleta de cores gaming (purple, pink, cyan)

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone [URL-DO-REPO]
cd leoveio-streamer-site

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev
```

O site estará disponível em `http://localhost:3000`

## 🎨 Componentes

### HeroBanner
Componente principal que inclui:
- Informações do streamer com status de live em tempo real
- Player da Twitch incorporado
- Botões de ação interativos
- Estatísticas sociais
- Efeitos visuais avançados

## 📦 Estrutura do Projeto

```
src/
├── app/
│   ├── layout.tsx      # Layout raiz da aplicação
│   ├── page.tsx        # Página inicial
│   └── globals.css     # Estilos globais
└── components/
    └── HeroBanner.tsx  # Componente hero principal
```

## 🔧 Personalização

### Alterar Canal da Twitch
No componente `HeroBanner.tsx`, modifique o parâmetro `channel` na URL do iframe:

```typescript
src="https://player.twitch.tv/?channel=SEU_CANAL&..."
```

### Cores e Tema
As cores principais estão definidas usando Tailwind CSS. Para personalizar:

- **Roxo**: `purple-500`, `purple-400`
- **Rosa**: `pink-500`, `pink-400`  
- **Ciano**: `cyan-500`, `cyan-400`

### Animações
As animações são controladas via Framer Motion. Para ajustar:

```typescript
// Exemplo de customização de animação
initial={{ opacity: 0, x: -100 }}
animate={{ opacity: 1, x: 0 }}
transition={{ duration: 0.8, ease: "easeOut" }}
```

## 🎯 Próximos Passos

- [ ] Sistema de chat integrado
- [ ] Seção de highlights/clipes
- [ ] Galeria de screenshots
- [ ] Sistema de notificações de live
- [ ] Integração com Discord
- [ ] Dashboard de analytics

## 📄 Licença

Este projeto foi desenvolvido para o streamer LeoVeio.

---

**Desenvolvido com 💜 usando Next.js + Tailwind + Framer Motion**
