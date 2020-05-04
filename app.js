const axios = require('axios');
const fs = require('fs');
const sha1 = require('sha1');


// Utilização da api axios para fazer a requisição na url passada
axios.get('https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=79a6ab50dd1004ebf6ba173df78444b694a45724')
    .then(function(response){      

        //Salva somente o array data da response 
        let dados = response.data

        //cria um arquivo utilizando o node, antes de criar o arquivo é feita a conversão do objeto json para uma 
        //string JSON
        fs.writeFileSync('answer.json', JSON.stringify(dados), function(err){            
            if(err)  throw err;      

            console.log('Arquivo salvo com sucesso');         
        })

        //Remove os espaços em branco do array
        //const cifra = dados['cifrado'].split(' ');
        //const cifra = dados['cifrado'].split(' ');
        //Junta o array
        const cifraRep1 = dados['cifrado'];
        
        //Remove pontos da String
        //const cifra1 = cifraRep.split('.');
        //Junta a string
        //const cifraRep1 = cifra1.join("");

        //Array que servirá como alfabeto, a fim de fazer as subsituições das variáveis
        const alfabeto = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        // Array que receberá um array decifrado
        var array = [];

        //Primeiro loop que irá atribuir um caracter a variável element
        for (let index = 0; index < cifraRep1.length; index++) {       
            const element = cifraRep1[index]; 
            // Casol o elemento seja um ponto o mesmo é adicionado no array sem entrar no segundo for     
            if(element === ' '){
              array.push(' ');
            }
            if(element === '.'){
                array.push('.');
            }else{
                // Array que irá compara cada caracter da cifra com cada caracter do alfabeto
                // até que haja uma correspondência
                for (let index = 0; index < alfabeto.length; index++) {                     
                    // Se o caracter a ser trocada for o último do array alfabeto
                    // o valor atribuido será o indice 0 do array alfabeto                                                                
                    if(alfabeto[index].toLowerCase() === element || (element === '.')){                    
                        if(typeof(alfabeto[index+1]) === 'undefined'){
                            var new_index = 10;
                            array.push(alfabeto[new_index].toLowerCase());
                        }else{
                            if((index + 1) > 25){
                              var new_index_sub = alfabeto.length - (index);
                              var new_index = 1 - new_index_sub;                              
                            }else{
                              var new_index = index + 1;                      
                            }
                            array.push(alfabeto[new_index].toLowerCase());
                        }                  
                    }
                    
                }             
            }
        }        

        // Junção dos caracteres decifrado apliacando o algoritmo para troca de uma posição no valor original
        cifraFinal = array.join("");
        // Aplicação do algoritmo de hash
        hashCifra = sha1(array);      

        // Seta a cifra decifrada e o resumo critográfica no array original
        dados['decifrado'] = cifraFinal;
        dados['resumo_criptografico'] = hashCifra;

        // Salva o arquivo completo
        fs.writeFileSync('answer.json', JSON.stringify(dados), function(err){
            if(err) throw err;

            console.log("Arquivo salvo com sucesso");
        })
    })
    .catch(function(error){
        console.log(error);                
    })


//Devolução dos dados com AXIOS
// axios({
//     'method': 'POST',
//     'url': 'https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=79a6ab50dd1004ebf6ba173df78444b694a45724',
//     'headers': {
//         'Content-Type': 'multipart/form-data',
//         'Accept': 'application/json'
//     },
//     formData: {
//         'answer': {
//         'value': fs.createReadStream(__dirname.concat('/answer.json')),
//         'options': {
//             'filetype':'file',
//             'filename': 'answer',
//             'contentType': null
//         }
//     }
//   }
// })
// .then(response => {
//     console.log(response.data)
// })
// .catch((error) => {
//     console.log(error)
// })


//**********************************************************************************
//**********************************************************************************

//Devolução dos dados com Node
var request = require('request');
var options = {
  'method': 'POST',
  'url': 'https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=79a6ab50dd1004ebf6ba173df78444b694a45724',
  'headers': {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json'
  },
  formData: {
    'answer': {
      'value': fs.createReadStream(__dirname.concat('/answer.json')),
      'options': {
        'filename': __dirname.concat('/answer.json'),
        'contentType': null
      }
    }
  }
};
request(options, function (error, response) { 
  if (error) throw new Error(error);
  console.log(response.body);
});
//**********************************************************************************
//**********************************************************************************