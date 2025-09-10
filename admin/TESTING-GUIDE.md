# Guia de Testes - Painel Administrativo Ghost Squad

## 1. Pré-requisitos

Antes de testar, você precisa:

1. Ter o projeto servido localmente (usando `python -m http.server` ou `npx serve`)
2. Ter acesso ao console do Firebase para criar um administrador de teste

## 2. Configuração Inicial

### 2.1 Criar um administrador de teste

1. Acesse o console do Firebase do projeto Ghost Squad
2. Vá para a seção "Database" (Realtime Database)
3. Execute o seguinte código no console do navegador na página do painel administrativo:

```javascript
// Criar administrador de teste
const adminEmail = 'admin@test.com';
const adminPassword = 'password123';

firebase.auth().createUserWithEmailAndPassword(adminEmail, adminPassword)
  .then((userCredential) => {
    const userId = userCredential.user.uid;
    const adminData = {
      email: adminEmail,
      name: 'Administrador de Teste',
      role: 'admin',
      createdAt: new Date().toISOString(),
      lastLogin: null,
      permissions: ['users.manage', 'stats.view', 'config.edit']
    };
    
    return firebase.database().ref('admins/' + userId).set(adminData);
  })
  .then(() => {
    console.log('Administrador de teste criado com sucesso!');
    console.log('Email:', adminEmail);
    console.log('Senha:', adminPassword);
    
    // Fazer logout após criar o administrador
    return firebase.auth().signOut();
  })
  .catch((error) => {
    console.error('Erro ao criar administrador:', error);
  });
```

## 3. Testar o Painel Administrativo

### 3.1 Acessar o painel

1. Acesse o painel administrativo através do endereço local:
   - Se estiver usando `python -m http.server`: http://localhost:8000/admin/
   - Se estiver usando `npx serve`: http://localhost:3000/admin/

### 3.2 Testar autenticação

1. Na página de login, insira:
   - Email: `admin@test.com`
   - Senha: `password123`
   
2. Clique em "Entrar"

### 3.3 Verificar funcionalidades

1. Após o login, você deve ser redirecionado para o dashboard
2. Verifique se a mensagem "Bem-vindo ao Painel Administrativo do Ghost Squad" aparece
3. Teste o botão "Sair" para verificar se o logout funciona corretamente
4. Verifique se o sistema de timeout automático funciona (após 30 minutos de inatividade)

### 3.4 Testar validações

1. Tente fazer login com credenciais inválidas
2. Tente enviar o formulário vazio
3. Verifique se as mensagens de erro aparecem corretamente

## 4. Verificar logs de auditoria

1. No console do Firebase, verifique se os logs de auditoria estão sendo registrados na tabela `auditLogs`
2. Verifique se há registros de login/logout

## 5. Troubleshooting

### Problemas comuns:

1. **"Acesso negado. Você não tem privilégios administrativos."**
   - Verifique se o usuário está cadastrado na tabela `admins` do Firebase
   
2. **Erro de CORS**
   - Certifique-se de estar acessando o painel através de um servidor local
   
3. **Erro de autenticação**
   - Verifique se as credenciais estão corretas
   - Confirme se o Firebase foi inicializado corretamente

## 6. Próximos passos

Após testar com sucesso:
1. Podemos implementar o dashboard principal com métricas em tempo real
2. Desenvolver o gerenciamento de usuários
3. Criar os relatórios e estatísticas
4. Implementar as configurações do jogo