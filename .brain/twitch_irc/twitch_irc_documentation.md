# Twitch IRC - Documentação Completa

## Fonte: https://dev.twitch.tv/docs/irc

---

# Twitch Chat & Chatbots

Chat é uma parte essencial da experiência Twitch, permitindo que membros da comunidade, streamers e chatbots interajam entre si em tempo real.

## Métodos de Conexão

A Twitch fornece:
1. **EventSub** - Método preferido para ler/enviar chats
2. **API Twitch** - Para enviar mensagens
3. **IRC Interface** - Método legado (baseado em RFC1459 modificado + IRCv3 Message Tags)

**IMPORTANTE:** Twitch IRC tem funcionalidades limitadas. Para funcionalidade completa, use EventSub + API.

---

# O que é um Chatbot?

Um "chatbot" é um software de terceiros que age em nome de um usuário em uma ou mais salas de chat da Twitch. Ele aparece no chat como qualquer outro usuário real.

## Tipos de Chatbots

### 1. Cloud Chatbots
- Hospedados fora do sistema do usuário
- Projetados para operar em grande escala
- Usuário não precisa instalar software
- Pode precisar autenticar ou adicionar como moderador

### 2. Installed Chatbots
- Hospedados no sistema do usuário
- Inclui programas standalone e overlays OBS
- Usuário precisa autenticar

### 3. Chat Clients
- Interfaces para acessar o chat Twitch
- Para casos de uso específicos (moderação, UI flexível)
- Usuário precisa autenticar

---

# Rate Limits

## Limites de API Twitch
- Bucket separado para Send Chat Message API
- Não afeta o bucket normal de rate limit

## Limites de Chat Twitch

### Conta Normal:
| Tipo | Limite |
|------|--------|
| Mensagens no próprio canal | 20/30s |
| Mensagens em outros canais | 20/30s |

### Conta Verificada:
| Tipo | Limite |
|------|--------|
| Mensagens no próprio canal | 7500/30s |
| Mensagens em outros canais | 20/30s |

**Se exceder:** Twitch ignora mensagens por **1 hora**.

## Limites de Join Concorrente
- Limite: **100 salas** por conta (desde Maio 2024)
- Exceções:
  - Broadcaster ou moderador não conta
  - Autorizado pelo broadcaster com scope `channel:bot`

## Limites de Join Rate

### Conta Normal:
- 20 joins por 10 segundos
- 20 autenticações por 10 segundos (IRC only)

### Conta Verificada:
- 2000 joins por 10 segundos
- 200 autenticações por 10 segundos (IRC only)

---

# Conectando ao Servidor IRC Twitch

## Endereços do Servidor

| Protocolo | URI | Porta |
|-----------|-----|-------|
| IRC over TLS/SSL | irc.chat.twitch.tv | 6697 |
| IRC without TLS | irc.chat.twitch.tv | 6667 |
| WebSocket over TLS | wss://irc-ws.chat.twitch.tv | 443 |
| WebSocket without TLS | ws://irc-ws.chat.twitch.tv | 80 |

**NOTA:** Conexões sem TLS estão sendo descontinuadas.

---

# Autenticação

## Requisitos
1. User Access Token com scopes:
   - `chat:read` - para ler mensagens
   - `chat:write` - para enviar mensagens

## Sequência de Autenticação

```
1. PASS oauth:<token>
2. NICK <username_lowercase>
```

### Exemplo:
```
PASS oauth:yfvzjqb705z12hrhy1zkwa9xt7v662
NICK twitchdev
```

### Resposta de Sucesso:
```
:tmi.twitch.tv 001 <user> :Welcome, GLHF!
:tmi.twitch.tv 002 <user> :Your host is tmi.twitch.tv
:tmi.twitch.tv 003 <user> :This server is rather new
:tmi.twitch.tv 004 <user> :-
:tmi.twitch.tv 375 <user> :-
:tmi.twitch.tv 372 <user> :You are in a maze of twisty passages.
:tmi.twitch.tv 376 <user> :>
```

### Resposta de Falha:
```
:tmi.twitch.tv NOTICE * :Login authentication failed
```

---

# Capabilities (Recursos Adicionais)

Após conectar, você pode requisitar metadados adicionais nas mensagens.

## Capabilities Disponíveis

| Capability | Descrição |
|------------|-----------|
| `twitch.tv/membership` | Recebe JOIN/PART quando usuários entram/saem |
| `twitch.tv/tags` | Adiciona tags IRCv3 às mensagens (badges, cores, etc) |
| `twitch.tv/commands` | Recebe comandos especiais (GLOBALUSERSTATE, ROOMSTATE, etc) |

