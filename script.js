const fetchAsync = async url => {
  const response = await fetch(url);
  return await response.json();
}

const getGraphBens = (siglas, mediaPartido) => {
  const options = {
    series: [{
    name: 'Valor',
    data: mediaPartido
  }],
    chart: {
    type: 'bar',
    height: 700,
    stacked: true,
  },
  plotOptions: {
    bar: {
      horizontal: true,
    },
  },
  stroke: {
    width: 1,
    colors: ['#fff']
  },
  title: {
    text: ' '
  },
  xaxis: {
    categories: siglas,
  },
  yaxis: {
    title: {
      text: undefined
    },
  },
  fill: {
    opacity: 1
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    offsetX: 40
  }
  }

  let chart = new ApexCharts(document.querySelector("#chartBens"), options);
  chart.render()
}

const getGraphIdade = (siglas, mediaIdade) => {
  const options = {
    series: [{
    name: 'Idade',
    data: mediaIdade
  }],
    chart: {
    type: 'bar',
    height: 700,
    stacked: true,
  },
  plotOptions: {
    bar: {
      horizontal: true,
    },
  },
  stroke: {
    width: 1,
    colors: ['#fff']
  },
  title: {
    text: ' '
  },
  xaxis: {
    categories: siglas,
  },
  yaxis: {
    title: {
      text: undefined
    },
  },
  fill: {
    opacity: 1
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    offsetX: 40
  }
  }

  let chart = new ApexCharts(document.querySelector("#chartIdade"), options);
  chart.render()
}

const getGraphEleicoesAnteriores = (siglas, novatos, jaCandidatos, jaVereadores, atuaisVereadores) => {
  const options = {
    series: [{
    name: 'Novatos',
    data: novatos
  }, {
    name: 'Já foram candidatos mas não se elegeram',
    data: jaCandidatos
  }, {
    name: 'Ex-vereadores',
    data: jaVereadores
  }, {
    name: 'Atuais vereadores',
    data: atuaisVereadores
  }],
    chart: {
    type: 'bar',
    height: 700,
    stacked: true,
  },
  plotOptions: {
    bar: {
      horizontal: true,
    },
  },
  stroke: {
    width: 1,
    colors: ['#fff']
  },
  title: {
    text: ' '
  },
  xaxis: {
    categories: siglas,
  },
  yaxis: {
    title: {
      text: undefined
    },
  },
  fill: {
    opacity: 1
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    offsetX: 40
  }
  }

  let chart = new ApexCharts(document.querySelector("#chartEleicoesAnteriores"), options);
  chart.render()
}

const getGraphRaca = (racas, index) => {
  const options = {
    series: racas,
    chart: {
      width: 380,
      type: 'pie',
    },
    labels: ['Branca', 'Parda', 'Preta', 'Sem Informação'],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  }

  let chart = new ApexCharts(document.querySelector(`#chartEleicoesRaca${index}`), options);
  chart.render()
}

const getGraphGenero = (generos, index) => {
  const options = {
    series: generos,
    chart: {
      width: 380,
      type: 'pie',
    },
    labels: ['Masculino', 'Feminino'],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  }

  let chart = new ApexCharts(document.querySelector(`#chartEleicoesGenero${index}`), options);
  chart.render()
}

const getGraphEscolaridade = (niveisEscolaridade, index) => {
  const options = {
    series: niveisEscolaridade,
    colors : ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#5C4742'],
    chart: {
      width: 380,
      type: 'pie',
    },
    labels: ['Ensino fundamental incompleto', 'Ensino fundamental completo', 'Ensino medio incompleto', 'Ensino medio completo', 'Superior incompleto', 'Superior completo'],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  }

  let chart = new ApexCharts(document.querySelector(`#chartEleicoesEscolaridade${index}`), options);
  chart.render()
}

