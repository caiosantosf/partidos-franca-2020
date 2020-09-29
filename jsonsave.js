const fs = require('fs')
const fsp = require('fs-promise');
const fetch = require('node-fetch')
const cheerio = require('cheerio')

const urlCandidatos = 'http://divulgacandcontas.tse.jus.br/divulga/rest/v1/candidatura/listar/2020/64254/2030402020/13/candidatos'

const urlCandidato = id => {
  return `http://divulgacandcontas.tse.jus.br/divulga/rest/v1/candidatura/buscar/2020/64254/2030402020/candidato/${id}`
} 

const fetchAsync = async url => {
  const response = await fetch(url)
  return await response.json()
}

const fetchAsyncLocal = async url => {
  var file = __dirname + url
  let json

  data = await fsp.readFile(file, 'utf8')
  json = JSON.parse(data)

  return json
}

const fetchAsyncHtml = async url => {
  const response = await fetch(url)
  return await response.text()
}

const getDataTSE = async _ => {
  let jsonData = await fetchAsync(urlCandidatos)
  const atuais = await fetchAsync('https://raw.githubusercontent.com/caiosantosf/partidos-franca-2020/master/json/atuais.json')
  const antigos = await fetchAsync('https://raw.githubusercontent.com/caiosantosf/partidos-franca-2020/master/json/antigos.json')

  const { candidatos } = jsonData
  let candidatosNovo = []

  for (const [index, candidato] of candidatos.entries()) {
    let jsonData = await fetchAsync(urlCandidato(candidato.id))

    const { nomeColigacao } = candidato
    const { id, descricaoCorRaca, grauInstrucao, descricaoSexo, totalDeBens, dataDeNascimento } = jsonData

    const nomeCompleto = removeAcento(jsonData.nomeCompleto)
    
    let jaCandidato = false
    let atualVereador = false
    let exVereador = false

    jsonData.eleicoesAnteriores.every(eleicao => {
      if ((eleicao.nrAno !== 2020) && (eleicao.cargo == 'Vereador')) {
        jaCandidato = true
        return false
      } else {
        return true
      }
    })

    for (vereador of atuais) {
      if (vereador.nomeCompleto == nomeCompleto) {
        atualVereador = true
      }
    }

    for (vereador of antigos) {
      if (vereador.nomeCompleto == nomeCompleto) {
        exVereador = true
      }
    }

    const candidatoNovo = { id, jaCandidato, atualVereador, exVereador, nomeColigacao, nomeCompleto, descricaoCorRaca, grauInstrucao, descricaoSexo, totalDeBens, dataDeNascimento }

    candidatosNovo.push(candidatoNovo)
  }

  candidatosNovo = { candidatos: candidatosNovo }
  save(candidatosNovo, 'candidatos')
}

const getDataCamara = async _ => {
  const baseUrl = 'https://franca.sp.leg.br'
  const arrUrls = [
    '/pt-br/vereadores/legislaturas/2017-2020',
    '/pt-br/vereadores/legislaturas/2013-2016',
    '/pt-br/vereadores/legislaturas/2009-2012',
    '/pt-br/vereadores/legislaturas/2005-2008',
    '/pt-br/vereadores/legislaturas/2001-2004',
    '/pt-br/vereadores/legislaturas/1997-2000',
    '/pt-br/vereadores/legislaturas/1993-1996',
    '/pt-br/vereadores/legislaturas/1989-1992',
    '/pt-br/vereadores/legislaturas/1983-1988',
    '/pt-br/vereadores/legislaturas/1977-1982'
  ]

  let atuais = []
  let antigos = []

  for (url of arrUrls) {
    var html = await fetchAsyncHtml(baseUrl + url)
    const selector = cheerio.load(html);

    for (i = 1; i < 8; i++) {
      for (j = 1; j < 4; j++) {
        const urlDetalhe = selector(`#block-bartik-content > div > div > div > div.view-content > div > div.views-row.clearfix.row-${i} > div.views-col.col-${j} > article > header > h2 > a`)
          .attr('href')

        if (urlDetalhe) {
          var htmlDetalhe = await fetchAsyncHtml(baseUrl + urlDetalhe)
          const selectorDetalhe = cheerio.load(htmlDetalhe);

          const nomeCompleto = removeAcento(selectorDetalhe('#block-bartik-content > div > div > div.group-left > div.field.field--name-field-nome-completo.field--type-string.field--label-above > div.field__item')
            .text())
          
          if (url == '/pt-br/vereadores/legislaturas/2017-2020') {
            atuais.push({ nomeCompleto })
          } else {
            let atual = false
            for (vereador of atuais) {
              if (vereador.nomeCompleto == nomeCompleto) {
                atual = true
              }
            }

            if (!atual) {
              antigos.push({ nomeCompleto })
            }
          }
        }
      }
    }
  }
  save(atuais, 'atuais')
  save(antigos, 'antigos')
}