## Requisitando Capabilities

```
CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands
```

### Resposta de Sucesso:
```
:tmi.twitch.tv CAP * ACK :twitch.tv/membership twitch.tv/tags twitch.tv/commands
```

---

# Entrando em Canais (JOIN)

## Comando:
```
JOIN #<channel>
```

Ou múltiplos canais:
```
JOIN #channel1,#channel2
```

### Resposta de Sucesso:
```
:user!user@user.tmi.twitch.tv JOIN #channel
:user.tmi.twitch.tv 353 user = #channel :user
:user.tmi.twitch.tv 366 user #channel :End of /NAMES list
```

Com capabilities:
```
@badge-info=;badges=;... :tmi.twitch.tv USERSTATE #channel
@emote-only=0;... :tmi.twitch.tv ROOMSTATE #channel
```

---

# Saindo de Canais (PART)

```
PART #<channel>
```

---

# Enviando Mensagens

## PRIVMSG - Mensagem Normal
```
PRIVMSG #<channel> :Sua mensagem aqui
```

## Reply (Responder a Mensagem)
```
@reply-parent-msg-id=<message-id> PRIVMSG #<channel> :Resposta
```

---

# Keepalive (PING/PONG)

O servidor envia PING periodicamente. Você DEVE responder com PONG.

### Recebido:
```
PING :tmi.twitch.tv
```

### Resposta:
```
PONG :tmi.twitch.tv
```

**Se não responder:** Conexão é terminada.

---

# Formato das Mensagens

Todas as mensagens são delimitadas por CRLF (`\r\n`).

### Exemplo de múltiplas mensagens:
```
:foo!foo@foo.tmi.twitch.tv JOIN #bar\r\n
:foo.tmi.twitch.tv 353 foo = #bar :foo\r\n
:foo.tmi.twitch.tv 366 foo #bar :End of /NAMES list\r\n
```

---

# Comandos IRC Importantes

| Comando | Descrição |
|---------|-----------|
| PRIVMSG | Mensagem de chat |
| JOIN | Entrar em canal |
| PART | Sair de canal |
| PING | Keepalive do servidor |
| PONG | Resposta ao PING |
| NOTICE | Notificações do sistema |
| GLOBALUSERSTATE | Estado global do usuário |
| USERSTATE | Estado do usuário no canal |
| ROOMSTATE | Estado da sala |
| CLEARCHAT | Limpar chat/ban/timeout |
| CLEARMSG | Deletar mensagem específica |
| RECONNECT | Servidor pedindo reconexão |

---

# Exemplo de Conexão Completa

```python
import socket

# Conectar
sock = socket.create_connection(("irc.chat.twitch.tv", 6667))

# Autenticar
sock.send(b"CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands\r\n")
sock.send(f"PASS oauth:{token}\r\n".encode())
sock.send(f"NICK {username}\r\n".encode())

# Esperar autenticação...
time.sleep(1)

# Entrar no canal
sock.send(f"JOIN #{channel}\r\n".encode())

# Loop principal
while True:
    data = sock.recv(4096).decode('utf-8', errors='ignore')
    
    if data.startswith("PING"):
        sock.send("PONG :tmi.twitch.tv\r\n".encode())
    
    # Processar mensagens...
```

---

# Uso via Proxy HTTP (CONNECT Tunnel)

Para usar IRC através de um proxy HTTP:

```python
# Conectar no proxy
sock = socket.create_connection((proxy_host, proxy_port))

# Criar tunnel CONNECT
connect_req = "CONNECT irc.chat.twitch.tv:6667 HTTP/1.1\r\n"
connect_req += "Host: irc.chat.twitch.tv:6667\r\n\r\n"
sock.send(connect_req.encode())

# Esperar resposta 200 OK
response = sock.recv(1024)
if b"200" in response:
    # Agora o socket está tunelado - pode usar IRC normalmente
    sock.send(f"PASS oauth:{token}\r\n".encode())
    # ...
```

---

# Notas Importantes

1. **IRC é legado** - Twitch recomenda EventSub + API para novos projetos
2. **Rate limits são rigorosos** - Respeite ou será banido temporariamente
3. **PING/PONG é obrigatório** - Sem resposta = desconexão
4. **OAuth tokens expiram** - Renove antes de expirar
5. **Case sensitivity** - Comandos são case-insensitive, mas nomes de canais são lowercase
