import ajax from './ajax.js'

const apiKey=""

//获取个省份疫情数据
export const getEpidemic=()=> ajax(`http://api.tianapi.com/txapi/ncovcity/index?key=${apiKey}`)

//获取全国累计确诊等数据
export const getNationalScope=()=> ajax(`http://api.tianapi.com/txapi/ncov/index?key=${apiKey}`)