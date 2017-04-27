/* eslint-disable */
export default (gaCode) => {
  window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;
  ga('create', gaCode,'auto');ga('send','pageview')
}
