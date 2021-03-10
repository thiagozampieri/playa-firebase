module.exports = {
  config: {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
  },
  states: [
    { name: 'Acre', value: 'AC' },
    { name: 'Alagoas', value: 'AL' },
    { name: 'Amapá', value: 'AP' },
    { name: 'Amazonas', value: 'AM' },
    { name: 'Bahia', value: 'BA' },
    { name: 'Ceará', value: 'CE' },
    { name: 'Distrito Federal', value: 'DF' },
    { name: 'Espírito Santo', value: 'ES' },
    { name: 'Goiás', value: 'GO' },
    { name: 'Maranhão', value: 'MA' },
    { name: 'Mato Grosso', value: 'MT' },
    { name: 'Mato Grosso do Sul', value: 'MS' },
    { name: 'Minas Gerais', value: 'MG' },
    { name: 'Pará', value: 'PA' },
    { name: 'Paraíba', value: 'PB' },
    { name: 'Paraná', value: 'PR' },
    { name: 'Pernambuco', value: 'PE' },
    { name: 'Piauí', value: 'PI' },
    { name: 'Rio de Janeiro', value: 'RJ' },
    { name: 'Rio Grande do Norte', value: 'RN' },
    { name: 'Rio Grande do Sul', value: 'RS' },
    { name: 'Rondônia', value: 'RO' },
    { name: 'Roraima', value: 'RR' },
    { name: 'Santa Catarina', value: 'SC' },
    { name: 'São Paulo', value: 'SP' },
    { name: 'Sergipe', value: 'SE' },
    { name: 'Tocantins', value: 'TO' },
  ],
};