export function PrivacyPolicyPage() {
  const effectiveDate = '14 de maio de 2026'

  return (
    <section className="page" aria-label="Política de Privacidade">
      <h2>Política de Privacidade</h2>
      <p className="page-subtitle">
        Este documento explica quais dados podem ser tratados no MDreader e como você pode gerenciar seu
        consentimento.
      </p>

      <article className="card">
        <h3>1. Informações gerais</h3>
        <p>
          O MDreader é uma aplicação para leitura e edição de arquivos Markdown. Por padrão, o processamento acontece
          no navegador do usuário.
        </p>
        <p>
          Data de vigência desta política: <strong>{effectiveDate}</strong>.
        </p>
      </article>

      <article className="card">
        <h3>2. Dados que podem ser coletados</h3>
        <p>Dependendo da sua escolha no banner de cookies, podemos tratar:</p>
        <ul>
          <li>Dados técnicos de navegação (páginas visitadas, navegador, dispositivo e métricas de uso).</li>
          <li>Eventos de interação com a aplicação para análise de desempenho e estabilidade.</li>
          <li>Preferências salvas localmente no navegador (ex.: tema, rascunho do editor e consentimento).</li>
        </ul>
      </article>

      <article className="card">
        <h3>3. Cookies e tecnologias semelhantes</h3>
        <p>
          Utilizamos armazenamento local para lembrar preferências e a decisão sobre cookies. Tecnologias de
          rastreamento opcionais só são ativadas quando você clica em <strong>ACEITAR</strong>.
        </p>
        <p>Se você clicar em <strong>REJEITAR</strong>, os scripts opcionais de rastreamento não são carregados.</p>
      </article>

      <article className="card">
        <h3>4. Finalidades do tratamento</h3>
        <ul>
          <li>Operação da aplicação e manutenção das funcionalidades essenciais.</li>
          <li>Melhoria de experiência, desempenho e correção de erros.</li>
          <li>Medição agregada de uso, quando houver consentimento para rastreamento.</li>
        </ul>
      </article>

      <article className="card">
        <h3>5. Compartilhamento com terceiros</h3>
        <p>
          Serviços de terceiros podem ser utilizados para análise e monetização. Esses serviços só são ativados
          conforme sua escolha de consentimento, quando aplicável.
        </p>
      </article>

      <article className="card">
        <h3>6. Retenção e segurança</h3>
        <p>
          Dados de preferência ficam armazenados localmente no seu navegador até remoção manual ou limpeza de dados.
          Adotamos medidas técnicas razoáveis para reduzir riscos de acesso não autorizado.
        </p>
      </article>

      <article className="card">
        <h3>7. Seus direitos</h3>
        <p>
          Você pode, a qualquer momento, alterar sua decisão de cookies limpando os dados locais do navegador e
          escolhendo novamente no banner.
        </p>
      </article>

      <article className="card">
        <h3>8. Alterações nesta política</h3>
        <p>
          Esta política pode ser atualizada para refletir mudanças legais, técnicas ou de produto. A versão vigente
          será sempre publicada nesta página.
        </p>
      </article>

      <article className="card">
        <h3>9. Contato</h3>
        <p>
          Para dúvidas sobre privacidade, entre em contato pelo canal oficial do projeto ou site do responsável.
        </p>
      </article>
    </section>
  )
}