const setJsonPartidos = async _ => {

  const json = await fetchAsyncLocal('\\json\\candidatos.json')
  const { candidatos } = json

  candidatos.sort((a, b) => {
    if ( a.nomeColigacao < b.nomeColigacao ){
      return -1;
    }
    if ( a.nomeColigacao > b.nomeColigacao ){
      return 1;
    }
    return 0;
  })
 
  let niveisEscolaridade = [0, 0, 0, 0, 0, 0], generos = [0, 0], racas = [0, 0, 0, 0], mediaBens = 0, mediaIdade = 0
  let novatosConta = 0, jaCandidatosConta = 0, jaVereadoresConta = 0, atuaisVereadoresConta = 0, candidatosConta = 0
  let sigla, totalDeBens = 0, totalIdade = 0

  let partidos = []
  let partido = {}

  for (const [index, candidato] of candidatos.entries()) {
    if (0 !== index) {
      if (sigla !== candidato.nomeColigacao){

        mediaBens = (totalDeBens / candidatosConta).toFixed(2)
        mediaIdade = (totalIdade / candidatosConta).toFixed(2)
        
        partido = { sigla, 
                    atuaisVereadoresConta, 
                    novatosConta, 
                    jaCandidatosConta, 
                    jaVereadoresConta,
                    racas,
                    niveisEscolaridade,
                    generos,
                    mediaBens,
                    mediaIdade
        }

        partidos.push(partido)

        novatosConta = 0, jaCandidatosConta = 0, jaVereadoresConta = 0, atuaisVereadoresConta = 0, candidatosConta = 0, totalDeBens = 0, totalIdade = 0
        racas = [0, 0, 0, 0]
        niveisEscolaridade = [0, 0, 0, 0, 0, 0]
        generos = [0, 0]
      }
    }
    candidatosConta++

    sigla = candidato.nomeColigacao
    const raca = removeAcento(candidato.descricaoCorRaca)
    const escolaridade = removeAcento(candidato.grauInstrucao)
    const genero = removeAcento(candidato.descricaoSexo)
    totalDeBens += candidato.totalDeBens
    const data = candidato.dataDeNascimento
    totalIdade += calculateAge(data.substr(5, 2), data.substr(8, 2), data.substr(0, 4))

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

    if (candidato.atualVereador) {
      atuaisVereadoresConta++
    } else {
      if (candidato.exVereador) {
        jaVereadoresConta++
      } else {
        if (candidato.jaCandidato) {
          jaCandidatosConta++
        } else {
          novatosConta++
        }
      }
    }
  }

  mediaBens = (totalDeBens / candidatosConta).toFixed(2)
  mediaIdade = (totalIdade / candidatosConta).toFixed(2)
  
  partido = { sigla, 
              atuaisVereadoresConta, 
              novatosConta, 
              jaCandidatosConta, 
              jaVereadoresConta,
              racas,
              niveisEscolaridade,
              generos,
              mediaBens,
              mediaIdade
  }

  partidos.push(partido)
  partidos = { partidos }
  
  save(partidos, 'partidos')
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

const save = (jsonData, fileName) => {
  const jsonContent = JSON.stringify(jsonData)
  
  fs.writeFile(`json\\${fileName}.json`, jsonContent, 'utf8', function (err) {
      if (err) {
          console.log(`${fileName} - An error occured while writing JSON Object to File.`);
          return console.log(err)
      }
  
      console.log(`${fileName} - JSON file has been saved.`)
  })
}

const main = async _ => {
  //await getDataCamara()
  await getDataTSE()
  await setJsonPartidos()
}

main()