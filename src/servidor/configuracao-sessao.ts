export const configuracaoSessao = {
  modelName: 'auth_sessao',
  expiresIn: 60 * 60 * 24 * 30,
  updateAge: 60 * 60 * 24,
  cookieCache: { enabled: false },
};
