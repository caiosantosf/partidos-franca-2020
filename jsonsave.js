const fs = require('fs')
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

const fetchAsyncHtml = async url => {
  const response = await fetch(url)
  return await response.text()
}

const getDataTSE = async _ => {
  var jsonData = await fetchAsync(urlCandidatos)

  save(jsonData, 'candidatos')

  const { candidatos } = jsonData

  for (const [index, candidato] of candidatos.entries()) {
    let jsonData = await fetchAsync(urlCandidato(candidato.id))
    save(jsonData, candidato.id)
  }
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

getDataTSE()
getDataCamara()