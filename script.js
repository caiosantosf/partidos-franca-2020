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

const getGraph2016 = (siglas, diferenca) => {
  const options = {
    series: [{
    name: 'Diferença na quantidade de candidatos',
    data: diferenca
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

  let chart = new ApexCharts(document.querySelector("#chartEleicoes2016"), options);
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
  const { partidos } = await fetchAsync('json\\partidos.json')

  let siglas = [], mediaBens = [], mediaIdade = [], novatos = [], jaCandidatos = [], jaVereadores = [], atuaisVereadores = [], diferenca = []

  for (const [index, partido] of partidos.entries()) {
    getGraphRaca(partido.racas, index+1)
    getGraphGenero(partido.generos, index+1)
    getGraphEscolaridade(partido.niveisEscolaridade, index+1)

    const diferencaPartido = partido.candidatosConta - partido.candidatosConta2016

    siglas.push(partido.sigla)
    mediaBens.push(partido.mediaBens)
    mediaIdade.push(partido.mediaIdade)
    novatos.push(partido.novatosConta)
    jaCandidatos.push(partido.jaCandidatosConta)
    jaVereadores.push(partido.jaVereadoresConta)
    atuaisVereadores.push(partido.atuaisVereadoresConta)
    diferenca.push(diferencaPartido)
  }

  getGraph2016(siglas, diferenca)
  getGraphEleicoesAnteriores(siglas, novatos, jaCandidatos, jaVereadores, atuaisVereadores)
  getGraphBens(siglas, mediaBens)
  getGraphIdade(siglas, mediaIdade)

  document.getElementById('loading').style.display = 'none'
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

getData()