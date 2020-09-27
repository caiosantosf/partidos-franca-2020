const fetchAsync = async url => {
  const response = await fetch(url);
  return await response.json();
}

const getGraph = (siglas, novatos, jaCandidatos, jaVereadores, atuaisVereadores) => {
  let options = {
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
    height: 1000,
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

  let chart = new ApexCharts(document.querySelector("#chart"), options);
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

  let siglas = [], novatos = [], jaCandidatos = [], jaVereadores = [], atuaisVereadores = []
  let novatosConta = 0, jaCandidatosConta = 0, jaVereadoresConta = 0, atuaisVereadoresConta = 0
  let sigla

  for (const [index, candidato] of candidatos.entries()) {
    if (0 !== index) {
      if (sigla !== candidato.nomeColigacao){
        siglas.push(sigla)
        atuaisVereadores.push(atuaisVereadoresConta)
        novatos.push(novatosConta)
        jaCandidatos.push(jaCandidatosConta)
        jaVereadores.push(jaVereadoresConta)
        novatosConta = 0, jaCandidatosConta = 0, jaVereadoresConta = 0, atuaisVereadoresConta = 0
      }
    }
    sigla = candidato.nomeColigacao
    novatosConta++

    let candidatoDetalhes = await fetchAsync(`json\\${(candidato.id)}.json`)

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

  siglas.push(sigla)
  atuaisVereadores.push(atuaisVereadoresConta)
  novatos.push(novatosConta)
  jaCandidatos.push(jaCandidatosConta)
  jaVereadores.push(jaVereadoresConta)

  getGraph(siglas, novatos, jaCandidatos, jaVereadores, atuaisVereadores)
}

getData()