const fs = require('fs')
const fetch = require('node-fetch')

const urlCandidatos = 'http://divulgacandcontas.tse.jus.br/divulga/rest/v1/candidatura/listar/2020/64254/2030402020/13/candidatos'

const urlCandidato = id => {
  return `http://divulgacandcontas.tse.jus.br/divulga/rest/v1/candidatura/buscar/2020/64254/2030402020/candidato/${id}`
} 

const fetchAsync = async url => {
  const response = await fetch(url);
  return await response.json();
}

const getData = async _ => {
  var jsonData = await fetchAsync(urlCandidatos)

  save(jsonData, 'candidatos')

  const { candidatos } = jsonData

  for (const [index, candidato] of candidatos.entries()) {
    let jsonData = await fetchAsync(urlCandidato(candidato.id))
    save(jsonData, candidato.id)
  }
}

const save = (jsonData, fileName) => {
  var jsonContent = JSON.stringify(jsonData)
  
  fs.writeFile(`json\\${fileName}.json`, jsonContent, 'utf8', function (err) {
      if (err) {
          console.log(`${fileName} - An error occured while writing JSON Object to File.`);
          return console.log(err)
      }
  
      console.log(`${fileName} - JSON file has been saved.`)
  })
}
 
getData()