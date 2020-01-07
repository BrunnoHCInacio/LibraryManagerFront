const ModulosService = {
  getModulos: function () {
    return [
      {
        icone: 'bubble_chart',
        nome: 'Livros',
        breve_descricao: '',
        link: '',
        filhos: [
          {
            nome: 'Cadastro de Livros',
            icone: '',
            link: {
              name: 'BooksRegister'
            }
          },
          {
            nome: 'Consulta de Livros',
            icone: '',
            link: {
              name: 'BooksListing'
            }
          }
        ]
      },
      {
        icone: 'bubble_chart',
        nome: 'Pessoas',
        filhos: [
          {
            nome: 'Cadastro de Pessoas',
            link: {
              name: 'PeoplesRegister'
            }
          },
          {
            nome: 'Consulta de Pessoas',
            link: {
              name: 'PeoplesListing'
            }
          }
        ]
      },

      {
        icone: 'bubble_chart',
        nome: 'Emprestimos',
        filhos: [
          {
            nome: 'Novo Emprestimo',
            link: {
              name: 'LoansRegister'
            }
          },
          {
            nome: 'Consulta de Emprestimos',
            link: {
              name: 'LoansListing'
            }
          }
        ]
      }
      
    ]
  }
}

export default ModulosService