const getData = async _ => {
  const { candidatos } = await fetchAsync('json\\candidatos.json')

  candidatos.sort((a, b) => {
    if ( a.nomeColigacao < b.nomeColigacao ){
      return -1;
    }
    if ( a.nomeColigacao > b.nomeColigacao ){
      return 1;
    }
    return 0;
  })

  let siglas = [], novatos = [], jaCandidatos = [], jaVereadores = [], atuaisVereadores = [], racas = [0, 0, 0, 0]
  let niveisEscolaridade = [0, 0, 0, 0, 0, 0], generos = [0, 0], mediaPartido = [], mediaIdade = []
  let novatosConta = 0, jaCandidatosConta = 0, jaVereadoresConta = 0, atuaisVereadoresConta = 0, candidatosConta = 0
  let sigla, indexPartido = 0, totalDeBens = 0, totalIdade = 0

  const atuais = await fetchAsync(`json\\atuais.json`)
  const antigos = await fetchAsync(`json\\antigos.json`)

  for (const [index, candidato] of candidatos.entries()) {
    if (0 !== index) {
      if (sigla !== candidato.nomeColigacao){
        siglas.push(sigla)
        atuaisVereadores.push(atuaisVereadoresConta)
        novatos.push(novatosConta)
        jaCandidatos.push(jaCandidatosConta)
        jaVereadores.push(jaVereadoresConta)
        mediaPartido.push((totalDeBens / candidatosConta).toFixed(2))
        mediaIdade.push((totalIdade / candidatosConta).toFixed(2))

        indexPartido++
        getGraphRaca(racas, indexPartido)
        getGraphEscolaridade(niveisEscolaridade, indexPartido)
        getGraphGenero(generos, indexPartido)

        novatosConta = 0, jaCandidatosConta = 0, jaVereadoresConta = 0, atuaisVereadoresConta = 0, candidatosConta = 0, totalDeBens = 0, totalIdade = 0
        racas = [0, 0, 0, 0]
        niveisEscolaridade = [0, 0, 0, 0, 0, 0]
        generos = [0, 0]
      }
    }
    sigla = candidato.nomeColigacao

    novatosConta++
    candidatosConta++

    const nomeCompleto = removeAcento(candidato.nomeCompleto)

    const candidatoDetalhes = await fetchAsync(`json\\${(candidato.id)}.json`)

    const raca = removeAcento(candidatoDetalhes.descricaoCorRaca)
    const escolaridade = removeAcento(candidatoDetalhes.grauInstrucao)
    const genero = removeAcento(candidatoDetalhes.descricaoSexo)
    totalDeBens += candidatoDetalhes.totalDeBens
    const data = candidatoDetalhes.dataDeNascimento
    totalIdade += calculateAge(data.substr(5, 2), data.substr(8, 2), data.substr(0, 4))

    console.log(sigla + ' - ' + nomeCompleto + ' - ' + calculateAge(data.substr(5, 2), data.substr(8, 2), data.substr(0, 4)))

    if (raca == 'branca') racas[0]++
    if (raca == 'parda') racas[1]++
    if (raca == 'preta') racas[2]++
    if (raca == 'sem informacao') racas[3]++

    if (escolaridade == 'ensino fundamental incompleto') niveisEscolaridade[0]++
    if (escolaridade == 'ensino fundamental completo') niveisEscolaridade[1]++
    if (escolaridade == 'ensino medio incompleto') niveisEscolaridade[2]++
    if (escolaridade == 'ensino medio completo') niveisEscolaridade[3]++
    if (escolaridade == 'superior incompleto') niveisEscolaridade[4]++
    if (escolaridade == 'superior completo') niveisEscolaridade[5]++

    if (genero == 'masc.') generos[0]++
    if (genero == 'fem.') generos[1]++

    let atual = false
    for (vereador of atuais) {
      if (vereador.nomeCompleto == nomeCompleto) {
        atual = true
      }
    }
    if (atual) {
      atuaisVereadoresConta++
      novatosConta--
    } else {
      let antigo = false
      for (vereador of antigos) {
        if (vereador.nomeCompleto == nomeCompleto) {
          antigo = true
        }
      }
      if (antigo) {
        jaVereadoresConta++
        novatosConta--
      } else {
        candidatoDetalhes.eleicoesAnteriores.every(eleicao => {
          if ((eleicao.nrAno !== 2020) && (eleicao.cargo == 'Vereador')) {
            jaCandidatosConta++
            novatosConta--
            return false
          } else {
            return true
          }
        })
      }
    }
  }

  siglas.push(sigla)
  atuaisVereadores.push(atuaisVereadoresConta)
  novatos.push(novatosConta)
  jaCandidatos.push(jaCandidatosConta)
  jaVereadores.push(jaVereadoresConta)
  mediaPartido.push((totalDeBens / candidatosConta).toFixed(2))
  mediaIdade.push((totalIdade / candidatosConta).toFixed(2))

  getGraphEleicoesAnteriores(siglas, novatos, jaCandidatos, jaVereadores, atuaisVereadores)
  getGraphBens(siglas, mediaPartido)
  getGraphIdade(siglas, mediaIdade)

  indexPartido++
  getGraphRaca(racas, indexPartido)
  getGraphEscolaridade(niveisEscolaridade, indexPartido)
  getGraphGenero(generos, indexPartido)
}

function removeAcento(text) {       
  text = text.toLowerCase();                                                         
  text = text.replace(new RegExp('[ÁÀÂÃ]','gi'), 'a');
  text = text.replace(new RegExp('[ÉÈÊ]','gi'), 'e');
  text = text.replace(new RegExp('[ÍÌÎ]','gi'), 'i');
  text = text.replace(new RegExp('[ÓÒÔÕ]','gi'), 'o');
  text = text.replace(new RegExp('[ÚÙÛ]','gi'), 'u');
  text = text.replace(new RegExp('[Ç]','gi'), 'c');
  return text;                 
}

function calculateAge(birthMonth, birthDay, birthYear) {
  var currentDate = new Date();
  var currentYear = currentDate.getFullYear();
  var currentMonth = currentDate.getMonth();
  var currentDay = currentDate.getDate(); 
  var calculatedAge = currentYear - birthYear;

  if (currentMonth < birthMonth - 1) {
      calculatedAge--;
  }
  if (birthMonth - 1 == currentMonth && currentDay < birthDay) {
      calculatedAge--;
  }
  return calculatedAge;
}

getData()