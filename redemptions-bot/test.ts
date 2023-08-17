import axios from "axios"

let start = Date.now()
axios.post('https://api.streamelements.com/kappa/v2/store/5cc799026e852d26fcf16717/redemptions/123456789', {
    proxy: {
        port: 5074,
        auth: {
            username: 'xyyvazzo',
            password: 'kun9oaz06uj9'
        },
        host: '2.56.119.93',
        protocol: 'http'
    }
})
    .catch((e)=>{
        // console.log(e.response.headers)
    })
.finally(()=>{
    console.log(Date.now()-start)
})