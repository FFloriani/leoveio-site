# Twitch IRC - Guia Rápido de Implementação

## Conexão Básica em Python (Socket)

```python
import socket
import time

class TwitchIRC:
    def __init__(self, token, username, channel, proxy_url=None):
        self.token = token
        self.username = username.lower()
        self.channel = channel.lower()
        self.proxy_url = proxy_url
        self.sock = None
        self.connected = False
    
    def connect(self):
        """Conecta ao IRC da Twitch (diretamente ou via proxy)"""
        try:
            if self.proxy_url:
                # Conexão via proxy HTTP
                proxy_host = self.proxy_url.replace("http://", "").split(":")[0]
                proxy_port = int(self.proxy_url.split(":")[-1])
                
                self.sock = socket.create_connection((proxy_host, proxy_port), timeout=10)
                
                # Criar tunnel CONNECT
                connect_req = "CONNECT irc.chat.twitch.tv:6667 HTTP/1.1\r\n"
                connect_req += "Host: irc.chat.twitch.tv:6667\r\n\r\n"
                self.sock.send(connect_req.encode())
                
                # Verificar resposta
                resp = b""
                while b"\r\n\r\n" not in resp:
                    data = self.sock.recv(1024)
                    if not data:
                        return False
                    resp += data
                
                if b"200" not in resp:
                    return False
            else:
                # Conexão direta
                self.sock = socket.create_connection(("irc.chat.twitch.tv", 6667), timeout=10)
            
            # Requisitar capabilities
            self.sock.send(b"CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands\r\n")
            
            # Autenticar
            self.sock.send(f"PASS oauth:{self.token}\r\n".encode())
            self.sock.send(f"NICK {self.username}\r\n".encode())
            
            time.sleep(1)
            
            # Entrar no canal
            self.sock.send(f"JOIN #{self.channel}\r\n".encode())
            
            self.connected = True
            return True
            
        except Exception as e:
            print(f"Erro ao conectar: {e}")
            return False
    
    def send_message(self, message):
        """Envia uma mensagem no chat"""
        if self.connected and self.sock:
            try:
                self.sock.send(f"PRIVMSG #{self.channel} :{message}\r\n".encode())
                return True
            except:
                return False
        return False
    
    def receive(self):
        """Recebe dados do servidor"""
        try:
            return self.sock.recv(4096).decode('utf-8', errors='ignore')
        except:
            return ""
    
    def handle_ping(self, data):
        """Responde PING com PONG"""
        if "PING" in data:
            self.sock.send("PONG :tmi.twitch.tv\r\n".encode())
            return True
        return False
    
    def run_loop(self):
        """Loop principal de recebimento"""
        self.sock.settimeout(1)
        while self.connected:
            try:
                data = self.receive()
                if data:
                    self.handle_ping(data)
                    # Processar outras mensagens aqui...
            except socket.timeout:
                continue
            except:
                break
    
    def disconnect(self):
        """Desconecta do servidor"""
        self.connected = False
        if self.sock:
            try:
                self.sock.send(f"PART #{self.channel}\r\n".encode())
                self.sock.close()
            except:
                pass


# Exemplo de uso:
if __name__ == "__main__":
    irc = TwitchIRC(
        token="seu_oauth_token_aqui",
        username="seu_username",
        channel="canal_alvo",
        proxy_url="http://127.0.0.1:18080"  # Opcional
    )
    
    if irc.connect():
        print("Conectado!")
        irc.send_message("Olá chat!")
        irc.run_loop()
    else:
        print("Falha ao conectar")
```

---

## Formato de Token OAuth

O token deve ter os scopes:
- `chat:read` - para ler mensagens
- `chat:write` - para enviar mensagens

Formato no arquivo cookies.txt:
```
username:password:oauth_token
```

Exemplo:
```
meubot:senhasegura:abcdef1234567890abcdef1234567890
```

---

## Sequência de Comandos IRC

### 1. Conectar e Autenticar
```
CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands
PASS oauth:TOKEN
NICK username
```

### 2. Entrar no Canal
```
JOIN #canal
```

### 3. Enviar Mensagem
```
PRIVMSG #canal :Sua mensagem aqui
```

### 4. Responder PING
```
PING :tmi.twitch.tv  <- Recebe do servidor
PONG :tmi.twitch.tv  <- Você envia de volta
```

### 5. Sair do Canal
```
PART #canal
```

---

## Parsing de Mensagens Recebidas

### Formato de PRIVMSG com tags:
```
@badge-info=subscriber/12;badges=subscriber/12,premium/1;color=#FF69B4;display-name=User;emotes=;first-msg=0;id=abc123;mod=0;room-id=12345;subscriber=1;tmi-sent-ts=1234567890;turbo=0;user-id=67890;user-type= :user!user@user.tmi.twitch.tv PRIVMSG #canal :Texto da mensagem
```

### Extraindo informações:
```python
import re

def parse_message(raw):
    """Parse uma mensagem IRC da Twitch"""
    # Padrão: @tags :user!user@user.tmi.twitch.tv PRIVMSG #canal :mensagem
    pattern = r'^(?:@(\S+)\s)?:(\w+)!\w+@\w+\.tmi\.twitch\.tv\s(\w+)\s#(\w+)\s:(.+)$'
    match = re.match(pattern, raw.strip())
    
    if match:
        tags_str, username, command, channel, message = match.groups()
        
        # Parse tags
        tags = {}
        if tags_str:
            for tag in tags_str.split(';'):
                if '=' in tag:
                    key, value = tag.split('=', 1)
                    tags[key] = value
        
        return {
            'username': username,
            'display_name': tags.get('display-name', username),
            'channel': channel,
            'message': message,
            'tags': tags,
            'command': command
        }
    
    return None
```

---

## Rate Limits Importantes

| Ação | Limite Normal | Limite Verificado |
|------|---------------|-------------------|
| Mensagens/30s | 20 | 7500 (próprio canal) |
| JOINs/10s | 20 | 2000 |
| Auth/10s | 20 | 200 |
| Canais simultâneos | 100 | 100 |

**Penalidade:** Mensagens ignoradas por 1 hora

---

## Dicas de Implementação

1. **Sempre responda PING** - Sem resposta = desconexão
2. **Use timeout no socket** - Para não bloquear indefinidamente
3. **Implemente reconexão** - Conexões caem, prepare-se
4. **Buffer de mensagens** - Não envie mais que 20/30s
5. **Lowercase nos nomes** - Canal e username sempre em minúsculas
6. **Valide respostas** - Cheque "200 OK" no proxy CONNECT
